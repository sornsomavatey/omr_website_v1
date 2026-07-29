from typing import Dict


def send_event(event_name: str, payload: Dict[str, object]) -> None:
    """Send an analytics event to Facebook Analytics."""
    # TODO: implement Facebook Analytics event reporting
    print(f"[FacebookAnalytics] event={event_name} payload={payload}")
