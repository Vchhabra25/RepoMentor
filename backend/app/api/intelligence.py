import asyncio

from fastapi import APIRouter, HTTPException, status

from app.schemas import AnalysisResponse
from app.services import repository_service
from app.services.intelligence import analysis_pipeline, analysis_store

router = APIRouter(tags=["intelligence"])


@router.post("/repository/{repository_id}/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_repository(repository_id: str) -> AnalysisResponse:
    """
    Runs the deterministic Repository Intelligence Engine over an ingested
    repository: scans files, detects languages/frameworks/package managers/
    databases/auth/cloud targets, builds a dependency graph, computes
    project health, and generates the structured repository summary.

    No AI or LLM calls happen here — this is the rule-based layer future
    AI modules will read from once they're built.
    """
    repository = repository_service.get(repository_id)
    if repository is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found.")

    if repository.status != "Ready":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Repository is not ready for analysis (current status: {repository.status}).",
        )

    # The pipeline walks the filesystem and parses manifests — genuinely
    # blocking work, so it runs off the event loop.
    analysis = await asyncio.to_thread(analysis_pipeline.run, repository)

    return AnalysisResponse(analysis=analysis)


@router.get("/repository/{repository_id}/analysis", response_model=AnalysisResponse)
async def get_repository_analysis(repository_id: str) -> AnalysisResponse:
    """Returns a previously generated Repository Intelligence analysis."""
    analysis = analysis_store.get(repository_id)
    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No analysis found for this repository yet. Trigger one with POST /repository/{id}/analyze.",
        )
    return AnalysisResponse(analysis=analysis)
