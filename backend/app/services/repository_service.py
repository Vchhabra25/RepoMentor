import asyncio
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

from app.config import get_settings
from app.models import Repository, RepositorySource, RepositoryStatus
from app.services.github_service import github_service
from app.services.metadata_service import metadata_service
from app.services.validation_service import ValidationError, validation_service
from app.services.zip_service import zip_service


class RepositoryService:
    """
    Orchestrates repository ingestion end-to-end — validation, extraction
    or cloning, cleanup of ignored paths, metadata generation, and
    persistence — and is the single read/write seam everything else goes
    through.

    Storage is an in-memory dict for this version: ingestion is what's in
    scope here, not a persistence layer. Swapping in Firestore later only
    means changing `_register` / `get` / `list_all` — callers (API routes,
    and eventually AI analysis modules) are unaffected.
    """

    def __init__(self) -> None:
        self._store: Dict[str, Repository] = {}

    # -- storage -----------------------------------------------------------

    def _storage_root(self) -> Path:
        settings = get_settings()
        root = Path(settings.repository_storage_dir)
        root.mkdir(parents=True, exist_ok=True)
        return root

    def _register(self, repository: Repository) -> None:
        self._store[repository.id] = repository

    def get(self, repository_id: str) -> Optional[Repository]:
        return self._store.get(repository_id)

    def list_all(self) -> List[Repository]:
        return sorted(self._store.values(), key=lambda repo: repo.upload_time, reverse=True)

    # -- ingestion -----------------------------------------------------------

    async def ingest_zip(self, filename: str, content: bytes) -> Repository:
        """Ingests a repository from raw ZIP bytes already read off the request."""
        repo_id = str(uuid.uuid4())
        name = Path(filename).stem or "uploaded-repository"
        destination = self._storage_root() / repo_id

        repository = Repository(
            id=repo_id,
            name=name,
            owner=None,
            source=RepositorySource.ZIP,
            upload_time=datetime.now(timezone.utc),
            root_directory=str(destination),
            status=RepositoryStatus.UPLOADING,
        )
        self._register(repository)

        try:
            validation_service.validate_zip_bytes(content)

            repository.status = RepositoryStatus.EXTRACTING
            self._register(repository)
            await asyncio.to_thread(zip_service.extract, content, destination)

            await self._finalize(repository, destination)
        except ValidationError as exc:
            self._fail(repository, destination, str(exc))
            raise
        except Exception:
            self._fail(repository, destination, "Unexpected error during ingestion.")
            raise

        return repository

    async def ingest_github(self, repo_url: str) -> Repository:
        """Ingests a repository by shallow-cloning a public GitHub URL."""
        owner, repo_name = validation_service.parse_github_url(repo_url)
        repo_id = str(uuid.uuid4())
        destination = self._storage_root() / repo_id

        repository = Repository(
            id=repo_id,
            name=repo_name,
            owner=owner,
            source=RepositorySource.GITHUB,
            upload_time=datetime.now(timezone.utc),
            root_directory=str(destination),
            status=RepositoryStatus.QUEUED,
        )
        self._register(repository)

        try:
            repository.status = RepositoryStatus.EXTRACTING
            self._register(repository)
            await github_service.clone(repo_url, destination)

            await self._finalize(repository, destination)
        except ValidationError as exc:
            self._fail(repository, destination, str(exc))
            raise
        except Exception:
            self._fail(repository, destination, "Unexpected error during ingestion.")
            raise

        return repository

    # -- shared steps --------------------------------------------------------

    async def _finalize(self, repository: Repository, destination: Path) -> None:
        """Cleans ignored paths, computes metadata, validates size, marks Ready."""
        repository.status = RepositoryStatus.PREPARING
        self._register(repository)

        await asyncio.to_thread(metadata_service.clean_ignored, destination)
        stats = await asyncio.to_thread(metadata_service.compute, destination)

        validation_service.validate_size(stats["size_bytes"])

        repository.file_count = stats["file_count"]
        repository.folder_count = stats["folder_count"]
        repository.size_bytes = stats["size_bytes"]
        repository.primary_language = stats["primary_language"]
        repository.status = RepositoryStatus.READY
        self._register(repository)

    def _fail(self, repository: Repository, destination: Path, message: str) -> None:
        repository.status = RepositoryStatus.FAILED
        repository.error_message = message
        self._register(repository)
        shutil.rmtree(destination, ignore_errors=True)


repository_service = RepositoryService()
