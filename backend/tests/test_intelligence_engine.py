from tests.helpers import SAMPLE_FULLSTACK_FILES, make_zip_bytes


def _ingest_and_analyze(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    upload = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    repository = upload.json()["repository"]

    response = client.post(f"/api/repository/{repository['id']}/analyze")
    assert response.status_code == 201
    return response.json()["analysis"]


def test_analyze_detects_frameworks_and_languages(client):
    analysis = _ingest_and_analyze(client)
    summary = analysis["summary"]

    assert "Next.js" in summary["framework"] or summary["frontend"] == "Next.js"
    assert summary["backend"] == "FastAPI"
    assert "TypeScript" in summary["languages"]
    assert "Python" in summary["languages"]


def test_analyze_detects_database_and_auth(client):
    analysis = _ingest_and_analyze(client)
    assert analysis["detected_databases"] == ["PostgreSQL"]
    assert "JWT" in analysis["detected_auth_methods"]


def test_analyze_detects_cloud_target(client):
    analysis = _ingest_and_analyze(client)
    assert "Docker" in analysis["detected_cloud_targets"]


def test_analyze_finds_entry_points_and_config_files(client):
    analysis = _ingest_and_analyze(client)
    summary = analysis["summary"]
    assert "backend/app/main.py" in summary["entryPoints"]
    assert "frontend/package.json" in summary["configurationFiles"]
    assert ".env.example" in summary["configurationFiles"]


def test_analyze_health_metrics_are_populated(client):
    analysis = _ingest_and_analyze(client)
    health = analysis["health"]
    assert health["lines_of_code"] > 0
    assert health["repository_size_bytes"] > 0
    assert health["largest_file"] is not None


def test_analyze_requires_repository_to_exist(client):
    response = client.post("/api/repository/does-not-exist/analyze")
    assert response.status_code == 404


def test_get_analysis_before_running_returns_404(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    upload = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    repository_id = upload.json()["repository"]["id"]

    response = client.get(f"/api/repository/{repository_id}/analysis")
    assert response.status_code == 404


def test_get_analysis_after_running_returns_stored_result(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    upload = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    repository_id = upload.json()["repository"]["id"]

    client.post(f"/api/repository/{repository_id}/analyze")
    response = client.get(f"/api/repository/{repository_id}/analysis")
    assert response.status_code == 200
    assert response.json()["analysis"]["repository_id"] == repository_id
