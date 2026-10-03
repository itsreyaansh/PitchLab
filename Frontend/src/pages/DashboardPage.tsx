import React from 'react';
import { PageRoute, PitchSession } from '../types';
import { RECENT_SESSIONS } from '../data/mockData';
import { 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Award, 
  Clock, 
  Zap, 
  Play, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectSession: (session: PitchSession) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectSession
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Welcome back, Founder 👋
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Practice your pitch before the real room. Walk in, defend your numbers, get evaluated.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sessions')}
            className="px-4 py-2 rounded-xl bg-[#09090B] hover:bg-[#18181B] border border-[#27272A] text-xs font-semibold text-[#A1A1AA] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Past Sessions</span>
          </button>

          <button
            onClick={() => onNavigate('new-pitch')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start New Pitch</span>
          </button>
        </div>
      </div>

      {/* Hero Card & Performance Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Hero Launcher Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#09090B] via-[#121215] to-[#09090B] border border-emerald-500/20 p-8 relative overflow-hidden flex flex-col justify-between group">
          {/* Subtle Waveform Animation Graphic in Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex items-center justify-end pr-8">
            <div className="flex items-center gap-1.5 h-32">
              {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 40, 70, 85, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full animate-pulse"
                  style={{ 
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-lg space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>PITCHROOM AI 1.1 — IMMERSIVE BOARDROOM</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white leading-tight">
              Ready for the investor room?
            </h3>

            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Upload your startup brief and face 6 specialized AI partner judges (Market, Product, Finance, Growth, Operations, Risk) with real voice speech & live cross-examination.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('pitch-setup')}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-950/60 transform group-hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter Boardroom Now</span>
              </button>

              <button
                onClick={() => onNavigate('brief-review')}
                className="px-4 py-3 rounded-2xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-white flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Review Brief (WatchAI)</span>
              </button>
            </div>
          </div>

          {/* Bottom Features pill */}
          <div className="relative z-10 mt-8 pt-4 border-t border-[#27272A]/60 flex items-center gap-6 text-xs text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 6 AI Judge Avatars
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time Speech Voice
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Contradiction Audit
            </span>
          </div>
        </div>

        {/* Performance Overview Card */}
        <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">PERFORMANCE SUMMARY</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +11 pts
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#121215] border border-[#27272A]">
                <div>
                  <span className="text-xs text-[#A1A1AA] block">Average Score</span>
                  <span className="text-3xl font-heading font-extrabold text-white">78</span>
                  <span className="text-xs text-[#A1A1AA]">/100</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#121215] border border-[#27272A]">
                  <span className="text-xs text-[#A1A1AA] block">Sessions</span>
                  <span className="text-xl font-heading font-bold text-white">12</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#121215] border border-[#27272A]">
                  <span className="text-xs text-[#A1A1AA] block">Best Score</span>
                  <span className="text-xl font-heading font-bold text-emerald-400">89</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('insights')}
            className="w-full mt-6 py-2.5 px-4 rounded-xl bg-[#121215] hover:bg-[#18181B] border border-[#27272A] text-xs font-semibold text-white flex items-center justify-between transition-colors group"
          >
            <span>View Detailed Analytics</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Pitch Sessions Section */}
      <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-white">Recent Pitch Sessions</h3>
            <p className="text-xs text-[#A1A1AA]">Review recordings, transcripts, and evaluation metrics</p>
          </div>

          <button
            onClick={() => onNavigate('sessions')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Sessions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                <th className="py-3 px-4">Startup</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/60 text-xs">
              {RECENT_SESSIONS.map((session) => (
                <tr 
                  key={session.id}
                  className="hover:bg-[#121215] transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectSession(session);
                    onNavigate('evaluation-report');
                  }}
                >
                  <td className="py-4 px-4 font-semibold text-white">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {session.startupName}
                      </span>
                      <span className="text-[11px] text-[#A1A1AA] truncate max-w-xs">
                        {session.tagline}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-sm font-heading font-extrabold text-emerald-400">
                        {session.overallScore}
                      </span>
                      <span className="text-[11px] text-[#A1A1AA]">/100</span>
                      {session.overallScore >= 80 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          Strong
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                          Moderate
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#E4E4E7]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <span>{session.duration}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#A1A1AA]">
                    {session.date}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-[#121215] group-hover:bg-emerald-500 group-hover:text-[#000000] text-[#E4E4E7] text-xs font-semibold transition-all inline-flex items-center gap-1">
                      <span>Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
