from typing import Any, Optional

from pydantic import BaseModel, Field


class PlaceholderResponse(BaseModel):
    """
    Standard shape returned by every not-yet-implemented endpoint.
    Real responses (once analysis logic lands) should extend this model
    rather than replace it, so the frontend's request/response contract
    stays stable.
    """

    status: str = "Not implemented yet"
    detail: Optional[str] = None
    data: Optional[dict[str, Any]] = None


class GithubAnalyzeRequest(BaseModel):
    repo_url: str = Field(..., description="Public GitHub repository URL")


class AnalyzeRequest(BaseModel):
    project_id: str = Field(..., description="Identifier of a previously ingested project")


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str


class ReadinessCheck(BaseModel):
    name: str
    status: str  # "ok" | "degraded" | "unavailable"
    detail: str


class ReadinessResponse(BaseModel):
    status: str  # "ready" | "degraded"
    checks: list[ReadinessCheck]
