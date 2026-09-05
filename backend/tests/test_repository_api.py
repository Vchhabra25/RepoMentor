from tests.helpers import SAMPLE_FULLSTACK_FILES, make_zip_bytes


def _upload_sample(client):
    zip_bytes = make_zip_bytes(SAMPLE_FULLSTACK_FILES)
    response = client.post("/api/upload", files={"file": ("sample.zip", zip_bytes, "application/zip")})
    assert response.status_code == 201
    return response.json()["repository"]


def test_get_repository_by_id(client):
    repository = _upload_sample(client)
    response = client.get(f"/api/repository/{repository['id']}")
    assert response.status_code == 200
    assert response.json()["repository"]["id"] == repository["id"]


def test_get_repository_404_for_unknown_id(client):
    response = client.get("/api/repository/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_list_repositories_returns_most_recent_first(client):
    first = _upload_sample(client)
    second = _upload_sample(client)

    response = client.get("/api/repositories")
    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 2
    ids = [r["id"] for r in body["repositories"]]
    assert ids[0] == second["id"]
    assert ids[1] == first["id"]
