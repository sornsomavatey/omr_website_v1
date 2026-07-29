from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.core.config import settings
from app.api.middleware.security import _buckets, setup_security


def make_app() -> FastAPI:
    app = FastAPI()
    setup_security(app)

    @app.get('/api/test')
    def test_endpoint():
        return {'ok': True}

    @app.post('/api/contact/')
    def contact_endpoint():
        return {'ok': True}

    return app


def test_security_headers_are_present():
    _buckets.clear()
    response = TestClient(make_app()).get('/api/test')

    assert response.status_code == 200
    assert response.headers['x-content-type-options'] == 'nosniff'
    assert response.headers['x-frame-options'] == 'DENY'
    assert response.headers['referrer-policy'] == 'strict-origin-when-cross-origin'


def test_rejects_oversized_request():
    _buckets.clear()
    response = TestClient(make_app()).post(
        '/api/contact/',
        headers={'content-length': str(settings.MAX_REQUEST_BODY_BYTES + 1)},
    )

    assert response.status_code == 413


def test_reservation_rate_limit(monkeypatch):
    _buckets.clear()
    monkeypatch.setattr(settings, 'RESERVATION_RATE_LIMIT_REQUESTS', 2)
    client = TestClient(make_app())

    assert client.post('/api/reservations/').status_code == 404
    assert client.post('/api/reservations/').status_code == 404
    blocked = client.post('/api/reservations/')

    assert blocked.status_code == 429
    assert blocked.headers['retry-after']


def test_contact_uses_its_own_limit(monkeypatch):
    _buckets.clear()
    monkeypatch.setattr(settings, 'CONTACT_RATE_LIMIT_REQUESTS', 1)
    client = TestClient(make_app())

    assert client.post('/api/contact/').status_code == 200
    assert client.post('/api/contact/').status_code == 429
