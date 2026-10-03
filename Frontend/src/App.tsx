import React, { useState } from 'react';
import { PageRoute, StartupBrief, PitchSession, PitchSetupOptions } from './types';
import { SAMPLE_BRIEF, MOCK_PITCH_SESSIONS } from './data/mockData';
import { AppShell } from './components/layout/AppShell';

// Page Components
import { DashboardPage } from './pages/DashboardPage';
import { NewPitchPage } from './pages/NewPitchPage';
import { BriefReviewPage } from './pages/BriefReviewPage';
import { PitchSetupPage } from './pages/PitchSetupPage';
import { LiveRoomPage } from './pages/LiveRoomPage';
import { EvaluationProcessingPage } from './pages/EvaluationProcessingPage';
import { EvaluationReportPage } from './pages/EvaluationReportPage';
import { AgentInsightsPage } from './pages/AgentInsightsPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { InsightsAnalyticsPage } from './pages/InsightsAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('dashboard');
  const [accentColor, setAccentColor] = useState<string>('#10B981');
  const [currentBrief, setCurrentBrief] = useState<StartupBrief>(SAMPLE_BRIEF);
  const [selectedSession, setSelectedSession] = useState<PitchSession | null>(MOCK_PITCH_SESSIONS[0]);
  const [setupOptions, setSetupOptions] = useState<PitchSetupOptions>({
    durationMinutes: 5,
    difficulty: 'Adaptive',
    intensity: 'Balanced',
    pressureRound: true
  });

  const renderPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setCurrentRoute}
            onSelectSession={(s) => {
              setSelectedSession(s);
              setCurrentRoute('session-detail');
            }}
          />
        );

      case 'new-pitch':
        return (
          <NewPitchPage
            onNavigate={setCurrentRoute}
            onSetBrief={setCurrentBrief}
          />
        );

      case 'brief-review':
        return (
          <BriefReviewPage
            brief={currentBrief}
            onNavigate={setCurrentRoute}
            onUpdateBrief={setCurrentBrief}
          />
        );

      case 'pitch-setup':
        return (
          <PitchSetupPage
            onNavigate={setCurrentRoute}
            onStartPitch={setSetupOptions}
          />
        );

      case 'live-room':
        return (
          <LiveRoomPage
            brief={currentBrief}
            onNavigate={setCurrentRoute}
            onCompleteSession={() => {}}
          />
        );

      case 'evaluation-processing':
        return (
          <EvaluationProcessingPage
            onNavigate={setCurrentRoute}
          />
        );

      case 'evaluation-report':
        return (
          <EvaluationReportPage
            onNavigate={setCurrentRoute}
          />
        );

      case 'agent-insights':
        return (
          <AgentInsightsPage
            onNavigate={setCurrentRoute}
          />
        );

      case 'sessions':
        return (
          <SessionsPage
            onNavigate={setCurrentRoute}
            onSelectSession={(s) => {
              setSelectedSession(s);
              setCurrentRoute('session-detail');
            }}
          />
        );

      case 'session-detail':
        return (
          <SessionDetailPage
            session={selectedSession}
            onNavigate={setCurrentRoute}
          />
        );

      case 'insights':
        return (
          <InsightsAnalyticsPage
            onNavigate={setCurrentRoute}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            onNavigate={setCurrentRoute}
            accentColor={accentColor}
            onSelectAccentColor={(color) => {
              setAccentColor(color);
              document.documentElement.style.setProperty('--accent', color);
            }}
          />
        );

      default:
        return <DashboardPage onNavigate={setCurrentRoute} onSelectSession={() => {}} />;
    }
  };

  // Full-screen mode for the Live Boardroom session
  if (currentRoute === 'live-room') {
    return (
      <LiveRoomPage
        brief={currentBrief}
        onNavigate={setCurrentRoute}
        onCompleteSession={() => {}}
      />
    );
  }

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={setCurrentRoute}
      accentColor={accentColor}
      onSelectAccentColor={(color) => {
        setAccentColor(color);
        document.documentElement.style.setProperty('--accent', color);
      }}
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;
