# Architecture

This document describes how a repository moves through the system, end to
end, and the design decisions behind each layer.

## 1. Request flow

```
┌─────────────┐   ZIP/GitHub URL   ┌──────────────────────┐
│   Frontend  │ ─────────────────▶ │  Ingestion (app/api)  │
└─────────────┘                    │  upload.py / github.py│
                                    └──────────┬────────────┘
                                               ▼
                                    RepositoryService
                                    (validate → extract/clone →
                                     strip ignored paths →
                                     compute metadata → store)
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ Intelligence Engine   │◀── POST /repository/{id}/analyze
                                    │ (deterministic, no AI)│
                                    └──────────┬────────────┘
                                               ▼
                                    AnalysisStore (in-memory,
                                    Firestore mirror if configured)
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ AI Orchestrator        │◀── POST /repository/{id}/ai/*
                                    │ (8 agents, streaming)  │
                                    └──────────┬────────────┘
                                               ▼
                                    AICacheStore, fingerprinted
                                    to the Intelligence analysis
                                               │
                                               ▼
                                    SSE stream ──▶ Frontend (useAgentStream)
```

Two POST steps are required before any AI feature works: `/upload` or
`/github` (ingest), then `/repository/{id}/analyze` (run the Intelligence
Engine). AI endpoints return a clean error — not a crash — if either step
hasn't happened yet.

## 2. Repository ingestion

| Service | Responsibility |
|---|---|
| `ValidationService` | GitHub URL shape, ZIP integrity (corruption, emptiness), size limits |
| `ZipService` | Safe extraction with zip-slip protection (every member path is resolved and checked against the destination root before being written) |
| `GitHubService` | Shallow clone (`--depth 1`) via `asyncio.create_subprocess_exec` — argument list, never a shell, so there's no command-injection surface |
| `MetadataService` | Strips ignored paths (`node_modules`, `.git`, build artifacts, binaries), computes file/folder counts, size, primary language |
| `RepositoryService` | Orchestrates the above, owns the `Repository` record's lifecycle (`Queued → Uploading/Extracting → Preparing → Ready`/`Failed`) |

Storage is an in-memory dict today (`RepositoryService._store`), documented
as the seam to swap for real persistence — see the Roadmap in the root
README.

## 3. Repository Intelligence Engine

Runs once per `/analyze` call, entirely rule-based:

`RepositoryScanner` (one filesystem walk) → `LanguageDetector` →
`DependencyDetector` (parses `package.json`, `requirements.txt`,
`pyproject.toml`, `pom.xml`, `build.gradle(.kts)`, `Gemfile`,
`composer.json`, `Cargo.toml`, `*.csproj` into a structured dependency
graph) → `FrameworkDetector` → `EntryPointDetector` →
`ConfigurationDetector` → `ProjectStructureService` →
`ProjectHealthService` → `SummaryGenerator`, which assembles the final
`RepositorySummary` (the exact object AI prompts are built from) plus the
richer `RepositoryAnalysis` (health metrics, full dependency graph,
detected-but-not-primary databases/auth/cloud targets).

## 4. AI Orchestrator

Each of the 8 agents (`app/ai/agents/`) is a single-responsibility unit:

```python
class SomeAgent(BaseAgent):
    def build_prompt(self, *, repository, analysis, **context) -> (system, user):
        ...  # slices only the context this agent needs — never the whole repo
    def parse(self, raw_text) -> ResponseModel:
        ...  # strict pydantic validation; never trusts raw LLM text
```

- **Prompts** live entirely outside Python, as `.system.md`/`.user.md`
  template pairs under `app/ai/prompts/templates/`, rendered via a
  `{{TOKEN}}` substitution loader (`app/ai/prompts/loader.py`) that never
  collides with JSON braces in injected context.
- **Providers** are abstracted behind `AIProvider` (`complete` /
  `stream`); `ClaudeProvider` is the only implementation today, but adding
  `OpenAIProvider` means writing one new file, not touching agents.
- **Caching** (`AICacheStore`) is keyed by `(repository_id, agent_name,
  extra_key, fingerprint)`, where the fingerprint is a hash of the
  repository's current `RepositoryAnalysis` — so a re-analyzed (changed)
  repository naturally misses the cache instead of serving stale output.
- **Streaming**: `AIOrchestrator._stream` yields `{"type": "chunk"}` events
  as text arrives, then a single `{"type": "done" | "cached" | "error"}` to
  close out the stream. The API layer (`app/api/ai.py`) serializes these as
  Server-Sent Events; the frontend's `useAgentStream` hook consumes them.

## 5. Frontend

- `RepositoryWorkspaceContext` loads a repository + its analysis once per
  repository id and shares it across every nested AI page (Overview,
  Architecture, Explorer, ...), avoiding duplicate fetches on navigation.
- `useAgentStream` drives every AI page: manages the fetch + `AbortController`
  lifecycle, accumulates SSE chunks, and exposes `status/text/data/error`.
- Every dashboard page is `React.lazy`-loaded; Mermaid (a large dependency)
  is dynamically imported only when the Architecture page actually renders
  a diagram.

## 6. Security

- **Zip-slip**: every extracted path is resolved and verified to stay
  inside the destination directory (`ZipService._safe_member_path`).
- **Command injection**: `git clone` runs via an argument list through
  `asyncio.create_subprocess_exec`, never a shell string.
- **Path traversal in AI agents**: folder/file explanation agents validate
  the requested path against the actual scanned file tree before doing
  anything with it — an unknown path is rejected, not silently resolved.
- **Prompt injection**: repository *content* is attacker-controlled by
  nature of the feature. The mitigation in place is structural, not
  best-effort: every agent's output must validate against a strict pydantic
  schema (`app/ai/parsers/`) or the whole response is rejected — injected
  instructions can't produce a response outside that schema. This is a
  known-residual-risk area, not a fully "solved" one; treat it as a
  documented limitation.
- **Rate limiting**: an in-memory sliding-window limiter
  (`app/core/rate_limit.py`), stricter for `/ai/*` routes. Single-process
  only by design — swap for Redis before running multiple instances.
- **Security headers & CORS**: `SecurityHeadersMiddleware` sets
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and HSTS in production; CORS is restricted to
  `ALLOWED_ORIGINS`, never `*`.
- **Error responses** never include stack traces — `register_exception_handlers`
  logs the full exception server-side and returns a generic message
  client-side, with a `request_id` for cross-referencing logs.
