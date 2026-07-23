import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from typing import Optional
from ..core.config import settings

def send_email_alert(
    subject: str,
    html_content: str,
    text_content: str = "",
    to_email: Optional[str] = None
) -> bool:
    """Send an email alert using the configured SMTP server with inline logo attachment."""
    host = settings.SMTP_HOST
    port = settings.SMTP_PORT
    user = settings.SMTP_USER
    password = settings.SMTP_PASSWORD
    from_email = settings.EMAILS_FROM_EMAIL or user
    recipient = to_email or settings.EMAILS_TO_EMAIL

    if not host or not recipient:
        return False

    # Create message container with related layout for inline images
    message = MIMEMultipart("related")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = recipient

    msg_alternative = MIMEMultipart("alternative")
    message.attach(msg_alternative)

    if text_content:
        part1 = MIMEText(text_content, "plain")
        msg_alternative.attach(part1)

    part2 = MIMEText(html_content, "html")
    msg_alternative.attach(part2)

    # Automatically attach logo inline if CID is referenced
    if "cid:omr_logo" in html_content:
        curr_dir = os.path.dirname(__file__)
        possible_paths = [
            os.path.abspath(os.path.join(curr_dir, "../../../../Frontend/public/assets/partners/onemorerestaurant.png")),
            "Frontend/public/assets/partners/onemorerestaurant.png",
            "public/assets/partners/onemorerestaurant.png"
        ]
        logo_path = next((p for p in possible_paths if os.path.exists(p)), None)
        if logo_path:
            try:
                with open(logo_path, "rb") as f:
                    img_part = MIMEImage(f.read())
                    img_part.add_header("Content-ID", "<omr_logo>")
                    img_part.add_header("Content-Disposition", "inline", filename="onemorerestaurant.png")
                    message.attach(img_part)
            except Exception as err:
                print("Failed to attach inline logo CID:", err)

    try:
        if settings.SMTP_SSL:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
            if settings.SMTP_TLS:
                server.starttls()

        if user and password:
            server.login(user, password)

        server.sendmail(from_email, recipient, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {recipient}: {e}")
        return False
