import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from .ai import AIProvider
from .config import BASE_DIR, Settings
from .database import ensure_database_schema, make_database
from .errors import APIError
from .middleware import RequestContextMiddleware
from .repository import Repository
from .routes import api, health
from .schemas import SimulationConfig
from .service import SimulationService
from .speech import SpeechService
from .web_research import WebResearcher

logger = logging.getLogger("shark_tank")


def error_response(
    request: Request, status: int, code: str, message: str, details=None, headers=None
):
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=status,
        content={
            "error": {"code": code, "message": message, "details": details},
            "request_id": request_id,
        },
        headers=headers,
    )


def create_app(
    settings: Settings | None = None, ai_transport: httpx.AsyncBaseTransport | None = None
) -> FastAPI:
    settings = settings or Settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        logging.basicConfig(
            level=settings.log_level, format="%(asctime)s %(levelname)s %(name)s %(message)s"
        )
        engine, session_factory = make_database(settings.database_url)
        try:
            await run_in_threadpool(ensure_database_schema, engine)
            repository = Repository(session_factory)
            config = SimulationConfig()
            if settings.config_file and not await run_in_threadpool(repository.has_config):
                path = settings.config_file
                if not path.is_absolute():
                    path = BASE_DIR / path
                config = SimulationConfig.model_validate_json(path.read_text(encoding="utf-8-sig"))
            await run_in_threadpool(repository.seed_config, config)
            async with httpx.AsyncClient(
                transport=ai_transport, follow_redirects=False, trust_env=False
            ) as client:
                provider = AIProvider(settings, client)
                web_researcher = WebResearcher(settings, client)
                speech_service = SpeechService(settings, client)
                app.state.settings = settings
                app.state.engine = engine
                app.state.repository = repository
                app.state.speech_service = speech_service
                app.state.service = SimulationService(
                    repository, provider, settings, web_researcher, speech_service
                )
                yield
        finally:
            await run_in_threadpool(engine.dispose)

    app = FastAPI(
        title=settings.title,
        version="1.0.0",
        description="Configurable investor panel that cross-questions business pitches and produces a scored simulation report.",
        lifespan=lifespan,
        docs_url="/docs" if settings.docs_enabled else None,
        redoc_url="/redoc" if settings.docs_enabled else None,
        openapi_url="/openapi.json" if settings.docs_enabled else None,
    )

    @app.exception_handler(APIError)
    async def api_error(request: Request, error: APIError):
        return error_response(request, error.status, error.code, error.message)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, error: RequestValidationError):
        # Exclude submitted values and exception contexts from error responses.
        details = [
            {"location": list(item["loc"]), "message": item["msg"], "type": item["type"]}
            for item in error.errors()
        ]
        return error_response(
            request, 422, "validation_error", "Request validation failed", details
        )

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, error: HTTPException):
        return error_response(
            request, error.status_code, "http_error", str(error.detail), headers=error.headers
        )

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, error: Exception):
        # SQL/HTTP exception strings may contain private pitches or credentials.
        logger.error(
            "Unhandled error type=%s request_id=%s",
            type(error).__name__,
            getattr(request.state, "request_id", "unknown"),
        )
        return error_response(
            request,
            500,
            "internal_error",
            "An unexpected server error occurred",
            headers={
                "X-Request-ID": getattr(request.state, "request_id", "unknown"),
                "Cache-Control": "no-store",
            },
        )

    app.include_router(health)
    app.include_router(api)
    app.add_middleware(RequestContextMiddleware, max_request_bytes=settings.max_request_bytes)
    # CORS wraps the body guard so browsers also receive CORS headers on 413 responses.
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=False,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "X-Session-Token", "X-API-Key", "X-Admin-Key"],
            expose_headers=["X-Request-ID", "Location"],
        )
    return app
