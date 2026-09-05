from app.core.rate_limit import InMemoryRateLimiter


def test_allows_requests_under_the_limit():
    limiter = InMemoryRateLimiter(general_limit=3, ai_limit=1)
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-a", is_ai_path=False) is True


def test_rejects_requests_over_the_limit():
    limiter = InMemoryRateLimiter(general_limit=2, ai_limit=1)
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-a", is_ai_path=False) is False


def test_ai_and_general_buckets_are_independent():
    limiter = InMemoryRateLimiter(general_limit=1, ai_limit=1)
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-a", is_ai_path=True) is True  # separate bucket, not exhausted
    assert limiter.check("client-a", is_ai_path=False) is False
    assert limiter.check("client-a", is_ai_path=True) is False


def test_different_clients_have_independent_buckets():
    limiter = InMemoryRateLimiter(general_limit=1, ai_limit=1)
    assert limiter.check("client-a", is_ai_path=False) is True
    assert limiter.check("client-b", is_ai_path=False) is True
