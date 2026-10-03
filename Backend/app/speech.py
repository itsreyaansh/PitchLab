import logging
import re
from pathlib import Path

import httpx

from .schemas import SpeechAudio

logger = logging.getLogger("shark_tank.tts")


class SpeechService:
    def __init__(self, settings, client: httpx.AsyncClient):
        self.settings = settings
        self.client = client

    async def synthesize(self, session_id: str, name: str, text: str) -> SpeechAudio | None:
        text = " ".join(text.split())
        if not self.settings.tts_enabled or not text:
            return None
        filename = f"{self._safe_name(name)}.mp3"
        target = self.path_for(session_id, filename)
        if not target.exists():
            try:
                content = await self._request_audio(text)
            except httpx.HTTPError as error:
                logger.info("TTS unavailable error_type=%s", type(error).__name__)
                return None
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
        return SpeechAudio(
            url=f"/api/v1/sessions/{session_id}/audio/{filename}",
            filename=filename,
        )

    def path_for(self, session_id: str, filename: str) -> Path:
        safe_session = self._safe_name(session_id)
        safe_file = self._safe_name(filename.removesuffix(".mp3")) + ".mp3"
        return self.settings.tts_output_dir / safe_session / safe_file

    async def _request_audio(self, text: str) -> bytes:
        headers = {}
        key = self.settings.tts_api_key or self.settings.ai_api_key
        if key and key.get_secret_value():
            headers["Authorization"] = f"Bearer {key.get_secret_value()}"
        response = await self.client.post(
            self.settings.tts_base_url.rstrip("/") + "/audio/speech",
            headers=headers,
            json={
                "model": self.settings.tts_model,
                "voice": self.settings.tts_voice,
                "input": text,
                "response_format": "mp3",
            },
            timeout=self.settings.tts_timeout_seconds,
        )
        if response.is_error:
            logger.info("TTS provider rejected request status=%s", response.status_code)
            response.raise_for_status()
        return response.content

    @staticmethod
    def _safe_name(value: str) -> str:
        return re.sub(r"[^a-zA-Z0-9_.-]+", "-", value).strip(".-")[:120] or "speech"
