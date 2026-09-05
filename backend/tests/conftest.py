import os

# Must happen before `app.main` (and therefore the middleware stack) is
# imported anywhere in the test session, since RateLimitMiddleware reads
# this setting once at app construction time.
os.environ.setdefault("RATE_LIMIT_ENABLED", "false")
os.environ.setdefault("ENVIRONMENT", "development")

import pytest
from fastapi.testclient import TestClient

from app.ai.cache import ai_cache_store
from app.config import get_settings
from app.main import app
from app.services import repository_service
from app.services.intelligence import analysis_store


@pytest.fixture(autouse=True)
def isolated_state(tmp_path, monkeypatch):
    """
    Every test gets its own on-disk storage directory and starts from
    empty in-memory stores — RepositoryService, AnalysisStore, and
    AICacheStore are process-wide singletons, so without this, state from
    one test would leak into the next.
    """
    monkeypatch.setattr(get_settings(), "repository_storage_dir", str(tmp_path / "repositories"))
    repository_service._store.clear()
    analysis_store._cache.clear()
    ai_cache_store._cache.clear()
    yield


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
