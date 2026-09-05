from fastapi import APIRouter, HTTPException, status

from app.schemas import GithubIngestRequest, RepositoryResponse
from app.services import ValidationError, repository_service

router = APIRouter(tags=["ingestion"])


@router.post("/github", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def ingest_github_repository(payload: GithubIngestRequest) -> RepositoryResponse:
    """
    Ingests a public GitHub repository.

    Validates the URL, shallow-clones it into a working directory, strips
    ignored paths, and computes metadata. No code analysis happens here —
    this only prepares the repository for future AI modules to read.
    """
    try:
        repository = await repository_service.ingest_github(payload.repo_url)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return RepositoryResponse(repository=repository)
