/**
 * Telegram Alerts Helper Module
 * Provides helper functions and interface definitions for dispatching real-time
 * Telegram & Email notifications for Table Reservations, Event Inquiries, and Guest Feedback.
 */

// ── 1. Table Reservation Alert ──────────────────────────────
export interface ReservationPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  reservation_date: string;
  reservation_time: string;
  guest_count?: number;
  adults?: number;
  kids?: number;
  area?: string;
  branch_name?: string;
  special_requests?: string | null;
  preordered_items?: Array<{ name: string; qty: number; price?: string | number }>;
  booking_ref?: string;
}

export const sendTelegramReservationAlert = async (data: ReservationPayload): Promise<boolean> => {
  try {
    const response = await fetch(`/api/telegram-reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.ok === true || response.ok;
  } catch {
    return false;
  }
};

// ── 2. Event Inquiry Alert ──────────────────────────────────
export interface EventInquiryPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  branch_name?: string;
  company?: string | null;
  event_type?: string;
  guest_count?: number;
  event_date?: string;
  special_requirements?: string | null;
  booking_ref?: string;
}

export const sendTelegramEventAlert = async (data: EventInquiryPayload): Promise<boolean> => {
  try {
    const response = await fetch('/api/telegram-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.ok === true;
  } catch {
    return false;
  }
};

// ── 3. Guest Feedback Alert ─────────────────────────────────
export interface FeedbackPayload {
  customer_name?: string;
  customer_email?: string | null;
  branch_name?: string;
  rating?: number;
  subject?: string;
  message?: string;
}

export const sendTelegramFeedbackAlert = async (data: FeedbackPayload): Promise<boolean> => {
  try {
    const response = await fetch('/api/telegram-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.ok === true;
  } catch {
    return false;
  }
};


