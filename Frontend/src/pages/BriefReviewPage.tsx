import React, { useState } from 'react';
import { PageRoute, StartupBrief } from '../types';
import { 
  FileText, 
  Edit3, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface BriefReviewPageProps {
  brief: StartupBrief;
  onNavigate: (route: PageRoute) => void;
  onUpdateBrief: (updated: StartupBrief) => void;
}

export const BriefReviewPage: React.FC<BriefReviewPageProps> = ({
  brief,
  onNavigate,
  onUpdateBrief
}) => {
  const [formData, setFormData] = useState<StartupBrief>(brief);
  const [showRawText, setShowRawText] = useState(false);
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  const fields: { key: keyof StartupBrief; label: string; placeholder: string }[] = [
    { key: 'startupName', label: 'Startup Name', placeholder: 'e.g. WatchAI' },
    { key: 'tagline', label: 'One-Line Tagline', placeholder: 'Autonomous AI Visual Intelligence for Retail' },
    { key: 'problem', label: 'Problem Statement', placeholder: 'Describe customer pain...' },
    { key: 'solution', label: 'Solution & Product', placeholder: 'Describe your core tech/solution...' },
    { key: 'targetCustomer', label: 'Target Customer', placeholder: 'Enterprise retail chains...' },
    { key: 'marketSize', label: 'Market Size (TAM/SAM)', placeholder: '$38.4B Global Market...' },
    { key: 'businessModel', label: 'Business Model', placeholder: 'B2B SaaS subscription...' },
    { key: 'revenueModel', label: 'Revenue Model', placeholder: '$49/camera/month...' },
    { key: 'pricing', label: 'Pricing Tiers', placeholder: 'Standard vs Enterprise pricing...' },
    { key: 'traction', label: 'Current Traction', placeholder: '$420K ARR across 28 pilot stores...' },
    { key: 'competition', label: 'Competitors', placeholder: 'CCTV hardware makers, standard analytics...' },
    { key: 'competitiveAdvantage', label: 'Competitive Advantage / Moat', placeholder: 'Zero hardware replacement, lightweight ONNX model...' },
    { key: 'team', label: 'Founding Team', placeholder: 'Vihaan (Ex-Google CV) & Priya (Ex-Target Ops VP)...' },
    { key: 'fundingAsk', label: 'Funding Ask & Valuation', placeholder: '$2.5M Seed @ $12M Post-Money...' },
    { key: 'useOfFunds', label: 'Use of Funds', placeholder: '50% Engineering, 35% GTM Sales...' },
    { key: 'growthStrategy', label: 'Growth Strategy', placeholder: 'Direct Enterprise Sales + POS vendor partners...' },
  ];

  const handleFieldChange = (key: keyof StartupBrief, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAndProceed = () => {
    onUpdateBrief(formData);
    onNavigate('pitch-setup');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header Step */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 2 OF 3 — BRIEF EXTRACTION REVIEW</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Review Extracted Startup Information
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Verify what the AI judges extracted from your TXT file. Edit any field before entering the boardroom.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#09090B] border border-[#27272A] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('structured')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'structured' 
                ? 'bg-emerald-500 text-[#000000] shadow-md shadow-emerald-950/40' 
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Structured View
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'raw' 
                ? 'bg-emerald-500 text-[#000000] shadow-md shadow-emerald-950/40' 
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Raw Brief TXT
          </button>
        </div>
      </div>

      {activeTab === 'structured' ? (
        /* Structured Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fields.map((f) => {
            const val = formData[f.key] as string;
            const isMissing = !val || val.trim() === '';

            return (
              <div 
                key={f.key}
                className="rounded-2xl bg-[#09090B] border border-[#27272A] p-5 space-y-2 hover:border-[#3F3F46] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    {f.label}
                  </label>
                  {isMissing ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Not provided
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>

                {f.key === 'problem' || f.key === 'solution' || f.key === 'traction' || f.key === 'competitiveAdvantage' ? (
                  <textarea
                    rows={3}
                    value={val || ''}
                    onChange={(e) => handleFieldChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-[#121215] border border-[#27272A] rounded-xl p-3 text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={val || ''}
                    onChange={(e) => handleFieldChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-[#121215] border border-[#27272A] rounded-xl px-3 py-2.5 text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Raw Brief Text Editor View */
        <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#A1A1AA]">Original Startup TXT Brief</span>
            <span className="text-xs text-emerald-400 font-mono">WatchAI-Startup-Brief.txt</span>
          </div>
          <textarea
            rows={18}
            value={formData.rawText || ''}
            onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
            className="w-full bg-[#000000] border border-[#27272A] rounded-2xl p-4 font-mono text-xs text-[#F4F4F5] focus:outline-none focus:border-emerald-500/50 leading-relaxed"
          />
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 rounded-2xl bg-[#09090B] border border-[#27272A] flex items-center justify-between">
        <button
          onClick={() => onNavigate('new-pitch')}
          className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          ← Re-upload Brief File
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAndProceed}
            className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-950/60"
          >
            <span>Proceed to Pitch Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
