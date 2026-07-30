# Backend Project Structure

This backend scaffold follows the project layout shown in the provided diagram.

## Structure

- `app/`
  - `main.py` — FastAPI application entry point
  - `api/`
    - `core/` — API configuration and shared settings
    - `dependencies/` — dependency helpers (database, authentication)
    - `middleware/` — logging, CORS, and request middleware
    - `modules/` — API feature modules (users, items)
    - `utils/` — shared utility helpers
- `api/fastapi/` — FastAPI application entrypoint for the Python API
- `api/express/` — Express.js API scaffold for Node-based endpoints
- `analytics/`
  - `google/` — Google Analytics stubs
  - `facebook/` — Facebook Analytics stubs
  - `custom/` — built-in/custom analytics tracker
- `migrations/` — database migration package
- `scripts/` — support scripts for scaffolding and verification
- `seeders/` — initial data seeding scripts
- `tests/` — backend test skeletons
- `.env.example` — environment variable sample file
- `requirements.txt` — backend Python dependencies

## Analytics

The project supports multiple analytics options:

- Google Analytics
- Facebook Analytics
- Custom built-in tracking
