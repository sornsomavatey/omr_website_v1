from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = 'One More Restaurant Backend'
    APP_VERSION: str = '0.1.0'
    API_PREFIX: str = '/api'
    GOOGLE_ANALYTICS_ID: str = ''
    FACEBOOK_ANALYTICS_TOKEN: str = ''
    CUSTOM_ANALYTICS_ENABLED: bool = True
    TELEGRAM_BOT_TOKEN: str = ''
    TELEGRAM_CHAT_ID: str = ''
    TELEGRAM_RESERVATION_THREAD_ID: Optional[int] = 2
    TELEGRAM_FEEDBACK_THREAD_ID: Optional[int] = 4
    FASTAPI_HOST: str = '0.0.0.0'
    FASTAPI_PORT: int = 8000
    EXPRESS_PORT: int = 3002
    ENVIRONMENT: str = 'development'

    # Web security. Comma-separated values make these easy to configure in .env.
    CORS_ORIGINS: str = 'http://localhost:3001,http://127.0.0.1:3001'
    ALLOWED_HOSTS: str = 'localhost,127.0.0.1,testserver'
    FORCE_HTTPS: bool = False
    TRUST_PROXY_HEADERS: bool = False
    MAX_REQUEST_BODY_BYTES: int = 1_048_576
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 120
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    RESERVATION_RATE_LIMIT_REQUESTS: int = 3
    RESERVATION_RATE_LIMIT_WINDOW_SECONDS: int = 600
    CONTACT_RATE_LIMIT_REQUESTS: int = 5
    CONTACT_RATE_LIMIT_WINDOW_SECONDS: int = 600
    ORDER_RATE_LIMIT_REQUESTS: int = 10
    ORDER_RATE_LIMIT_WINDOW_SECONDS: int = 600
    PAYMENT_RATE_LIMIT_REQUESTS: int = 5
    PAYMENT_RATE_LIMIT_WINDOW_SECONDS: int = 900
    LOGIN_RATE_LIMIT_REQUESTS: int = 5
    LOGIN_RATE_LIMIT_WINDOW_SECONDS: int = 600
    PASSWORD_RESET_RATE_LIMIT_REQUESTS: int = 3
    PASSWORD_RESET_RATE_LIMIT_WINDOW_SECONDS: int = 3600
    NEWSLETTER_RATE_LIMIT_REQUESTS: int = 3
    NEWSLETTER_RATE_LIMIT_WINDOW_SECONDS: int = 3600
    ADMIN_API_KEY: str = ''

    # SMTP/Email Alert Settings
    SMTP_HOST: str = ''
    SMTP_PORT: int = 587
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_USER: str = ''
    SMTP_PASSWORD: str = ''
    EMAILS_FROM_EMAIL: str = ''
    EMAILS_TO_EMAIL: str = ''

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'
        extra = 'ignore'


settings = Settings()
