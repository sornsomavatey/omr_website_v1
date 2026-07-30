from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.api.core.config import settings
from app.api.dependencies.security import require_admin


def make_app() -> FastAPI:
    app = FastAPI()

    @app.get('/admin', dependencies=[Depends(require_admin)])
    def admin_endpoint():
        return {'ok': True}

    return app


def test_admin_key_is_required_when_configured(monkeypatch):
    monkeypatch.setattr(settings, 'ADMIN_API_KEY', 'a-long-test-admin-secret')
    client = TestClient(make_app())

    assert client.get('/admin').status_code == 401
    assert client.get(
        '/admin',
        headers={'X-Admin-Key': 'a-long-test-admin-secret'},
    ).status_code == 200


def test_missing_admin_key_fails_closed_in_production(monkeypatch):
    monkeypatch.setattr(settings, 'ADMIN_API_KEY', '')
    monkeypatch.setattr(settings, 'ENVIRONMENT', 'production')

    assert TestClient(make_app()).get('/admin').status_code == 503
