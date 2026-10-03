import hashlib
import secrets
from datetime import timedelta
from uuid import uuid4

from sqlalchemy import or_, update
from sqlalchemy.exc import IntegrityError

from .database import Configuration, PitchSession, aware, utc_now
from .errors import APIError
from .schemas import ConfigRead, Pitch, SessionRead, SimulationConfig


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class Repository:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    def has_config(self) -> bool:
        with self.session_factory() as db:
            return db.get(Configuration, 1) is not None

    def seed_config(self, config: SimulationConfig):
        with self.session_factory() as db:
            row = db.get(Configuration, 1)
            if row is None:
                db.add(Configuration(id=1, revision=1, data=config.model_dump(mode="json")))
                try:
                    db.commit()
                except IntegrityError:
                    db.rollback()  # Another worker seeded the same singleton.
                return
            current = SimulationConfig.model_validate(row.data)
            agent_ids = [agent.id for agent in current.agents]
            if agent_ids in (
                ["finance", "market", "product"],
                ["finance", "market", "product", "strategy"],
            ):
                default_agents = {agent.id: agent for agent in SimulationConfig().agents}
                upgraded_agents = [
                    *current.agents,
                    *(
                        default_agents[agent_id]
                        for agent_id in ("strategy", "technical", "market_research")
                        if agent_id not in agent_ids
                    ),
                ]
                upgraded = current.model_copy(update={"agents": upgraded_agents})
                row.data = upgraded.model_dump(mode="json")
                row.revision += 1
                db.commit()

    def get_config(self) -> ConfigRead:
        with self.session_factory() as db:
            row = db.get(Configuration, 1)
            config = SimulationConfig.model_validate(row.data)
            return ConfigRead(revision=row.revision, agent_count=len(config.agents), config=config)

    def update_config(self, config: SimulationConfig, expected_revision: int) -> ConfigRead:
        with self.session_factory() as db:
            result = db.execute(
                update(Configuration)
                .where(Configuration.id == 1, Configuration.revision == expected_revision)
                .values(data=config.model_dump(mode="json"), revision=expected_revision + 1)
            )
            if result.rowcount != 1:
                raise APIError(
                    409, "config_conflict", "Configuration changed; fetch its current revision"
                )
            db.commit()
        return ConfigRead(
            revision=expected_revision + 1, agent_count=len(config.agents), config=config
        )

    def create_session(self, pitch: Pitch, provider: str) -> tuple[SessionRead, str]:
        snapshot = self.get_config()
        config = snapshot.config
        total_chars = sum(
            len(value) for value in pitch.model_dump().values() if isinstance(value, str)
        )
        if len(pitch.summary) < config.pitch_min_chars or total_chars > config.pitch_max_chars:
            raise APIError(
                422,
                "invalid_pitch_length",
                f"Summary needs at least {config.pitch_min_chars} characters; total pitch text must be <= {config.pitch_max_chars}",
            )
        token = secrets.token_urlsafe(32)
        with self.session_factory() as db:
            row = PitchSession(
                id=str(uuid4()),
                token_hash=token_hash(token),
                ai_provider=provider,
                config_revision=snapshot.revision,
                config=config.model_dump(mode="json"),
                pitch=pitch.model_dump(mode="json"),
                questions=[],
                round_analyses=[],
            )
            db.add(row)
            db.commit()
            return self.serialize(row), token

    @staticmethod
    def serialize(row: PitchSession) -> SessionRead:
        return SessionRead(
            id=row.id,
            version=row.version,
            status=row.status,
            ai_provider=row.ai_provider,
            config_revision=row.config_revision,
            config=row.config,
            pitch=row.pitch,
            current_round=row.current_round,
            questions=row.questions,
            round_analyses=row.round_analyses or [],
            evaluation=row.evaluation,
            busy=bool(row.operation_id and row.lease_until and aware(row.lease_until) > utc_now()),
            created_at=aware(row.created_at),
            updated_at=aware(row.updated_at),
        )

    def get_session(self, session_id: str, token: str) -> SessionRead:
        with self.session_factory() as db:
            row = db.get(PitchSession, session_id)
            if row is None:
                raise APIError(404, "session_not_found", "Pitch session not found")
            if not secrets.compare_digest(row.token_hash, token_hash(token)):
                raise APIError(403, "session_access_denied", "Invalid session token")
            return self.serialize(row)

    def acquire(self, session_id: str, version: int, lease_seconds: float) -> str:
        operation_id = str(uuid4())
        now = utc_now()
        with self.session_factory() as db:
            result = db.execute(
                update(PitchSession)
                .where(
                    PitchSession.id == session_id,
                    PitchSession.version == version,
                    or_(PitchSession.operation_id.is_(None), PitchSession.lease_until <= now),
                )
                .values(
                    operation_id=operation_id, lease_until=now + timedelta(seconds=lease_seconds)
                )
            )
            if result.rowcount != 1:
                raise APIError(
                    409, "session_conflict", "Session changed or an AI operation is already running"
                )
            db.commit()
        return operation_id

    def save(self, session_id: str, version: int, values: dict, operation_id: str | None = None):
        statement = update(PitchSession).where(
            PitchSession.id == session_id, PitchSession.version == version
        )
        if operation_id is not None:
            statement = statement.where(
                PitchSession.operation_id == operation_id, PitchSession.lease_until > utc_now()
            )
        else:
            statement = statement.where(
                or_(PitchSession.operation_id.is_(None), PitchSession.lease_until <= utc_now())
            )
        with self.session_factory() as db:
            result = db.execute(
                statement.values(
                    **values,
                    version=version + 1,
                    operation_id=None,
                    lease_until=None,
                    updated_at=utc_now(),
                )
            )
            if result.rowcount != 1:
                raise APIError(
                    409,
                    "session_conflict",
                    "Session changed or an AI operation is already running; fetch the latest session",
                )
            db.commit()

    def release(self, session_id: str, operation_id: str):
        with self.session_factory() as db:
            db.execute(
                update(PitchSession)
                .where(PitchSession.id == session_id, PitchSession.operation_id == operation_id)
                .values(operation_id=None, lease_until=None)
            )
            db.commit()

    def delete(self, session_id: str, token: str, version: int):
        session = self.get_session(session_id, token)
        if session.version != version or session.busy:
            raise APIError(
                409, "session_conflict", "Session changed or busy; fetch the latest session"
            )
        with self.session_factory() as db:
            result = (
                db.query(PitchSession)
                .filter(
                    PitchSession.id == session_id,
                    PitchSession.version == version,
                    or_(PitchSession.operation_id.is_(None), PitchSession.lease_until <= utc_now()),
                )
                .delete(synchronize_session=False)
            )
            if result != 1:
                raise APIError(409, "session_conflict", "Session changed or busy")
            db.commit()
