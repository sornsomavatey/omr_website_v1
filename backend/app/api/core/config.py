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
