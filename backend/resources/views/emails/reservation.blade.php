<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Table Reservation</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 40px 20px;
            color: #333333;
        }

        .card {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #557945;
            color: #ffffff;
            text-align: center;
            padding: 20px 15px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .content {
            padding: 30px;
            line-height: 2.2;
            font-size: 16px;
        }

        .field-label {
            font-weight: bold;
            color: #1a1a1a;
        }

        .field-value {
            color: #555555;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="header">
            📋 NEW TABLE RESERVATION
        </div>

        <div class="content">
            <div>
                <span class="field-label">Branch:</span>
                <span class="field-value">{{ $data['branch_name'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Customer Name:</span>
                <span class="field-value">{{ $data['customer_name'] ?? $data['name'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Phone:</span>
                <span class="field-value">{{ $data['customer_phone'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Guests:</span>
                <span class="field-value">
                    @if(isset($data['guest_count']))
                        {{ $data['guest_count'] }}
                    @elseif(isset($data['adults']) || isset($data['kids']))
                        {{ ($data['adults'] ?? 0) + ($data['kids'] ?? 0) }} people ({{ $data['adults'] ?? 0 }} Adults, {{ $data['kids'] ?? 0 }} Kids)
                    @else
                        0 people (0 Adults, 0 Kids)
                    @endif
                </span>
            </div>
            <div>
                <span class="field-label">Seating Area:</span>
                <span class="field-value">{{ $data['area'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Date:</span>
                <span class="field-value">{{ $data['reservation_date'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Time:</span>
                <span class="field-value">{{ $data['reservation_time'] ?? '' }}</span>
            </div>


            @if(!empty($data['preordered_items']) && is_array($data['preordered_items']) && count($data['preordered_items']) > 0)
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #ddd;">
                  <h4 style="margin: 0 0 8px 0; color: #5b8045;">🛒 Pre-ordered Dishes:</h4>
                  <ul style="margin: 0; padding-left: 20px; color: #333;">
                    @php
                      $total = 0;
                      $hasPrice = false;
                    @endphp
                    @foreach($data['preordered_items'] as $item)
                      @php
                        $qty = (int) ($item['qty'] ?? 1);
                        $name = htmlspecialchars($item['name'] ?? '', ENT_QUOTES, 'UTF-8');
                        $rawPriceStr = isset($item['price']) ? preg_replace('/[^0-9.]/', '', (string)$item['price']) : '';
                        $unitPrice = is_numeric($rawPriceStr) ? (float)$rawPriceStr : 0;
                        $priceStr = '';
                        if ($unitPrice > 0) {
                            $hasPrice = true;
                            $total += ($unitPrice * $qty);
                            $cleanPriceVal = (fmod($unitPrice, 1.0) == 0) ? (int)$unitPrice : number_format($unitPrice, 2, '.', '');
                            $priceStr = ' (' . $cleanPriceVal . ')';
                        } elseif (!empty($item['price'])) {
                            $priceStr = ' (' . htmlspecialchars((string)$item['price'], ENT_QUOTES, 'UTF-8') . ')';
                        }
                      @endphp
                      <li style="margin: 4px 0;">{{ $qty }}x {{ $name }}{{ $priceStr }}</li>
                    @endforeach
                  </ul>
                  @if($hasPrice && $total > 0)
                    <p style="margin-top: 8px; font-weight: bold;">Total: ${{ number_format($total, 2, '.', '') }}</p>
                  @endif
                </div>
              @endif
            </div>
        </div>
    </div>

</body>
</html>
