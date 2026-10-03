import React, { useState, useEffect } from 'react';
import { PageRoute, PitchSetupOptions, AIJudge } from '../types';
import { INITIAL_JUDGES } from '../data/mockData';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Clock, 
  Flame, 
  Sliders, 
  Sparkles, 
  Play, 
  Check, 
  ShieldAlert,
  ChevronDown,
  Info
} from 'lucide-react';

interface PitchSetupPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartPitch: (options: PitchSetupOptions) => void;
}

export const PitchSetupPage: React.FC<PitchSetupPageProps> = ({
  onNavigate,
  onStartPitch
}) => {
  const [micConnected, setMicConnected] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [options, setOptions] = useState<PitchSetupOptions>({
    durationMinutes: 5,
    difficulty: 'Adaptive',
    intensity: 'Balanced',
    pressureRound: true
  });

  // Simulated Mic volume level meter
  useEffect(() => {
    let interval: any;
    if (isTestingMic) {
      interval = setInterval(() => {
        setMicLevel(Math.floor(Math.random() * 70) + 15);
      }, 100);
    } else {
      setMicLevel(0);
    }
    return () => clearInterval(interval);
  }, [isTestingMic]);

  const handleToggleMicTest = () => {
    setIsTestingMic(!isTestingMic);
  };

  const handleEnterRoom = () => {
    onStartPitch(options);
    onNavigate('live-room');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 3 OF 3 — BOARDROOM ROOM SETUP</span>
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Prepare Your Live Pitch Session
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto">
          Test your microphone, configure pitch parameters, and preview the 6 AI judges waiting inside.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Audio & Setup Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Audio Setup Card */}
          <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" /> Audio Input & Output
            </h3>

            {/* Mic Status */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Default Microphone</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                </span>
              </div>

              {/* Live Volume Level Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#A1A1AA]">
                  <span>Mic Level Meter</span>
                  <span>{micLevel}%</span>
                </div>
                <div className="h-2 w-full bg-[#000000] rounded-full overflow-hidden p-0.5 border border-[#27272A]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-75"
                    style={{ width: `${micLevel}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleToggleMicTest}
                className="w-full py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors"
              >
                {isTestingMic ? 'Stop Mic Test' : 'Test Microphone Audio'}
              </button>
            </div>
          </div>

          {/* Session Parameters Card */}
          <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Session Rules
            </h3>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Pitch Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 5, 10].map((m) => (
                  <button
                    key={m}
                    onClick={() => setOptions({ ...options, durationMinutes: m })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.durationMinutes === m 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : 'bg-[#121215] border-[#27272A] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {m} Min
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Mode */}
            <div className="space-y-2">
              <label className="text-xs text-[#A1A1AA]">AI Panel Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Adaptive', 'Normal', 'Hardcore'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setOptions({ ...options, difficulty: d })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.difficulty === d 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : 'bg-[#121215] border-[#27272A] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="pt-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#A1A1AA] hover:text-white py-1"
              >
                <span>Advanced Boardroom Settings</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-4 pt-3 border-t border-[#27272A] animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Pressure Round</span>
                      <span className="text-[10px] text-[#A1A1AA]">Simulate rapid-fire VC objections</span>
                    </div>
                    <button
                      onClick={() => setOptions({ ...options, pressureRound: !options.pressureRound })}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        options.pressureRound ? 'bg-emerald-500' : 'bg-[#27272A]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        options.pressureRound ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Judge Panel Roster Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold text-white">The AI Investor Boardroom</h3>
                <p className="text-xs text-[#A1A1AA]">6 specialized judges seated around the conference table</p>
              </div>

              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                6 Active Avatars
              </span>
            </div>

            {/* 6 Judge Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {INITIAL_JUDGES.map((judge) => (
                <div
                  key={judge.id}
                  className="rounded-2xl bg-[#121215] border border-[#27272A] p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] flex-shrink-0">
                      <div className="w-full h-full bg-[#09090B] rounded-full flex items-center justify-center font-bold text-xs text-emerald-300">
                        {judge.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {judge.name}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 tracking-wide uppercase truncate">
                        {judge.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-tight">
                    {judge.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {judge.keyFocus.slice(0, 2).map((focus, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#E4E4E7]">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Big Launch Action CTA */}
            <div className="pt-4 border-t border-[#27272A] flex items-center justify-between">
              <button
                onClick={() => onNavigate('brief-review')}
                className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
              >
                ← Back to Brief Review
              </button>

              <button
                onClick={handleEnterRoom}
                className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-2xl shadow-emerald-950/70 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter Boardroom & Start Pitch</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
