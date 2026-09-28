<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEW EVENT BOOKED</title>
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
            📋 NEW EVENT BOOKED
        </div>

        <div class="content">
            <div>
                <span class="field-label">Booking Ref:</span>
                <span class="field-value">{{ $data['booking_ref'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Branch:</span>
                <span class="field-value">{{ $data['branch_name'] ?? '' }}</span>
            </div>
            <div>
                <span class="field-label">Customer Name:</span>
                <span class="field-value">{{ $data['customer_name'] ?? $data['name'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Phone:</span>
                <span class="field-value">{{ $data['customer_phone'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Email:</span>
                <span class="field-value">{{ $data['customer_email'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Company:</span>
                <span class="field-value">{{ $data['company'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Event Type:</span>
                <span class="field-value">{{ $data['event_type'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Event Date:</span>
                <span class="field-value">{{ $data['event_date'] ?? 'N/A' }}</span>
            </div>
            <div>
                <span class="field-label">Guests:</span>
                <span class="field-value">{{ $data['guest_count'] ?? 0 }}</span>
            </div>
            <div>
                <span class="field-label">Special Requirements:</span>
                <span class="field-value">{{ $data['special_requirements'] ?? 'N/A' }}</span>
            </div>
        </div>
    </div>

</body>
</html>
