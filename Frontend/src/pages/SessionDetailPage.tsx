import React, { useState } from 'react';
import { PageRoute, PitchSession } from '../types';
import { MOCK_EVALUATION_REPORT } from '../data/mockData';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface SessionDetailPageProps {
  session: PitchSession | null;
  onNavigate: (route: PageRoute) => void;
}

export const SessionDetailPage: React.FC<SessionDetailPageProps> = ({
  session,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'contradictions'>('overview');

  const sessionData = (session as any) || {
    id: 's1',
    startupName: 'WatchAI',
    tagline: 'Autonomous AI Visual Intelligence for Retail Stores',
    date: 'March 28, 2026',
    duration: '12m 42s',
    overallScore: 78,
    status: 'completed' as const,
    agentCount: 6,
    questionsCount: 18,
    contradictionCount: 2
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <button
            onClick={() => onNavigate('sessions')}
            className="text-xs font-semibold text-[#737373] hover:text-white mb-2 block"
          >
            ← Back to Sessions
          </button>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            {sessionData.startupName} Session Record
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            {sessionData.tagline} • Session ID: {sessionData.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('evaluation-report')}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#080808] font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-950/50"
          >
            <span>View Full Evaluation Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-2xl border border-[#242424] w-fit">
        {(['overview', 'transcript', 'contradictions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === t 
                ? 'bg-cyan-500 text-[#080808] shadow-md shadow-cyan-950/40' 
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#242424] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">Final Score</span>
            <div className="text-4xl font-heading font-extrabold text-cyan-400">
              {sessionData.overallScore || sessionData.score || 78} <span className="text-xs text-[#737373]">/100</span>
            </div>
            <p className="text-xs text-[#A3A3A3]">Evaluated by 6 AI Boardroom Partners</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121212] border border-[#242424] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">Session Details</span>
            <div className="text-sm font-semibold text-white space-y-1">
              <div>Date: {sessionData.date}</div>
              <div>Duration: {sessionData.duration}</div>
              <div>Questions Asked: {sessionData.questionsCount}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121212] border border-[#242424] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">Audit Flags</span>
            <div className="text-2xl font-heading font-extrabold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" /> {sessionData.contradictionCount} Discrepancies
            </div>
            <p className="text-xs text-[#A3A3A3]">CAC & Sales Cycle Discrepancies Flagged</p>
          </div>
        </div>
      )}

      {/* Transcript Tab Content */}
      {activeTab === 'transcript' && (
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Session Transcript</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#242424]">
              <span className="text-xs font-bold text-cyan-400 block mb-1">Aarav Mehta (Market Analyst) — 00:05</span>
              <p className="text-xs text-white">"Welcome to the boardroom. Present your elevator pitch for WatchAI."</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#171717] border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Vihaan (Founder) — 00:32</span>
              <p className="text-xs text-white">"WatchAI transforms offline CCTV into real-time retail intelligence with zero hardware upgrades."</p>
            </div>
          </div>
        </div>
      )}

      {/* Contradictions Tab */}
      {activeTab === 'contradictions' && (
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Statement Contradiction Audit</h3>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            {MOCK_EVALUATION_REPORT.contradictions[0].whyItMatters}
          </p>
        </div>
      )}
    </div>
  );
};
