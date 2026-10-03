import React, { useState } from 'react';
import { TranscriptItem } from '../../types';
import { X, Search, Clock, Mic, Volume2, ShieldAlert } from 'lucide-react';

interface TranscriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: TranscriptItem[];
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({
  isOpen,
  onClose,
  transcript
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = transcript.filter(item => 
    item.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0D0D0D]/95 border-l border-[#242424] shadow-2xl backdrop-blur-2xl flex flex-col justify-between animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-[#242424] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="font-heading font-bold text-sm text-white">Live Session Transcript</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-[#171717] hover:bg-[#242424] text-[#A3A3A3] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-[#242424] bg-[#080808]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dialogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-[#242424] rounded-xl text-xs text-white placeholder-[#737373] focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Transcript Log List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#737373]">
            No transcript entries found yet.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isFounder = item.speakerId === 'founder';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                  isFounder
                    ? 'bg-[#171717] border-emerald-500/30 ml-4'
                    : 'bg-[#121212] border-[#242424] mr-2 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${
                    isFounder ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {isFounder ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {item.speakerName} {item.speakerRole && `(${item.speakerRole})`}
                  </span>

                  <span className="text-[10px] text-[#737373] font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#F5F5F5] leading-relaxed">
                  {item.text}
                </p>

                {item.isContradiction && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <ShieldAlert className="w-3 h-3" /> Potential statement contradiction flagged
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#242424] bg-[#080808] text-center text-[10px] text-[#737373]">
        Full conversation transcript saved to session report.
      </div>
    </div>
  );
};
