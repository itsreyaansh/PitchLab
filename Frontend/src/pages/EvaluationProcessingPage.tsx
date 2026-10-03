import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface EvaluationProcessingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const EvaluationProcessingPage: React.FC<EvaluationProcessingPageProps> = ({
  onNavigate
}) => {
  const steps = [
    'Reviewing startup brief parameters',
    'Analyzing market TAM/SAM discussion',
    'Reviewing product & edge tech answers',
    'Reviewing financial & CAC answers',
    'Reviewing GTM & growth strategy',
    'Reviewing operational scale answers',
    'Performing cross-examination contradiction check',
    'Building final score & investor report'
  ];

  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedSteps(prev => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onNavigate('evaluation-report');
          }, 800);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onNavigate, steps.length]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="rounded-3xl bg-[#121212] border border-[#242424] p-8 max-w-lg w-full space-y-8 shadow-2xl text-center">
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-950/40">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-2xl font-heading font-extrabold text-white tracking-tight">
            Finalizing Your Pitch Evaluation
          </h2>
          <p className="text-xs text-[#A3A3A3]">
            Converting live boardroom conversation into evidence-backed partner report...
          </p>
        </div>

        {/* Step Checklist */}
        <div className="space-y-3 text-left bg-[#0D0D0D] p-5 rounded-2xl border border-[#242424]">
          {steps.map((step, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all ${
                  isDone 
                    ? 'text-white font-semibold' 
                    : isCurrent 
                    ? 'text-cyan-400 font-bold' 
                    : 'text-[#737373]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#333333] flex-shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-[#737373] italic">
          PitchRoom AI partners evaluate statements based strictly on transcript evidence.
        </p>
      </div>
    </div>
  );
};
