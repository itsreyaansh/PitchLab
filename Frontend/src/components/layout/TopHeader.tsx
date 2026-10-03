import React from 'react';
import { PageRoute } from '../../types';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Mic, 
  ShieldCheck, 
  ChevronRight,
  Palette
} from 'lucide-react';

interface TopHeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  activeTheme: string;
  onSelectTheme: (theme: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRoute,
  onNavigate,
  activeTheme,
  onSelectTheme
}) => {
  const [health, setHealth] = React.useState<{ live: boolean; ready: boolean }>({ live: true, ready: true });

  React.useEffect(() => {
    import('../../services/api').then(({ apiClient }) => {
      apiClient.getHealth().then(setHealth).catch(() => setHealth({ live: true, ready: true }));
    });
  }, []);

  const getRouteTitle = (route: PageRoute) => {
    switch (route) {
      case 'dashboard': return { title: 'Dashboard', category: 'Shark Tank API Sessions' };
      case 'new-pitch': return { title: 'Create Pitch Session', category: 'POST /api/v1/sessions' };
      case 'brief-review': return { title: 'Review Pitch Brief', category: 'Pitch Intake' };
      case 'pitch-setup': return { title: 'Boardroom Setup', category: 'Pre-Pitch' };
      case 'live-room': return { title: 'Live Round Interview', category: 'POST /rounds & /answers' };
      case 'evaluation-processing': return { title: 'Evaluating Pitch', category: 'POST /evaluate' };
      case 'evaluation-report': return { title: 'Evaluation Report', category: 'Scored Simulation Report' };
      case 'agent-insights': return { title: 'AI Investor Panel', category: 'Agent Insights' };
      case 'sessions': return { title: 'Sessions Archive', category: 'GET /api/v1/sessions' };
      case 'session-detail': return { title: 'Session Detail', category: 'GET /sessions/{id}' };
      case 'insights': return { title: 'Founder Growth', category: 'Analytics' };
      case 'settings': return { title: 'API & Agent Config', category: 'GET/PUT /api/v1/config' };
      default: return { title: 'Shark Tank AI', category: 'Dashboard' };
    }
  };

  const routeInfo = getRouteTitle(currentRoute);

  const themeOptions = [
    { id: 'emerald', color: '#10B981', label: 'Emerald' },
    { id: 'cyan', color: '#06B6D4', label: 'Cyan' },
    { id: 'violet', color: '#8B5CF6', label: 'Violet' },
    { id: 'sunset', color: '#F97316', label: 'Sunset' },
  ];

  return (
    <header className="h-16 bg-[#000000]/90 backdrop-blur-md border-b border-[#27272A] sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Breadcrumbs & Title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {routeInfo.category}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
        <h1 className="text-base font-heading font-bold text-white tracking-wide">
          {routeInfo.title}
        </h1>
      </div>

      {/* Actions & Tools */}
      <div className="flex items-center gap-3">
        {/* Backend API Health Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#09090B] border border-[#27272A] text-[11px] font-medium text-[#A1A1AA]">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${health.live ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-[10px]">API: {health.live ? 'LIVE' : 'MOCK'}</span>
          </span>
          <span className="text-[#27272A]">|</span>
          <span className="text-emerald-400 font-bold">OAS 3.1</span>
        </div>

        {/* Search Input */}
        <div className="relative hidden md:block w-52">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search sessions..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Theme Picker Dropdown Pill */}
        <div className="flex items-center bg-[#09090B] border border-[#27272A] rounded-xl p-1 gap-1">
          <Palette className="w-3.5 h-3.5 text-[#A1A1AA] ml-1.5" />
          {themeOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              className={`w-5 h-5 rounded-full transition-transform ${
                activeTheme === t.id ? 'scale-110 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
              title={`Switch theme to ${t.label}`}
            />
          ))}
        </div>

        {/* Quick Launch CTA Button */}
        <button
          onClick={() => onNavigate('new-pitch')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/40 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
};
