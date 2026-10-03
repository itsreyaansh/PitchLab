import React, { useState } from 'react';
import { PageRoute, JudgeInsight } from '../types';
import { MOCK_EVALUATION_REPORT } from '../data/mockData';
import { INITIAL_JUDGES } from '../data/mockData';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AgentInsightsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AgentInsightsPage: React.FC<AgentInsightsPageProps> = ({
  onNavigate
}) => {
  const [activeJudgeId, setActiveJudgeId] = useState<string>('finance-1');

  const insights = MOCK_EVALUATION_REPORT.judgeInsights;
  const activeInsight = insights.find(i => i.judgeId === activeJudgeId) || insights[0];
  const activeJudgeInfo = INITIAL_JUDGES.find(j => j.id === activeJudgeId) || INITIAL_JUDGES[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI INVESTOR PANEL DEEP DIVE</span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Individual Agent Insights
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Review detailed observations from each of the 6 partner judges for WatchAI.
          </p>
        </div>

        <button
          onClick={() => onNavigate('evaluation-report')}
          className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#171717] border border-[#242424] text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          ← Return to Main Report
        </button>
      </div>

      {/* 6 Judge Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {insights.map((insight) => {
          const judge = INITIAL_JUDGES.find(j => j.id === insight.judgeId) || INITIAL_JUDGES[0];
          const isActive = insight.judgeId === activeJudgeId;

          return (
            <button
              key={insight.judgeId}
              onClick={() => setActiveJudgeId(insight.judgeId)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                isActive 
                  ? 'bg-[#171717] border-cyan-400 shadow-lg shadow-cyan-950/40 scale-105' 
                  : 'bg-[#121212] border-[#242424] hover:border-[#333333] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {judge.shortRole}
                </span>
                <span className="text-xs font-bold text-white">
                  {insight.score}
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate">
                {insight.judgeName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Judge Detailed Card */}
      <div className="rounded-3xl bg-[#121212] border border-[#242424] p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1.5px]">
              <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center font-bold text-lg text-cyan-300">
                {activeJudgeInfo.name.charAt(0)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-heading font-extrabold text-white">
                {activeInsight.judgeName}
              </h3>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                {activeInsight.role} Partner
              </p>
              <p className="text-xs text-[#737373] mt-1">{activeJudgeInfo.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#171717] border border-[#242424] text-center">
              <span className="text-[10px] text-[#737373] block uppercase font-bold">Category Score</span>
              <span className="text-2xl font-heading font-extrabold text-cyan-400">{activeInsight.score}</span>
              <span className="text-xs text-[#737373]">/100</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#171717] border border-[#242424] text-center">
              <span className="text-[10px] text-[#737373] block uppercase font-bold">Questions Triggered</span>
              <span className="text-2xl font-heading font-extrabold text-white">{activeInsight.questionsAsked}</span>
            </div>
          </div>
        </div>

        {/* Detailed Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-[#171717] border border-emerald-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Observed Strengths
            </h4>
            <ul className="space-y-2 text-xs text-[#F5F5F5]">
              {activeInsight.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div className="p-5 rounded-2xl bg-[#171717] border border-amber-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Raised Concerns
            </h4>
            <ul className="space-y-2 text-xs text-[#F5F5F5]">
              {activeInsight.concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Information */}
          <div className="p-5 rounded-2xl bg-[#171717] border border-rose-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Missing Data Items
            </h4>
            <ul className="space-y-2 text-xs text-[#F5F5F5]">
              {activeInsight.missingInfo.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
