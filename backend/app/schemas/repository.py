from typing import List

from pydantic import BaseModel, Field

from app.models import Repository


class GithubIngestRequest(BaseModel):
    repo_url: str = Field(..., description="Public GitHub repository URL")


class RepositoryResponse(BaseModel):
    status: str = "success"
    repository: Repository


class RepositoryListResponse(BaseModel):
    status: str = "success"
    count: int
    repositories: List[Repository]
