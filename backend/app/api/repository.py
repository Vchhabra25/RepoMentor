from fastapi import APIRouter, HTTPException, status

from app.schemas import RepositoryListResponse, RepositoryResponse
from app.services import repository_service

router = APIRouter(tags=["repositories"])


@router.get("/repository/{repository_id}", response_model=RepositoryResponse)
async def get_repository(repository_id: str) -> RepositoryResponse:
    """Returns a single ingested repository's metadata and current status."""
    repository = repository_service.get(repository_id)
    if repository is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found.")
    return RepositoryResponse(repository=repository)


@router.get("/repositories", response_model=RepositoryListResponse)
async def list_repositories() -> RepositoryListResponse:
    """Returns every ingested repository, most recently uploaded first."""
    repositories = repository_service.list_all()
    return RepositoryListResponse(count=len(repositories), repositories=repositories)
