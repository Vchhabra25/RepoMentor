from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.config import get_settings
from app.schemas import RepositoryResponse
from app.services import ValidationError, repository_service
from app.utils import is_zip_file

router = APIRouter(tags=["ingestion"])


@router.post("/upload", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def upload_repository(file: UploadFile = File(...)) -> RepositoryResponse:
    """
    Ingests a repository from an uploaded .zip file.

    Validates the archive, extracts it into a working directory, strips
    ignored paths (node_modules, .git, build artifacts, binary assets,
    etc.), and computes metadata. No code analysis happens here — this only
    prepares the repository for future AI modules to read.
    """
    if not is_zip_file(file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .zip files are accepted.",
        )

    settings = get_settings()
    max_bytes = settings.max_repository_size_mb * 1024 * 1024

    # Read with a bound so an oversized upload is rejected without loading
    # the whole file into memory first.
    content = await file.read(max_bytes + 1)
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the {settings.max_repository_size_mb}MB limit.",
        )

    try:
        repository = await repository_service.ingest_zip(
            filename=file.filename or "uploaded-repository.zip",
            content=content,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return RepositoryResponse(repository=repository)
