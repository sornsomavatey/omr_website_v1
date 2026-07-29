/**
 * Direct Frontend Email Alert Integration (Resend, EmailJS & Web3Forms)
 * Formats email alerts with the exact One More Restaurant table layout.
 */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  "88860b89-8e09-4381-a12d-6f622ab0e713";

export async function sendFrontendCustomerEmail(data: {
  email?: string | null;
  name?: string;
  reservationId?: string | number;
  message?: string;
  reservationData?: any;
}): Promise<boolean> {
  const res = data.reservationData || {};
  const rawEmail =
    (data.email && String(data.email).trim()) ||
    (res.customer_email && String(res.customer_email).trim()) ||
    (res.email && String(res.email).trim());
  const recipientEmail = rawEmail || "no-email-provided@onemorerestaurant.com";
  const replyToEmail = rawEmail || "no-reply@onemorerestaurant.com";
  const bookingRef = data.reservationId
    ? `#OMR-${data.reservationId}`
    : `#OMR-${Math.floor(1000 + Math.random() * 9000)}`;
  const customerName =
    res.customer_name || res.name || data.name || "Valued Guest";
  const customerPhone = res.customer_phone || res.phone || "N/A";

  let branchName = res.branch_name;
  if (!branchName) {
    if (res.branch_id === 1) branchName = "One More Restaurant Toul Kork";
    else if (res.branch_id === 2) branchName = "One More Restaurant Boeung Kak";
    else branchName = "One More Restaurant";
  }

  const reservationDate =
    res.reservation_date || new Date().toISOString().split("T")[0];
  const reservationTime = res.reservation_time || "06:00 AM";
  const adults = res.adults || 1;
  const kids = res.kids || 0;
  const totalGuests = res.guest_count || Number(adults) + Number(kids);
  const guestCountDisplay = `${totalGuests} (${adults} Adults, ${kids} Kids)`;
  const area = res.area || "Standard";
  const specialRequests = res.special_requests || "None";

  // Build Pre-ordered Dishes HTML block if dishes exist
  let preorderHtml = "";
  let preorderText = "";
  const items = res.preordered_items || res.preorder_items || [];
  if (Array.isArray(items) && items.length > 0) {
    const dishRows = items
      .map((i: any) => {
        const qty = i.qty || i.quantity || 1;
        const name = i.name || i.item_name || "Dish";
        const price = i.price ? ` (${i.price})` : "";
        return `<tr><td style="padding: 6px 0; border-bottom: 1px solid #f0f0f0;">${qty}x ${name}${price}</td></tr>`;
      })
      .join("");

    const dishLines = items
      .map((i: any) => {
        const qty = i.qty || i.quantity || 1;
        const name = i.name || i.item_name || "Dish";
        const price = i.price ? ` (${i.price})` : "";
        return `- ${qty}x ${name}${price}`;
      })
      .join("\n");

    preorderHtml = `
      <div style="background-color: #ffffff; border: 1px solid #e3e3e3; border-radius: 6px; padding: 15px 20px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #5b8045;">🛒 Pre-ordered Dishes</h4>
        <table style="width: 100%; border-collapse: collapse;">
          ${dishRows}
        </table>
      </div>
    `;

    preorderText = `\nPre-ordered Dishes:\n${dishLines}`;
  }

  // Exact OMR Email HTML Template
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    
    <div style="text-align: center; margin-bottom: 20px; background-color: #ffffff; border: 1px solid #dce8d5; padding: 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <img src="https://raw.githubusercontent.com/sornsomavatey/omr_website_v1/main/Frontend/public/assets/partners/onemorerestaurant.png" alt="One More Restaurant" style="max-height: 70px; width: auto; display: block; margin: 0 auto 12px auto;" />
      <h2 style="color: #5b8045; margin: 0; font-size: 22px; font-weight: 700;">📋 Booking table</h2>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #e3e3e3; border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #f0f0f0;">Booking Ref:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #5b8045; font-weight: bold;">${bookingRef}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Customer:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Phone:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${customerPhone}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Date:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${reservationDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Time Slot:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${reservationTime}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Guest Count:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${guestCountDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Branch:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${branchName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Area:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${area}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold;">Special Requests:</td>
          <td style="padding: 10px 0;">${specialRequests}</td>
        </tr>
      </table>
    </div>

    ${preorderHtml}

    <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 24px; border-top: 1px solid #e5e5e5; padding-top: 16px;">
      This is an automated reservation confirmation from One More Restaurant.
    </p>

  </body>
  </html>
  `;

  // Fallback plain text
  const plainTextMessage =
    `📋 Booking table ${bookingRef}\n\n` +
    `Booking Ref: ${bookingRef}\n` +
    `Customer: ${customerName}\n` +
    `Phone: ${customerPhone}\n` +
    `Date: ${reservationDate}\n` +
    `Time Slot: ${reservationTime}\n` +
    `Guest Count: ${guestCountDisplay}\n` +
    `Branch: ${branchName}\n` +
    `Area: ${area}\n` +
    `Special Requests: ${specialRequests}${preorderText}`;

  // // Option A: Direct Resend API Dispatch
  // if (rawEmail) {
  //   try {
  //     const response = await fetch("https://api.resend.com/emails", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${RESEND_API_KEY}`,
  //       },
  //       body: JSON.stringify({
  //         from: "One More Restaurant <onboarding@resend.dev>",
  //         to: [rawEmail],
  //         subject: `Booking table ${bookingRef} - Reservation Confirmation`,
  //         html: emailHtml,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log("Resend Direct Customer Email Result:", result);
  //     if (response.ok) return true;
  //   } catch (err) {
  //     console.error("Resend direct email failed:", err);
  //   }
  // }

  // Option B: Web3Forms API Dispatch
  if (WEB3FORMS_ACCESS_KEY) {
    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", `Booking table ${bookingRef}`);
      formData.append("from_name", "One More Restaurant");
      formData.append("name", customerName);
      formData.append("email", recipientEmail);
      formData.append("replyto", replyToEmail);
      formData.append("message", plainTextMessage);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Web3Forms Email Dispatch Result:", result);
      if (result.success) {
        return true;
      } else {
        console.error("Web3Forms Notice/Failure:", result.message || result);
      }
    } catch (err) {
      console.error("Web3Forms notification failed:", err);
    }
  }

  // Option C: EmailJS API Dispatch
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              to_email: recipientEmail,
              to_name: customerName,
              message: plainTextMessage,
              html_message: emailHtml,
              reservation_id: bookingRef,
            },
          }),
        },
      );
      return response.ok;
    } catch (err) {
      console.error("EmailJS notification failed:", err);
    }
  }

  return false;
}

export async function sendFrontendEventEmail(eventData: any): Promise<boolean> {
  const customerName =
    eventData.name || eventData.customer_name || "Valued Guest";
  const customerPhone = eventData.phone || eventData.customer_phone || "N/A";
  const customerEmail =
    eventData.email ||
    eventData.customer_email ||
    "no-email-provided@onemorerestaurant.com";
  const eventType = eventData.event_type || "Event Booking";
  const guestCount = eventData.guest_count || 1;
  const eventDate = eventData.event_date || "TBD";
  const details = eventData.package_details || eventData.details || "None";

  const plainTextMessage =
    `🎉 New Event Booking Request\n\n` +
    `Customer: ${customerName}\n` +
    `Phone: ${customerPhone}\n` +
    `Email: ${customerEmail}\n` +
    `Event Type: ${eventType}\n` +
    `Guest Count: ${guestCount} persons\n` +
    `Event Date: ${eventDate}\n` +
    `Details / Requirements: ${details}`;

  if (WEB3FORMS_ACCESS_KEY) {
    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", `🎉 New Event Booking Request - ${eventType}`);
      formData.append("from_name", "One More Restaurant");
      formData.append("name", customerName);
      formData.append("email", customerEmail);
      formData.append("replyto", customerEmail);
      formData.append("message", plainTextMessage);
      formData.append("autoresponder", "true");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Web3Forms Event Email Result:", result);
      return result.success === true;
    } catch (err) {
      console.error("Web3Forms Event email failed:", err);
    }
  }
  return false;
}

export async function sendFrontendFeedbackEmail(
  feedbackData: any,
): Promise<boolean> {
  const customerName =
    feedbackData.name || feedbackData.customer_name || "Anonymous Guest";
  const customerEmail =
    feedbackData.email ||
    feedbackData.customer_email ||
    "no-email-provided@onemorerestaurant.com";
  const subject = feedbackData.subject || "General Inquiry";
  const message = feedbackData.message || "";

  const plainTextMessage =
    `💬 New Customer Feedback / Inquiry\n\n` +
    `From: ${customerName}\n` +
    `Email: ${customerEmail}\n` +
    `Subject: ${subject}\n\n` +
    `Message:\n${message}`;

  if (WEB3FORMS_ACCESS_KEY) {
    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", `💬 Customer Feedback - ${subject}`);
      formData.append("from_name", "One More Restaurant");
      formData.append("name", customerName);
      formData.append("email", customerEmail);
      formData.append("replyto", customerEmail);
      formData.append("message", plainTextMessage);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Web3Forms Feedback Email Result:", result);
      return result.success === true;
    } catch (err) {
      console.error("Web3Forms Feedback email failed:", err);
    }
  }
  return false;
}
