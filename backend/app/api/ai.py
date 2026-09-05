import json
from typing import AsyncIterator, Dict

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.ai.orchestrator import ai_orchestrator
from app.schemas.ai import FileExplanationRequest, FolderExplanationRequest

router = APIRouter(tags=["ai"])

SSE_HEADERS = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}


async def _to_sse(events: AsyncIterator[Dict[str, object]]) -> AsyncIterator[bytes]:
    """
    Serializes orchestrator stream events as Server-Sent Events. Event
    shapes: {"type": "chunk", "text": ...} while generating, then a single
    {"type": "cached" | "done" | "error", ...} to close out the stream —
    see AIOrchestrator._stream for the full contract.
    """
    async for event in events:
        yield f"data: {json.dumps(event)}\n\n".encode("utf-8")


def _stream_response(events: AsyncIterator[Dict[str, object]]) -> StreamingResponse:
    return StreamingResponse(_to_sse(events), media_type="text/event-stream", headers=SSE_HEADERS)


@router.post("/repository/{repository_id}/ai/overview")
async def stream_project_overview(repository_id: str) -> StreamingResponse:
    """Streams the Project Overview Agent's output (purpose, tech stack, workflow)."""
    return _stream_response(ai_orchestrator.stream_project_overview(repository_id))


@router.post("/repository/{repository_id}/ai/architecture")
async def stream_architecture(repository_id: str) -> StreamingResponse:
    """Streams the Architecture Agent's output, including a Mermaid diagram."""
    return _stream_response(ai_orchestrator.stream_architecture(repository_id))


@router.post("/repository/{repository_id}/ai/folder-explanation")
async def stream_folder_explanation(repository_id: str, payload: FolderExplanationRequest) -> StreamingResponse:
    """Streams the Folder Explainer Agent's output for a single folder."""
    return _stream_response(ai_orchestrator.stream_folder_explanation(repository_id, payload.folder_path))


@router.post("/repository/{repository_id}/ai/file-explanation")
async def stream_file_explanation(repository_id: str, payload: FileExplanationRequest) -> StreamingResponse:
    """Streams the File Explainer Agent's output for a single file."""
    return _stream_response(ai_orchestrator.stream_file_explanation(repository_id, payload.file_path))


@router.post("/repository/{repository_id}/ai/api-documentation")
async def stream_api_documentation(repository_id: str) -> StreamingResponse:
    """Streams the API Documentation Agent's output."""
    return _stream_response(ai_orchestrator.stream_api_documentation(repository_id))


@router.post("/repository/{repository_id}/ai/interview-questions")
async def stream_interview_questions(repository_id: str) -> StreamingResponse:
    """Streams the Interview Coach Agent's output (HR/technical/system design questions)."""
    return _stream_response(ai_orchestrator.stream_interview_questions(repository_id))


@router.post("/repository/{repository_id}/ai/improvement-suggestions")
async def stream_improvement_suggestions(repository_id: str) -> StreamingResponse:
    """Streams the Improvement Advisor Agent's output."""
    return _stream_response(ai_orchestrator.stream_improvement_suggestions(repository_id))


@router.post("/repository/{repository_id}/ai/readme")
async def stream_readme(repository_id: str) -> StreamingResponse:
    """Streams the README Generator Agent's output."""
    return _stream_response(ai_orchestrator.stream_readme(repository_id))
