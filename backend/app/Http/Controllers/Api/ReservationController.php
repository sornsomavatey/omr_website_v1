<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Mail\ReservationConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Cache;

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

        $cPhone = trim($validated['customer_phone']);
        $rDate = trim($validated['reservation_date']);
        $rTime = trim($validated['reservation_time']);
        $dupKey = 'res_dup_' . md5("{$cPhone}_{$rDate}_{$rTime}");

        if (Cache::has($dupKey)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Duplicate reservation detected. Please wait before trying again.'
            ], 429);
        }
        Cache::put($dupKey, true, 60);

        // 1. Send Email Alert ONLY to Team Email(s) (Configured in .env via TEAM_ALERT_EMAIL)
        // $teamEmailsRaw = env('TEAM_ALERT_EMAIL', env('MAIL_FROM_ADDRESS', 'darichhy61@gmail.com'));
        // $teamEmails = array_filter(array_map('trim', explode(',', (string) $teamEmailsRaw)));

        // if (!empty($teamEmails)) {
        //     try {
        //         Mail::to($teamEmails)->send(new ReservationConfirmation($validated));
        //     } catch (\Throwable $e) {
        //         \Log::error('Laravel Team Email Alert Failed: ' . $e->getMessage());
        //     }
        // }

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
                $cPhoneEsc = htmlspecialchars($validated['customer_phone'], ENT_QUOTES, 'UTF-8');
                $cEmail = !empty($validated['customer_email']) ? htmlspecialchars($validated['customer_email'], ENT_QUOTES, 'UTF-8') : '';
                $rDateEsc = $normalizeToEnglishTime(htmlspecialchars($validated['reservation_date'], ENT_QUOTES, 'UTF-8'));
                $rTimeEsc = $normalizeToEnglishTime(htmlspecialchars($validated['reservation_time'], ENT_QUOTES, 'UTF-8'));
                $branchMap = [1 => 'Toul Kork', 2 => 'Boeung Kak', '1' => 'Toul Kork', '2' => 'Boeung Kak'];
                $rawBranch = $validated['branch_name'] ?? $request->input('branch') ?? ($request->input('branch_id') ? ($branchMap[$request->input('branch_id')] ?? '') : '') ?: 'Boeung Kak';
                $bName = htmlspecialchars($rawBranch, ENT_QUOTES, 'UTF-8');
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
                    "• <b>Phone:</b> {$cPhoneEsc}",
                ];

                if ($cEmail) {
                    $lines[] = "• <b>Email:</b> {$cEmail}";
                }

                $lines[] = "• <b>Guests:</b> {$guestsFormatted}";
                $lines[] = "• <b>Seating Area:</b> {$sArea}";
                $lines[] = "• <b>Date:</b> {$rDateEsc}";
                $lines[] = "• <b>Time:</b> {$rTimeEsc}";

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
            'ok' => true,
            'status' => 'success',
            'message' => 'Reservation received and notifications sent',
        ], 201);
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'customer_phone' => 'nullable|string',
            'phone' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'name' => 'nullable|string',
            'event_type' => 'nullable|string',
            'event_date' => 'nullable|string',
            'date' => 'nullable|string',
        ]);

        $phone = trim($request->input('customer_phone') ?? $request->input('phone') ?? '');
        $evtType = trim($request->input('event_type', 'General'));
        $evtDate = trim($request->input('event_date') ?? $request->input('date') ?? '');
        $dupKey = 'evt_dup_' . md5("{$phone}_{$evtType}_{$evtDate}");

        if (Cache::has($dupKey)) {
            return response()->json([
                'ok' => false,
                'status' => 'error',
                'message' => 'Duplicate event inquiry detected. Please wait before trying again.'
            ], 429);
        }
        Cache::put($dupKey, true, 60);

        // 1. Send Email Alert ONLY to Team Email(s)
        $teamEmailsRaw = env('TEAM_ALERT_EMAIL', env('MAIL_FROM_ADDRESS', 'darichhy61@gmail.com'));
        $teamEmails = array_filter(array_map('trim', explode(',', (string) $teamEmailsRaw)));

        if (!empty($teamEmails)) {
            try {
                Mail::to($teamEmails)->send(new ReservationConfirmation([
                    'booking_ref' => $request->input('booking_ref', 'EVT-' . rand(10000, 99000)),
                    'customer_name' => $request->input('customer_name') ?? $request->input('name') ?? 'Valued Guest',
                    'customer_phone' => $phone,
                    'customer_email' => $request->input('customer_email') ?? $request->input('email'),
                    'reservation_date' => $evtDate ?: date('Y-m-d'),
                    'reservation_time' => 'Event Booking (' . $evtType . ')',
                    'branch_name' => $request->input('branch_name') ?? $request->input('branch') ?? 'One More Restaurant',
                    'special_requests' => $request->input('special_requirements') ?? $request->input('special_requests'),
                ]));
            } catch (\Throwable $e) {
                \Log::error('Laravel Event Team Email Alert Failed: ' . $e->getMessage());
            }
        }

        // 2. Send Telegram Alert (if bot token configured)
        $telegramToken = env('TELEGRAM_BOT_TOKEN');
        $telegramChatId = env('TELEGRAM_CHAT_ID');
        $telegramThreadId = env('TELEGRAM_EVENT_THREAD_ID', env('TELEGRAM_RESERVATION_THREAD_ID', '2'));

        if ($telegramToken && $telegramChatId) {
            try {
                $cName = htmlspecialchars($request->input('customer_name') ?? $request->input('name') ?? 'Valued Guest', ENT_QUOTES, 'UTF-8');
                $cPhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
                $bName = htmlspecialchars($request->input('branch_name') ?? $request->input('branch') ?? 'One More Restaurant', ENT_QUOTES, 'UTF-8');
                $guestCount = min(1000, max(1, (int) $request->input('guest_count', 1)));
                $specialReq = htmlspecialchars($request->input('special_requirements') ?? $request->input('special_requests') ?? '', ENT_QUOTES, 'UTF-8');
                $ref = htmlspecialchars($request->input('booking_ref', ''), ENT_QUOTES, 'UTF-8');

                $lines = [
                    '🎉 <b>NEW EVENT INQUIRY</b>',
                    '',
                ];
                if ($ref) $lines[] = "• <b>Ref Code:</b> #{$ref}";
                $lines[] = "• <b>Branch:</b> {$bName}";
                $lines[] = "• <b>Customer:</b> {$cName}";
                $lines[] = "• <b>Phone:</b> {$cPhone}";
                $lines[] = "• <b>Event Type:</b> " . htmlspecialchars($evtType, ENT_QUOTES, 'UTF-8');
                $lines[] = "• <b>Expected Guests:</b> {$guestCount} " . ($guestCount === 1 ? 'person' : 'people');
                $lines[] = "• <b>Date:</b> " . htmlspecialchars($evtDate, ENT_QUOTES, 'UTF-8');
                if ($specialReq) $lines[] = "• <b>Special Requirements:</b> {$specialReq}";

                $telegramPayload = [
                    'chat_id' => $telegramChatId,
                    'text' => implode("\n", $lines),
                    'parse_mode' => 'HTML',
                ];
                if ($telegramThreadId) {
                    $telegramPayload['message_thread_id'] = (int) $telegramThreadId;
                }

                Http::post("https://api.telegram.org/bot{$telegramToken}/sendMessage", $telegramPayload);
            } catch (\Throwable $e) {
                \Log::error('Laravel Event Alert Failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'ok' => true,
            'status' => 'success',
            'message' => 'Event inquiry received and notifications sent',
        ], 201);
    }

    public function storeFeedback(Request $request)
    {
        $cName = trim($request->input('customer_name') ?? $request->input('name') ?? 'Anonymous');
        $bName = trim($request->input('branch_name') ?? $request->input('branch') ?? '');
        $rating = (int) $request->input('rating', 5);
        $dupKey = 'fb_dup_' . md5("{$cName}_{$bName}_{$rating}");

        if (Cache::has($dupKey)) {
            return response()->json([
                'ok' => false,
                'status' => 'error',
                'message' => 'Duplicate feedback detected. Please wait before trying again.'
            ], 429);
        }
        Cache::put($dupKey, true, 60);

        $telegramToken = env('TELEGRAM_BOT_TOKEN');
        $telegramChatId = env('TELEGRAM_CHAT_ID');
        $telegramThreadId = env('TELEGRAM_FEEDBACK_THREAD_ID', '4');

        if ($telegramToken && $telegramChatId) {
            try {
                $cNameEsc = htmlspecialchars($cName, ENT_QUOTES, 'UTF-8');
                $bNameEsc = htmlspecialchars($bName ?: 'One More Restaurant', ENT_QUOTES, 'UTF-8');
                $stars = str_repeat('⭐', max(1, min(5, $rating)));
                $msgText = htmlspecialchars($request->input('message', '(No written comment provided)'), ENT_QUOTES, 'UTF-8');

                $lines = [
                    '💬 <b>NEW GUEST FEEDBACK</b>',
                    '',
                    "• <b>Branch:</b> {$bNameEsc}",
                    "• <b>Customer:</b> {$cNameEsc}",
                    "• <b>Rating:</b> {$stars} ({$rating}/5)",
                    "• <b>Message:</b> {$msgText}",
                ];

                $telegramPayload = [
                    'chat_id' => $telegramChatId,
                    'text' => implode("\n", $lines),
                    'parse_mode' => 'HTML',
                ];
                if ($telegramThreadId) {
                    $telegramPayload['message_thread_id'] = (int) $telegramThreadId;
                }

                Http::post("https://api.telegram.org/bot{$telegramToken}/sendMessage", $telegramPayload);
            } catch (\Throwable $e) {
                \Log::error('Laravel Feedback Alert Failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'ok' => true,
            'status' => 'success',
            'message' => 'Feedback received and notifications sent',
        ], 201);
    }
}
