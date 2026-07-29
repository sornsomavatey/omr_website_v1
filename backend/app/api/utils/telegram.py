from typing import Optional

def send_telegram_alert(message: str, message_thread_id: Optional[int] = None) -> bool:
    """
    [COMMENTED OUT IN BACKEND]
    Alerts are handled directly from the Frontend (see Frontend/src/lib/telegramAlerts.ts).
    """
    # token = settings.TELEGRAM_BOT_TOKEN
    # chat_id = settings.TELEGRAM_CHAT_ID
    # url = f"https://api.telegram.org/bot{token}/sendMessage"
    # payload = { "chat_id": chat_id, "text": message, "parse_mode": "HTML" }
    # if message_thread_id is not None:
    #     payload["message_thread_id"] = message_thread_id
    # req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    # with urllib.request.urlopen(req, timeout=5) as response:
    #     return response.status == 200
    return True


def send_reservation_telegram_alert(message: str) -> bool:
    """[COMMENTED OUT IN BACKEND] Handled directly by Frontend."""
    return True


def send_feedback_telegram_alert(message: str) -> bool:
    """[COMMENTED OUT IN BACKEND] Handled directly by Frontend."""
    return True
