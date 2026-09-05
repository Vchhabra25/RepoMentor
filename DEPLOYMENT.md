# Deployment

RepoMentor AI deploys as two independent services: the FastAPI backend on
**Render**, and the Vite/React frontend on **Vercel**.

## Backend → Render

A [`render.yaml`](./render.yaml) blueprint is included at the repo root.

1. In the Render dashboard: **New → Blueprint**, point it at this repo.
2. Render will detect `render.yaml` and provision a `repomentor-ai-backend`
   web service (`rootDir: backend`, Python runtime).
3. Set the `sync: false` environment variables in the Render dashboard
   (these aren't committed, on purpose):
   - `ALLOWED_ORIGINS` — your deployed Vercel URL, e.g.
     `https://repomentor-ai.vercel.app`
   - `ANTHROPIC_API_KEY` — required for AI features; the app runs fine
     without it (AI endpoints return a clean error), but the demo won't
     feel complete
   - `FIREBASE_CREDENTIALS_PATH` / `FIREBASE_PROJECT_ID` — optional
4. Deploy. Health check is wired to `GET /api/health`; use `GET /api/ready`
   for a deeper readiness probe (distinguishes "critical" failures like an
   unwritable storage directory from "degraded but functional" like a
   missing AI key).

**Known limitation:** Render's free-tier filesystem is ephemeral — every
deploy or restart wipes `data/repositories` and resets the in-memory
`RepositoryService` / `AnalysisStore` / `AICacheStore`. For a persistent
demo:
- Attach a [Render Disk](https://render.com/docs/disks) mounted at the path
  in `REPOSITORY_STORAGE_DIR`, and/or
- Configure Firebase so `AnalysisStore`/`AICacheStore`'s existing
  best-effort Firestore mirror actually has something to write to (note:
  today they mirror writes but don't read back from Firestore on restart —
  see the Roadmap in the root README).

## Frontend → Vercel

A [`vercel.json`](./frontend/vercel.json) is included in `frontend/`.

1. In the Vercel dashboard: **New Project**, import this repo, set the
   **Root Directory** to `frontend`.
2. Vercel auto-detects the Vite framework preset (`vercel.json` also
   declares it explicitly).
3. Set environment variables (Project Settings → Environment Variables):
   - `VITE_API_BASE_URL` — your deployed Render backend URL
   - `VITE_FIREBASE_*` — optional, enables Google/anonymous sign-in
4. Deploy. `vercel.json` includes an SPA rewrite (`/* → /index.html`) so
   client-side routes like `/dashboard/:repositoryId/architecture` work on
   a hard refresh, plus long-lived caching for hashed asset files.

## Production checklist

- [ ] `ENVIRONMENT=production` and `DEBUG=false` on the backend
- [ ] `ALLOWED_ORIGINS` set to the exact Vercel URL (no `*`)
- [ ] `ANTHROPIC_API_KEY` set if you want AI features live in the demo
- [ ] `RATE_LIMIT_ENABLED=true` (default) — consider raising
      `RATE_LIMIT_AI_REQUESTS_PER_MINUTE` if you expect real traffic
- [ ] Frontend `VITE_API_BASE_URL` points at the Render URL, not localhost
- [ ] Hit `GET /api/ready` after deploying and confirm `"status": "ready"`

## Logs

The backend emits structured JSON logs when `ENVIRONMENT=production`
(`app/core/logging.py`), one JSON object per line, including a
`request_id` on every request-scoped log — Render's log viewer displays
these directly; pipe them into any log aggregator that ingests JSON lines.
