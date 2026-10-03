import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  Sliders, 
  Volume2, 
  Palette, 
  User, 
  Mic, 
  Sparkles, 
  Check, 
  Save,
  Moon
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (route: PageRoute) => void;
  accentColor: string;
  onSelectAccentColor: (color: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  accentColor,
  onSelectAccentColor
}) => {
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [panelIntensity, setPanelIntensity] = useState<'Gentle' | 'Balanced' | 'Aggressive' | 'Hardcore'>('Balanced');
  const [config, setConfig] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    import('../services/api').then(({ apiClient }) => {
      apiClient.getConfig().then(setConfig).catch(console.error);
    });
  }, []);

  const colors = [
    { name: 'Emerald Teal', hex: '#10B981' },
    { name: 'Electric Cyan', hex: '#06B6D4' },
    { name: 'Violet Glow', hex: '#8B5CF6' },
    { name: 'Fuchsia Pink', hex: '#D946EF' }
  ];

  const handleSave = async () => {
    if (config) {
      try {
        const { apiClient } = await import('../services/api');
        await apiClient.updateConfig(config);
      } catch (e) {
        console.warn('API config update fallback', e);
      }
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Boardroom & Theme Settings
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Customize voice parameters, AI judge intensity, theme accent colors, and audio sensitivity.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#080808] font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-950/50"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Visual Theme Accent Picker */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" /> UI Accent Theme Color
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => onSelectAccentColor(c.hex)}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  accentColor === c.hex 
                    ? 'bg-[#171717] border-cyan-400 shadow-md ring-2 ring-cyan-500/30' 
                    : 'bg-[#171717]/50 border-[#242424] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs font-bold text-white">{c.name}</span>
                </div>
                {accentColor === c.hex && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* AI Voice & Audio Parameters */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Web Speech Synthesis & Voice Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speech Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white">Speech Rate (Speed)</span>
                <span className="font-mono text-cyan-400">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-[#171717]"
              />
            </div>

            {/* Speech Pitch */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white">Speech Pitch</span>
                <span className="font-mono text-cyan-400">{speechPitch}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* AI Boardroom Intensity Level */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> AI Panel Question Intensity
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Gentle', 'Balanced', 'Aggressive', 'Hardcore'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPanelIntensity(mode)}
                className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                  panelIntensity === mode 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'bg-[#171717] border-[#242424] text-[#A3A3A3] hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Founder Profile Info */}
        <div className="rounded-3xl bg-[#121212] border border-[#242424] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Founder Account Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#A3A3A3]">Founder Name</label>
              <input
                type="text"
                defaultValue="Vihaan"
                className="w-full bg-[#171717] border border-[#242424] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#A3A3A3]">Email Address</label>
              <input
                type="email"
                defaultValue="vihaan@startup.ai"
                className="w-full bg-[#171717] border border-[#242424] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
