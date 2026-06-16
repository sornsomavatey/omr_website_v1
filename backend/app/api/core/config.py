from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = 'One More Restaurant Backend'
    APP_VERSION: str = '0.1.0'
    API_PREFIX: str = '/api'
    GOOGLE_ANALYTICS_ID: str = ''
    FACEBOOK_ANALYTICS_TOKEN: str = ''
    CUSTOM_ANALYTICS_ENABLED: bool = True

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

settings = Settings()
