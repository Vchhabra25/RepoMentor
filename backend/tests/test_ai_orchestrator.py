import json

import pytest

from app.ai.errors import AIParsingError
from app.ai.orchestrator import AIOrchestrator, OrchestratorError
from app.ai.providers.base import AIProvider
from app.services import repository_service
from app.services.intelligence import analysis_pipeline
from tests.helpers import SAMPLE_FULLSTACK_FILES, make_zip_bytes

FAKE_OVERVIEW = {
    "purpose": "A fullstack test app.",
    "tech_stack_summary": "Next.js frontend, FastAPI backend.",
    "high_level_workflow": "Client hits Next.js, which calls FastAPI.",
    "important_technologies": ["Next.js", "FastAPI"],
}


class FakeProvider(AIProvider):
    def __init__(self, response: dict | None = None, raw_text: str | None = None):
        self._response = response
        self._raw_text = raw_text
        self.call_count = 0

    async def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        self.call_count += 1
        return self._raw_text if self._raw_text is not None else json.dumps(self._response)

    async def stream(self, *, system_prompt: str, user_prompt: str):
        self.call_count += 1
        text = self._raw_text if self._raw_text is not None else json.dumps(self._response)
        yield text


@pytest.fixture
async def ready_repository():
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    repository = await repository_service.ingest_zip("sample.zip", zip_bytes)
    analysis_pipeline.run(repository)
    return repository


async def test_generate_project_overview_returns_parsed_data(ready_repository):
    provider = FakeProvider(response=FAKE_OVERVIEW)
    orchestrator = AIOrchestrator(provider=provider)

    result = await orchestrator.generate_project_overview(ready_repository.id)

    assert result.data.purpose == FAKE_OVERVIEW["purpose"]
    assert result.from_cache is False
    assert provider.call_count == 1


async def test_second_call_is_served_from_cache(ready_repository):
    provider = FakeProvider(response=FAKE_OVERVIEW)
    orchestrator = AIOrchestrator(provider=provider)

    await orchestrator.generate_project_overview(ready_repository.id)
    second = await orchestrator.generate_project_overview(ready_repository.id)

    assert second.from_cache is True
    assert provider.call_count == 1  # no second LLM call


async def test_raises_when_repository_not_found():
    orchestrator = AIOrchestrator(provider=FakeProvider(response=FAKE_OVERVIEW))
    with pytest.raises(OrchestratorError):
        await orchestrator.generate_project_overview("does-not-exist")


async def test_raises_when_analysis_not_yet_run():
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    repository = await repository_service.ingest_zip("sample.zip", zip_bytes)
    # deliberately not calling analysis_pipeline.run()

    orchestrator = AIOrchestrator(provider=FakeProvider(response=FAKE_OVERVIEW))
    with pytest.raises(OrchestratorError, match="Intelligence Engine"):
        await orchestrator.generate_project_overview(repository.id)


async def test_malformed_llm_output_raises_parsing_error(ready_repository):
    provider = FakeProvider(raw_text="this is not json")
    orchestrator = AIOrchestrator(provider=provider)

    with pytest.raises(AIParsingError):
        await orchestrator.generate_project_overview(ready_repository.id)


async def test_stream_yields_chunks_then_done_event(ready_repository):
    provider = FakeProvider(response=FAKE_OVERVIEW)
    orchestrator = AIOrchestrator(provider=provider)

    events = [event async for event in orchestrator.stream_project_overview(ready_repository.id)]

    assert events[-1]["type"] == "done"
    assert events[-1]["data"]["purpose"] == FAKE_OVERVIEW["purpose"]


async def test_stream_yields_error_event_on_malformed_output(ready_repository):
    provider = FakeProvider(raw_text="not json")
    orchestrator = AIOrchestrator(provider=provider)

    events = [event async for event in orchestrator.stream_project_overview(ready_repository.id)]

    assert events[-1]["type"] == "error"


async def test_folder_explanation_requires_valid_folder_path(ready_repository):
    provider = FakeProvider(
        response={
            "folder_path": "frontend",
            "purpose": "p",
            "responsibilities": [],
            "important_files": [],
            "connections": "c",
        }
    )
    orchestrator = AIOrchestrator(provider=provider)

    with pytest.raises(Exception):
        await orchestrator.generate_folder_explanation(ready_repository.id, "does/not/exist")
