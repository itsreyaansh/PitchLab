import React from 'react';
import { PageRoute } from '../../types';
import { 
  Home, 
  PlusCircle, 
  Clock, 
  TrendingUp, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Mic,
  User,
  Shield,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  hasActiveSession?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  hasActiveSession = false
}) => {
  const navItems = [
    { id: 'dashboard' as PageRoute, label: 'Dashboard', icon: Home },
    { id: 'new-pitch' as PageRoute, label: 'New Pitch Session', icon: PlusCircle, badge: 'API' },
    { id: 'live-room' as PageRoute, label: 'Live Interview', icon: Mic },
    { id: 'evaluation-report' as PageRoute, label: 'Evaluation Report', icon: Layers },
    { id: 'settings' as PageRoute, label: 'Agent & Config', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#000000] border-r border-[#27272A] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272A]">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-[#000000] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                  PITCHROOM <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
                </span>
                <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-medium">Virtual Boardroom</span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg bg-[#09090B] hover:bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Pitch Alert Banner if active */}
        {hasActiveSession && (
          <div className="p-3">
            <button
              onClick={() => onNavigate('live-room')}
              className={`w-full rounded-xl bg-gradient-to-r from-red-500/20 via-rose-500/20 to-amber-500/20 border border-rose-500/40 p-2.5 flex items-center gap-3 text-rose-300 hover:border-rose-500 transition-all ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              {!collapsed && (
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Live Room Active</span>
                  <span className="text-[11px] text-rose-200/80">Click to re-enter pitch</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Main Navigation List */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id || 
              (item.id === 'new-pitch' && ['brief-review', 'pitch-setup'].includes(currentRoute)) ||
              (item.id === 'sessions' && ['session-detail', 'evaluation-report'].includes(currentRoute));

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-[#18181B] text-white border border-emerald-500/30 shadow-md font-medium' 
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#09090B] border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-[#A1A1AA] group-hover:text-white'
                }`} />
                
                {!collapsed && (
                  <span className="text-sm tracking-wide flex-grow text-left">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Pitch Entry Card (Expanded Mode) */}
        {!collapsed && (
          <div className="mx-3 mt-6 p-4 rounded-2xl bg-[#09090B] border border-[#27272A] relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Mic className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Investor Room</span>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-3 leading-relaxed">
              Pitch WatchAI brief to 6 AI judges with real voice & dynamic cross-examination.
            </p>
            <button
              onClick={() => onNavigate('pitch-setup')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
            >
              Enter Boardroom →
            </button>
          </div>
        )}
      </div>

      {/* Founder Profile Footer */}
      <div className="p-3 border-t border-[#27272A] bg-[#000000]">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-[#09090B] border border-[#27272A] ${
          collapsed ? 'justify-center' : ''
        }`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 p-[1.5px]">
              <div className="w-full h-full bg-[#09090B] rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-emerald-400">V</span>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#000000]" />
          </div>

          {!collapsed && (
            <div className="flex flex-col text-left overflow-hidden flex-grow">
              <span className="text-xs font-semibold text-white truncate">Vihaan</span>
              <span className="text-[11px] text-[#A1A1AA] truncate">Founder & CEO</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
