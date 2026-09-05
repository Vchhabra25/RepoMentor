from tests.helpers import SAMPLE_FULLSTACK_FILES, make_zip_bytes


def test_ai_overview_stream_errors_gracefully_for_unknown_repository(client):
    response = client.post("/api/repository/does-not-exist/ai/overview")
    assert response.status_code == 200  # SSE streams always start with 200; errors are in-band
    assert '"type": "error"' in response.text
    assert "was not found" in response.text


def test_ai_overview_stream_errors_when_analysis_not_run(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    upload = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    repository_id = upload.json()["repository"]["id"]

    response = client.post(f"/api/repository/{repository_id}/ai/overview")
    assert response.status_code == 200
    assert '"type": "error"' in response.text
    assert "Intelligence Engine" in response.text


def test_ai_overview_stream_errors_without_api_key_configured(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    upload = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    repository_id = upload.json()["repository"]["id"]
    client.post(f"/api/repository/{repository_id}/analyze")

    response = client.post(f"/api/repository/{repository_id}/ai/overview")
    assert response.status_code == 200
    assert '"type": "error"' in response.text
    assert "ANTHROPIC_API_KEY" in response.text


def test_folder_explanation_requires_folder_path_body(client):
    response = client.post("/api/repository/some-id/ai/folder-explanation", json={})
    assert response.status_code == 422
