<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public array $data;

    /**
     * Create a new message instance.
     */
    public function __construct(array $data, string $type)
    {
         $this->data = $data;
         $this->data["type_booking"] = $type;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {

        if ($this->data["type_booking"] == "reservation") {
            $ref = $this->data['customer_name'] ?? '#OMR-RES';
            return new Envelope(
                subject: "📋 New Table Reservation - {$ref}",
            );
        }
        else {
            $ref = $this->data['customer_name'] ?? '#OMR-RES';
            return new Envelope(
                subject: "📋 New Event Booked - {$ref}",
            );
        }

    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->data["type_booking"] == "reservation") {
            return new Content(
                view: 'emails.reservation',
            );
        }
        else {
            return new Content(
                view: 'emails.event',
            );
        }

    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
