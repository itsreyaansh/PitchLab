from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class AgentConfig(StrictModel):
    id: str = Field(pattern=r"^[a-z][a-z0-9_-]*$", max_length=64)
    name: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=200)
    instructions: str = Field(min_length=1, max_length=8000)
    expertise: list[str] = Field(min_length=1)
    assertiveness: float = Field(default=0.7, ge=0, le=1, allow_inf_nan=False)
    risk_tolerance: float = Field(default=0.5, ge=0, le=1, allow_inf_nan=False)
    voting_weight: float = Field(default=1, gt=0, allow_inf_nan=False)
    web_access: bool = True
    model: str | None = Field(default=None, min_length=1)
    temperature: float | None = Field(default=0.7, ge=0, le=2, allow_inf_nan=False)
    max_output_tokens: int = Field(default=2000, ge=1)


class OrchestratorConfig(StrictModel):
    enabled: bool = True
    id: str = Field(default="orchestrator", pattern=r"^[a-z][a-z0-9_-]*$", max_length=64)
    name: str = Field(default="Jordan", min_length=1, max_length=100)
    role: str = Field(default="Lead investor and panel moderator", min_length=1, max_length=200)
    instructions: str = Field(
        default=(
            "Coordinate the investor panel. Set a focused round objective, assign each investor "
            "a non-overlapping angle, and make sure the panel follows up on weak or unsupported claims."
        ),
        min_length=1,
        max_length=8000,
    )
    model: str | None = Field(default=None, min_length=1)
    temperature: float | None = Field(default=0.4, ge=0, le=2, allow_inf_nan=False)
    max_output_tokens: int = Field(default=1500, ge=1)


class CriterionConfig(StrictModel):
    id: str = Field(pattern=r"^[a-z][a-z0-9_-]*$", max_length=64)
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=2000)
    weight: float = Field(default=1, gt=0, allow_inf_nan=False)


def default_agents() -> list[AgentConfig]:
    return [
        AgentConfig(
            id="finance",
            name="Alex",
            role="Finance investor",
            instructions="Challenge revenue, margins, valuation and funding assumptions.",
            expertise=["unit economics", "cash flow", "fundraising"],
            risk_tolerance=0.3,
        ),
        AgentConfig(
            id="market",
            name="Morgan",
            role="Market investor",
            instructions="Challenge customer demand, competition and acquisition strategy.",
            expertise=["market size", "customer acquisition", "competition"],
        ),
        AgentConfig(
            id="product",
            name="Sam",
            role="Product investor",
            instructions="Challenge differentiation, feasibility and ability to scale.",
            expertise=["product", "technology", "operations"],
            risk_tolerance=0.7,
        ),
        AgentConfig(
            id="strategy",
            name="Riley",
            role="Go-to-market investor",
            instructions="Challenge positioning, sales motion, partnerships and founder readiness.",
            expertise=["go-to-market", "sales strategy", "pitch clarity"],
            assertiveness=0.8,
        ),
        AgentConfig(
            id="technical",
            name="Taylor",
            role="Technical investor",
            instructions="Challenge technical feasibility, architecture, security, data strategy and build risk.",
            expertise=["technical feasibility", "architecture", "security"],
            risk_tolerance=0.4,
        ),
        AgentConfig(
            id="market_research",
            name="Casey",
            role="Market research investor",
            instructions="Challenge market evidence, category trends, customer segments and external proof.",
            expertise=["market research", "industry trends", "customer validation"],
            assertiveness=0.8,
            risk_tolerance=0.4,
        ),
    ]


def default_criteria() -> list[CriterionConfig]:
    return [
        CriterionConfig(
            id="market",
            name="Market opportunity",
            description="Demand and reachable customer segment",
            weight=0.3,
        ),
        CriterionConfig(
            id="economics",
            name="Business economics",
            description="Revenue, margins and sustainable acquisition",
            weight=0.3,
        ),
        CriterionConfig(
            id="product",
            name="Product advantage",
            description="Differentiation and defensibility",
            weight=0.2,
        ),
        CriterionConfig(
            id="execution",
            name="Execution",
            description="Team capability and credible next steps",
            weight=0.2,
        ),
    ]


class SimulationConfig(StrictModel):
    """Add/remove agents to change the panel size; IDs must stay unique."""

    orchestrator: OrchestratorConfig = Field(default_factory=OrchestratorConfig)
    agents: list[AgentConfig] = Field(default_factory=default_agents, min_length=1)
    difficulty_mode: Literal["friendly", "normal", "brutal", "investor_grade"] = "normal"
    max_rounds: int = Field(default=3, ge=1)
    questions_per_agent: int = Field(default=1, ge=1)
    pitch_min_chars: int = Field(default=20, ge=1)
    pitch_max_chars: int = Field(default=12000, ge=1)
    answer_max_chars: int = Field(default=8000, ge=1)
    question_max_chars: int = Field(default=1500, ge=1)
    speech_text_max_chars: int = Field(default=2000, ge=1)
    orchestrator_briefing_max_chars: int = Field(default=1200, ge=1)
    round_analysis_text_max_chars: int = Field(default=1200, ge=1)
    round_analysis_points_per_section: int = Field(default=3, ge=1, le=10)
    feedback_max_chars: int = Field(default=6000, ge=1)
    history_max_chars: int = Field(default=32000, ge=1)
    web_research_enabled: bool = True
    web_search_results_per_agent: int = Field(default=3, ge=1, le=10)
    web_context_max_chars: int = Field(default=4000, ge=1)
    ai_timeout_seconds: float = Field(default=60, gt=0, allow_inf_nan=False)
    ai_retries: int = Field(default=2, ge=0, le=10)
    retry_backoff_seconds: float = Field(default=1, ge=0, le=30, allow_inf_nan=False)
    score_min: float = Field(default=0, allow_inf_nan=False)
    score_max: float = Field(default=10, allow_inf_nan=False)
    investment_threshold: float = Field(default=7, allow_inf_nan=False)
    criteria: list[CriterionConfig] = Field(default_factory=default_criteria, min_length=1)
    question_instructions: str = Field(
        default="Ask specific, constructive investor questions. Use previous answers to probe gaps; avoid repeating earlier questions.",
        min_length=1,
        max_length=8000,
    )
    evaluation_instructions: str = Field(
        default="Evaluate only the supplied evidence. Explain strengths, risks and practical next steps. Distinguish claims from proven facts.",
        min_length=1,
        max_length=8000,
    )

    @model_validator(mode="after")
    def validate_consistency(self):
        for objects in (self.agents, self.criteria):
            if len({item.id for item in objects}) != len(objects):
                raise ValueError("Agent IDs and criterion IDs must each be unique")
        if self.pitch_min_chars > self.pitch_max_chars:
            raise ValueError("pitch_min_chars must be <= pitch_max_chars")
        if not self.score_min < self.score_max:
            raise ValueError("score_min must be less than score_max")
        if not self.score_min <= self.investment_threshold <= self.score_max:
            raise ValueError("investment_threshold must be within the score range")
        return self


class ConfigRead(StrictModel):
    revision: int
    agent_count: int
    config: SimulationConfig


class ConfigUpdate(StrictModel):
    expected_revision: int = Field(ge=1)
    config: SimulationConfig


class Pitch(StrictModel):
    business_name: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1)
    industry: str | None = Field(default=None, max_length=200)
    target_customers: str | None = Field(default=None, max_length=2000)
    revenue_model: str | None = Field(default=None, max_length=2000)
    traction: str | None = Field(default=None, max_length=3000)
    funding_ask: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    equity_offered_percent: float | None = Field(default=None, gt=0, le=100, allow_inf_nan=False)
    currency: str = Field(default="USD", pattern=r"^[A-Z]{3}$")


class SpeechAudio(StrictModel):
    url: str
    filename: str
    media_type: Literal["audio/mpeg"] = "audio/mpeg"


class Question(StrictModel):
    id: str
    agent_id: str
    agent_name: str
    round_number: int
    text: str
    speech_text: str = ""
    speech_audio: SpeechAudio | None = None
    sources: list["WebSource"] = Field(default_factory=list)
    answer: str | None = None


class WebSource(StrictModel):
    title: str = Field(min_length=1, max_length=300)
    snippet: str = Field(min_length=1, max_length=2000)
    source_url: str | None = Field(default=None, max_length=2000)


class AgentRoundAnalysis(StrictModel):
    agent_id: str
    agent_name: str
    round_number: int
    summary: str
    speech_text: str = ""
    speech_audio: SpeechAudio | None = None
    strengths: list[str]
    concerns: list[str]
    recommendations: list[str]


class PanelRoundSummary(StrictModel):
    summary: str
    speech_text: str = ""
    speech_audio: SpeechAudio | None = None
    top_strengths: list[str]
    top_concerns: list[str]
    next_steps: list[str]
    readiness_score: float = Field(ge=0, le=100, allow_inf_nan=False)


class RoundAnalysis(StrictModel):
    round_number: int
    panel_summary: PanelRoundSummary | None = None
    agents: list[AgentRoundAnalysis]


class Answer(StrictModel):
    question_id: str
    text: str = Field(min_length=1)


class VersionRequest(StrictModel):
    expected_version: int = Field(ge=1)


class AnswersRequest(VersionRequest):
    answers: list[Answer] = Field(min_length=1)


class AgentEvaluation(StrictModel):
    agent_id: str
    agent_name: str
    scores: dict[str, float]
    weighted_score: float
    verdict: Literal["interested", "pass"]
    feedback: str
    speech_text: str = ""
    speech_audio: SpeechAudio | None = None


class Evaluation(StrictModel):
    overall_score: float
    verdict: Literal["interested", "pass"]
    criteria_scores: dict[str, float]
    agents: list[AgentEvaluation]
    speech_text: str = ""
    speech_audio: SpeechAudio | None = None


class SessionRead(StrictModel):
    id: str
    version: int
    status: Literal["ready_for_round", "awaiting_answers", "ready_for_evaluation", "completed"]
    ai_provider: Literal["demo", "openai_compatible"]
    config_revision: int
    config: SimulationConfig
    pitch: Pitch
    current_round: int
    questions: list[Question]
    round_analyses: list[RoundAnalysis]
    evaluation: Evaluation | None
    busy: bool
    created_at: datetime
    updated_at: datetime


class SessionCreated(SessionRead):
    session_token: str


class QuestionOutput(StrictModel):
    questions: list[str] = Field(min_length=1)


class OrchestratorOutput(StrictModel):
    round_objective: str = Field(min_length=1, max_length=1000)
    briefings: dict[str, str] = Field(min_length=1)


class RoundAnalysisOutput(StrictModel):
    summary: str = Field(min_length=1)
    strengths: list[str] = Field(min_length=1)
    concerns: list[str] = Field(min_length=1)
    recommendations: list[str] = Field(min_length=1)


class EvaluationOutput(StrictModel):
    scores: dict[str, float]
    feedback: str = Field(min_length=1)


class ErrorDetail(StrictModel):
    code: str
    message: str
    details: list[dict] | None = None


class ErrorResponse(StrictModel):
    error: ErrorDetail
    request_id: str
