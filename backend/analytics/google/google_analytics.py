from typing import Dict


def send_event(event_name: str, payload: Dict[str, object]) -> None:
    """Send an analytics event to Google Analytics."""
    # TODO: implement Google Analytics event reporting
    print(f"[GoogleAnalytics] event={event_name} payload={payload}")
