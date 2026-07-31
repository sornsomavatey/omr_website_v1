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

    return Promise.resolve(true);
  } catch {
    alert("dasdas");
    return Promise.resolve(false);
  }
};
