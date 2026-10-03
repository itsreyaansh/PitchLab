from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Integer, String, create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.pool import StaticPool


def utc_now() -> datetime:
    return datetime.now(UTC)


def aware(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


class Base(DeclarativeBase):
    pass


class Configuration(Base):
    __tablename__ = "configuration"
    id: Mapped[int] = mapped_column(primary_key=True)
    revision: Mapped[int] = mapped_column(Integer, default=1)
    data: Mapped[dict] = mapped_column(JSON)


class PitchSession(Base):
    __tablename__ = "pitch_sessions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    token_hash: Mapped[str] = mapped_column(String(64))
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(32), default="ready_for_round")
    ai_provider: Mapped[str] = mapped_column(String(32))
    config_revision: Mapped[int] = mapped_column(Integer)
    config: Mapped[dict] = mapped_column(JSON)
    pitch: Mapped[dict] = mapped_column(JSON)
    current_round: Mapped[int] = mapped_column(Integer, default=0)
    questions: Mapped[list] = mapped_column(JSON, default=list)
    round_analyses: Mapped[list] = mapped_column(JSON, default=list)
    evaluation: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    operation_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    lease_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


def make_database(url: str):
    options = {"pool_pre_ping": True}
    if url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False, "timeout": 30}
        if url in {"sqlite://", "sqlite:///:memory:"}:
            options["poolclass"] = StaticPool
    engine = create_engine(url, **options)
    return engine, sessionmaker(bind=engine, expire_on_commit=False)


def ensure_database_schema(engine):
    Base.metadata.create_all(engine)
    if engine.dialect.name != "sqlite":
        return
    columns = {column["name"] for column in inspect(engine).get_columns("pitch_sessions")}
    if "round_analyses" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE pitch_sessions ADD COLUMN round_analyses JSON DEFAULT '[]'")
            )
