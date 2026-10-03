# Shark Tank AI API

A Python 3.11+ FastAPI backend for a website where founders pitch a business and a configurable panel of AI investors cross-questions them. A configurable orchestrator plans each questioning round and privately briefs the six default investors before they ask. During question generation, agents share same-round context and optional web research snippets so they know what other agents are asking and can avoid overlap. When a round is fully answered, the agents generate coaching feedback so founders can tighten their real pitch. The API saves the pitch, panel configuration, interview transcript, round analyses, and final evaluation in SQLite. It uses an OpenAI-compatible Chat Completions adapter for your chosen provider.

## Run locally (PowerShell)

From this workspace:

```powershell
cd Coding/Backend
py -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
.venv/Scripts/python.exe -m uvicorn main:app --reload
```

The virtual environment and dependencies have already been created in this workspace. The server starts in **demo mode**: questions are deterministic templates and scores are placeholders. Demo mode makes no external AI calls. Interactive API documentation is at http://127.0.0.1:8000/docs; the OpenAPI schema is at `/openapi.json`.

## Connect your AI provider

Edit `.env`:

```dotenv
API_AI_PROVIDER=openai_compatible
API_AI_BASE_URL=https://your-provider.example/v1
API_AI_MODEL=your-provider-model
API_AI_API_KEY=your-provider-key
API_AI_JSON_MODE=true
API_AI_TOKEN_PARAMETER=max_tokens
API_TTS_ENABLED=true
API_TTS_BASE_URL=https://your-provider.example/v1
API_TTS_MODEL=your-tts-model
API_TTS_VOICE=your-voice
API_ADMIN_KEY=your-long-random-admin-secret
```

The base URL must include the provider's API prefix (commonly `/v1`); the backend appends `/chat/completions`. A key is optional for local providers that do not require authentication. Set `API_AI_JSON_MODE=false` if the provider does not support `response_format`. Set `API_AI_TOKEN_PARAMETER=max_completion_tokens` if required by the model. Set an agent's `temperature` to `null` to omit that parameter for models that do not support it. Provider/model feature support varies; no real provider call has been made during development.

When `API_TTS_ENABLED=true`, the backend also calls an OpenAI-compatible `POST /audio/speech` endpoint and stores MP3 files under `API_TTS_OUTPUT_DIR` (`generated_audio` by default). If `API_TTS_API_KEY` is blank, the backend reuses `API_AI_API_KEY`. If TTS generation fails, the API still returns `speech_text` and leaves `speech_audio` empty for that item.

The adapter uses JSON mode when enabled and independently validates all returned questions and scores. [Official OpenAI documentation on JSON output](https://developers.openai.com/api/docs/guides/structured-outputs) describes the request format; compatible providers implement their own feature subsets.

Deployment settings are read at process startup. Restart Uvicorn after changing `.env`; `--reload` does not necessarily watch that file. AI keys and provider URLs stay on the server and are excluded from public session/configuration responses.

## Configure the simulation

`simulation.example.json` contains a complete, editable configuration. For the first startup of a new database, set `API_CONFIG_FILE=simulation.example.json`. Relative paths resolve from the backend directory. Once a configuration exists in the database, update it through `PUT /api/v1/config`; changing the seed file does not replace saved configuration.

| Setting | Purpose |
| --- | --- |
| `orchestrator` | Lead AI moderator that plans each round and assigns private briefings to the investors. Disable it with `orchestrator.enabled = false`. |
| Orchestrator `id`, `name`, `role`, `instructions` | Identity and coordination behavior for the moderator. |
| Orchestrator `model`, `temperature`, `max_output_tokens` | Per-orchestrator generation settings. A null model uses `API_AI_MODEL`. |
| `agents` | The complete investor panel. The default panel has 6 agents: finance, market, product, strategy, technical and market research. Add or remove entries to change the number. |
| `difficulty_mode` | Agent pressure level: `friendly`, `normal`, `brutal`, or `investor_grade`. |
| Agent `id`, `name`, `role`, `instructions`, `expertise` | Identity and investor persona. IDs must be unique. |
| Agent `assertiveness`, `risk_tolerance` | Persona values from 0 to 1, passed to the model's instructions. |
| Agent `voting_weight` | Influence on the panel's final score. |
| Agent `web_access` | Enables or disables web snippets for that agent. |
| Agent `model`, `temperature`, `max_output_tokens` | Per-investor model and generation settings. A null model uses `API_AI_MODEL`. |
| `max_rounds`, `questions_per_agent` | Interview length and number of questions each investor asks per round. |
| `pitch_min_chars`, `pitch_max_chars`, `answer_max_chars` | Minimum summary length, total pitch text limit, and answer limit. |
| `question_max_chars`, `speech_text_max_chars`, `orchestrator_briefing_max_chars`, `round_analysis_text_max_chars`, `feedback_max_chars`, `history_max_chars` | Output limits, frontend speech text limit, and recent transcript budget sent to the model. |
| `round_analysis_points_per_section` | Number of strengths, concerns and recommendations each agent returns after a completed round. |
| `web_research_enabled`, `web_search_results_per_agent`, `web_context_max_chars` | Per-simulation web research toggle and limits. Deployment settings can also disable web access globally. |
| `ai_timeout_seconds`, `ai_retries`, `retry_backoff_seconds` | Per-call timeout, retry count and exponential retry backoff. Timeout includes waiting for a provider slot. |
| `score_min`, `score_max`, `investment_threshold` | Score scale and threshold for an `interested` verdict. |
| `criteria` | Arbitrary scoring dimensions, each with a unique ID, description and positive weight. |
| `question_instructions`, `evaluation_instructions` | Shared investor instructions for questioning and evaluation. |

Weights do not need to sum to one. Each investor's score is `sum(criterion score * criterion weight) / sum(criterion weights)`. The overall score and per-criterion panel scores use the same weighted average with investor voting weights. An `interested` verdict means the score reaches the configured threshold; it is a simulation result, not an actual investment commitment.

Read and update configuration:

```powershell
$config = Invoke-RestMethod http://127.0.0.1:8000/api/v1/config
$config.config.max_rounds = 4
$config.config.questions_per_agent = 2
$config.config.agents = @($config.config.agents[0], $config.config.agents[1])
$body = @{
    expected_revision = $config.revision
    config = $config.config
} | ConvertTo-Json -Depth 20
Invoke-RestMethod -Method Put -Uri http://127.0.0.1:8000/api/v1/config `
    -Headers @{ 'X-Admin-Key' = 'your-long-random-admin-secret' } `
    -ContentType application/json -Body $body
```

Configuration writes are disabled until `API_ADMIN_KEY` is set. A configuration update affects **new sessions only**; existing interviews keep their simulation settings and rubric. `agent_count` is derived from the agents list so it cannot disagree with the panel. Provider URL, credentials, JSON compatibility options, and the default model remain deployment settings.

Additional server settings use the `API_` prefix: `DATABASE_URL`, `TITLE`, `MAX_CONCURRENT_AI_CALLS` (per process), `OPERATION_LEASE_SLACK_SECONDS`, `MAX_REQUEST_BYTES`, `CLIENT_KEY`, `CORS_ORIGINS`, `LOG_LEVEL`, `DOCS_ENABLED`, `CONFIG_FILE`, `WEB_ACCESS_ENABLED`, `WEB_SEARCH_URL`, `WEB_TIMEOUT_SECONDS`, `TTS_ENABLED`, `TTS_BASE_URL`, `TTS_API_KEY`, `TTS_MODEL`, `TTS_VOICE`, `TTS_TIMEOUT_SECONDS`, and `TTS_OUTPUT_DIR`. JSON lists are used for CORS origins. Numeric minimums and type/ID/uniqueness checks are structural validation rules.

## Website workflow

All application routes are under `/api/v1`.

| Method and path | Purpose |
| --- | --- |
| `GET /config` | Read current defaults and configuration revision. |
| `PUT /config` | Admin configuration replacement with `expected_revision`. |
| `POST /sessions` | Submit business information and receive a private session token. |
| `GET /sessions/{id}` | Resume the interview and read the transcript/report. |
| `POST /sessions/{id}/rounds` | Have every investor generate the next set of questions. |
| `POST /sessions/{id}/answers` | Answer pending questions; completing a round also returns agent coaching. |
| `POST /sessions/{id}/evaluate` | Generate the final report after all configured rounds. |
| `DELETE /sessions/{id}?expected_version=N` | Remove the pitch, transcript and report. |
| `GET /health/live`, `GET /health/ready` | Process and database checks; readiness does not call the AI provider. |

Start with a pitch:

```json
{
  "business_name": "FreshBox",
  "summary": "A subscription service delivering affordable surplus produce from local farms.",
  "industry": "Food technology",
  "target_customers": "Urban families looking for affordable fresh produce",
  "revenue_model": "Monthly subscriptions",
  "traction": "50 paying pilot customers",
  "funding_ask": 50000,
  "equity_offered_percent": 10,
  "currency": "USD"
}
```

Only `business_name` and `summary` are required. Creation returns `id`, `version`, `session_token`, the configuration snapshot, and `status: ready_for_round`. Save `session_token`; it is returned only once. Send it as `X-Session-Token` on every subsequent session request.

Call `POST /sessions/{id}/rounds` with `{"expected_version": 1}` using the current returned version. The orchestrator first prepares the round objective and per-investor briefings; then the investors generate the questions. Each question includes `speech_text` for frontend text-to-speech playback, optional `speech_audio` with a protected MP3 URL when TTS is enabled, and can include `sources`, a short list of web snippets used by that agent. The result contains the panel's questions and changes status to `awaiting_answers`.

Submit answers using the version from that response:

```json
{
  "expected_version": 2,
  "answers": [
    { "question_id": "question-id-from-the-response", "text": "Our pilot shows a 35% gross margin." }
  ]
}
```

Partial answer batches are supported. Each partial answer increments the session version. Once all questions in the current round are answered, the agents generate a `round_analyses` entry with a `panel_summary`, strengths, concerns and recommendations for pitch rehearsal. Agent coaching and the panel summary both include `speech_text` and can include `speech_audio`. The status becomes `ready_for_round` or, after the final round, `ready_for_evaluation`. Generate the next round or call `/evaluate` with the current version. Evaluation returns `completed`, individual investor feedback, criterion scores, weighted scores, a panel verdict, final `speech_text`, and optional final MP3 audio.

To play an MP3, call the returned `speech_audio.url` with the same `X-Session-Token` header. Audio files are not public static assets.

The complete transcript is persisted. AI context includes the pitch and the most recent complete Q&A entries that fit `history_max_chars`; older entries remain available in the session API. Tiny history budgets may exclude all entries. The orchestrator first creates the round plan. Investors then generate questions in panel order, each receiving the shared round objective, every investor briefing, the questions already chosen by earlier agents in that same round, and web research snippets when web access is enabled. Web lookup is server-side, bounded by `web_search_results_per_agent` and `web_context_max_chars`, and failures return an empty snippet list instead of failing the interview. Round analysis and final evaluation calls still run concurrently up to the configured provider concurrency limit. Round analysis calls see the completed round and return coaching intended for practice before the founder gives the real pitch.

## Access and reliability

Each session has a random bearer token; only its hash is stored. Possession of that token grants access to that pitch. Send tokens in headers, keep them private, and use HTTPS for deployment. There is no account/login system in this backend. For a public website, connect it to your website's authentication and rate limits before serving paid AI calls. `API_CLIENT_KEY` can require a shared server credential on application routes; keep it in your website backend rather than shipping it in public browser code. Health routes remain public.

Admin changes require `X-Admin-Key` and, if configured, `X-API-Key`. CORS is an explicit origin allowlist. Request bodies are capped even for chunked requests. Responses use `Cache-Control: no-store`, server-generated `X-Request-ID`, and consistent errors:

```json
{
  "error": { "code": "version_conflict", "message": "Session changed; fetch its current version", "details": null },
  "request_id": "request-uuid"
}
```

`409` means a stale version/revision, wrong interview stage, or a busy session; fetch the current session/configuration before acting. `422` means invalid input. `502` means rejected or malformed provider output. `503` means a timeout or unavailable provider. Provider response bodies, private pitch inputs and credentials are excluded from errors and request logs.

Database leases prevent two workers from generating the same round simultaneously. Failed rounds/evaluations release the lease and leave the session unchanged. A crashed worker's lease expires so a later request can retry. Provider retries can incur additional charges; exactly-once external model billing is not guaranteed. Limits and leases coordinate session writes in the database; provider concurrency is per Uvicorn process.

SQLite tables are initialized on startup. Use a persistent database volume for deployment. SQLAlchemy supports changing `API_DATABASE_URL`; PostgreSQL requires installing its driver (for example `psycopg[binary]` with `postgresql+psycopg://...`). PostgreSQL has not been tested here. Future database schema changes should use migrations; startup initialization only creates missing tables.

## Code and verification

`main.py` exposes `app`. `app/application.py` owns startup, errors and middleware; `schemas.py` validates the contracts; `routes.py` exposes the API; `service.py` controls interview stages; `ai.py` adapts the provider; `repository.py` and `database.py` handle persistence.

```powershell
.venv/Scripts/python.exe -m pytest -q
.venv/Scripts/python.exe -m ruff check app main.py tests
.venv/Scripts/python.exe -m ruff format --check app main.py tests
```

Integration tests cover configurable panel sizes and scoring, follow-ups, configuration snapshots, access controls, partial answers, stale versions, persistence, concurrent requests, crashed-worker recovery, provider retries/malformed responses, and request limits. Provider calls are mocked; tests do not send paid AI requests.
