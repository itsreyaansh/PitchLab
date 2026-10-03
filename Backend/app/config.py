from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from pydantic import Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Deployment settings. Provider URLs and secrets stay on the server."""

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_prefix="API_", extra="ignore")
    title: str = "Shark Tank AI API"
    database_url: str = f"sqlite:///{(BASE_DIR / 'shark_tank.db').as_posix()}"
    config_file: Path | None = None
    ai_provider: Literal["demo", "openai_compatible"] = "demo"
    ai_base_url: str = "https://api.openai.com/v1"
    ai_api_key: SecretStr | None = None
    ai_model: str | None = None
    ai_json_mode: bool = True
    ai_token_parameter: Literal["max_tokens", "max_completion_tokens"] = "max_tokens"
    tts_enabled: bool = False
    tts_base_url: str = "https://api.openai.com/v1"
    tts_api_key: SecretStr | None = None
    tts_model: str = "tts-1"
    tts_voice: str = "alloy"
    tts_timeout_seconds: float = Field(default=30, gt=0, allow_inf_nan=False)
    tts_output_dir: Path = BASE_DIR / "generated_audio"
    web_access_enabled: bool = True
    web_search_url: str = "https://api.duckduckgo.com/"
    web_timeout_seconds: float = Field(default=5, gt=0, allow_inf_nan=False)
    max_concurrent_ai_calls: int = Field(default=4, ge=1)
    operation_lease_slack_seconds: int = Field(default=60, ge=1)
    admin_key: SecretStr | None = None
    client_key: SecretStr | None = None
    cors_origins: list[str] = []
    max_request_bytes: int = Field(default=262144, ge=1024)
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    docs_enabled: bool = True

    @model_validator(mode="after")
    def validate_provider(self):
        if self.ai_provider == "openai_compatible":
            if not self.ai_model or not self.ai_model.strip():
                raise ValueError("API_AI_MODEL is required for the configured provider")
            url = urlsplit(self.ai_base_url)
            if url.scheme not in {"http", "https"} or not url.hostname:
                raise ValueError("API_AI_BASE_URL must be an HTTP(S) URL")
            if url.username or url.password or url.query or url.fragment:
                raise ValueError("Provider URL cannot contain credentials, query, or fragment")
        if self.web_access_enabled:
            url = urlsplit(self.web_search_url)
            if url.scheme not in {"http", "https"} or not url.hostname:
                raise ValueError("API_WEB_SEARCH_URL must be an HTTP(S) URL")
        if self.tts_enabled:
            url = urlsplit(self.tts_base_url)
            if url.scheme not in {"http", "https"} or not url.hostname:
                raise ValueError("API_TTS_BASE_URL must be an HTTP(S) URL")
            if url.username or url.password or url.query or url.fragment:
                raise ValueError("TTS URL cannot contain credentials, query, or fragment")
            if not self.tts_model.strip() or not self.tts_voice.strip():
                raise ValueError("API_TTS_MODEL and API_TTS_VOICE are required when TTS is enabled")
        return self
