import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.config import get_settings
from app.core import (
    RateLimitMiddleware,
    RequestLoggingMiddleware,
    SecurityHeadersMiddleware,
    configure_logging,
    register_exception_handlers,
)
from app.firebase import init_firebase

logger = logging.getLogger("app.startup")


def _validate_environment() -> None:
    """
    Logs (never raises) warnings for missing-but-recommended configuration.
    The app is designed to run in a useful degraded mode without Firebase
    or an AI provider configured, so this is advisory, not fatal — a
    production operator should still see it in their logs at boot.
    """
    settings = get_settings()

    active_provider_key = settings.groq_api_key if settings.ai_provider == "groq" else settings.anthropic_api_key
    if not active_provider_key:
        env_var = "GROQ_API_KEY" if settings.ai_provider == "groq" else "ANTHROPIC_API_KEY"
        logger.warning(f"startup_warning: {env_var} is not set — AI endpoints will return 503.")
    if not settings.firebase_credentials_path:
        logger.warning("startup_warning: FIREBASE_CREDENTIALS_PATH is not set — using in-memory storage only.")
    if settings.is_production and settings.debug:
        logger.warning("startup_warning: DEBUG=true while ENVIRONMENT=production — verbose errors may leak detail.")
    if settings.is_production and "*" in settings.allowed_origins_list:
        logger.warning("startup_warning: ALLOWED_ORIGINS includes '*' in production — this is unusually permissive.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(debug=settings.debug, log_format="json" if settings.is_production else "text")
    _validate_environment()
    init_firebase()
    logger.info("startup_complete", extra={"environment": settings.environment})
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description=(
            "Understand any codebase in minutes. Repository ingestion, a deterministic "
            "Repository Intelligence Engine, and a modular AI Orchestrator for architecture, "
            "interview prep, documentation, and improvement suggestions."
        ),
        version="0.3.0",
        lifespan=lifespan,
    )

    register_exception_handlers(app)

    # Middleware executes outside-in on the way in, inside-out on the way
    # out — added here so CORS headers land on every response, including
    # rate-limited (429) and unhandled-error (500) ones.
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    return app


app = create_app()
