import secrets
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response, Security
from fastapi.responses import FileResponse
from fastapi.security import APIKeyHeader
from sqlalchemy import text

from .errors import APIError
from .schemas import (
    AnswersRequest,
    ConfigRead,
    ConfigUpdate,
    ErrorResponse,
    Pitch,
    SessionCreated,
    SessionRead,
    VersionRequest,
)

client_key_header = APIKeyHeader(name="X-API-Key", auto_error=False, scheme_name="ClientKey")
admin_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False, scheme_name="AdminKey")
session_token_header = APIKeyHeader(
    name="X-Session-Token", auto_error=False, scheme_name="SessionToken"
)


def require_client(request: Request, key: Annotated[str | None, Security(client_key_header)]):
    expected = request.app.state.settings.client_key
    if (
        expected
        and expected.get_secret_value()
        and not secrets.compare_digest(expected.get_secret_value(), key or "")
    ):
        raise APIError(401, "invalid_client_key", "A valid X-API-Key is required")


def require_admin(request: Request, key: Annotated[str | None, Security(admin_key_header)]):
    expected = request.app.state.settings.admin_key
    if not expected or not expected.get_secret_value():
        raise APIError(
            403, "admin_disabled", "Set API_ADMIN_KEY on the server to enable configuration writes"
        )
    if not secrets.compare_digest(expected.get_secret_value(), key or ""):
        raise APIError(403, "invalid_admin_key", "A valid X-Admin-Key is required")


def require_session_token(token: Annotated[str | None, Security(session_token_header)]) -> str:
    if not token:
        raise APIError(
            401,
            "session_token_required",
            "Provide X-Session-Token from the session creation response",
        )
    return token


Token = Annotated[str, Depends(require_session_token)]
api = APIRouter(
    prefix="/api/v1",
    dependencies=[Depends(require_client)],
    responses={code: {"model": ErrorResponse} for code in (401, 403, 404, 409, 413, 422, 502, 503)},
)
health = APIRouter(tags=["Health"])


@health.get("/health/live")
def live():
    return {"status": "ok"}


@health.get("/health/ready", responses={503: {"model": ErrorResponse}})
def ready(request: Request):
    try:
        with request.app.state.engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        raise APIError(503, "database_unavailable", "Database is unavailable") from None
    return {"status": "ready", "ai_provider": request.app.state.settings.ai_provider}


@api.get("/config", response_model=ConfigRead, tags=["Configuration"])
def get_configuration(request: Request):
    """Read simulation defaults. Provider keys and deployment secrets are excluded."""
    return request.app.state.repository.get_config()


@api.put(
    "/config",
    response_model=ConfigRead,
    tags=["Configuration"],
    dependencies=[Depends(require_admin)],
)
def update_configuration(payload: ConfigUpdate, request: Request):
    """Replace the configuration using its current revision. Applies to new sessions."""
    return request.app.state.repository.update_config(payload.config, payload.expected_revision)


@api.post("/sessions", response_model=SessionCreated, status_code=201, tags=["Pitch sessions"])
def create_session(payload: Pitch, request: Request, response: Response):
    """Submit a pitch. Save session_token; it is returned only at creation."""
    session, token = request.app.state.repository.create_session(
        payload, request.app.state.settings.ai_provider
    )
    response.headers["Location"] = f"/api/v1/sessions/{session.id}"
    return SessionCreated(**session.model_dump(), session_token=token)


@api.get("/sessions/{session_id}", response_model=SessionRead, tags=["Pitch sessions"])
def get_session(session_id: UUID, token: Token, request: Request):
    """Read the complete transcript, configuration snapshot and evaluation."""
    return request.app.state.repository.get_session(str(session_id), token)


@api.get("/sessions/{session_id}/audio/{filename}", tags=["Pitch sessions"])
def get_session_audio(session_id: UUID, filename: str, token: Token, request: Request):
    """Read a generated MP3 for a private session."""
    request.app.state.repository.get_session(str(session_id), token)
    if "/" in filename or "\\" in filename or not filename.endswith(".mp3"):
        raise APIError(404, "audio_not_found", "Audio file not found")
    path = request.app.state.speech_service.path_for(str(session_id), filename)
    if not path.exists():
        raise APIError(404, "audio_not_found", "Audio file not found")
    return FileResponse(path, media_type="audio/mpeg", filename=filename)


@api.post("/sessions/{session_id}/rounds", response_model=SessionRead, tags=["Interview"])
async def next_round(session_id: UUID, payload: VersionRequest, token: Token, request: Request):
    """Each configured investor generates questions, informed by earlier answers."""
    return await request.app.state.service.next_round(
        str(session_id), token, payload.expected_version
    )


@api.post("/sessions/{session_id}/answers", response_model=SessionRead, tags=["Interview"])
async def submit_answers(session_id: UUID, payload: AnswersRequest, token: Token, request: Request):
    """Answer pending questions. Completing a round also generates investor coaching."""
    return await request.app.state.service.submit_answers(str(session_id), token, payload)


@api.post("/sessions/{session_id}/evaluate", response_model=SessionRead, tags=["Evaluation"])
async def evaluate(session_id: UUID, payload: VersionRequest, token: Token, request: Request):
    """Produce investor feedback and weighted scores after the final round."""
    return await request.app.state.service.evaluate(
        str(session_id), token, payload.expected_version
    )


@api.delete("/sessions/{session_id}", status_code=204, tags=["Pitch sessions"])
def delete_session(
    session_id: UUID, token: Token, request: Request, expected_version: Annotated[int, Query(ge=1)]
):
    """Delete the stored pitch, transcript and report."""
    request.app.state.repository.delete(str(session_id), token, expected_version)
    return Response(status_code=204)
