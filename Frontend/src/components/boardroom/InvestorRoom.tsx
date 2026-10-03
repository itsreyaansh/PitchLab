import React from 'react';
import { AIJudge } from '../../types';
import { JudgeAvatar } from './JudgeAvatar';

interface InvestorRoomProps {
  judges: AIJudge[];
  activeJudgeId: string | null;
  onSelectJudge: (id: string) => void;
  viewMode: 'panel' | 'speaker';
}

export const InvestorRoom: React.FC<InvestorRoomProps> = ({
  judges,
  activeJudgeId,
  onSelectJudge,
  viewMode
}) => {
  const activeJudge = judges.find(j => j.id === activeJudgeId) || judges[0];

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-gradient-to-b from-[#080808] via-[#0E0E10] to-[#0A0A0C] overflow-hidden flex flex-col justify-between p-4 md:p-8">
      {/* Dark Charcoal Wall Backdrop & Subtle Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Spotlights over Table */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 left-1/4 w-[400px] h-[250px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[250px] bg-teal-500/5 rounded-full blur-3xl" />

        {/* Boardroom Wall Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Boardroom Seating Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
        {viewMode === 'panel' ? (
          /* Full 6-Judge Semicircle Boardroom Composition */
          <div className="w-full space-y-8 my-auto">
            {/* Back Row (3 Judges: Market, Product, Finance) */}
            <div className="flex items-center justify-center gap-4 md:gap-8 transform translate-y-2 scale-95">
              {judges.slice(0, 3).map((judge) => (
                <JudgeAvatar
                  key={judge.id}
                  judge={judge}
                  isSpeaking={judge.id === activeJudgeId}
                  onSelect={() => onSelectJudge(judge.id)}
                  size="md"
                />
              ))}
            </div>

            {/* Front Row (3 Judges: Growth, Operations, Risk) */}
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {judges.slice(3, 6).map((judge) => (
                <JudgeAvatar
                  key={judge.id}
                  judge={judge}
                  isSpeaking={judge.id === activeJudgeId}
                  onSelect={() => onSelectJudge(judge.id)}
                  size="md"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Speaker Focus View (Active judge magnified, other 5 supporting in mini bar) */
          <div className="w-full flex flex-col items-center justify-center gap-6 my-auto">
            {/* Primary Large Active Speaker Avatar */}
            <div className="transform transition-transform duration-300 scale-110">
              <JudgeAvatar
                judge={activeJudge}
                isSpeaking={activeJudge.id === activeJudgeId}
                size="lg"
              />
            </div>

            {/* Supporting 5 Seated Judges Strip */}
            <div className="flex items-center gap-3 bg-[#0D0D0D]/80 p-2 rounded-2xl border border-[#242424]">
              {judges.filter(j => j.id !== activeJudge.id).map((j) => (
                <JudgeAvatar
                  key={j.id}
                  judge={j}
                  isSpeaking={j.id === activeJudgeId}
                  onSelect={() => onSelectJudge(j.id)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Matte Black Conference Table Foreground */}
      <div className="relative z-20 w-full max-w-5xl mx-auto h-14 rounded-t-3xl bg-gradient-to-t from-[#141414] via-[#1A1A1A] to-[#242424]/40 border-t border-x border-[#333333]/50 shadow-2xl flex items-center justify-center px-8">
        <div className="w-full flex items-center justify-between text-[11px] text-[#737373]">
          <span className="font-mono tracking-widest uppercase">CONFERENCE TABLE · SEAT 01</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-semibold">FOUNDER PERSPECTIVE</span>
          </div>
          <span className="font-mono tracking-widest uppercase">6 AI PARTNERS ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
