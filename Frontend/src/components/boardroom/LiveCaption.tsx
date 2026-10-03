import React from 'react';
import { Volume2, Mic } from 'lucide-react';

interface LiveCaptionProps {
  speakerName: string;
  speakerRole?: string;
  text: string;
  isFounder?: boolean;
}

export const LiveCaption: React.FC<LiveCaptionProps> = ({
  speakerName,
  speakerRole,
  text,
  isFounder = false
}) => {
  if (!text) return null;

  return (
    <div className="w-full max-w-2xl mx-auto z-30 animate-fade-in">
      <div className="rounded-2xl bg-[#0D0D0D]/95 border border-cyan-500/30 p-4 shadow-2xl backdrop-blur-md flex flex-col gap-1 text-center">
        <div className="flex items-center justify-center gap-2">
          {isFounder ? (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Mic className="w-3 h-3" /> YOU (FOUNDER)
            </span>
          ) : (
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-pulse" /> {speakerRole || speakerName}
            </span>
          )}
        </div>

        <p className="text-sm md:text-base font-medium text-white leading-relaxed italic tracking-wide">
          “{text}”
        </p>
      </div>
    </div>
  );
};
