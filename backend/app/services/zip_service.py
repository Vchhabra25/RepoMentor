import io
import zipfile
from pathlib import Path

from app.config import get_settings
from app.services.validation_service import ValidationError

# Ceiling on the number of members a single archive may contain, independent
# of total size — protects against archives packed with millions of
# zero-byte entries (inode/metadata exhaustion rather than a disk-space bomb).
MAX_ZIP_MEMBERS = 50_000

# Compression-ratio guard: a member that claims to inflate far more than its
# compressed size is a classic zip-bomb signature (e.g. 42.zip-style
# nesting). Checked per-member in addition to the overall uncompressed-size
# budget below.
MAX_COMPRESSION_RATIO = 100


class ZipService:
    """Extracts uploaded ZIP archives into a destination directory on disk."""

    @staticmethod
    def extract(content: bytes, destination: Path) -> None:
        """
        Extracts every member of the archive into `destination`.

        Guards against zip-slip: any member whose resolved path would land
        outside `destination` is rejected rather than written to disk.

        Also guards against decompression ("zip bomb") attacks: the ZIP
        format only bounds the *compressed* size a client can be made to
        upload (already enforced in app/api/upload.py), not the size it
        expands to on disk. A small, highly-repetitive archive can otherwise
        inflate to gigabytes and exhaust disk space before `validate_size`
        ever runs post-extraction. We check each member's declared
        uncompressed size and compression ratio, and track a running total,
        before writing any bytes.
        """
        destination.mkdir(parents=True, exist_ok=True)
        resolved_root = destination.resolve()
        max_uncompressed_bytes = get_settings().max_repository_size_mb * 1024 * 1024

        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            members = archive.infolist()
            if len(members) > MAX_ZIP_MEMBERS:
                raise ValidationError(f"ZIP archive contains too many entries (max {MAX_ZIP_MEMBERS}).")

            total_uncompressed = 0
            for member in members:
                total_uncompressed += member.file_size
                if member.compress_size > 0 and member.file_size / member.compress_size > MAX_COMPRESSION_RATIO:
                    raise ValidationError("ZIP archive rejected: a member's compression ratio is implausibly high.")

            if total_uncompressed > max_uncompressed_bytes:
                raise ValidationError(
                    "ZIP archive would expand beyond the "
                    f"{get_settings().max_repository_size_mb}MB repository size limit."
                )

            for member in members:
                member_path = ZipService._safe_member_path(resolved_root, member.filename)

                if member.is_dir():
                    member_path.mkdir(parents=True, exist_ok=True)
                    continue

                member_path.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(member) as source, open(member_path, "wb") as target:
                    target.write(source.read())

    @staticmethod
    def _safe_member_path(resolved_root: Path, member_name: str) -> Path:
        candidate = (resolved_root / member_name).resolve()
        if candidate != resolved_root and resolved_root not in candidate.parents:
            raise ValidationError(f"Unsafe path in ZIP archive: {member_name}")
        return candidate


zip_service = ZipService()
