import React from 'react';
import { AIJudge } from '../../types';
import { Volume2, Sparkles, MessageSquare, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface JudgeAvatarProps {
  judge: AIJudge;
  isSpeaking: boolean;
  isFocused?: boolean;
  onSelect?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const JudgeAvatar: React.FC<JudgeAvatarProps> = ({
  judge,
  isSpeaking,
  isFocused = false,
  onSelect,
  size = 'md'
}) => {
  // Dimension tokens
  const dimensions = {
    sm: { container: 'w-28 h-36', avatar: 'w-16 h-16', text: 'text-[10px]', name: 'text-xs' },
    md: { container: 'w-44 h-56', avatar: 'w-24 h-24', text: 'text-xs', name: 'text-sm' },
    lg: { container: 'w-64 h-80', avatar: 'w-36 h-36', text: 'text-sm', name: 'text-base' }
  }[size];

  // Specific avatar vector illustrations for each of the 6 judges
  const renderAvatarGraphic = () => {
    switch (judge.avatarVariant) {
      case 'aarav': // Market Analyst - Professional male, dark hair, glasses
        return (
          <g>
            <circle cx="50" cy="40" r="22" fill="#E5C09B" />
            {/* Hair */}
            <path d="M 28 35 Q 50 15 72 35 L 72 30 Q 50 12 28 30 Z" fill="#1C1917" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="42" cy="38" rx="2.5" ry="3" fill="#1C1917" />
              <ellipse cx="58" cy="38" rx="2.5" ry="3" fill="#1C1917" />
            </g>
            {/* Glasses */}
            <rect x="36" y="32" width="12" height="10" rx="2" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
            <rect x="52" y="32" width="12" height="10" rx="2" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
            <line x1="48" y1="36" x2="52" y2="36" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Mouth / Lip sync */}
            <path 
              d="M 43 49 Q 50 53 57 49" 
              stroke="#1C1917" 
              strokeWidth="2" 
              fill={isSpeaking ? "#991B1B" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Suit Collar */}
            <path d="M 24 75 L 36 58 L 50 68 L 64 58 L 76 75 Z" fill="#172554" />
            <path d="M 46 65 L 50 80 L 54 65 Z" fill="#F59E0B" />
          </g>
        );

      case 'maya': // Product & Tech - Modern female, slick hair
        return (
          <g>
            <circle cx="50" cy="42" r="21" fill="#F3D2B8" />
            {/* Long Dark Hair */}
            <path d="M 25 30 C 25 15, 75 15, 75 30 L 78 65 L 72 65 L 70 38 Q 50 20 30 38 L 28 65 L 22 65 Z" fill="#0F172A" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="41" cy="40" rx="2.5" ry="3" fill="#0F172A" />
              <ellipse cx="59" cy="40" rx="2.5" ry="3" fill="#0F172A" />
              <path d="M 37 35 Q 41 33 45 35" stroke="#0F172A" strokeWidth="1" fill="none" />
              <path d="M 55 35 Q 59 33 63 35" stroke="#0F172A" strokeWidth="1" fill="none" />
            </g>
            {/* Mouth */}
            <path 
              d="M 43 51 Q 50 56 57 51" 
              stroke="#0F172A" 
              strokeWidth="2" 
              fill={isSpeaking ? "#E11D48" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Cyber Cyan Blazer */}
            <path d="M 20 78 L 36 60 L 50 70 L 64 60 L 80 78 Z" fill="#0891B2" />
          </g>
        );

      case 'rohan': // Finance - Senior male, silver sides, sharp suit
        return (
          <g>
            <circle cx="50" cy="40" r="22" fill="#DDB28D" />
            {/* Hair with grey highlights */}
            <path d="M 28 35 Q 50 16 72 35 Q 60 22 40 22 Z" fill="#475569" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="42" cy="38" rx="2.2" ry="2.8" fill="#1E293B" />
              <ellipse cx="58" cy="38" rx="2.2" ry="2.8" fill="#1E293B" />
            </g>
            {/* Mouth */}
            <path 
              d="M 43 49 Q 50 52 57 49" 
              stroke="#1E293B" 
              strokeWidth="2" 
              fill={isSpeaking ? "#991B1B" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Executive Suit */}
            <path d="M 22 75 L 38 58 L 50 66 L 62 58 L 78 75 Z" fill="#064E3B" />
            <path d="M 47 62 L 50 78 L 53 62 Z" fill="#10B981" />
          </g>
        );

      case 'naina': // Growth - Vibrant female, wavy hair
        return (
          <g>
            <circle cx="50" cy="41" r="21" fill="#E8B993" />
            {/* Wavy hair */}
            <path d="M 24 38 Q 20 18 50 18 Q 80 18 76 38 Q 80 55 72 65 Q 60 20 40 20 Q 20 55 28 65 Z" fill="#701A75" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="41" cy="39" rx="2.5" ry="3" fill="#3B0764" />
              <ellipse cx="59" cy="39" rx="2.5" ry="3" fill="#3B0764" />
            </g>
            {/* Mouth */}
            <path 
              d="M 42 50 Q 50 55 58 50" 
              stroke="#3B0764" 
              strokeWidth="2" 
              fill={isSpeaking ? "#C026D3" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Fuchsia Jacket */}
            <path d="M 22 78 L 38 60 L 50 68 L 62 60 L 78 78 Z" fill="#A21CAF" />
          </g>
        );

      case 'kabir': // Operations - Sturdy build, beard, crisp blazer
        return (
          <g>
            <circle cx="50" cy="40" r="22" fill="#D39E77" />
            {/* Beard */}
            <path d="M 32 42 Q 50 64 68 42 L 66 52 Q 50 66 34 52 Z" fill="#262626" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="42" cy="37" rx="2.5" ry="2.8" fill="#171717" />
              <ellipse cx="58" cy="37" rx="2.5" ry="2.8" fill="#171717" />
            </g>
            {/* Mouth */}
            <path 
              d="M 44 47 Q 50 51 56 47" 
              stroke="#FFFFFF" 
              strokeWidth="1.5" 
              fill={isSpeaking ? "#EF4444" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Navy Operations Blazer */}
            <path d="M 20 78 L 36 58 L 50 68 L 64 58 L 80 78 Z" fill="#312E81" />
          </g>
        );

      case 'vikram': // Risk & Return - Senior Partner, salt & pepper hair, dark glasses
        return (
          <g>
            <circle cx="50" cy="40" r="22" fill="#CCA080" />
            {/* Silver Hair */}
            <path d="M 26 35 Q 50 14 74 35 L 74 30 Q 50 10 26 30 Z" fill="#94A3B8" />
            {/* Eyes */}
            <g className="animate-eye-blink">
              <ellipse cx="42" cy="38" rx="2.2" ry="2.8" fill="#0F172A" />
              <ellipse cx="58" cy="38" rx="2.2" ry="2.8" fill="#0F172A" />
            </g>
            {/* Mouth */}
            <path 
              d="M 43 50 Q 50 53 57 50" 
              stroke="#0F172A" 
              strokeWidth="2" 
              fill={isSpeaking ? "#991B1B" : "none"} 
              className={isSpeaking ? "lip-speaking" : ""}
            />
            {/* Charcoal Suit & Red Tie */}
            <path d="M 22 75 L 38 58 L 50 66 L 62 58 L 78 75 Z" fill="#1C1917" />
            <path d="M 47 62 L 50 80 L 53 62 Z" fill="#E11D48" />
          </g>
        );
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-between p-3.5 rounded-3xl transition-all duration-300 cursor-pointer select-none group ${dimensions.container} ${
        isSpeaking 
          ? 'bg-[#171717] border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-105 z-20' 
          : isFocused
          ? 'bg-[#141414] border border-cyan-500/40 shadow-lg z-10'
          : 'bg-[#121212]/90 hover:bg-[#171717] border border-[#242424] opacity-85 hover:opacity-100'
      }`}
    >
      {/* Top Role Tag */}
      <div className="w-full flex items-center justify-between">
        <span 
          className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm truncate max-w-[110px]"
          style={{ 
            color: judge.accentHex, 
            backgroundColor: `${judge.accentHex}15`,
            borderColor: `${judge.accentHex}40`
          }}
        >
          {judge.shortRole}
        </span>

        {isSpeaking && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/40 animate-pulse">
            <Volume2 className="w-3 h-3" /> SPEAKING
          </span>
        )}
      </div>

      {/* Center Animated Bust Graphic */}
      <div className="relative my-auto flex items-center justify-center">
        {/* Active Speaker Waveform Glow Ring */}
        {isSpeaking && (
          <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/60 animate-ping opacity-30 pointer-events-none" />
        )}

        <div className={`rounded-full p-1 bg-gradient-to-tr transition-all duration-300 ${
          isSpeaking 
            ? 'from-cyan-400 via-teal-300 to-cyan-500 ring-4 ring-cyan-500/30' 
            : 'from-[#242424] to-[#1C1C1C]'
        }`}>
          <div className="w-24 h-24 rounded-full bg-[#0D0D0D] border border-[#242424] overflow-hidden flex items-center justify-center animate-breathe">
            <svg viewBox="0 0 100 90" className="w-full h-full">
              {renderAvatarGraphic()}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Name & Expression Status */}
      <div className="w-full text-center space-y-0.5">
        <h4 className={`font-heading font-bold text-white tracking-wide truncate ${dimensions.name}`}>
          {judge.name}
        </h4>
        <span className="text-[10px] text-[#737373] block truncate">
          {isSpeaking ? 'Asking question...' : 'Attentive & Listening'}
        </span>
      </div>
    </div>
  );
};
