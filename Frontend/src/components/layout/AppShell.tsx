import React, { useState, useEffect } from 'react';
import { PageRoute } from '../../types';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppShellProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  children: React.ReactNode;
  hasActiveSession?: boolean;
  accentColor?: string;
  onSelectAccentColor?: (color: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children,
  hasActiveSession = false,
  accentColor,
  onSelectAccentColor
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTheme, setActiveTheme] = useState('emerald');

  // Handle theme attribute on HTML element
  const handleSelectTheme = (theme: string) => {
    setActiveTheme(theme);
    if (theme === 'emerald') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Live boardroom screen handles its own minimalist immersive frame
  const isLiveRoom = currentRoute === 'live-room';

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col font-sans">
      {/* Show full navigation shell when not in live boardroom mode */}
      {!isLiveRoom ? (
        <div className="flex flex-1">
          {/* Sidebar Navigation */}
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            hasActiveSession={hasActiveSession}
          />

          {/* Main Content Area */}
          <div 
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}
          >
            <TopHeader
              currentRoute={currentRoute}
              onNavigate={onNavigate}
              activeTheme={activeTheme}
              onSelectTheme={handleSelectTheme}
            />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      ) : (
        /* Immersive Live Boardroom View (No default shell header/sidebar distracting elements) */
        <div className="flex-1 w-full h-screen bg-[#080808] overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
