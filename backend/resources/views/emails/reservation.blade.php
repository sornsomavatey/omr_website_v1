<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    
    <div style="text-align: center; margin-bottom: 20px; background-color: #ffffff; border: 1px solid #dce8d5; padding: 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <h2 style="color: #5b8045; margin: 0; font-size: 22px; font-weight: 700;">📋 Booking table</h2>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #e3e3e3; border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #f0f0f0;">Booking Ref:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #5b8045; font-weight: bold;">{{ $data['booking_ref'] ?? 'N/A' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Customer:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{{ $data['customer_name'] ?? 'Guest' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Phone:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{{ $data['customer_phone'] ?? 'N/A' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Date:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{{ $data['reservation_date'] ?? 'N/A' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Time Slot:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{{ $data['reservation_time'] ?? 'N/A' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Branch:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{{ $data['branch_name'] ?? 'One More Restaurant' }}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold;">Special Requests:</td>
          <td style="padding: 10px 0;">{{ $data['special_requests'] ?? 'None' }}</td>
        </tr>
      </table>

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

</body>
</html>
