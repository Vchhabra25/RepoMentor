import io
import re
import zipfile
from typing import Tuple

from app.config import get_settings

_GITHUB_URL_PATTERN = re.compile(
    r"^https?://github\.com/(?P<owner>[A-Za-z0-9_.-]+)/(?P<repo>[A-Za-z0-9_.-]+?)(?:\.git)?/?$"
)


class ValidationError(Exception):
    """Raised when ingestion input fails validation. Caught at the API layer and returned as HTTP 400."""


class ValidationService:
    """
    Validates every ingestion input before it touches the filesystem:
    GitHub URL shape, ZIP integrity, and repository size limits. Ingestion
    services (GitHubService, ZipService) assume their input already passed
    through here.
    """

    @staticmethod
    def parse_github_url(url: str) -> Tuple[str, str]:
        """Validates a GitHub repository URL and returns (owner, repo_name)."""
        match = _GITHUB_URL_PATTERN.match((url or "").strip())
        if not match:
            raise ValidationError(
                "Invalid GitHub URL. Expected format: https://github.com/owner/repository"
            )
        return match.group("owner"), match.group("repo")

    @staticmethod
    def validate_zip_bytes(content: bytes) -> None:
        """Rejects empty or corrupted ZIP archives before extraction."""
        if not content:
            raise ValidationError("Uploaded file is empty.")

        buffer = io.BytesIO(content)
        if not zipfile.is_zipfile(buffer):
            raise ValidationError("Uploaded file is not a valid ZIP archive.")

        buffer.seek(0)
        with zipfile.ZipFile(buffer) as archive:
            if len(archive.namelist()) == 0:
                raise ValidationError("ZIP archive contains no files.")
            bad_member = archive.testzip()
            if bad_member is not None:
                raise ValidationError(f"ZIP archive is corrupted (bad member: {bad_member}).")

    @staticmethod
    def validate_size(size_bytes: int) -> None:
        """Rejects repositories (post-extraction/clone) larger than the configured limit."""
        settings = get_settings()
        max_bytes = settings.max_repository_size_mb * 1024 * 1024
        if size_bytes > max_bytes:
            raise ValidationError(
                f"Repository exceeds the {settings.max_repository_size_mb}MB size limit "
                f"({size_bytes / (1024 * 1024):.1f}MB)."
            )


validation_service = ValidationService()
