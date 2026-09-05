from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central application configuration, sourced from environment variables.
    Extend this as real services (analysis, storage, etc.) come online —
    every module should read config from here rather than os.environ directly.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    app_name: str = "RepoMentor AI"
    environment: str = "development"  # development | staging | production
    debug: bool = True

    # CORS
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Firebase
    firebase_project_id: str = ""
    firebase_credentials_path: str = ""

    # Uploads
    max_upload_size_mb: int = 100

    # Repository ingestion
    repository_storage_dir: str = "data/repositories"
    max_repository_size_mb: int = 150

    # AI layer
    # Which concrete AIProvider backs the AI Orchestrator. See
    # app/ai/providers/factory.py for how this is resolved.
    ai_provider: str = "claude"  # claude | groq
    anthropic_api_key: str = ""
    ai_model: str = "claude-sonnet-5"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    ai_max_tokens: int = 4096
    ai_request_timeout_seconds: int = 60

    # Rate limiting (simple in-memory sliding window — see app/core/middleware.py)
    rate_limit_enabled: bool = True
    rate_limit_requests_per_minute: int = 60
    rate_limit_ai_requests_per_minute: int = 10

    @field_validator("environment")
    @classmethod
    def _validate_environment(cls, value: str) -> str:
        allowed = {"development", "staging", "production"}
        normalized = value.strip().lower()
        if normalized not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {sorted(allowed)}, got {value!r}")
        return normalized

    @field_validator("ai_provider")
    @classmethod
    def _validate_ai_provider(cls, value: str) -> str:
        allowed = {"claude", "groq"}
        normalized = value.strip().lower()
        if normalized not in allowed:
            raise ValueError(f"AI_PROVIDER must be one of {sorted(allowed)}, got {value!r}")
        return normalized

    @field_validator("max_upload_size_mb", "max_repository_size_mb", "ai_max_tokens", "ai_request_timeout_seconds")
    @classmethod
    def _validate_positive(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Must be a positive integer.")
        return value

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
