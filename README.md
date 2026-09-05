# RepoMentor AI

**Understand any codebase in minutes.**

RepoMentor AI ingests a repository (ZIP upload or public GitHub URL), runs a
deterministic **Repository Intelligence Engine** to map its structure, and
then hands that structured context to a modular **AI Orchestrator** —
specialized agents that generate an architecture explanation, interview
prep, API documentation, a README, and more, streamed token-by-token to a
dark, dev-tool-grade frontend.

> 📸 **Screenshots** — _add screenshots or a short screen recording of the
> Home Dashboard, Architecture page (with its Mermaid diagram), and
> Interview Mode here before sharing this repo publicly._

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Repository ingestion** — drag-and-drop a `.zip` or paste a public GitHub
  URL. Validates, extracts/clones, strips build artifacts and binaries, and
  computes metadata (language, size, file/folder counts).
- **Repository Intelligence Engine** — fully deterministic, no LLM involved:
  detects languages, frameworks, package managers, databases, auth
  providers, cloud/deployment targets, entry points, configuration files,
  and important folders; builds a dependency graph; computes health metrics
  (LOC, largest file/folder, average folder depth).
- **AI Orchestrator** — 8 single-responsibility agents (Project Overview,
  Architecture, Folder Explainer, File Explainer, API Documentation,
  Interview Coach, Improvement Advisor, README Generator), each with its own
  prompt template, parser, and response model. Every response is validated
  against a strict schema before it's trusted.
- **Streaming UX** — Server-Sent Events all the way to the browser; the
  frontend shows a live preview while a response generates and swaps to a
  polished, typed view once it's parsed.
- **Caching** — AI output is cached per repository, fingerprinted against
  that repository's Intelligence Engine analysis, so re-visiting a page
  doesn't re-spend tokens unless the underlying repository actually changed.
- **Production hardening** — structured JSON logging, request IDs, security
  headers, in-memory rate limiting, a consistent error envelope, a
  readiness probe distinguishing critical vs. degraded subsystems, and a
  real test suite (pytest + Vitest/RTL) wired into CI.

## Architecture

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full breakdown —
request flow, the Intelligence Engine pipeline, the AI Orchestrator's
agent/prompt/parser/cache design, and how the two connect.

```
Upload / GitHub URL
        │
        ▼
Repository Ingestion  (ValidationService, ZipService, GitHubService,
        │               MetadataService, RepositoryService)
        ▼
Repository Intelligence Engine  (Scanner, Language/Framework/Dependency/
        │                        EntryPoint/Configuration detectors,
        │                        ProjectStructureService, health metrics)
        ▼
AI Orchestrator  (8 agents, each: prompt template → AI provider → strict parser)
        │
        ▼
Streaming JSON (SSE) ──▶ React frontend (dark, glassmorphic, Framer Motion)
```

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, react-markdown, Mermaid |
| Backend    | FastAPI, Python 3.12, Pydantic v2 |
| AI         | Groq (default) or Anthropic Claude — provider-abstracted, switch via `AI_PROVIDER` (see `app/ai/providers/`) |
| Storage    | In-memory (default) with an optional Firebase/Firestore mirror |
| Testing    | pytest + httpx (backend), Vitest + React Testing Library (frontend) |
| CI/CD      | GitHub Actions (lint, typecheck, test, build, dependency audit) |
| Deployment | Vercel (frontend), Render (backend) |

## Project structure

```
repomentor-ai/
├── backend/
│   ├── app/
│   │   ├── api/            Route handlers (ingestion, intelligence, ai, system)
│   │   ├── ai/              Orchestrator, agents, prompts, parsers, providers, cache
│   │   ├── services/        Ingestion services + services/intelligence/
│   │   ├── models/          Domain models (Repository, RepositoryAnalysis, ...)
│   │   ├── schemas/         API request/response schemas
│   │   ├── core/            Logging, exception handlers, middleware
│   │   ├── config/          Environment-driven settings
│   │   └── firebase/        Optional Firebase Admin SDK init
│   └── tests/                pytest suite
├── frontend/
│   └── src/
│       ├── pages/            Route-level pages (dashboard, upload, landing, auth)
│       ├── components/       ui/ (primitives), ai/ (AI-page shells), layout/
│       ├── hooks/             useAgentStream, useRepositoryWorkspace, ...
│       ├── contexts/          Auth, RepositoryWorkspace
│       ├── services/          Typed API client (incl. SSE streaming)
│       └── types/             Shared TypeScript types (mirror backend schemas)
├── .github/workflows/ci.yml
├── render.yaml
└── frontend/vercel.json
```

## Getting started

**Requirements:** Python 3.12+, Node 20+, `git` on `PATH`.

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. The app runs without any external credentials —
Firebase auth and AI features degrade gracefully (see below) rather than
crashing, so you can explore ingestion and the Intelligence Engine
immediately. Add `GROQ_API_KEY` (the default provider — see below) to unlock
the AI-powered pages.

## Environment variables

Full reference with defaults and comments lives in
[`backend/.env.example`](./backend/.env.example) and
[`frontend/.env.example`](./frontend/.env.example). Highlights:

| Variable | Where | Required? | Notes |
|---|---|---|---|
| `AI_PROVIDER` | backend | No (default `groq`) | `groq` or `claude` — selects which `AIProvider` the orchestrator uses, see `app/ai/providers/factory.py` |
| `GROQ_API_KEY` | backend | For AI pages, if `AI_PROVIDER=groq` | Without it, `/api/repository/{id}/ai/*` streams a clean error event instead of failing the app |
| `ANTHROPIC_API_KEY` | backend | For AI pages, if `AI_PROVIDER=claude` | Same graceful-degradation behavior as `GROQ_API_KEY` |
| `FIREBASE_CREDENTIALS_PATH` | backend | No | Without it, storage/cache fall back to in-memory |
| `ALLOWED_ORIGINS` | backend | Yes (prod) | Comma-separated list of frontend origins for CORS |
| `RATE_LIMIT_*` | backend | No | In-memory sliding-window limiter; see [ARCHITECTURE.md](./ARCHITECTURE.md#security) |
| `VITE_API_BASE_URL` | frontend | Yes (prod) | Points the SPA at the deployed backend |
| `VITE_FIREBASE_*` | frontend | No | Enables Google/anonymous sign-in |

## Testing

```bash
# Backend — 53 tests: ingestion, Intelligence Engine, AI orchestrator
# (via a fake provider, no real API calls), rate limiting, middleware
cd backend && pip install -r requirements-dev.txt && pytest

# Frontend — component + hook tests (Vitest + React Testing Library)
cd frontend && npm test
```

Both suites run in CI on every push/PR — see
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step Render + Vercel
instructions, including required environment variables and the known
limitation that Render's free-tier filesystem is ephemeral (in-memory state
resets on restart unless you attach a persistent disk / configure
Firestore).

## Roadmap

- [ ] Persist `RepositoryService` / `AnalysisStore` / `AICacheStore` to
      Firestore by default instead of best-effort mirroring
- [x] Additional `AIProvider` implementations behind the existing
      interface — Groq (`GroqProvider`, now the default) alongside the
      original `ClaudeProvider`, selected via `AI_PROVIDER`
- [ ] Further `AIProvider` implementations (OpenAI, Gemini) behind the
      same interface
- [ ] A `mode` parameter on folder/file explanation so "Explain Like I'm
      New" vs. "Senior Engineer" trigger genuinely distinct AI generations
      (currently a client-side presentation lens over one response — see
      `ExplainModeSelector`)
- [ ] A real file-tree endpoint so Explorer isn't limited to the
      Intelligence Engine's curated important-folders/entry-points list
- [ ] Redis-backed rate limiting for multi-instance deployments

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
