import logging
from typing import AsyncIterator, Dict, Optional

from app.ai.agents import (
    BaseAgent,
    api_documentation_agent,
    architecture_agent,
    file_explainer_agent,
    folder_explainer_agent,
    improvement_advisor_agent,
    interview_coach_agent,
    project_overview_agent,
    readme_generator_agent,
)
from app.ai.cache import ai_cache_store, repository_fingerprint
from app.ai.errors import AIError
from app.ai.models import AgentRunResult
from app.ai.providers import get_default_provider
from app.ai.providers.base import AIProvider
from app.models import Repository, RepositoryAnalysis, RepositoryStatus
from app.services import repository_service
from app.services.intelligence import analysis_store

logger = logging.getLogger(__name__)


class OrchestratorError(AIError):
    """Raised for orchestration-level failures (missing repository, repository not ready, no analysis yet)."""


class AIOrchestrator:
    """
    The single entrypoint for every AI-powered feature. Decides which
    specialized agent handles a request, assembles the (already-narrow)
    context each agent asks for, checks the cache before spending a single
    token, and — for streaming requests — relays raw text chunks to the
    caller while still parsing and caching the accumulated result once the
    stream completes.

    This class deliberately has no LLM-calling logic of its own: every
    completion goes through an AIProvider, and every prompt/parse step
    belongs to the agent. The orchestrator only orchestrates.
    """

    def __init__(self, provider: Optional[AIProvider] = None) -> None:
        self._provider = provider or get_default_provider()

    # -- lookups --------------------------------------------------------------

    @staticmethod
    def _load_repository_and_analysis(repository_id: str) -> tuple[Repository, RepositoryAnalysis]:
        repository = repository_service.get(repository_id)
        if repository is None:
            raise OrchestratorError(f"Repository '{repository_id}' was not found.")
        if repository.status != RepositoryStatus.READY:
            raise OrchestratorError(
                f"Repository is not ready for AI analysis (current status: {repository.status})."
            )

        analysis = analysis_store.get(repository_id)
        if analysis is None:
            raise OrchestratorError(
                "This repository hasn't been analyzed by the Repository Intelligence Engine yet. "
                "Run POST /api/repository/{id}/analyze first."
            )

        return repository, analysis

    # -- generic run / stream --------------------------------------------------

    async def _run(self, agent: BaseAgent, repository_id: str, *, extra_key: str = "", **extra_context) -> AgentRunResult:
        repository, analysis = self._load_repository_and_analysis(repository_id)
        fingerprint = repository_fingerprint(analysis)

        cached = ai_cache_store.get(
            repository_id=repository_id, agent_name=agent.name, fingerprint=fingerprint, extra_key=extra_key
        )
        if cached is not None:
            return AgentRunResult(
                agent=agent.name, repository_id=repository_id, data=cached.data, from_cache=True,
                generated_at=cached.generated_at,
            )

        data = await agent.run(self._provider, repository=repository, analysis=analysis, **extra_context)
        entry = ai_cache_store.set(
            repository_id=repository_id, agent_name=agent.name, fingerprint=fingerprint, data=data, extra_key=extra_key
        )
        return AgentRunResult(
            agent=agent.name, repository_id=repository_id, data=data, from_cache=False, generated_at=entry.generated_at
        )

    async def _stream(
        self, agent: BaseAgent, repository_id: str, *, extra_key: str = "", **extra_context
    ) -> AsyncIterator[Dict[str, object]]:
        """
        Yields dict events for the API layer to serialize as SSE:
          {"type": "cached", "data": <parsed model dict>}                    — cache hit, nothing to stream
          {"type": "chunk", "text": "..."}                                   — a token/text delta
          {"type": "done", "data": <parsed model dict>, "from_cache": False} — stream finished, fully parsed
          {"type": "error", "message": "..."}                                — something failed
        """
        try:
            repository, analysis = self._load_repository_and_analysis(repository_id)
            fingerprint = repository_fingerprint(analysis)

            cached = ai_cache_store.get(
                repository_id=repository_id, agent_name=agent.name, fingerprint=fingerprint, extra_key=extra_key
            )
            if cached is not None:
                yield {"type": "cached", "data": cached.data.model_dump(mode="json")}
                return

            accumulated = ""
            async for chunk in agent.stream(self._provider, repository=repository, analysis=analysis, **extra_context):
                accumulated += chunk
                yield {"type": "chunk", "text": chunk}

            parsed = agent.parse(accumulated)
            ai_cache_store.set(
                repository_id=repository_id, agent_name=agent.name, fingerprint=fingerprint, data=parsed, extra_key=extra_key
            )
            yield {"type": "done", "data": parsed.model_dump(mode="json"), "from_cache": False}
        except AIError as exc:
            logger.warning("AI stream failed for agent=%s repository=%s: %s", agent.name, repository_id, exc)
            yield {"type": "error", "message": str(exc)}

    # -- public API: non-streaming ---------------------------------------------

    async def generate_project_overview(self, repository_id: str) -> AgentRunResult:
        return await self._run(project_overview_agent, repository_id)

    async def generate_architecture(self, repository_id: str) -> AgentRunResult:
        return await self._run(architecture_agent, repository_id)

    async def generate_folder_explanation(self, repository_id: str, folder_path: str) -> AgentRunResult:
        return await self._run(folder_explainer_agent, repository_id, extra_key=folder_path, folder_path=folder_path)

    async def generate_file_explanation(self, repository_id: str, file_path: str) -> AgentRunResult:
        return await self._run(file_explainer_agent, repository_id, extra_key=file_path, file_path=file_path)

    async def generate_api_documentation(self, repository_id: str) -> AgentRunResult:
        return await self._run(api_documentation_agent, repository_id)

    async def generate_interview_questions(self, repository_id: str) -> AgentRunResult:
        return await self._run(interview_coach_agent, repository_id)

    async def generate_improvement_suggestions(self, repository_id: str) -> AgentRunResult:
        return await self._run(improvement_advisor_agent, repository_id)

    async def generate_readme(self, repository_id: str) -> AgentRunResult:
        return await self._run(readme_generator_agent, repository_id)

    # -- public API: streaming ---------------------------------------------

    def stream_project_overview(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(project_overview_agent, repository_id)

    def stream_architecture(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(architecture_agent, repository_id)

    def stream_folder_explanation(self, repository_id: str, folder_path: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(folder_explainer_agent, repository_id, extra_key=folder_path, folder_path=folder_path)

    def stream_file_explanation(self, repository_id: str, file_path: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(file_explainer_agent, repository_id, extra_key=file_path, file_path=file_path)

    def stream_api_documentation(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(api_documentation_agent, repository_id)

    def stream_interview_questions(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(interview_coach_agent, repository_id)

    def stream_improvement_suggestions(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(improvement_advisor_agent, repository_id)

    def stream_readme(self, repository_id: str) -> AsyncIterator[Dict[str, object]]:
        return self._stream(readme_generator_agent, repository_id)


ai_orchestrator = AIOrchestrator()
