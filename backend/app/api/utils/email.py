import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..core.config import settings

def send_email_alert(subject: str, html_content: str, text_content: str = "") -> bool:
    """Send an email alert using the configured SMTP server."""
    host = settings.SMTP_HOST
    port = settings.SMTP_PORT
    user = settings.SMTP_USER
    password = settings.SMTP_PASSWORD
    from_email = settings.EMAILS_FROM_EMAIL or user
    to_email = settings.EMAILS_TO_EMAIL

    if not host or not to_email:
        # If host or destination email is not set, skip silently
        return False

    # Create message container
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email

    # Record the MIME types of both parts - text/plain and text/html.
    if text_content:
        part1 = MIMEText(text_content, "plain")
        message.attach(part1)
    
    part2 = MIMEText(html_content, "html")
    message.attach(part2)

    try:
        if settings.SMTP_SSL:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
            if settings.SMTP_TLS:
                server.starttls()

        if user and password:
            server.login(user, password)

        server.sendmail(from_email, to_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email alert: {e}")
        return False
