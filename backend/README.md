# RepoMentor AI — Backend

FastAPI service: repository ingestion, a deterministic Repository
Intelligence Engine, and a modular AI Orchestrator. See the root
[README](../README.md) for the full picture and
[ARCHITECTURE.md](../ARCHITECTURE.md) for how the pieces fit together.

## Structure

```
app/
  api/          Route handlers: health, upload, github, repository, intelligence, ai, analyze
  services/     Ingestion services (validation, zip, github, metadata, repository)
    intelligence/  The Repository Intelligence Engine (scanner + 7 detectors + pipeline)
  ai/           The AI layer
    orchestrator/  AIOrchestrator — the single entrypoint, owns caching
    agents/        8 single-responsibility agents
    prompts/       Prompt templates (.system.md/.user.md) + loader — no prompt text in Python
    parsers/       Strict JSON→pydantic validation for every agent's output
    providers/     AIProvider interface + ClaudeProvider
    cache/         AICacheStore — fingerprinted to the Intelligence analysis
  models/       Domain models (Repository, RepositoryAnalysis, ...)
  schemas/      API request/response schemas
  core/         Logging, exception handlers, security/rate-limit middleware
  config/       Environment-driven settings (with validation)
  utils/        Shared helpers (ignore rules, language map)
  firebase/     Optional Firebase Admin SDK init
  main.py       App factory: middleware stack, exception handlers, lifespan
tests/          pytest suite (53 tests) — see below
```

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs · Health: `/api/health` · Readiness: `/api/ready`

## Testing

```bash
pip install -r requirements-dev.txt
pytest              # full suite
pytest -v            # verbose
python -m pyflakes app tests   # lint
```

Tests use a fake `AIProvider` for AI-layer coverage — no real Anthropic API
calls happen in the test suite, and GitHub cloning is mocked so tests don't
depend on network access.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Liveness probe |
| GET | `/api/ready` | Readiness probe (storage/AI/Firebase status) |
| POST | `/api/upload` | Ingest a repository from a `.zip` |
| POST | `/api/github` | Ingest a public GitHub repository |
| GET | `/api/repository/{id}` | Get a single ingested repository |
| GET | `/api/repositories` | List all ingested repositories |
| POST | `/api/repository/{id}/analyze` | Run the Intelligence Engine |
| GET | `/api/repository/{id}/analysis` | Get a stored Intelligence analysis |
| POST | `/api/repository/{id}/ai/{overview\|architecture\|folder-explanation\|file-explanation\|api-documentation\|interview-questions\|improvement-suggestions\|readme}` | Streaming AI agent endpoints (SSE) |

## Firebase

Optional. Firebase Admin initializes only if `FIREBASE_CREDENTIALS_PATH`
points to a valid service-account JSON file — without it, the app runs
fine with in-memory storage/caching only.

## Environment variables

See [`.env.example`](./.env.example) for the full list with defaults and
comments — settings are validated at startup (`app/config/settings.py`),
and missing-but-recommended config (AI key, Firebase) logs a warning
rather than crashing the app.
