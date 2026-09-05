def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"]


def test_readiness_check_reports_ok_storage(client):
    response = client.get("/api/ready")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    check_names = {c["name"] for c in body["checks"]}
    assert {"repository_storage", "ai_provider", "firebase"} <= check_names


def test_security_headers_present_on_every_response(client):
    response = client.get("/api/health")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert "x-request-id" in response.headers


def test_404_error_keeps_backward_compatible_detail_field(client):
    response = client.get("/api/repository/does-not-exist")
    assert response.status_code == 404
    body = response.json()
    # The frontend's error parsing reads `detail` directly — this must
    # never change shape without a corresponding frontend update.
    assert body["detail"] == "Repository not found."
    assert body["error_code"] == "http_404"
    assert "request_id" in body


def test_validation_error_has_consistent_shape(client):
    response = client.post("/api/github", json={"not_repo_url": "oops"})
    assert response.status_code == 422
    body = response.json()
    assert "detail" in body
    assert body["error_code"] == "validation_error"
    assert isinstance(body["fields"], list)


def test_cors_headers_present_on_error_responses(client):
    response = client.get(
        "/api/repository/does-not-exist",
        headers={"Origin": "http://localhost:5173"},
    )
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
