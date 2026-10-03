import {
  Answer,
  ConfigRead,
  HealthStatus,
  PitchPayload,
  SessionCreated,
  SessionRead,
  SimulationConfig,
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
const API_CLIENT_KEY = (import.meta as any).env?.VITE_API_CLIENT_KEY || '';
const API_ADMIN_KEY = (import.meta as any).env?.VITE_API_ADMIN_KEY || '';

const SESSION_TOKEN_PREFIX = 'pitchroom.session_token.';
const LATEST_SESSION_ID_KEY = 'pitchroom.latest_session_id';

export function parseMoneyAmount(value?: string): number | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/,/g, '');
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  let amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  if (normalized.includes('b')) amount *= 1_000_000_000;
  else if (normalized.includes('m')) amount *= 1_000_000;
  else if (normalized.includes('k')) amount *= 1_000;
  return amount;
}

export function parsePercent(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const percent = Number(match[1]);
  return Number.isFinite(percent) ? percent : null;
}

class ApiClient {
  private get sessionStorageAvailable() {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  }

  private rememberSession(session: SessionCreated) {
    if (!this.sessionStorageAvailable) return;
    window.localStorage.setItem(`${SESSION_TOKEN_PREFIX}${session.id}`, session.session_token);
    window.localStorage.setItem(LATEST_SESSION_ID_KEY, session.id);
  }

  getLatestSessionId(): string | null {
    if (!this.sessionStorageAvailable) return null;
    return window.localStorage.getItem(LATEST_SESSION_ID_KEY);
  }

  getSessionToken(sessionId: string): string | null {
    if (!this.sessionStorageAvailable) return null;
    return window.localStorage.getItem(`${SESSION_TOKEN_PREFIX}${sessionId}`);
  }

  private headers(extra: HeadersInit = {}): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(API_CLIENT_KEY ? { 'X-API-Key': API_CLIENT_KEY } : {}),
      ...extra,
    };
  }

  private sessionHeaders(sessionId: string, extra: HeadersInit = {}): HeadersInit {
    const token = this.getSessionToken(sessionId);
    if (!token) {
      throw new Error('Missing session token. Start a new pitch session first.');
    }
    return this.headers({
      'X-Session-Token': token,
      ...extra,
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: this.headers(options.headers),
    });

    if (!response.ok) {
      let message = `API Error ${response.status}: ${response.statusText}`;
      try {
        const body = await response.json();
        message = body?.error?.message || message;
      } catch {
        // Keep the status-text error when the response is not JSON.
      }
      throw new Error(message);
    }

    return await response.json();
  }

  async getHealth(): Promise<HealthStatus> {
    const [live, ready] = await Promise.all([
      this.request<{ status: string }>('/health/live'),
      this.request<{ status: string }>('/health/ready'),
    ]);
    return { live: live.status === 'ok', ready: ready.status === 'ready' };
  }

  async getConfig(): Promise<ConfigRead> {
    return await this.request<ConfigRead>('/api/v1/config');
  }

  async updateConfig(configOrRead: SimulationConfig | ConfigRead): Promise<ConfigRead> {
    const configRead = 'config' in configOrRead && 'revision' in configOrRead
      ? configOrRead
      : await this.getConfig();
    const config = 'config' in configOrRead && 'revision' in configOrRead
      ? configOrRead.config
      : configOrRead;

    return await this.request<ConfigRead>('/api/v1/config', {
      method: 'PUT',
      headers: this.headers(API_ADMIN_KEY ? { 'X-Admin-Key': API_ADMIN_KEY } : {}),
      body: JSON.stringify({
        expected_revision: configRead.revision,
        config,
      }),
    });
  }

  async createSession(pitch: PitchPayload): Promise<SessionCreated> {
    const session = await this.request<SessionCreated>('/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify({
        currency: 'USD',
        ...pitch,
      }),
    });
    this.rememberSession(session);
    return session;
  }

  async getSession(sessionId: string): Promise<SessionRead> {
    const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${sessionId}`, {
      headers: this.sessionHeaders(sessionId),
    });
    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async deleteSession(sessionId: string, expectedVersion: number): Promise<{ success: boolean }> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/sessions/${sessionId}?expected_version=${expectedVersion}`,
      {
        method: 'DELETE',
        headers: this.sessionHeaders(sessionId),
      },
    );
    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    return { success: true };
  }

  async nextRound(session: Pick<SessionRead, 'id' | 'version'>): Promise<SessionRead> {
    const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${session.id}/rounds`, {
      method: 'POST',
      headers: this.sessionHeaders(session.id),
      body: JSON.stringify({ expected_version: session.version }),
    });
    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async submitAnswers(
    session: Pick<SessionRead, 'id' | 'version'>,
    answers: Answer[],
  ): Promise<SessionRead> {
    const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${session.id}/answers`, {
      method: 'POST',
      headers: this.sessionHeaders(session.id),
      body: JSON.stringify({
        expected_version: session.version,
        answers,
      }),
    });
    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async evaluateSession(session: Pick<SessionRead, 'id' | 'version'>): Promise<SessionRead> {
    const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${session.id}/evaluate`, {
      method: 'POST',
      headers: this.sessionHeaders(session.id),
      body: JSON.stringify({ expected_version: session.version }),
    });
    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    return await response.json();
  }
}

export const apiClient = new ApiClient();
