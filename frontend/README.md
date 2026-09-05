# RepoMentor AI — Frontend

React + TypeScript + Vite + Tailwind + Framer Motion. A repository-scoped
dashboard that streams AI-generated content (architecture, interview prep,
API docs, README) live from the backend's Server-Sent Events endpoints.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in the Firebase web config in `.env` to enable sign-in. Without it, the
app still runs — auth-gated routes fall back to an unauthenticated "demo
mode".

## Run

```bash
npm run dev
```

App runs at http://localhost:5173. The FastAPI backend is expected at
http://localhost:8000 (configurable via `VITE_API_BASE_URL`).

## Testing

```bash
npm test          # run once (Vitest)
npm run test:watch
npm run lint
npx tsc -b        # type-check
```

Component tests use React Testing Library; the `useAgentStream` hook is
tested against a fake async generator, so no network/backend is needed to
run the suite.

## Structure

```
src/
  components/
    layout/     Navbar, Sidebar, DashboardLayout, RepositoryWorkspaceLayout
    ui/         Button, Card, Loader, Badge, StreamingMarkdown, MermaidDiagram, ...
    ai/         AgentStreamPanel, RequiresIntelligenceAnalysis — shared AI-page shells
    upload/     UploadZone (drag-and-drop)
  pages/
    landing/    Marketing landing page
    auth/       Login page
    upload/     Upload / GitHub URL intake page
    dashboard/  HomeDashboard, RepositoryHome, Overview, Architecture, Explorer,
                ApiExplorer, InterviewMode, Improvements, Readme, Settings
  contexts/     AuthContext, RepositoryWorkspaceContext
  hooks/        useAgentStream (SSE state machine), useRepositoryWorkspace,
                useAuth, usePreferences, useMousePosition
  services/     firebase.ts, api.ts (typed backend client incl. SSE streaming)
  router/       AppRouter (lazy-loaded pages), ProtectedRoute
  types/        Shared TypeScript types — mirror backend Pydantic schemas exactly
  utils/        cn (class merge), formatters
```

## Design system

- **Palette**: near-black base (`#0A0C11`) with an indigo → cyan signal
  gradient (`#7C6CF0` → `#2CD9E8`) as the primary accent.
- **Type**: Space Grotesk (display), Inter (body), JetBrains Mono (code/data).
- **Surfaces**: glassmorphism cards over a faint animated grid background.
- **Motion**: Framer Motion for page transitions, the sidebar's active-item
  indicator, collapsible sections, and streaming fade-ins — kept subtle,
  respects `prefers-reduced-motion`.

## Streaming

Every AI page uses `useAgentStream`, which POSTs to the backend's SSE
endpoint and exposes `{ status, text, data, error, regenerate }`. While a
response is generating, the raw in-flight JSON is shown in a terminal-style
preview (`StreamingRawPreview`) rather than rendered as broken markdown —
the underlying stream is structured JSON, not prose, so this frames it
honestly. Once parsed, it swaps to the polished, typed view.

## Known limitations

- **Explain Modes** (`ExplainModeSelector`) are a client-side presentation
  lens over one AI response, not five distinct AI generations — the
  backend's folder/file explanation endpoints don't yet accept a `mode`
  parameter. See the Roadmap in the root README.
- **Explorer** is limited to paths the Intelligence Engine already
  surfaced (important folders, entry points, config files) plus a manual
  path lookup — there's no backend endpoint for a full file tree yet.
