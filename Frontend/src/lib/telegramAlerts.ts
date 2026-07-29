/**
 * Direct Frontend Telegram Alert Integration
 * Allows instant, backend-less Telegram notifications directly from the browser.
 */

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const RESERVATION_THREAD_ID = Number(
  import.meta.env.VITE_TELEGRAM_RESERVATION_THREAD_ID || 2,
);
const FEEDBACK_THREAD_ID = Number(
  import.meta.env.VITE_TELEGRAM_FEEDBACK_THREAD_ID || 4,
);

export async function sendTelegramMessage(
  text: string,
  messageThreadId?: number,
): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload: Record<string, any> = {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML",
    };

    if (messageThreadId) {
      payload.message_thread_id = messageThreadId;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error("Failed to send frontend Telegram alert:", error);
    return false;
  }
}

export async function sendFrontendReservationAlert(
  reservation: any,
): Promise<boolean> {
  const name = reservation.customer_name || reservation.name || "Valued Guest";
  const phone = reservation.customer_phone || reservation.phone || "N/A";
  const email = reservation.customer_email || reservation.email || "";

  let branch = reservation.branch_name;
  if (!branch) {
    if (reservation.branch_id === 1) branch = "One More Restaurant Toul Kork";
    else if (reservation.branch_id === 2)
      branch = "One More Restaurant Boeung Kak";
    else branch = "One More Restaurant";
  }

  const telegramHandle = reservation.customer_telegram
    ? `\n• <b>Customer Telegram:</b> ${reservation.customer_telegram}`
    : "";
  const emailText = email ? `\n• <b>Email:</b> ${email}` : "";
  const areaText = reservation.area
    ? `\n• <b>Seating Area:</b> ${reservation.area}`
    : "";

  let guestDetail = `${reservation.guest_count || Number(reservation.adults || 0) + Number(reservation.kids || 0)} persons`;
  if (reservation.adults !== undefined || reservation.kids !== undefined) {
    guestDetail += ` (${reservation.adults || 0} Adults, ${reservation.kids || 0} Kids)`;
  }

  const requests = reservation.special_requests
    ? `\n• <b>Special Requests:</b> ${reservation.special_requests}`
    : "";

  // Format pre-ordered dishes cleanly
  let preorderText = "";
  const items =
    reservation.preordered_items || reservation.preorder_items || [];
  if (Array.isArray(items) && items.length > 0) {
    const itemLines = items.map((item: any) => {
      const qty = item.qty || item.quantity || 1;
      const itemName = item.name || item.item_name || "Dish Item";
      const priceStr = item.price ? ` (${item.price})` : "";
      return `   └ ${qty}x ${itemName}${priceStr}`;
    });
    preorderText = `\n\n🛒 <b>PRE-ORDERED DISHES:</b>\n${itemLines.join("\n")}`;
  }

  const message =
    `📅 <b>NEW TABLE RESERVATION</b>\n\n` +
    `• <b>Branch:</b> ${branch}\n` +
    `• <b>Customer:</b> ${name}\n` +
    `• <b>Phone:</b> ${phone}${emailText}${telegramHandle}\n` +
    `• <b>Guests:</b> ${guestDetail}${areaText}\n` +
    `• <b>Date:</b> ${reservation.reservation_date}\n` +
    `• <b>Time:</b> ${reservation.reservation_time}${requests}${preorderText}`;

  return sendTelegramMessage(message, RESERVATION_THREAD_ID);
}

export async function sendFrontendEventAlert(event: any): Promise<boolean> {
  const name = event.customer_name || event.name || "Valued Guest";
  const phone = event.customer_phone || event.phone || "N/A";
  const email = event.customer_email || event.email || "N/A";
  const details =
    event.package_details || event.details
      ? `\n• <b>Details / Requirements:</b>\n${event.package_details || event.details}`
      : "";

  const message =
    `🎉 <b>NEW EVENT BOOKING REQUEST</b>\n\n` +
    `• <b>Customer:</b> ${name}\n` +
    `• <b>Phone:</b> ${phone}\n` +
    `• <b>Email:</b> ${email}\n` +
    `• <b>Event Type:</b> ${event.event_type}\n` +
    `• <b>Guest Count:</b> ${event.guest_count} persons\n` +
    `• <b>Event Date:</b> ${event.event_date}${details}`;

  return sendTelegramMessage(message, RESERVATION_THREAD_ID);
}

export async function sendFrontendFeedbackAlert(
  feedback: any,
): Promise<boolean> {
  const nameDisplay = (feedback.name || feedback.customer_name)?.trim()
    ? feedback.name || feedback.customer_name
    : "Anonymous Guest";

  const message =
    `💬 <b>NEW CUSTOMER FEEDBACK / INQUIRY</b>\n\n` +
    `• <b>From:</b> ${nameDisplay}\n` +
    `• <b>Email:</b> ${feedback.email || feedback.customer_email || "N/A"}\n` +
    `• <b>Subject:</b> ${feedback.subject || "General Inquiry"}\n\n` +
    `<b>Message:</b>\n${feedback.message}`;

  return sendTelegramMessage(message, FEEDBACK_THREAD_ID);
}
