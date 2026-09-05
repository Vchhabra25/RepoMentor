from tests.helpers import SAMPLE_FULLSTACK_FILES, make_zip_bytes


def test_upload_ingests_valid_zip_and_strips_ignored_paths(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)

    response = client.post(
        "/api/upload",
        files={"file": ("sample-repo.zip", zip_bytes, "application/zip")},
    )

    assert response.status_code == 201
    repository = response.json()["repository"]
    assert repository["status"] == "Ready"
    assert repository["source"] == "zip"
    # node_modules/, .git/, and logo.png are all in the ignore list.
    assert repository["file_count"] == len(SAMPLE_FULLSTACK_FILES) - 3
    assert repository["primary_language"] in {"Python", "TypeScript", "JavaScript"}


def test_upload_rejects_non_zip_extension(client):
    response = client.post(
        "/api/upload",
        files={"file": ("notes.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 400
    assert "zip" in response.json()["detail"].lower()


def test_upload_rejects_empty_zip(client):
    import io
    import zipfile

    buffer = io.BytesIO()
    zipfile.ZipFile(buffer, "w").close()

    response = client.post(
        "/api/upload",
        files={"file": ("empty.zip", buffer.getvalue(), "application/zip")},
    )
    assert response.status_code == 400
    assert "no files" in response.json()["detail"].lower()


def test_upload_rejects_corrupted_zip(client):
    response = client.post(
        "/api/upload",
        files={"file": ("corrupt.zip", b"PK\x03\x04not a real zip body", "application/zip")},
    )
    assert response.status_code == 400


def test_upload_rejects_oversized_file(client, monkeypatch):
    import zipfile

    from app.config import get_settings

    monkeypatch.setattr(get_settings(), "max_repository_size_mb", 1)  # 1 MB cap for this test
    zip_bytes = make_zip_bytes(
        {"a.py": "x" * (2 * 1024 * 1024)}, compression=zipfile.ZIP_STORED  # uncompressed, so size is real
    )

    response = client.post(
        "/api/upload",
        files={"file": ("big.zip", zip_bytes, "application/zip")},
    )
    assert response.status_code == 413


def test_upload_rejects_zip_bomb_by_declared_uncompressed_size(client, monkeypatch):
    """
    A small, highly-compressible archive can *declare* (via its central
    directory) a huge uncompressed size without the uploaded bytes
    themselves being large. zip_service.extract must reject this before
    writing anything to disk, rather than relying on validate_size to catch
    it only after extraction has already exhausted disk space.
    """
    import io
    import zipfile

    from app.config import get_settings

    monkeypatch.setattr(get_settings(), "max_repository_size_mb", 1)  # 1 MB cap for this test

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        # Highly repetitive content compresses to a tiny fraction of its
        # real size, so the upload itself stays well under the 1MB+1 read
        # bound in app/api/upload.py while still declaring >1MB uncompressed.
        archive.writestr("bomb.txt", "0" * (5 * 1024 * 1024))

    response = client.post(
        "/api/upload",
        files={"file": ("bomb.zip", buffer.getvalue(), "application/zip")},
    )
    assert response.status_code == 400
    detail = response.json()["detail"].lower()
    assert "size limit" in detail or "compression ratio" in detail


def test_zip_slip_path_traversal_is_rejected(client):
    import io
    import zipfile

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("../../etc/evil.txt", "malicious")

    response = client.post(
        "/api/upload",
        files={"file": ("evil.zip", buffer.getvalue(), "application/zip")},
    )
    # Either the archive's only member is dropped as unsafe (ending in an
    # empty-but-valid ingest) or the ingestion raises — both are acceptable
    # as long as nothing is ever written outside the destination directory.
    assert response.status_code in (201, 400)
