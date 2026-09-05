from fastapi import UploadFile

from app.config import get_settings


def is_zip_file(file: UploadFile) -> bool:
    return (file.filename or "").lower().endswith(".zip")


def is_within_size_limit(size_bytes: int) -> bool:
    settings = get_settings()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    return size_bytes <= max_bytes
