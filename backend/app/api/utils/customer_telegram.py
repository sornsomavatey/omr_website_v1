import urllib.request
import urllib.parse
import json
from typing import Optional, Dict, Any, List
from ..core.config import settings

def format_customer_telegram_message(
    customer_name: str,
    booking_ref: str,
    branch_name: str,
    reservation_date: str,
    reservation_time: str,
    guest_count: int,
    adults: int = 1,
    kids: int = 0,
    area: str = "Standard",
    special_requests: Optional[str] = None,
    preordered_items: Optional[List[Dict[str, Any]]] = None
) -> str:
    """
    Format a customer-friendly Telegram message containing their table reservation details.
    """
    preorder_text = ""
    if preordered_items:
        items_str = "\n".join([
            f"  • {item.get('name', 'Item')} x{item.get('qty', 1)} (${float(item.get('price', 0)) * int(item.get('qty', 1)):.2f})"
            for item in preordered_items
        ])
        preorder_text = f"\n\n🍽️ <b>Pre-ordered Items:</b>\n{items_str}"

    requests_text = f"\n• <b>Special Requests:</b> {special_requests}" if special_requests else ""

    message = (
        f"🎉 <b>One More Restaurant - Reservation Confirmation</b>\n\n"
        f"Dear <b>{customer_name}</b>,\n"
        f"Thank you for choosing One More Restaurant! Your table reservation is confirmed.\n\n"
        f"📋 <b>Your Reservation Details:</b>\n"
        f"• <b>Booking Ref:</b> #{booking_ref}\n"
        f"• <b>Branch:</b> {branch_name}\n"
        f"• <b>Date:</b> {reservation_date}\n"
        f"• <b>Time Slot:</b> {reservation_time}\n"
        f"• <b>Guest Count:</b> {guest_count} ({adults} Adults, {kids} Kids)\n"
        f"• <b>Seating Area:</b> {area}"
        f"{requests_text}"
        f"{preorder_text}\n\n"
        f"We look forward to welcoming you for an exceptional dining experience!\n\n"
        f"🌐 <b>Website:</b> www.onemorerestaurant.com"
    )
    return message


def send_customer_telegram_notification(
    target_chat_id: str,
    message: str,
    bot_token: Optional[str] = None
) -> bool:
    """
    [COMMENTED OUT IN BACKEND]
    Customer notifications are handled directly on the Frontend.
    """
    # token = bot_token or getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    # url = f"https://api.telegram.org/bot{token}/sendMessage"
    # payload = { "chat_id": target_chat_id, "text": message, "parse_mode": "HTML" }
    # data = json.dumps(payload).encode("utf-8")
    # req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    # with urllib.request.urlopen(req, timeout=5) as response: return response.status == 200
    return True
