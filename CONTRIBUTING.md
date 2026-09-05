# Contributing

Thanks for considering a contribution to RepoMentor AI. This is a portfolio
project first, but it's built with real production practices, and PRs are
welcome.

## Getting set up

Follow [Getting started](./README.md#getting-started) in the root README.
Run both test suites before opening a PR:

```bash
cd backend && pip install -r requirements-dev.txt && pytest
cd frontend && npm test
```

CI (`.github/workflows/ci.yml`) runs lint, type-check, tests, and a
production build for both backend and frontend on every push/PR — make
sure those pass locally first.

## Project conventions

- **Backend**: Python 3.12, type-hinted, `pyflakes`-clean. Services are
  single-responsibility and composed by orchestrators (`RepositoryService`,
  `AnalysisPipeline`, `AIOrchestrator`) — avoid reaching into another
  service's internals; go through its public methods.
- **AI agents**: every agent owns its own prompt template
  (`app/ai/prompts/templates/`), parser (`app/ai/parsers/`), and response
  model (`app/ai/models/responses.py`). Prompts are markdown files, not
  Python strings — don't inline prompt text in agent code.
- **Frontend**: TypeScript strict mode, Tailwind for styling (no inline
  style objects for anything reusable), Framer Motion for animation. Keep
  components small; shared behavior goes in `hooks/`, shared presentation
  in `components/ui/`.
- **Never trust raw LLM text** — any new AI-facing code must validate LLM
  output against a pydantic schema before using it.

## Making changes

1. Fork and branch from `main`.
2. Write or update tests for whatever you change — see `backend/tests/`
   and `frontend/src/**/*.test.{ts,tsx}` for examples and existing
   patterns (fixtures, fake providers, mocked streams).
3. Run the full test + lint + build pipeline locally.
4. Open a PR with a clear description of the change and why.

## Reporting issues

Open a GitHub issue with steps to reproduce. For security issues, please
avoid filing a public issue — see the security notes in
[ARCHITECTURE.md](./ARCHITECTURE.md#6-security) for known limitations
before reporting something already documented there.
