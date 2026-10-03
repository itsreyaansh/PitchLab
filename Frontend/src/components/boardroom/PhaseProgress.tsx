import React from 'react';
import { PitchPhase } from '../../types';
import { Check, ShieldAlert } from 'lucide-react';

interface PhaseProgressProps {
  currentPhase: PitchPhase;
  elapsedTime: string;
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({
  currentPhase,
  elapsedTime
}) => {
  const phases: PitchPhase[] = ['Pitch', 'Discovery', 'Cross Exam', 'Pressure', 'Final'];

  const getPhaseIndex = (phase: PitchPhase) => phases.indexOf(phase);
  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full flex items-center justify-between px-6 py-3 bg-[#0D0D0D]/90 border-b border-[#242424] backdrop-blur-md">
      {/* Brand & Live status */}
      <div className="flex items-center gap-3">
        <span className="font-heading font-extrabold text-sm text-white tracking-wider flex items-center gap-1.5">
          PITCHROOM <span className="text-xs text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">AI</span>
        </span>

        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>LIVE ● {elapsedTime}</span>
        </div>
      </div>

      {/* Center Phase Steps */}
      <div className="hidden md:flex items-center gap-2">
        {phases.map((phase, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={phase}>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isCurrent 
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-950/50' 
                  : isDone
                  ? 'bg-[#171717] text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#121212] text-[#737373] border border-transparent'
              }`}>
                {isDone ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[10px] opacity-70">0{idx + 1}</span>
                )}
                <span>{phase}</span>
              </div>

              {idx < phases.length - 1 && (
                <div className={`w-3 h-[1px] ${idx < currentIndex ? 'bg-emerald-500/40' : 'bg-[#242424]'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Phase Badge (Mobile view) */}
      <div className="md:hidden">
        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
          Phase: {currentPhase}
        </span>
      </div>
    </div>
  );
};
