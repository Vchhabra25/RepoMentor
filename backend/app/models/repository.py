from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class RepositorySource(str, Enum):
    GITHUB = "github"
    ZIP = "zip"


class RepositoryStatus(str, Enum):
    """
    Lifecycle of an ingested repository. AI analysis (future versions) picks
    up once a repository reaches READY.
    """

    QUEUED = "Queued"
    UPLOADING = "Uploading"
    EXTRACTING = "Extracting"
    PREPARING = "Preparing"
    READY = "Ready"
    FAILED = "Failed"


class Repository(BaseModel):
    """
    A single ingested repository and its metadata. This is the record
    RepositoryService stores and the shape returned by every repository
    API endpoint — future AI modules will read from this via
    RepositoryService.get() once analysis is implemented.
    """

    id: str
    name: str
    owner: Optional[str] = None
    source: RepositorySource
    upload_time: datetime
    primary_language: Optional[str] = None
    file_count: int = 0
    folder_count: int = 0
    size_bytes: int = 0
    root_directory: str
    status: RepositoryStatus = RepositoryStatus.QUEUED
    error_message: Optional[str] = None
