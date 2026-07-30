<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Mail\ReservationConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'reservation_date' => 'required|string',
            'reservation_time' => 'required|string',
            'branch_name' => 'nullable|string',
            'special_requests' => 'nullable|string',
        ]);


        // 1. Send Email Alert ONLY to Team Email(s) (Configured in .env via TEAM_ALERT_EMAIL)
        $teamEmailsRaw = env('TEAM_ALERT_EMAIL', env('MAIL_FROM_ADDRESS', 'darichhy61@gmail.com'));
        $teamEmails = array_filter(array_map('trim', explode(',', (string) $teamEmailsRaw)));

        if (!empty($teamEmails)) {
            try {
                Mail::to($teamEmails)->send(new ReservationConfirmation($validated));
            } catch (\Throwable $e) {
                \Log::error('Laravel Team Email Alert Failed: ' . $e->getMessage());
            }
        }

        // 2. Send Telegram Alert (if bot token configured)
        $telegramToken = env('TELEGRAM_BOT_TOKEN');
        $telegramChatId = env('TELEGRAM_CHAT_ID');
        $telegramThreadId = env('TELEGRAM_RESERVATION_THREAD_ID');
        if ($telegramToken && $telegramChatId) {
            try {
                $normalizeToEnglishTime = function($timeStr) {
                    $khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
                    $englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    $str = str_replace($khmerDigits, $englishDigits, (string)$timeStr);
                    $str = preg_replace('/\s*ព្រឹក/u', ' AM', $str);
                    $str = preg_replace('/\s*(ល្ងាច|ថ្ងៃ|យប់)/u', ' PM', $str);
                    return trim($str);
                };

                $cName = htmlspecialchars($validated['customer_name'], ENT_QUOTES, 'UTF-8');
                $cPhone = htmlspecialchars($validated['customer_phone'], ENT_QUOTES, 'UTF-8');
                $cEmail = !empty($validated['customer_email']) ? htmlspecialchars($validated['customer_email'], ENT_QUOTES, 'UTF-8') : '';
                $rDate = $normalizeToEnglishTime(htmlspecialchars($validated['reservation_date'], ENT_QUOTES, 'UTF-8'));
                $rTime = $normalizeToEnglishTime(htmlspecialchars($validated['reservation_time'], ENT_QUOTES, 'UTF-8'));
                $bName = htmlspecialchars($validated['branch_name'] ?? 'One More Restaurant', ENT_QUOTES, 'UTF-8');
                $sArea = htmlspecialchars($request->input('area', 'Standard'), ENT_QUOTES, 'UTF-8');
                $sNotes = !empty($validated['special_requests']) ? htmlspecialchars($validated['special_requests'], ENT_QUOTES, 'UTF-8') : '';

                $adults = (int) $request->input('adults', 1);
                $kids = (int) $request->input('kids', 0);
                $totalGuests = (int) $request->input('guest_count', $adults + $kids);
                $guestUnit = $totalGuests === 1 ? 'person' : 'people';
                $adultsStr = $adults . ' Adult' . ($adults === 1 ? '' : 's');
                $kidsStr = $kids > 0 ? ', ' . $kids . ' Kid' . ($kids === 1 ? '' : 's') : '';
                $guestsFormatted = "{$totalGuests} {$guestUnit} ({$adultsStr}{$kidsStr})";

                $lines = [
                    '📅 <b>NEW TABLE RESERVATION</b>',
                    '',
                    "• <b>Branch:</b> {$bName}",
                    "• <b>Customer:</b> {$cName}",
                    "• <b>Phone:</b> {$cPhone}",
                ];

                if ($cEmail) {
                    $lines[] = "• <b>Email:</b> {$cEmail}";
                }

                $lines[] = "• <b>Guests:</b> {$guestsFormatted}";
                $lines[] = "• <b>Seating Area:</b> {$sArea}";
                $lines[] = "• <b>Date:</b> {$rDate}";
                $lines[] = "• <b>Time:</b> {$rTime}";

                if ($sNotes) {
                    $lines[] = "• <b>Special Requests:</b> {$sNotes}";
                }

                $preordered = $request->input('preordered_items', []);
                if (is_array($preordered) && count($preordered) > 0) {
                    $lines[] = '';
                    $lines[] = '🛒 <b>PRE-ORDERED DISHES:</b>';
                    $total = 0.0;
                    $hasPrice = false;

                    foreach ($preordered as $item) {
                        $qty = (int) ($item['qty'] ?? 1);
                        $name = htmlspecialchars($item['name'] ?? '', ENT_QUOTES, 'UTF-8');
                        $rawPriceStr = isset($item['price']) ? preg_replace('/[^0-9.]/', '', (string)$item['price']) : '';
                        $unitPrice = is_numeric($rawPriceStr) ? (float)$rawPriceStr : 0.0;

                        $priceStr = '';
                        if ($unitPrice > 0) {
                            $hasPrice = true;
                            $total += ($unitPrice * $qty);
                            $cleanPriceVal = (fmod($unitPrice, 1.0) == 0) ? (int)$unitPrice : number_format($unitPrice, 2, '.', '');
                            $priceStr = ' (' . $cleanPriceVal . ')';
                        } else if (!empty($item['price'])) {
                            $priceStr = ' (' . htmlspecialchars((string)$item['price'], ENT_QUOTES, 'UTF-8') . ')';
                        }

                        $lines[] = "  └ {$qty}x {$name}{$priceStr}";
                    }

                    if ($hasPrice && $total > 0) {
                        $formattedTotal = number_format($total, 2, '.', '');
                        $lines[] = "<b>Total:</b> \${$formattedTotal}";
                    }
                }

                $msg = implode("\n", $lines);

                $telegramPayload = [
                    'chat_id' => $telegramChatId,
                    'text' => $msg,
                    'parse_mode' => 'HTML',
                ];

                if ($telegramThreadId) {
                    $telegramPayload['message_thread_id'] = (int) $telegramThreadId;
                }

                Http::post("https://api.telegram.org/bot{$telegramToken}/sendMessage", $telegramPayload);
            } catch (\Throwable $e) {
                \Log::error('Laravel Telegram Alert Failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation received and notifications sent',
        ], 201);
    }
}
