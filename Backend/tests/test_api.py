import asyncio
import json
import threading
from concurrent.futures import ThreadPoolExecutor

import httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import update

from app.application import create_app
from app.config import Settings
from app.database import PitchSession, utc_now

PITCH = {
    "business_name": "FreshBox",
    "summary": "A subscription service delivering affordable surplus produce from local farms.",
    "industry": "Food technology",
    "funding_ask": 50000,
    "equity_offered_percent": 10,
}


def settings(tmp_path, **overrides):
    values = dict(
        _env_file=None,
        database_url=f"sqlite:///{(tmp_path / 'test.db').as_posix()}",
        admin_key="admin-secret",
        client_key=None,
        ai_provider="demo",
        web_access_enabled=False,
    )
    return Settings(**(values | overrides))


@pytest.fixture
def client(tmp_path):
    with TestClient(create_app(settings(tmp_path))) as test_client:
        yield test_client


def configure(client, **changes):
    current = client.get("/api/v1/config").json()
    current["config"].update(changes)
    response = client.put(
        "/api/v1/config",
        json={
            "expected_revision": current["revision"],
            "config": current["config"],
        },
        headers={"X-Admin-Key": "admin-secret"},
    )
    assert response.status_code == 200, response.text
    return response.json()


def create_session(client):
    response = client.post("/api/v1/sessions", json=PITCH)
    assert response.status_code == 201, response.text
    result = response.json()
    headers = {"X-Session-Token": result.pop("session_token")}
    return result, headers


def next_round(client, session, headers):
    response = client.post(
        f"/api/v1/sessions/{session['id']}/rounds",
        json={"expected_version": session["version"]},
        headers=headers,
    )
    assert response.status_code == 200, response.text
    return response.json()


def answer_round(client, session, headers):
    response = client.post(
        f"/api/v1/sessions/{session['id']}/answers",
        headers=headers,
        json={
            "expected_version": session["version"],
            "answers": [
                {
                    "question_id": q["id"],
                    "text": "We have 50 paying customers and validated margins.",
                }
                for q in session["questions"]
                if q["answer"] is None
            ],
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_complete_configurable_workflow_and_delete(client):
    agents = client.get("/api/v1/config").json()["config"]["agents"][:2]
    configure(
        client,
        agents=agents,
        max_rounds=2,
        questions_per_agent=2,
        score_min=10,
        score_max=20,
        investment_threshold=14,
    )
    session, headers = create_session(client)
    assert session["ai_provider"] == "demo"
    assert session["config_revision"] == 2
    assert "token_hash" not in session
    session = next_round(client, session, headers)
    assert len(session["questions"]) == 4
    assert session["questions"][0]["speech_text"].startswith("Alex asks:")
    assert session["status"] == "awaiting_answers"
    session = answer_round(client, session, headers)
    assert len(session["round_analyses"]) == 1
    assert session["round_analyses"][0]["round_number"] == 1
    assert session["round_analyses"][0]["panel_summary"]["readiness_score"] == 50
    assert session["round_analyses"][0]["panel_summary"]["speech_text"]
    assert len(session["round_analyses"][0]["agents"]) == 2
    assert session["round_analyses"][0]["agents"][0]["speech_text"]
    assert session["round_analyses"][0]["agents"][0]["recommendations"]
    assert session["status"] == "ready_for_round"
    session = next_round(client, session, headers)
    assert len(session["questions"]) == 8
    assert all("50 paying customers" in q["text"] for q in session["questions"][4:])
    session = answer_round(client, session, headers)
    assert session["status"] == "ready_for_evaluation"
    response = client.post(
        f"/api/v1/sessions/{session['id']}/evaluate",
        headers=headers,
        json={"expected_version": session["version"]},
    )
    assert response.status_code == 200, response.text
    session = response.json()
    assert session["status"] == "completed"
    assert session["evaluation"]["overall_score"] == pytest.approx(15)
    assert session["evaluation"]["verdict"] == "interested"
    assert session["evaluation"]["speech_text"].startswith("Final panel verdict:")
    assert len(session["evaluation"]["agents"]) == 2
    assert session["evaluation"]["agents"][0]["speech_text"]
    path = f"/api/v1/sessions/{session['id']}"
    assert client.get(path, headers=headers).json() == session
    assert (
        client.delete(
            path, headers=headers, params={"expected_version": session["version"]}
        ).status_code
        == 204
    )
    assert client.get(path, headers=headers).status_code == 404


def test_configuration_snapshot_and_revision_conflicts(client):
    session, headers = create_session(client)
    original = client.get("/api/v1/config").json()
    configure(client, max_rounds=1, agents=original["config"]["agents"][:1])
    response = client.put(
        "/api/v1/config",
        headers={"X-Admin-Key": "admin-secret"},
        json={"expected_revision": original["revision"], "config": original["config"]},
    )
    assert response.status_code == 409
    stored = client.get(f"/api/v1/sessions/{session['id']}", headers=headers).json()
    assert stored["config"]["max_rounds"] == 3
    assert len(stored["config"]["agents"]) == 6
    new_session, _ = create_session(client)
    assert len(new_session["config"]["agents"]) == 1


@pytest.mark.parametrize(
    "change",
    [
        {"agents": []},
        {"questions_per_agent": 0},
        {"max_rounds": 0},
        {"score_min": 10, "score_max": 10},
        {"investment_threshold": 11},
        {"pitch_min_chars": 100, "pitch_max_chars": 20},
    ],
)
def test_invalid_configuration_rejected(client, change):
    current = client.get("/api/v1/config").json()
    current["config"].update(change)
    response = client.put(
        "/api/v1/config",
        headers={"X-Admin-Key": "admin-secret"},
        json={"expected_revision": current["revision"], "config": current["config"]},
    )
    assert response.status_code == 422
    assert client.get("/api/v1/config").json()["revision"] == 1


def test_admin_and_session_access(client, tmp_path):
    current = client.get("/api/v1/config").json()
    payload = {"expected_revision": 1, "config": current["config"]}
    assert client.put("/api/v1/config", json=payload).status_code == 403
    assert (
        client.put("/api/v1/config", json=payload, headers={"X-Admin-Key": "wrong"}).status_code
        == 403
    )
    session, headers = create_session(client)
    path = f"/api/v1/sessions/{session['id']}"
    assert client.get(path).status_code == 401
    assert client.get(path, headers={"X-Session-Token": "wrong"}).status_code == 403
    assert "session_token" not in client.get(path, headers=headers).json()
    with TestClient(
        create_app(settings(tmp_path, client_key="client-secret", admin_key=None))
    ) as restricted:
        assert restricted.get("/api/v1/config").status_code == 401
        assert restricted.get("/health/live").status_code == 200
        assert (
            restricted.put(
                "/api/v1/config", headers={"X-API-Key": "client-secret"}, json=payload
            ).status_code
            == 403
        )


def test_versions_state_and_partial_answers(client):
    session, headers = create_session(client)
    base = f"/api/v1/sessions/{session['id']}"
    assert (
        client.post(base + "/evaluate", headers=headers, json={"expected_version": 1}).status_code
        == 409
    )
    session = next_round(client, session, headers)
    assert (
        client.post(base + "/rounds", headers=headers, json={"expected_version": 1}).status_code
        == 409
    )
    assert (
        client.post(
            base + "/rounds", headers=headers, json={"expected_version": session["version"]}
        ).status_code
        == 409
    )
    q = session["questions"][0]
    payload = {
        "expected_version": session["version"],
        "answers": [{"question_id": q["id"], "text": "Evidence"}],
    }
    duplicated = payload | {"answers": payload["answers"] * 2}
    assert client.post(base + "/answers", headers=headers, json=duplicated).status_code == 422
    result = client.post(base + "/answers", headers=headers, json=payload)
    assert result.status_code == 200
    session = result.json()
    assert session["status"] == "awaiting_answers"
    payload["expected_version"] = session["version"]
    assert client.post(base + "/answers", headers=headers, json=payload).status_code == 422
    payload["answers"][0]["question_id"] = "other-session-question"
    assert client.post(base + "/answers", headers=headers, json=payload).status_code == 422
    session = answer_round(client, session, headers)
    assert session["status"] == "ready_for_round"


def test_validation_limits_docs_health_and_privacy(client):
    assert client.get("/health/live").status_code == 200
    assert client.get("/health/ready").status_code == 200
    schema = client.get("/openapi.json").json()
    assert "/api/v1/sessions/{session_id}/rounds" in schema["paths"]
    assert "SessionToken" in schema["components"]["securitySchemes"]
    configure(client, pitch_min_chars=30, answer_max_chars=4)
    assert client.post("/api/v1/sessions", json=PITCH | {"summary": "too short"}).status_code == 422
    response = client.post("/api/v1/sessions", json=PITCH | {"private_extra": "secret-pitch-data"})
    assert response.status_code == 422
    assert "secret-pitch-data" not in response.text
    assert response.json()["request_id"] == response.headers["X-Request-ID"]
    session, headers = create_session(client)
    session = next_round(client, session, headers)
    response = client.post(
        f"/api/v1/sessions/{session['id']}/answers",
        headers=headers,
        json={
            "expected_version": session["version"],
            "answers": [{"question_id": session["questions"][0]["id"], "text": "too long"}],
        },
    )
    assert response.status_code == 422
    assert response.headers["Cache-Control"] == "no-store"
    assert client.get("/missing").json()["error"]["code"] == "http_error"


def test_chunked_request_body_limit_and_cors(tmp_path):
    with TestClient(
        create_app(
            settings(tmp_path, max_request_bytes=1024, cors_origins=["http://localhost:3000"])
        )
    ) as client:
        response = client.post(
            "/api/v1/sessions",
            content=iter([b"x" * 600, b"x" * 600]),
            headers={"Origin": "http://localhost:3000"},
        )
        assert response.status_code == 413
        assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:3000"
        assert response.json()["request_id"] == response.headers["X-Request-ID"]


def provider_client(tmp_path, handler):
    return TestClient(
        create_app(
            settings(
                tmp_path,
                ai_provider="openai_compatible",
                ai_model="provider-model",
                ai_base_url="https://provider.example/v1",
                ai_api_key="provider-secret",
            ),
            ai_transport=httpx.MockTransport(handler),
        )
    )


def chat_response(payload):
    return httpx.Response(
        200,
        json={"choices": [{"finish_reason": "stop", "message": {"content": json.dumps(payload)}}]},
    )


def is_orchestrator_request(request):
    body = json.loads(request.content)
    return "lead investor orchestrating" in body["messages"][0]["content"]


def is_question_request(request):
    body = json.loads(request.content)
    return "only 'questions'" in body["messages"][0]["content"]


def is_round_analysis_request(request):
    body = json.loads(request.content)
    return "final coaching response" in body["messages"][0]["content"]


def orchestrator_payload(*agent_ids):
    return {
        "round_objective": "Probe the riskiest assumptions this round.",
        "briefings": {agent_id: f"Briefing for {agent_id}" for agent_id in agent_ids},
    }


def round_analysis_payload():
    return {
        "summary": "The pitch answer was specific enough to coach.",
        "strengths": ["Clear traction evidence", "Direct margin answer", "Simple next milestone"],
        "concerns": [
            "Needs stronger retention data",
            "Valuation support is thin",
            "CAC is unclear",
        ],
        "recommendations": [
            "Lead with the strongest customer metric",
            "Prepare a crisp unit economics answer",
            "Tie funding use to one measurable milestone",
        ],
    }


def single_agent_config(client, **extra):
    agent = client.get("/api/v1/config").json()["config"]["agents"][0]
    return configure(client, agents=[agent], max_rounds=1, retry_backoff_seconds=0, **extra)


def test_provider_wire_format_and_retry(tmp_path):
    requests = []

    def handler(request):
        requests.append(request)
        if len(requests) == 1:
            return httpx.Response(429, json={"error": "busy"})
        if is_orchestrator_request(request):
            return chat_response(orchestrator_payload("finance"))
        return chat_response({"questions": ["What are your validated unit economics?"]})

    with provider_client(tmp_path, handler) as client:
        single_agent_config(client)
        session, headers = create_session(client)
        session = next_round(client, session, headers)
        assert session["ai_provider"] == "openai_compatible"
        assert len(requests) == 3
        request = requests[-1]
        body = json.loads(request.content)
        assert str(request.url) == "https://provider.example/v1/chat/completions"
        assert request.headers["Authorization"] == "Bearer provider-secret"
        assert body["model"] == "provider-model"
        assert body["max_tokens"] == 2000
        assert body["response_format"] == {"type": "json_object"}
        assert body["messages"][0]["role"] == "system"
        assert "Briefing for finance" in body["messages"][0]["content"]
        context = json.loads(body["messages"][1]["content"])
        assert context["pitch"]["business_name"] == "FreshBox"
        assert context["shared_round"]["panel_briefings"] == {"finance": "Briefing for finance"}
        assert "provider-secret" not in json.dumps(session)


def test_web_research_context_is_sent_to_agents(tmp_path):
    contexts = []
    searches = []

    def handler(request):
        if request.method == "GET":
            searches.append(request)
            return httpx.Response(
                200,
                json={
                    "Heading": "FreshBox market",
                    "AbstractText": "Surplus produce subscriptions compete on affordability.",
                    "AbstractURL": "https://example.com/freshbox-market",
                },
            )
        body = json.loads(request.content)
        contexts.append(json.loads(body["messages"][1]["content"]))
        if "lead investor orchestrating" in body["messages"][0]["content"]:
            return chat_response(orchestrator_payload("finance"))
        return chat_response({"questions": ["How does current market evidence change your plan?"]})

    with TestClient(
        create_app(
            settings(
                tmp_path,
                ai_provider="openai_compatible",
                ai_model="provider-model",
                ai_base_url="https://provider.example/v1",
                web_access_enabled=True,
                web_search_url="https://search.example/",
            ),
            ai_transport=httpx.MockTransport(handler),
        )
    ) as client:
        single_agent_config(client)
        session, headers = create_session(client)
        session = next_round(client, session, headers)
        assert searches
        assert "FreshBox" in str(searches[0].url)
        question_context = contexts[-1]
        assert question_context["web_research"] == [
            {
                "title": "FreshBox market",
                "snippet": "Surplus produce subscriptions compete on affordability.",
                "source_url": "https://example.com/freshbox-market",
            }
        ]
        assert (
            session["questions"][0]["text"] == "How does current market evidence change your plan?"
        )
        assert session["questions"][0]["sources"] == question_context["web_research"]


def test_tts_mp3_is_generated_and_private(tmp_path):
    tts_requests = []

    def handler(request):
        if str(request.url).endswith("/audio/speech"):
            tts_requests.append(json.loads(request.content))
            return httpx.Response(200, content=b"fake-mp3", headers={"Content-Type": "audio/mpeg"})
        if is_orchestrator_request(request):
            return chat_response(orchestrator_payload("finance"))
        return chat_response({"questions": ["What proof supports your pricing?"]})

    with TestClient(
        create_app(
            settings(
                tmp_path,
                ai_provider="openai_compatible",
                ai_model="provider-model",
                ai_base_url="https://provider.example/v1",
                tts_enabled=True,
                tts_base_url="https://provider.example/v1",
                tts_model="tts-model",
                tts_voice="voice-a",
                tts_output_dir=tmp_path / "audio",
            ),
            ai_transport=httpx.MockTransport(handler),
        )
    ) as client:
        single_agent_config(client)
        session, headers = create_session(client)
        session = next_round(client, session, headers)
        audio = session["questions"][0]["speech_audio"]
        assert audio["media_type"] == "audio/mpeg"
        assert audio["url"].endswith(".mp3")
        assert tts_requests[0]["model"] == "tts-model"
        assert tts_requests[0]["voice"] == "voice-a"
        assert "Alex asks:" in tts_requests[0]["input"]
        assert client.get(audio["url"]).status_code == 401
        response = client.get(audio["url"], headers=headers)
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("audio/mpeg")
        assert response.content == b"fake-mp3"


@pytest.mark.parametrize(
    "response",
    [
        httpx.Response(401, json={"error": "secret-provider-detail"}),
        httpx.Response(200, json={"choices": [None]}),
        httpx.Response(200, json={"choices": [{"message": {"content": "not json"}}]}),
        httpx.Response(
            200, json={"choices": [{"message": {"content": '{"questions":["a","b"]}'}}]}
        ),
        httpx.Response(
            200,
            json={
                "choices": [
                    {"finish_reason": "length", "message": {"content": '{"questions":["a"]}'}}
                ]
            },
        ),
    ],
)
def test_provider_failure_keeps_round_retryable(tmp_path, response):
    with provider_client(tmp_path, lambda request: response) as client:
        single_agent_config(client, ai_retries=0)
        session, headers = create_session(client)
        base = f"/api/v1/sessions/{session['id']}"
        result = client.post(base + "/rounds", headers=headers, json={"expected_version": 1})
        assert result.status_code == 502
        assert "secret-provider-detail" not in result.text
        stored = client.get(base, headers=headers).json()
        assert stored["current_round"] == 0
        assert stored["questions"] == []
        assert stored["busy"] is False
        assert stored["version"] == 1


def test_weighted_evaluation_and_context(tmp_path):
    contexts = []

    def handler(request):
        body = json.loads(request.content)
        contexts.append(json.loads(body["messages"][1]["content"]))
        if "lead investor orchestrating" in body["messages"][0]["content"]:
            result = orchestrator_payload("finance", "market")
        elif "'questions'" in body["messages"][0]["content"]:
            finance = '"id": "finance"' in body["messages"][0]["content"]
            result = {
                "questions": [
                    "What evidence supports your margins?"
                    if finance
                    else "How will you defend customer demand?"
                ]
            }
        elif "final coaching response" in body["messages"][0]["content"]:
            result = round_analysis_payload()
        else:
            finance = '"id": "finance"' in body["messages"][0]["content"]
            result = {
                "scores": {"demand": 8 if finance else 4, "profit": 6 if finance else 2},
                "feedback": "Validate acquisition costs with a paid pilot.",
            }
        return httpx.Response(
            200,
            json={
                "choices": [{"finish_reason": "stop", "message": {"content": json.dumps(result)}}]
            },
        )

    with provider_client(tmp_path, handler) as client:
        agents = client.get("/api/v1/config").json()["config"]["agents"][:2]
        agents[0]["voting_weight"] = 3
        agents[1]["voting_weight"] = 1
        configure(
            client,
            agents=agents,
            max_rounds=1,
            investment_threshold=6,
            criteria=[
                {"id": "demand", "name": "Demand", "description": "Customer demand", "weight": 1},
                {"id": "profit", "name": "Profit", "description": "Margins", "weight": 3},
            ],
        )
        session, headers = create_session(client)
        session = answer_round(client, next_round(client, session, headers), headers)
        result = client.post(
            f"/api/v1/sessions/{session['id']}/evaluate",
            headers=headers,
            json={"expected_version": session["version"]},
        )
        assert result.status_code == 200, result.text
        report = result.json()["evaluation"]
        assert report["overall_score"] == pytest.approx(5.5)
        assert report["criteria_scores"] == {"demand": 7, "profit": 5}
        assert report["verdict"] == "pass"
        assert report["agents"][0]["verdict"] == "interested"
        assert session["round_analyses"][0]["agents"][0]["summary"]
        question_contexts = [context for context in contexts if "shared_round" in context]
        assert question_contexts[0]["shared_round"]["questions_already_chosen_this_round"] == []
        assert question_contexts[1]["shared_round"]["questions_already_chosen_this_round"] == [
            {
                "agent_id": "finance",
                "agent_name": "Alex",
                "questions": ["What evidence supports your margins?"],
            }
        ]
        assert any(q["answer"] for q in contexts[-1]["history"])


def test_concurrent_rounds_are_rejected(tmp_path):
    started = threading.Event()
    unblock = threading.Event()
    calls = []

    async def handler(request):
        calls.append(request)
        if is_orchestrator_request(request):
            started.set()
            await asyncio.to_thread(unblock.wait, 5)
            return chat_response(orchestrator_payload("finance"))
        return chat_response({"questions": ["What is your revenue?"]})

    with provider_client(tmp_path, handler) as client:
        single_agent_config(client)
        session, headers = create_session(client)
        base = f"/api/v1/sessions/{session['id']}"
        with ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(
                client.post, base + "/rounds", headers=headers, json={"expected_version": 1}
            )
            try:
                assert started.wait(5)
                assert client.get(base, headers=headers).json()["busy"] is True
                result = client.post(
                    base + "/rounds", headers=headers, json={"expected_version": 1}
                )
                assert result.status_code == 409
                assert (
                    client.delete(base, headers=headers, params={"expected_version": 1}).status_code
                    == 409
                )
                assert len(calls) == 1
            finally:
                unblock.set()
            assert future.result(timeout=5).status_code == 200


def test_expired_operation_lease_can_recover(client):
    session, headers = create_session(client)
    with client.app.state.repository.session_factory() as db:
        db.execute(
            update(PitchSession)
            .where(PitchSession.id == session["id"])
            .values(
                operation_id="crashed-operation",
                lease_until=utc_now(),
            )
        )
        db.commit()
    assert next_round(client, session, headers)["status"] == "awaiting_answers"


def test_configuration_and_session_survive_restart(tmp_path):
    with TestClient(create_app(settings(tmp_path))) as client:
        configure(client, max_rounds=1)
        session, headers = create_session(client)
        session = next_round(client, session, headers)
    with TestClient(create_app(settings(tmp_path))) as client:
        assert client.get("/api/v1/config").json()["config"]["max_rounds"] == 1
        stored = client.get(f"/api/v1/sessions/{session['id']}", headers=headers).json()
        assert stored == session


def test_seed_file_is_only_read_for_new_database(tmp_path):
    seed = tmp_path / "seed.json"
    seed.write_text('{"max_rounds": 2}', encoding="utf-8")
    with TestClient(create_app(settings(tmp_path, config_file=seed))) as client:
        assert client.get("/api/v1/config").json()["config"]["max_rounds"] == 2
    seed.write_text("invalid seed contents", encoding="utf-8")
    with TestClient(create_app(settings(tmp_path, config_file=seed))) as client:
        assert client.get("/api/v1/config").json()["config"]["max_rounds"] == 2


def test_provider_timeout_releases_session_for_retry(tmp_path):
    async def handler(request):
        await asyncio.sleep(1)
        return httpx.Response(200, json={})

    with provider_client(tmp_path, handler) as client:
        single_agent_config(client, ai_timeout_seconds=0.01, ai_retries=0)
        session, headers = create_session(client)
        base = f"/api/v1/sessions/{session['id']}"
        result = client.post(base + "/rounds", headers=headers, json={"expected_version": 1})
        assert result.status_code == 503
        assert result.json()["error"]["code"] == "ai_unavailable"
        stored = client.get(base, headers=headers).json()
        assert stored["busy"] is False
        assert stored["version"] == 1
        assert stored["questions"] == []


def test_invalid_evaluation_does_not_lose_answers(tmp_path):
    def handler(request):
        body = json.loads(request.content)
        if "lead investor orchestrating" in body["messages"][0]["content"]:
            result = orchestrator_payload("finance")
        elif "'questions'" in body["messages"][0]["content"]:
            result = {"questions": ["What is your revenue?"]}
        elif "final coaching response" in body["messages"][0]["content"]:
            result = round_analysis_payload()
        else:
            result = {"scores": {"wrong_criterion": 999}, "feedback": "Bad output"}
        return httpx.Response(200, json={"choices": [{"message": {"content": json.dumps(result)}}]})

    with provider_client(tmp_path, handler) as client:
        single_agent_config(client)
        session, headers = create_session(client)
        session = answer_round(client, next_round(client, session, headers), headers)
        base = f"/api/v1/sessions/{session['id']}"
        result = client.post(
            base + "/evaluate", headers=headers, json={"expected_version": session["version"]}
        )
        assert result.status_code == 502
        stored = client.get(base, headers=headers).json()
        assert stored["status"] == "ready_for_evaluation"
        assert stored["evaluation"] is None
        assert stored["questions"] == session["questions"]
        assert stored["version"] == session["version"]
        assert stored["busy"] is False
