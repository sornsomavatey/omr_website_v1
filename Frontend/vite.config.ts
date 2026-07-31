import { defineConfig, loadEnv, type UserConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import nodemailer from 'nodemailer';

const telegramProxyPlugin = (env: Record<string, string>): Plugin => ({
  name: 'telegram-reservation-proxy',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/telegram-reservation' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M';
            const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '-1003911645931';
            const threadId = env.TELEGRAM_RESERVATION_THREAD_ID || process.env.TELEGRAM_RESERVATION_THREAD_ID || '2';

            const data = JSON.parse(body || '{}');

            const escapeHtml = (text: any) =>
              String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const normalizeToEnglishTime = (timeStr: any) => {
              const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
              let res = String(timeStr || '');
              khmerDigits.forEach((kh, i) => {
                res = res.replaceAll(kh, String(i));
              });
              return res.replace(/\s*ព្រឹក/gi, ' AM').replace(/\s*(ល្ងាច|ថ្ងៃ|យប់)/gi, ' PM').trim();
            };

            const safeCustomerName = escapeHtml(data.customer_name);
            const safePhone = escapeHtml(data.customer_phone);
            const safeEmail = data.customer_email ? escapeHtml(data.customer_email) : '';
            const safeBranch = escapeHtml(data.branch_name || 'One More Restaurant');
            const safeDate = normalizeToEnglishTime(escapeHtml(data.reservation_date));
            const safeTime = normalizeToEnglishTime(escapeHtml(data.reservation_time));
            const safeArea = escapeHtml(data.area || 'Standard');
            const safeNotes = data.special_requests ? escapeHtml(data.special_requests) : '';

            const adults = Number(data.adults) || 1;
            const kids = Number(data.kids) || 0;
            const totalGuests = Number(data.guest_count) || (adults + kids);
            const guestUnit = totalGuests === 1 ? 'person' : 'people';
            const adultsStr = `${adults} Adult${adults === 1 ? '' : 's'}`;
            const kidsStr = kids > 0 ? `, ${kids} Kid${kids === 1 ? '' : 's'}` : '';
            const guestsFormatted = `${totalGuests} ${guestUnit} (${adultsStr}${kidsStr})`;

            const lines = [
              '📅 <b>NEW TABLE RESERVATION</b>',
              '',
              `• <b>Branch:</b> ${safeBranch}`,
              `• <b>Customer:</b> ${safeCustomerName}`,
              `• <b>Phone:</b> ${safePhone}`,
            ];

            if (safeEmail) {
              lines.push(`• <b>Email:</b> ${safeEmail}`);
            }

            lines.push(`• <b>Guests:</b> ${guestsFormatted}`);
            lines.push(`• <b>Seating Area:</b> ${safeArea}`);
            lines.push(`• <b>Date:</b> ${safeDate}`);
            lines.push(`• <b>Time:</b> ${safeTime}`);

            if (safeNotes) {
              lines.push(`• <b>Special Requests:</b> ${safeNotes}`);
            }

            let preorderHtml = '';
            if (Array.isArray(data.preordered_items) && data.preordered_items.length > 0) {
              lines.push('');
              lines.push('🛒 <b>PRE-ORDERED DISHES:</b>');
              let total = 0;
              let hasPrice = false;
              let preorderItemsListHtml = '';

              data.preordered_items.forEach((item: any) => {
                const qty = Number(item.qty) || 1;
                const name = escapeHtml(item.name || '');
                const rawPriceStr = item.price ? String(item.price).replace(/[^0-9.]/g, '') : '';
                const unitPrice = parseFloat(rawPriceStr);

                let priceStr = '';
                if (!isNaN(unitPrice) && unitPrice > 0) {
                  hasPrice = true;
                  total += unitPrice * qty;
                  const cleanVal = unitPrice % 1 === 0 ? String(unitPrice) : unitPrice.toFixed(2);
                  priceStr = ` (${cleanVal})`;
                } else if (item.price) {
                  priceStr = ` (${escapeHtml(String(item.price))})`;
                }

                lines.push(`  └ ${qty}x ${name}${priceStr}`);
                preorderItemsListHtml += `<li>${qty}x ${name}${priceStr}</li>`;
              });

              if (hasPrice && total > 0) {
                lines.push(`<b>Total:</b> $${total.toFixed(2)}`);
              }

              preorderHtml = `
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #ddd;">
                  <h4 style="margin: 0 0 8px 0; color: #5b8045;">🛒 Pre-ordered Dishes:</h4>
                  <ul style="margin: 0; padding-left: 20px;">${preorderItemsListHtml}</ul>
                  ${hasPrice && total > 0 ? `<p style="margin-top: 8px;"><b>Total:</b> $${total.toFixed(2)}</p>` : ''}
                </div>
              `;
            }

            const message = lines.join('\n');

            const telegramPayload: Record<string, any> = {
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            };
            if (threadId) {
              telegramPayload.message_thread_id = Number(threadId);
            }

            // 1. Send Telegram Alert
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(telegramPayload),
            });
            const result = await response.json();

            // 2. Send Team Email Alert via SMTP (Nodemailer)
            const teamEmail = env.TEAM_ALERT_EMAIL || env.MAIL_FROM_ADDRESS || process.env.TEAM_ALERT_EMAIL || 'darichhy61@gmail.com';
            const mailUser = env.MAIL_USERNAME || process.env.MAIL_USERNAME || 'darichhy61@gmail.com';
            const mailPass = env.MAIL_PASSWORD || process.env.MAIL_PASSWORD || 'kwbk wcls dgqe bvlh';
            const mailHost = env.MAIL_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
            const mailPort = Number(env.MAIL_PORT || process.env.MAIL_PORT || 587);

            if (teamEmail && mailUser && mailPass) {
              try {
                const transporter = nodemailer.createTransport({
                  host: mailHost,
                  port: mailPort,
                  secure: false,
                  auth: { user: mailUser, pass: mailPass },
                  tls: { rejectUnauthorized: false },
                });

                const htmlContent = `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
                      <h2 style="margin: 0;">📋 NEW TABLE RESERVATION</h2>
                    </div>
                    <div style="padding: 20px;">
                      <p style="margin: 8px 0;"><b>Branch:</b> ${safeBranch}</p>
                      <p style="margin: 8px 0;"><b>Customer Name:</b> ${safeCustomerName}</p>
                      <p style="margin: 8px 0;"><b>Phone:</b> ${safePhone}</p>
                      ${safeEmail ? `<p style="margin: 8px 0;"><b>Email:</b> ${safeEmail}</p>` : ''}
                      <p style="margin: 8px 0;"><b>Guests:</b> ${guestsFormatted}</p>
                      <p style="margin: 8px 0;"><b>Seating Area:</b> ${safeArea}</p>
                      <p style="margin: 8px 0;"><b>Date:</b> ${safeDate}</p>
                      <p style="margin: 8px 0;"><b>Time:</b> ${safeTime}</p>
                      ${safeNotes ? `<p style="margin: 8px 0;"><b>Special Requests:</b> ${safeNotes}</p>` : ''}
                      ${preorderHtml}
                    </div>
                  </div>
                `;

                await transporter.sendMail({
                  from: `"One More Restaurant" <${mailUser}>`,
                  to: teamEmail,
                  subject: `📋 New Table Reservation - ${safeCustomerName}`,
                  html: htmlContent,
                });
              } catch (mailErr) {
                // ignore silent mail error
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.ok ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, message: 'Server proxy error' }));
          }
        });
      } else if (req.url === '/api/telegram-event' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M';
            const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '-1003911645931';
            const threadId = env.TELEGRAM_EVENT_THREAD_ID || process.env.TELEGRAM_EVENT_THREAD_ID || env.TELEGRAM_RESERVATION_THREAD_ID || process.env.TELEGRAM_RESERVATION_THREAD_ID || '2';

            const data = JSON.parse(body || '{}');

            const escapeHtml = (text: any) =>
              String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const safeCustomerName = escapeHtml(data.customer_name || data.name);
            const safePhone = escapeHtml(data.customer_phone || data.phone);
            const safeEmail = data.customer_email || data.email ? escapeHtml(data.customer_email || data.email) : '';
            const safeBranch = escapeHtml(data.branch_name || data.branch || 'One More Restaurant');
            const safeCompany = data.company ? escapeHtml(data.company) : '';
            const safeEventType = escapeHtml(data.event_type || 'Event Inquiry');
            const guestCount = Number(data.guest_count) || 1;
            const safeDate = escapeHtml(data.event_date || data.date || new Date().toISOString().split('T')[0]);
            const safeNotes = data.special_requirements ? escapeHtml(data.special_requirements) : '';
            const safeRef = data.booking_ref ? escapeHtml(data.booking_ref) : '';

            const lines = [
              '🎉 <b>NEW EVENT INQUIRY</b>',
              '',
            ];

            if (safeRef) {
              lines.push(`• <b>Ref Code:</b> #${safeRef}`);
            }
            lines.push(`• <b>Branch:</b> ${safeBranch}`);
            lines.push(`• <b>Customer:</b> ${safeCustomerName}`);
            lines.push(`• <b>Phone:</b> ${safePhone}`);

            if (safeEmail && safeEmail !== 'noemail@onemore.com') {
              lines.push(`• <b>Email:</b> ${safeEmail}`);
            }
            if (safeCompany) {
              lines.push(`• <b>Company:</b> ${safeCompany}`);
            }
            lines.push(`• <b>Event Type:</b> ${safeEventType}`);
            lines.push(`• <b>Expected Guests:</b> ${guestCount} ${guestCount === 1 ? 'person' : 'people'}`);
            lines.push(`• <b>Date:</b> ${safeDate}`);

            if (safeNotes) {
              lines.push(`• <b>Special Requirements:</b> ${safeNotes}`);
            }

            const message = lines.join('\n');

            const telegramPayload: Record<string, any> = {
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            };
            if (threadId) {
              telegramPayload.message_thread_id = Number(threadId);
            }

            // 1. Send Telegram Alert
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(telegramPayload),
            });
            const result = await response.json();

            // 2. Send Team Email Alert via SMTP (Nodemailer)
            const teamEmail = env.TEAM_ALERT_EMAIL || env.MAIL_FROM_ADDRESS || process.env.TEAM_ALERT_EMAIL || 'darichhy61@gmail.com';
            const mailUser = env.MAIL_USERNAME || process.env.MAIL_USERNAME || 'darichhy61@gmail.com';
            const mailPass = env.MAIL_PASSWORD || process.env.MAIL_PASSWORD || 'kwbk wcls dgqe bvlh';
            const mailHost = env.MAIL_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
            const mailPort = Number(env.MAIL_PORT || process.env.MAIL_PORT || 587);

            if (teamEmail && mailUser && mailPass) {
              try {
                const transporter = nodemailer.createTransport({
                  host: mailHost,
                  port: mailPort,
                  secure: false,
                  auth: { user: mailUser, pass: mailPass },
                  tls: { rejectUnauthorized: false },
                });

                const htmlContent = `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
                      <h2 style="margin: 0;">🎉 NEW EVENT INQUIRY</h2>
                    </div>
                    <div style="padding: 20px;">
                      ${safeRef ? `<p style="margin: 8px 0;"><b>Ref Code:</b> #${safeRef}</p>` : ''}
                      <p style="margin: 8px 0;"><b>Branch:</b> ${safeBranch}</p>
                      <p style="margin: 8px 0;"><b>Customer Name:</b> ${safeCustomerName}</p>
                      <p style="margin: 8px 0;"><b>Phone:</b> ${safePhone}</p>
                      ${safeEmail && safeEmail !== 'noemail@onemore.com' ? `<p style="margin: 8px 0;"><b>Email:</b> ${safeEmail}</p>` : ''}
                      ${safeCompany ? `<p style="margin: 8px 0;"><b>Company:</b> ${safeCompany}</p>` : ''}
                      <p style="margin: 8px 0;"><b>Event Type:</b> ${safeEventType}</p>
                      <p style="margin: 8px 0;"><b>Expected Guests:</b> ${guestCount} ${guestCount === 1 ? 'person' : 'people'}</p>
                      <p style="margin: 8px 0;"><b>Date:</b> ${safeDate}</p>
                      ${safeNotes ? `<p style="margin: 8px 0;"><b>Special Requirements:</b> ${safeNotes}</p>` : ''}
                    </div>
                  </div>
                `;

                await transporter.sendMail({
                  from: `"One More Restaurant" <${mailUser}>`,
                  to: teamEmail,
                  subject: `🎉 New Event Inquiry - ${safeCustomerName}${safeRef ? ` (#${safeRef})` : ''}`,
                  html: htmlContent,
                });
              } catch (mailErr) {
                // ignore silent mail error
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.ok ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, message: 'Server proxy error' }));
          }
        });
      } else if (req.url === '/api/telegram-feedback' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M';
            const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '-1003911645931';
            const threadId = env.TELEGRAM_FEEDBACK_THREAD_ID || process.env.TELEGRAM_FEEDBACK_THREAD_ID || '4';

            const data = JSON.parse(body || '{}');

            const escapeHtml = (text: any) =>
              String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const safeCustomerName = escapeHtml(data.customer_name || data.name || 'Anonymous');
            const safeEmail = data.customer_email || data.email;
            const cleanEmail = safeEmail && safeEmail !== 'N/A' ? escapeHtml(safeEmail) : '';
            const safeBranch = escapeHtml(data.branch_name || data.branch || 'General');
            const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));
            const stars = '⭐'.repeat(rating);
            const safeSubject = escapeHtml(data.subject || `Guest feedback - ${safeBranch} - ${rating}/5`);
            const safeMessage = escapeHtml(data.message || '(No details provided)');

            const lines = [
              '💬 <b>NEW GUEST FEEDBACK</b>',
              '',
              `• <b>Branch:</b> ${safeBranch}`,
              `• <b>Customer:</b> ${safeCustomerName}`,
            ];

            if (cleanEmail) {
              lines.push(`• <b>Email:</b> ${cleanEmail}`);
            }

            lines.push(`• <b>Rating:</b> ${stars} (${rating}/5)`);
            lines.push(`• <b>Subject:</b> ${safeSubject}`);
            lines.push(`• <b>Message:</b> ${safeMessage}`);

            const message = lines.join('\n');

            const telegramPayload: Record<string, any> = {
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            };
            if (threadId) {
              telegramPayload.message_thread_id = Number(threadId);
            }

            // 1. Send Telegram Alert
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(telegramPayload),
            });
            const result = await response.json();

            // 2. Send Team Email Alert via SMTP (Nodemailer)
            const teamEmail = env.TEAM_ALERT_EMAIL || env.MAIL_FROM_ADDRESS || process.env.TEAM_ALERT_EMAIL || 'darichhy61@gmail.com';
            const mailUser = env.MAIL_USERNAME || process.env.MAIL_USERNAME || 'darichhy61@gmail.com';
            const mailPass = env.MAIL_PASSWORD || process.env.MAIL_PASSWORD || 'kwbk wcls dgqe bvlh';
            const mailHost = env.MAIL_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
            const mailPort = Number(env.MAIL_PORT || process.env.MAIL_PORT || 587);

            if (teamEmail && mailUser && mailPass) {
              try {
                const transporter = nodemailer.createTransport({
                  host: mailHost,
                  port: mailPort,
                  secure: false,
                  auth: { user: mailUser, pass: mailPass },
                  tls: { rejectUnauthorized: false },
                });

                const htmlContent = `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
                      <h2 style="margin: 0;">💬 NEW GUEST FEEDBACK</h2>
                    </div>
                    <div style="padding: 20px;">
                      <p style="margin: 8px 0;"><b>Branch:</b> ${safeBranch}</p>
                      <p style="margin: 8px 0;"><b>Customer Name:</b> ${safeCustomerName}</p>
                      ${cleanEmail ? `<p style="margin: 8px 0;"><b>Email:</b> ${cleanEmail}</p>` : ''}
                      <p style="margin: 8px 0;"><b>Rating:</b> ${stars} (${rating}/5)</p>
                      <p style="margin: 8px 0;"><b>Subject:</b> ${safeSubject}</p>
                      <p style="margin: 8px 0;"><b>Message:</b> ${safeMessage.replace(/\n/g, '<br/>')}</p>
                    </div>
                  </div>
                `;

                await transporter.sendMail({
                  from: `"One More Restaurant" <${mailUser}>`,
                  to: teamEmail,
                  subject: `💬 New Guest Feedback - ${safeBranch} (${rating}/5)`,
                  html: htmlContent,
                });
              } catch (mailErr) {
                // ignore silent mail error
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.ok ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, message: 'Server proxy error' }));
          }
        });
      }
 else {
        next();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      telegramProxyPlugin(env),
    ],
    define: {
      __APP_BUILD_VERSION__: JSON.stringify(String(Date.now())),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3001,
      host: true,
    },
  };
});
