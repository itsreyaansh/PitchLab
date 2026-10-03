export type PageRoute = 
  | 'dashboard'
  | 'new-pitch'
  | 'brief-review'
  | 'pitch-setup'
  | 'live-room'
  | 'evaluation-processing'
  | 'evaluation-report'
  | 'agent-insights'
  | 'sessions'
  | 'session-detail'
  | 'insights'
  | 'settings';

export type PitchPhase = 'Pitch' | 'Discovery' | 'Cross Exam' | 'Pressure' | 'Final';

export type JudgeRole = 
  | 'Market Analyst'
  | 'Product & Technology'
  | 'Finance & Business'
  | 'Growth & Marketing'
  | 'Operations & Scale'
  | 'Investor & Risk';

export type ExpressionState = 'neutral' | 'listening' | 'curious' | 'concerned' | 'interested' | 'challenging' | 'acknowledging';

export type JudgeState = 'IDLE' | 'LISTENING' | 'ANALYZING' | 'SELECTED' | 'SPEAKING' | 'INTERRUPTED' | 'COMPLETED';

export interface AIJudge {
  id: string;
  name: string;
  role: JudgeRole;
  shortRole: string;
  tagline: string;
  avatarColor: string;
  accentHex: string;
  voiceGender: 'male' | 'female';
  voicePitch: number;
  voiceRate: number;
  voiceName?: string;
  bio: string;
  keyFocus: string[];
  expression: ExpressionState;
  state: JudgeState;
  avatarVariant: 'aarav' | 'maya' | 'rohan' | 'naina' | 'kabir' | 'vikram';
}

export interface StartupBrief {
  id: string;
  startupName: string;
  tagline: string;
  problem: string;
  solution: string;
  targetCustomer: string;
  marketSize: string;
  businessModel: string;
  revenueModel: string;
  pricing: string;
  traction: string;
  competition: string;
  competitiveAdvantage: string;
  team: string;
  fundingAsk: string;
  useOfFunds: string;
  growthStrategy: string;
  rawText?: string;
}

/* ==========================================
   Shark Tank AI OpenAPI 3.1 Schemas
   ========================================== */

export interface HealthStatus {
  live: boolean;
  ready: boolean;
}

export interface PitchPayload {
  business_name: string;
  summary: string;
  industry?: string | null;
  target_customers?: string | null;
  revenue_model?: string | null;
  traction?: string | null;
  funding_ask?: number | null;
  equity_offered_percent?: number | null;
  currency?: string;
  metrics?: Record<string, any>;
}

export interface SpeechAudio {
  url: string;
  filename: string;
  media_type: 'audio/mpeg';
}

export interface Question {
  id: string;
  agent_id: string;
  agent_name: string;
  round_number: number;
  text: string;
  speech_text: string;
  speech_audio?: SpeechAudio | null;
  sources?: Array<{ title: string; snippet: string; source_url?: string | null }>;
  answer?: string | null;
}

export interface Answer {
  question_id: string;
  text: string;
}

export interface AnswersRequest {
  expected_version: number;
  answers: Answer[];
}

export interface AgentRoundAnalysis {
  agent_id: string;
  agent_name: string;
  round_number: number;
  summary: string;
  speech_text: string;
  speech_audio?: SpeechAudio | null;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

export interface RoundAnalysis {
  round_number: number;
  panel_summary?: {
    summary: string;
    speech_text: string;
    speech_audio?: SpeechAudio | null;
    top_strengths: string[];
    top_concerns: string[];
    next_steps: string[];
    readiness_score: number;
  } | null;
  agents: AgentRoundAnalysis[];
}

export interface AgentEvaluation {
  agent_id: string;
  agent_name: string;
  role: string;
  score: number;
  decision: 'INVEST' | 'PASS' | 'CONDITIONAL';
  feedback: string;
  strengths: string[];
  concerns: string[];
}

export interface Evaluation {
  overall_score: number;
  verdict: 'interested' | 'pass';
  criteria_scores: Record<string, number>;
  agents: Array<{
    agent_id: string;
    agent_name: string;
    scores: Record<string, number>;
    weighted_score: number;
    verdict: 'interested' | 'pass';
    feedback: string;
    speech_text: string;
    speech_audio?: SpeechAudio | null;
  }>;
  speech_text: string;
  speech_audio?: SpeechAudio | null;
}

export interface SessionRead {
  id: string;
  version: number;
  status: 'ready_for_round' | 'awaiting_answers' | 'ready_for_evaluation' | 'completed';
  ai_provider: 'demo' | 'openai_compatible';
  config_revision: number;
  config: SimulationConfig;
  created_at: string;
  updated_at: string;
  pitch: PitchPayload;
  current_round: number;
  questions: Question[];
  round_analyses: RoundAnalysis[];
  evaluation?: Evaluation | null;
  busy: boolean;
}

export interface SessionCreated extends SessionRead {
  session_token: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  instructions: string;
  expertise: string[];
  assertiveness: number;
  risk_tolerance: number;
  voting_weight: number;
  web_access: boolean;
  model?: string | null;
  temperature?: number | null;
  max_output_tokens: number;
}

export interface CriterionConfig {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface OrchestratorConfig {
  enabled: boolean;
  id: string;
  name: string;
  role: string;
  instructions: string;
  model?: string | null;
  temperature?: number | null;
  max_output_tokens: number;
}

export interface SimulationConfig {
  orchestrator: OrchestratorConfig;
  agents: AgentConfig[];
  difficulty_mode: 'friendly' | 'normal' | 'brutal' | 'investor_grade';
  max_rounds: number;
  questions_per_agent: number;
  pitch_min_chars: number;
  pitch_max_chars: number;
  answer_max_chars: number;
  question_max_chars: number;
  speech_text_max_chars: number;
  orchestrator_briefing_max_chars: number;
  round_analysis_text_max_chars: number;
  round_analysis_points_per_section: number;
  feedback_max_chars: number;
  history_max_chars: number;
  web_research_enabled: boolean;
  web_search_results_per_agent: number;
  web_context_max_chars: number;
  ai_timeout_seconds: number;
  ai_retries: number;
  retry_backoff_seconds: number;
  score_min: number;
  score_max: number;
  investment_threshold: number;
  criteria: CriterionConfig[];
  question_instructions: string;
  evaluation_instructions: string;
}

export interface ConfigRead {
  revision: number;
  agent_count: number;
  config: SimulationConfig;
}

/* Legacy UI Data Interfaces maintained for UI rendering compatibility */
export interface TranscriptItem {
  id: string;
  timestamp: string;
  speakerId: string;
  speakerName: string;
  speakerRole?: string;
  text: string;
  phase: PitchPhase;
  isContradiction?: boolean;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  keyIssue: string;
  status: 'strong' | 'moderate' | 'critical';
}

export interface ContradictionItem {
  id: string;
  title: string;
  earlierStatement: string;
  laterStatement: string;
  calculation: string;
  whyItMatters: string;
  category: string;
}

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
}

export interface ImprovementItem {
  id: string;
  category: string;
  title: string;
  evidence: string;
  improveBy: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UnansweredQuestion {
  id: string;
  index: number;
  question: string;
  judgeRole: string;
  whyImportant: string;
}

export interface NextPitchChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

export interface JudgeInsight {
  judgeId: string;
  judgeName: string;
  role: string;
  score: number;
  strengths: string[];
  concerns: string[];
  questionsAsked: number;
  missingInfo: string[];
}

export interface EvaluationReport {
  sessionId: string;
  startupName: string;
  tagline: string;
  date: string;
  duration: string;
  overallScore: number;
  questionsCount: number;
  agentCount: number;
  categoryScores: CategoryScore[];
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  contradictions: ContradictionItem[];
  unansweredQuestions: UnansweredQuestion[];
  nextPitchChecklist: NextPitchChecklistItem[];
  judgeInsights: JudgeInsight[];
}

export interface PitchSession {
  id: string;
  startupName: string;
  tagline: string;
  date: string;
  duration: string;
  overallScore: number;
  brief: StartupBrief;
  status: 'completed' | 'draft';
  categoryHighlights: {
    finance: number;
    market: number;
    product: number;
    communication: number;
  };
}

export interface PitchSetupOptions {
  durationMinutes: number;
  difficulty: 'Adaptive' | 'Normal' | 'Hardcore';
  intensity: 'Gentle' | 'Balanced' | 'Aggressive';
  pressureRound: boolean;
}

