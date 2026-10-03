import React, { useState } from 'react';
import { PageRoute, EvaluationReport } from '../types';
import { MOCK_EVALUATION_REPORT } from '../data/mockData';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  CheckSquare, 
  ArrowRight, 
  FileText, 
  Clock, 
  Users, 
  Share2, 
  Download, 
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface EvaluationReportPageProps {
  report?: EvaluationReport;
  onNavigate: (route: PageRoute) => void;
}

export const EvaluationReportPage: React.FC<EvaluationReportPageProps> = ({
  report = MOCK_EVALUATION_REPORT,
  onNavigate
}) => {
  const [checklist, setChecklist] = useState(report.nextPitchChecklist);
  const [activeTab, setActiveTab] = useState<'all' | 'contradictions' | 'improvements'>('all');

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI INVESTOR PANEL REPORT</span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            {report.startupName} Evaluation
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            {report.tagline} • {report.date} • {report.duration} session duration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#171717] border border-[#242424] text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Report PDF</span>
          </button>

          <button
            onClick={() => onNavigate('new-pitch')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080808] font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-cyan-950/50"
          >
            <span>Practice Next Pitch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Section: Main Score Gauge & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Overall Score Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#121212] via-[#0E1518] to-[#121212] border border-cyan-500/30 p-8 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-widest text-[#737373]">
            OVERALL PITCH SCORE
          </div>

          <div className="relative flex items-center justify-center my-2">
            {/* Outer Score Gauge Ring */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="#171717"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="url(#scoreGrad)"
                strokeWidth="12"
                strokeDasharray={427}
                strokeDashoffset={427 - (427 * report.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-heading font-extrabold text-white">
                {report.overallScore}
              </span>
              <span className="text-xs text-[#737373] font-medium">out of 100</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/40">
            Fundable with Conditions
          </span>

          <div className="pt-2 text-xs text-[#737373] flex items-center gap-4">
            <span>{report.agentCount} Judges</span>
            <span>•</span>
            <span>{report.questionsCount} Questions</span>
          </div>
        </div>

        {/* Category Scores Grid */}
        <div className="lg:col-span-2 rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
              CATEGORY PERFORMANCE BREAKDOWN
            </h3>
            <button 
              onClick={() => onNavigate('agent-insights')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Judge Insights</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.categoryScores.map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#171717] border border-[#242424] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{cat.category}</span>
                  <span className={`font-bold ${
                    cat.status === 'strong' ? 'text-emerald-400' : cat.status === 'moderate' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {cat.score} / {cat.maxScore}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#0D0D0D] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.status === 'strong' 
                        ? 'bg-emerald-400' 
                        : cat.status === 'moderate' 
                        ? 'bg-amber-400' 
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#737373] truncate">
                  {cat.keyIssue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTRADICTION DETECTOR UI (Critical Feature Highlight) */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#171412] to-rose-950/20 border border-amber-500/40 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
                Contradiction Audit Highlights
              </h3>
              <p className="text-xs text-[#A3A3A3]">
                Discrepancies identified between your uploaded brief and live cross-examination answers
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {report.contradictions.length} Contradictions Detected
          </span>
        </div>

        <div className="space-y-4">
          {report.contradictions.map((c) => (
            <div key={c.id} className="rounded-2xl bg-[#121212]/90 border border-[#242424] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {c.category} · {c.title}
                </span>
                <span className="text-[10px] text-[#737373] font-mono">Flagged by Finance & Risk Panel</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#171717] border border-[#242424] space-y-1">
                  <span className="text-[10px] font-bold text-[#737373] block uppercase">Brief Statement</span>
                  <p className="text-white italic">{c.earlierStatement}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#171717] border border-[#242424] space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 block uppercase">Live Pitch Answer</span>
                  <p className="text-white italic">{c.laterStatement}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">System Math Breakdown:</span>
                  <span className="font-mono text-amber-200">{c.calculation}</span>
                </div>
                <p className="text-[#A3A3A3] text-[11px] leading-relaxed">
                  <strong className="text-white">Why it matters:</strong> {c.whyItMatters}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Areas 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-heading font-bold text-white">What You Did Well</h3>
          </div>

          <div className="space-y-3">
            {report.strengths.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#171717] border border-emerald-500/20 space-y-1">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {s.title}
                </h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Improvements Card */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-heading font-bold text-white">Priority Improvements</h3>
          </div>

          <div className="space-y-3">
            {report.improvements.map((imp) => (
              <div key={imp.id} className="p-4 rounded-2xl bg-[#171717] border border-[#242424] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {imp.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    imp.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {imp.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{imp.title}</h4>
                <p className="text-[11px] text-[#A3A3A3]">
                  <strong className="text-[#737373]">Evidence:</strong> {imp.evidence}
                </p>
                <div className="pt-1 text-xs text-cyan-300 font-medium">
                  → <span className="underline underline-offset-2">Action:</span> {imp.improveBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unanswered Questions & Next Pitch Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unanswered Questions Section */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-heading font-bold text-white">Unanswered VC Questions</h3>
          </div>

          <div className="space-y-3">
            {report.unansweredQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-[#171717] border border-[#242424] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">
                    0{q.index} · {q.judgeRole}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  "{q.question}"
                </p>
                <p className="text-[11px] text-[#737373]">
                  Why important: {q.whyImportant}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Next Pitch Action Checklist */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-heading font-bold text-white">Your Next Pitch Checklist</h3>
            </div>
            <span className="text-xs text-[#737373]">
              {checklist.filter(c => c.completed).length} / {checklist.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.completed 
                    ? 'bg-[#171717]/50 border-emerald-500/30 opacity-70' 
                    : 'bg-[#171717] border-[#242424] hover:border-cyan-500/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-0.5 rounded border-[#333333] text-cyan-500 focus:ring-0"
                />
                <div className="flex flex-col text-xs">
                  <span className={`font-semibold ${item.completed ? 'line-through text-[#737373]' : 'text-white'}`}>
                    {item.text}
                  </span>
                  <span className="text-[10px] text-[#737373] uppercase font-bold mt-0.5">
                    {item.category}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
