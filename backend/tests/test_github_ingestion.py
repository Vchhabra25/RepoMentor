import pytest


def test_github_ingest_rejects_invalid_url(client):
    response = client.post("/api/github", json={"repo_url": "not-a-github-url"})
    assert response.status_code == 400
    assert "Invalid GitHub URL" in response.json()["detail"]


@pytest.mark.parametrize(
    "url",
    [
        "https://gitlab.com/owner/repo",
        "ftp://github.com/owner/repo",
        "https://github.com/",
        "https://github.com/owner",
    ],
)
def test_github_ingest_rejects_non_github_or_malformed_urls(client, url):
    response = client.post("/api/github", json={"repo_url": url})
    assert response.status_code == 400


def test_github_ingest_succeeds_with_mocked_clone(client, monkeypatch, tmp_path):
    """
    Mocks GitHubService.clone so this test never touches the network —
    it verifies the ingestion pipeline (clone -> clean -> analyze metadata)
    end to end without depending on github.com being reachable in CI.
    """

    async def fake_clone(repo_url: str, destination):
        destination.mkdir(parents=True, exist_ok=True)
        (destination / "main.py").write_text("print('hello')")
        (destination / "requirements.txt").write_text("fastapi==0.115.0\n")

    from app.services.github_service import github_service

    monkeypatch.setattr(github_service, "clone", fake_clone)

    response = client.post("/api/github", json={"repo_url": "https://github.com/octocat/Hello-World"})
    assert response.status_code == 201
    repository = response.json()["repository"]
    assert repository["owner"] == "octocat"
    assert repository["name"] == "Hello-World"
    assert repository["status"] == "Ready"
    assert repository["file_count"] == 2
