from typing import Any


def safe_get(value: Any, default: Any = None) -> Any:
    return value if value is not None else default
