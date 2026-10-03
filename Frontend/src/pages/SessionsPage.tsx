import React, { useState } from 'react';
import { PageRoute, PitchSession } from '../types';
import { MOCK_PITCH_SESSIONS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SessionsPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectSession: (session: PitchSession) => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({
  onNavigate,
  onSelectSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSessions = MOCK_PITCH_SESSIONS.filter(s => {
    const matchesSearch = s.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Pitch Sessions History
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Browse and review past boardroom sessions, evaluation scores, and contradiction logs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-pitch')}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#080808] font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Pitch Session</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-[#242424]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search startup name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#171717] border border-[#242424] rounded-xl text-xs text-white placeholder-[#737373] focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#737373]" />
          <div className="flex items-center bg-[#171717] p-1 rounded-xl border border-[#242424]">
            {['all', 'completed', 'in-progress'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterStatus === st 
                    ? 'bg-cyan-500 text-[#080808]' 
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pitch Sessions Grid / List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => {
              onSelectSession(session);
              onNavigate('session-detail');
            }}
            className="rounded-2xl bg-[#121212] border border-[#242424] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-heading font-extrabold text-cyan-400 text-lg group-hover:scale-105 transition-transform">
                {session.overallScore || 78}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {session.startupName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {session.status}
                  </span>
                </div>
                <p className="text-xs text-[#A3A3A3] mt-0.5">{session.tagline}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#737373] mt-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.duration}</span>
                  <span>{((session as any).agentCount || 6)} Judges Seated</span>
                  {((session as any).contradictionCount > 0) && (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {(session as any).contradictionCount} Discrepancies
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                View Full Details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
