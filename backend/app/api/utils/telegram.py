from typing import Optional
import urllib.request
import urllib.parse
import json
from ..core.config import settings

def send_telegram_alert(message: str, message_thread_id: Optional[int] = None) -> bool:
    """Send a message to a Telegram chat or specific topic thread using the bot API."""
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }

    if message_thread_id is not None:
        payload["message_thread_id"] = message_thread_id

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status == 200
    except Exception as e:
        print(f"Failed to send Telegram alert: {e}")
        return False


def send_reservation_telegram_alert(message: str) -> bool:
    """Send a reservation alert to the designated Telegram reservation topic."""
    thread_id = getattr(settings, 'TELEGRAM_RESERVATION_THREAD_ID', None)
    return send_telegram_alert(message, message_thread_id=thread_id)


def send_feedback_telegram_alert(message: str) -> bool:
    """Send a feedback alert to the designated Telegram feedback topic."""
    thread_id = getattr(settings, 'TELEGRAM_FEEDBACK_THREAD_ID', None)
    return send_telegram_alert(message, message_thread_id=thread_id)
