from pydantic import BaseModel

from app.models import RepositoryAnalysis


class AnalysisResponse(BaseModel):
    status: str = "success"
    analysis: RepositoryAnalysis
