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
    </div>

    <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 24px; border-top: 1px solid #e5e5e5; padding-top: 16px;">
      This is an automated reservation confirmation from One More Restaurant.
    </p>

</body>
</html>
