import logging
from urllib.parse import quote

import httpx

from .schemas import AgentConfig, SessionRead

logger = logging.getLogger("shark_tank.web")


class WebResearcher:
    def __init__(self, settings, client: httpx.AsyncClient):
        self.settings = settings
        self.client = client

    async def research(self, agent: AgentConfig, session: SessionRead) -> list[dict]:
        config = session.config
        if (
            not self.settings.web_access_enabled
            or not config.web_research_enabled
            or not agent.web_access
        ):
            return []
        query = self._query(agent, session)
        try:
            response = await self._request(query)
            response.raise_for_status()
            return self._parse(response.json(), config.web_search_results_per_agent)[
                : config.web_search_results_per_agent
            ]
        except (httpx.HTTPError, ValueError, TypeError, KeyError) as error:
            logger.info(
                "Web research unavailable agent_id=%s error_type=%s",
                agent.id,
                type(error).__name__,
            )
            return []

    async def _request(self, query: str) -> httpx.Response:
        url = self.settings.web_search_url
        if "{query}" in url:
            return await self.client.get(
                url.replace("{query}", quote(query)),
                timeout=self.settings.web_timeout_seconds,
            )
        return await self.client.get(
            url,
            params={
                "q": query,
                "format": "json",
                "no_html": 1,
                "skip_disambig": 1,
            },
            timeout=self.settings.web_timeout_seconds,
        )

    @staticmethod
    def _query(agent: AgentConfig, session: SessionRead) -> str:
        pitch = session.pitch
        parts = [
            pitch.business_name,
            pitch.industry or "",
            "startup pitch",
            agent.role,
            *agent.expertise,
        ]
        return " ".join(part for part in parts if part).strip()

    @staticmethod
    def _parse(data: dict, limit: int) -> list[dict]:
        results = []
        if data.get("AbstractText"):
            results.append(
                {
                    "title": data.get("Heading") or "Search result",
                    "snippet": data["AbstractText"],
                    "source_url": data.get("AbstractURL") or None,
                }
            )
        for topic in data.get("RelatedTopics", []):
            if len(results) >= limit:
                break
            if "Topics" in topic:
                for nested in topic["Topics"]:
                    if len(results) >= limit:
                        break
                    result = WebResearcher._topic_result(nested)
                    if result:
                        results.append(result)
                continue
            result = WebResearcher._topic_result(topic)
            if result:
                results.append(result)
        return results

    @staticmethod
    def _topic_result(topic: dict) -> dict | None:
        text = topic.get("Text")
        if not text:
            return None
        return {
            "title": topic.get("Name") or "Search result",
            "snippet": text,
            "source_url": topic.get("FirstURL") or None,
        }
