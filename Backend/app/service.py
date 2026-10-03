import asyncio
import json
import math
from uuid import uuid4

from fastapi.concurrency import run_in_threadpool

from .errors import APIError
from .schemas import (
    AgentEvaluation,
    AgentRoundAnalysis,
    AnswersRequest,
    Evaluation,
    PanelRoundSummary,
    Question,
    RoundAnalysis,
    SessionRead,
)


class SimulationService:
    def __init__(self, repository, provider, settings, web_researcher, speech_service):
        self.repository = repository
        self.provider = provider
        self.settings = settings
        self.web_researcher = web_researcher
        self.speech_service = speech_service

    def check_state(self, session: SessionRead, version: int, status: str):
        if session.version != version:
            raise APIError(409, "version_conflict", "Session changed; fetch its current version")
        if session.busy:
            raise APIError(409, "session_busy", "An AI operation is already running")
        if session.status != status:
            raise APIError(
                409, "invalid_session_state", f"This action requires session status '{status}'"
            )

    async def _panel_operation(self, session, operation, values_builder):
        if session.ai_provider != self.settings.ai_provider:
            raise APIError(
                409, "provider_changed", "Server provider changed; start a new pitch session"
            )
        config = session.config
        deadline = (
            math.ceil(len(config.agents) / self.settings.max_concurrent_ai_calls)
            * (
                config.ai_timeout_seconds * (config.ai_retries + 1)
                + config.retry_backoff_seconds * (2**config.ai_retries - 1)
            )
            + self.settings.operation_lease_slack_seconds
        )
        operation_id = await run_in_threadpool(
            self.repository.acquire,
            session.id,
            session.version,
            deadline + self.settings.operation_lease_slack_seconds,
        )
        try:
            async with asyncio.timeout(deadline):
                # Drain all tasks on failure before releasing the database lease.
                tasks = [asyncio.create_task(operation(agent, session)) for agent in config.agents]
                try:
                    outputs = await asyncio.gather(*tasks)
                finally:
                    for task in tasks:
                        if not task.done():
                            task.cancel()
                    await asyncio.gather(*tasks, return_exceptions=True)
            values = await values_builder(outputs)
            await run_in_threadpool(
                self.repository.save, session.id, session.version, values, operation_id
            )
        except TimeoutError:
            raise APIError(
                503, "ai_timeout", "Panel exceeded its operation time budget; try again"
            ) from None
        finally:
            await run_in_threadpool(self.repository.release, session.id, operation_id)

    async def _round_operation(self, session, values_builder):
        if session.ai_provider != self.settings.ai_provider:
            raise APIError(
                409, "provider_changed", "Server provider changed; start a new pitch session"
            )
        config = session.config
        deadline = (1 + len(config.agents)) * (
            config.ai_timeout_seconds * (config.ai_retries + 1)
            + config.retry_backoff_seconds * (2**config.ai_retries - 1)
        ) + self.settings.operation_lease_slack_seconds
        operation_id = await run_in_threadpool(
            self.repository.acquire,
            session.id,
            session.version,
            deadline + self.settings.operation_lease_slack_seconds,
        )
        try:
            async with asyncio.timeout(deadline):
                plan = await self.provider.orchestrate(session)
                outputs = []
                web_results = []
                same_round_questions = []
                for agent in config.agents:
                    web_research = await self.web_researcher.research(agent, session)
                    web_research = self._fit_web_context(web_research, config.web_context_max_chars)
                    web_results.append(web_research)
                    output = await self.provider.ask(
                        agent, session, plan, same_round_questions, web_research
                    )
                    outputs.append(output)
                    same_round_questions.append(
                        {
                            "agent_id": agent.id,
                            "agent_name": agent.name,
                            "questions": output.questions,
                        }
                    )
            values = await values_builder(outputs, web_results)
            await run_in_threadpool(
                self.repository.save, session.id, session.version, values, operation_id
            )
        except TimeoutError:
            raise APIError(
                503, "ai_timeout", "Panel exceeded its operation time budget; try again"
            ) from None
        finally:
            await run_in_threadpool(self.repository.release, session.id, operation_id)

    @staticmethod
    def _fit_web_context(results: list[dict], max_chars: int) -> list[dict]:
        while results and len(json.dumps(results, ensure_ascii=False)) > max_chars:
            results.pop()
        return results

    @staticmethod
    def _speech_text(*parts: str, max_chars: int) -> str:
        text = " ".join(part.strip() for part in parts if part and part.strip())
        text = " ".join(text.split())
        return text[:max_chars]

    async def _speech_audio(self, session_id: str, name: str, text: str):
        return await self.speech_service.synthesize(session_id, name, text)

    async def next_round(self, session_id: str, token: str, version: int):
        session = await run_in_threadpool(self.repository.get_session, session_id, token)
        self.check_state(session, version, "ready_for_round")
        next_round = session.current_round + 1

        async def build_values(outputs, web_results):
            questions = [q.model_dump(mode="json") for q in session.questions]
            for agent, output, sources in zip(
                session.config.agents, outputs, web_results, strict=True
            ):
                for text in output.questions:
                    question_id = str(uuid4())
                    speech_text = self._speech_text(
                        f"{agent.name} asks:",
                        text,
                        max_chars=session.config.speech_text_max_chars,
                    )
                    questions.append(
                        Question(
                            id=question_id,
                            agent_id=agent.id,
                            agent_name=agent.name,
                            round_number=next_round,
                            text=text,
                            speech_text=speech_text,
                            speech_audio=await self._speech_audio(
                                session.id, f"question-{question_id}", speech_text
                            ),
                            sources=sources,
                        ).model_dump(mode="json")
                    )
            return {
                "questions": questions,
                "current_round": next_round,
                "status": "awaiting_answers",
            }

        await self._round_operation(session, build_values)
        return await run_in_threadpool(self.repository.get_session, session_id, token)

    async def submit_answers(self, session_id: str, token: str, payload: AnswersRequest):
        session = await run_in_threadpool(self.repository.get_session, session_id, token)
        self.check_state(session, payload.expected_version, "awaiting_answers")
        pending = {
            q.id: q
            for q in session.questions
            if q.round_number == session.current_round and q.answer is None
        }
        ids = [answer.question_id for answer in payload.answers]
        if len(set(ids)) != len(ids):
            raise APIError(
                422, "duplicate_answers", "Each question may be answered only once per request"
            )
        for answer in payload.answers:
            if answer.question_id not in pending:
                raise APIError(
                    422,
                    "invalid_question",
                    "Question does not belong to the current round or was already answered",
                )
            if len(answer.text) > session.config.answer_max_chars:
                raise APIError(
                    422,
                    "answer_too_long",
                    f"Answer must be <= {session.config.answer_max_chars} characters",
                )
            pending[answer.question_id].answer = answer.text
        all_answered = all(q.answer is not None for q in pending.values())
        status = session.status
        if all_answered:
            status = (
                "ready_for_evaluation"
                if session.current_round >= session.config.max_rounds
                else "ready_for_round"
            )
        values = {
            "questions": [q.model_dump(mode="json") for q in session.questions],
            "status": status,
        }
        if not all_answered:
            await run_in_threadpool(self.repository.save, session_id, session.version, values)
            return await run_in_threadpool(self.repository.get_session, session_id, token)

        analysis_session = session.model_copy(update={"status": status})

        async def build_values(outputs):
            agents = []
            for agent, output in zip(session.config.agents, outputs, strict=True):
                speech_text = self._speech_text(
                    f"{agent.name}'s round {session.current_round} feedback.",
                    output.summary,
                    "Strengths:",
                    ". ".join(output.strengths),
                    "Concerns:",
                    ". ".join(output.concerns),
                    "Recommendations:",
                    ". ".join(output.recommendations),
                    max_chars=session.config.speech_text_max_chars,
                )
                agents.append(
                    AgentRoundAnalysis(
                        agent_id=agent.id,
                        agent_name=agent.name,
                        round_number=session.current_round,
                        summary=output.summary,
                        speech_text=speech_text,
                        speech_audio=await self._speech_audio(
                            session.id,
                            f"round-{session.current_round}-agent-{agent.id}",
                            speech_text,
                        ),
                        strengths=output.strengths,
                        concerns=output.concerns,
                        recommendations=output.recommendations,
                    )
                )
            analyses = [
                analysis.model_dump(mode="json")
                for analysis in session.round_analyses
                if analysis.round_number != session.current_round
            ]
            panel_summary = self._summarize_round(
                session.current_round, agents, session.config.speech_text_max_chars
            )
            panel_summary.speech_audio = await self._speech_audio(
                session.id,
                f"round-{session.current_round}-panel",
                panel_summary.speech_text,
            )
            analyses.append(
                RoundAnalysis(
                    round_number=session.current_round,
                    panel_summary=panel_summary,
                    agents=agents,
                ).model_dump(mode="json")
            )
            return values | {"round_analyses": analyses}

        await self._panel_operation(analysis_session, self.provider.analyze_round, build_values)
        return await run_in_threadpool(self.repository.get_session, session_id, token)

    @staticmethod
    def _summarize_round(
        round_number: int, agents: list[AgentRoundAnalysis], speech_text_max_chars: int
    ) -> PanelRoundSummary:
        strengths = [item for agent in agents for item in agent.strengths]
        concerns = [item for agent in agents for item in agent.concerns]
        recommendations = [item for agent in agents for item in agent.recommendations]
        total = len(strengths) + len(concerns)
        score = 50.0 if total == 0 else round((len(strengths) / total) * 100, 1)
        lead_concern = concerns[0] if concerns else "No major concern was raised by the panel."
        return PanelRoundSummary(
            summary=f"Round {round_number} panel review: {lead_concern}",
            speech_text=SimulationService._speech_text(
                f"Round {round_number} panel review.",
                lead_concern,
                "Top next steps:",
                ". ".join(recommendations[:3]),
                max_chars=speech_text_max_chars,
            ),
            top_strengths=strengths[:3],
            top_concerns=concerns[:3],
            next_steps=recommendations[:3],
            readiness_score=score,
        )

    async def evaluate(self, session_id: str, token: str, version: int):
        session = await run_in_threadpool(self.repository.get_session, session_id, token)
        self.check_state(session, version, "ready_for_evaluation")
        config = session.config

        async def build_values(outputs):
            criterion_weight = sum(criterion.weight for criterion in config.criteria)
            panel_weight = sum(agent.voting_weight for agent in config.agents)
            evaluations = []
            for agent, output in zip(config.agents, outputs, strict=True):
                score = (
                    sum(output.scores[c.id] * c.weight for c in config.criteria) / criterion_weight
                )
                evaluations.append(
                    AgentEvaluation(
                        agent_id=agent.id,
                        agent_name=agent.name,
                        scores=output.scores,
                        weighted_score=score,
                        verdict="interested" if score >= config.investment_threshold else "pass",
                        feedback=output.feedback,
                        speech_text=(
                            speech_text := self._speech_text(
                                f"{agent.name}'s final verdict is",
                                "interested" if score >= config.investment_threshold else "pass",
                                output.feedback,
                                max_chars=config.speech_text_max_chars,
                            )
                        ),
                        speech_audio=await self._speech_audio(
                            session.id, f"evaluation-agent-{agent.id}", speech_text
                        ),
                    )
                )
            overall = (
                sum(
                    e.weighted_score * a.voting_weight
                    for e, a in zip(evaluations, config.agents, strict=True)
                )
                / panel_weight
            )
            criteria_scores = {
                c.id: sum(
                    e.scores[c.id] * a.voting_weight
                    for e, a in zip(evaluations, config.agents, strict=True)
                )
                / panel_weight
                for c in config.criteria
            }
            speech_text = self._speech_text(
                "Final panel verdict:",
                "interested" if overall >= config.investment_threshold else "pass",
                f"Overall score: {overall:.1f}.",
                "Key feedback:",
                " ".join(e.feedback for e in evaluations[:3]),
                max_chars=config.speech_text_max_chars,
            )
            report = Evaluation(
                overall_score=overall,
                verdict="interested" if overall >= config.investment_threshold else "pass",
                criteria_scores=criteria_scores,
                agents=evaluations,
                speech_text=speech_text,
                speech_audio=await self._speech_audio(session.id, "evaluation-panel", speech_text),
            )
            return {"evaluation": report.model_dump(mode="json"), "status": "completed"}

        await self._panel_operation(session, self.provider.evaluate, build_values)
        return await run_in_threadpool(self.repository.get_session, session_id, token)
