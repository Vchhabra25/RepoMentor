from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.schemas import HealthResponse, ReadinessCheck, ReadinessResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Liveness probe — is the process up and serving requests at all."""
    settings = get_settings()
    return HealthResponse(status="ok", service=settings.app_name, environment=settings.environment)


@router.get("/ready", response_model=ReadinessResponse)
def readiness_check() -> JSONResponse:
    """
    Readiness probe — can this instance actually do its job right now.
    Storage being unwritable is critical (ingestion cannot work at all) and
    returns 503; AI/Firebase being unconfigured is degraded-but-functional
    (the app runs fine without them) and still returns 200.
    """
    settings = get_settings()
    checks: list[ReadinessCheck] = []
    critical_failure = False

    storage_path = Path(settings.repository_storage_dir)
    try:
        storage_path.mkdir(parents=True, exist_ok=True)
        probe_file = storage_path / ".readiness-probe"
        probe_file.write_text("ok")
        probe_file.unlink(missing_ok=True)
        checks.append(ReadinessCheck(name="repository_storage", status="ok", detail=str(storage_path)))
    except OSError as exc:
        critical_failure = True
        checks.append(ReadinessCheck(name="repository_storage", status="unavailable", detail=str(exc)))

    if settings.ai_provider == "groq":
        active_key, model, env_var = settings.groq_api_key, settings.groq_model, "GROQ_API_KEY"
    else:
        active_key, model, env_var = settings.anthropic_api_key, settings.ai_model, "ANTHROPIC_API_KEY"

    if active_key:
        checks.append(ReadinessCheck(name="ai_provider", status="ok", detail=f"{settings.ai_provider}:{model}"))
    else:
        checks.append(ReadinessCheck(name="ai_provider", status="degraded", detail=f"{env_var} not configured"))

    if settings.firebase_credentials_path:
        checks.append(ReadinessCheck(name="firebase", status="ok", detail="Credentials configured"))
    else:
        checks.append(ReadinessCheck(name="firebase", status="degraded", detail="Running with in-memory storage only"))

    overall = "ready" if not critical_failure else "degraded"
    response = ReadinessResponse(status=overall, checks=checks)
    return JSONResponse(status_code=503 if critical_failure else 200, content=response.model_dump())
