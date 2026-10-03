import React from 'react';
import { PageRoute } from '../types';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface InsightsAnalyticsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InsightsAnalyticsPage: React.FC<InsightsAnalyticsPageProps> = ({
  onNavigate
}) => {
  const pitchHistoryData = [
    { date: 'Feb 15', score: 58, label: 'First Brief' },
    { date: 'Mar 02', score: 64, label: 'Pre-seed' },
    { date: 'Mar 14', score: 71, label: 'TAM Revised' },
    { date: 'Mar 28', score: 78, label: 'WatchAI Latest' }
  ];

  const categoryProgress = [
    { name: 'Problem & Market Need', current: 86, previous: 72 },
    { name: 'Solution & Tech Moat', current: 82, previous: 78 },
    { name: 'Business & Unit Economics', current: 61, previous: 45 },
    { name: 'Go-To-Market Strategy', current: 72, previous: 65 },
    { name: 'Operations & Scale', current: 79, previous: 70 },
    { name: 'Risk & Valuation', current: 68, previous: 55 }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PITCH IMPROVEMENT ANALYTICS</span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Founder Performance Analytics
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Track pitch score progression, category mastery curves, and recurring VC objections over time.
          </p>
        </div>
      </div>

      {/* Analytics Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] space-y-2">
          <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">Average Pitch Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-extrabold text-white">67.8</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              +20 pts <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">Across 4 simulated sessions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] space-y-2">
          <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">Highest Score Reached</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-extrabold text-cyan-400">78</span>
            <span className="text-xs text-[#737373]">/100</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">WatchAI Session</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] space-y-2">
          <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">Contradiction Reduction</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-extrabold text-white">-60%</span>
            <span className="text-xs font-bold text-emerald-400">Improvement</span>
          </div>
          <span className="text-[11px] text-[#737373]">From 5 to 2 audit flags</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] space-y-2">
          <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">Total Practice Time</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-extrabold text-white">48m</span>
          </div>
          <span className="text-[11px] text-[#737373]">72 VC questions answered</span>
        </div>
      </div>

      {/* Interactive SVG Pitch Score Progression Chart */}
      <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-heading font-bold text-white">Score Progression Over Time</h3>
            <p className="text-xs text-[#737373]">Historical trajectory from initial brief to latest boardroom session</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            +34.4% Growth
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="h-56 w-full pt-4">
          <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#242424" strokeDasharray="3 3" />
            <line x1="0" y1="70" x2="500" y2="70" stroke="#242424" strokeDasharray="3 3" />
            <line x1="0" y1="110" x2="500" y2="110" stroke="#242424" strokeDasharray="3 3" />

            {/* Gradient Fill under path */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 50 110 L 175 90 L 300 65 L 450 35 L 450 150 L 50 150 Z"
              fill="url(#chartGrad)"
            />

            {/* Main Score Line */}
            <path
              d="M 50 110 L 175 90 L 300 65 L 450 35"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {[
              { x: 50, y: 110, score: 58, label: 'Feb 15' },
              { x: 175, y: 90, score: 64, label: 'Mar 02' },
              { x: 300, y: 65, score: 71, label: 'Mar 14' },
              { x: 450, y: 35, score: 78, label: 'Mar 28' }
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="6" fill="#080808" stroke="#06B6D4" strokeWidth="3" />
                <text x={pt.x} y={pt.y - 12} fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {pt.score}
                </text>
                <text x={pt.x} y="155" fill="#737373" fontSize="10" textAnchor="middle">
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Category Progress Breakdown */}
      <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-white">Category Growth Curves</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryProgress.map((cat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#171717] border border-[#242424] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{cat.name}</span>
                <span className="font-bold text-cyan-400">
                  {cat.current} <span className="text-[10px] text-[#737373] font-normal">(was {cat.previous})</span>
                </span>
              </div>
              <div className="h-2 w-full bg-[#0D0D0D] rounded-full overflow-hidden p-0.5 border border-[#242424]">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${cat.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
