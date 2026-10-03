import React from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  FileText, 
  PhoneOff, 
  Maximize2, 
  Grid, 
  UserCheck
} from 'lucide-react';

interface VoiceControlDockProps {
  isMicMuted: boolean;
  onToggleMic: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onToggleTranscript: () => void;
  viewMode: 'panel' | 'speaker';
  onToggleViewMode: () => void;
  onEndSession: () => void;
  speechStatus?: string;
}

export const VoiceControlDock: React.FC<VoiceControlDockProps> = ({
  isMicMuted,
  onToggleMic,
  isAudioMuted,
  onToggleAudio,
  onToggleTranscript,
  viewMode,
  onToggleViewMode,
  onEndSession,
  speechStatus
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="rounded-full bg-[#0D0D0D]/90 border border-[#242424] p-2 shadow-2xl backdrop-blur-xl flex items-center gap-3 ring-1 ring-white/10">
        {/* Mic Toggle Circle */}
        <button
          onClick={onToggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isMicMuted 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' 
              : 'bg-cyan-500 text-[#080808] hover:bg-cyan-400 shadow-cyan-900/50 scale-105'
          }`}
          title={isMicMuted ? "Start speech recognition" : "Stop speech recognition"}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {speechStatus && (
          <span className="hidden sm:block max-w-40 text-[10px] text-[#A1A1AA] font-semibold uppercase tracking-wide">
            {speechStatus}
          </span>
        )}

        {/* Audio Mute */}
        <button
          onClick={onToggleAudio}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${
            isAudioMuted
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-[#171717] text-white border-[#242424] hover:bg-[#242424]'
          }`}
          title={isAudioMuted ? "Unmute AI Speakers" : "Mute AI Speakers"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* View Mode Switcher */}
        <button
          onClick={onToggleViewMode}
          className="w-10 h-10 rounded-full bg-[#171717] hover:bg-[#242424] border border-[#242424] text-white flex items-center justify-center transition-colors"
          title={viewMode === 'panel' ? "Switch to Speaker Focus" : "Switch to Full Panel"}
        >
          {viewMode === 'panel' ? <UserCheck className="w-4 h-4 text-cyan-400" /> : <Grid className="w-4 h-4 text-white" />}
        </button>

        {/* Transcript Drawer Toggle */}
        <button
          onClick={onToggleTranscript}
          className="w-10 h-10 rounded-full bg-[#171717] hover:bg-[#242424] border border-[#242424] text-white flex items-center justify-center transition-colors"
          title="Toggle Full Transcript Drawer"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
        </button>

        <div className="w-[1px] h-6 bg-[#242424] mx-1" />

        {/* End Session Button */}
        <button
          onClick={onEndSession}
          className="px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Pitch</span>
        </button>
      </div>
    </div>
  );
};
