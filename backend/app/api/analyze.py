from fastapi import APIRouter

from app.schemas import AnalyzeRequest, PlaceholderResponse
from app.services import placeholder_service

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=PlaceholderResponse)
async def analyze_project(payload: AnalyzeRequest) -> PlaceholderResponse:
    """
    Triggers analysis for a previously ingested project.

    v1 returns a placeholder response only. This is the seam where future
    AI modules (architecture mapping, file explanations, API discovery,
    interview question generation) will plug in.
    """
    return placeholder_service.handle_analyze(project_id=payload.project_id)
