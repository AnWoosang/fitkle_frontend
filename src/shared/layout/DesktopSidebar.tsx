"use client";

import { Home, Search, Users, MessageCircle, User, Plus } from 'lucide-react';
import { AppLogo } from '@/shared/components/AppLogo';

interface DesktopSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onCreateEvent: () => void;
}

export function DesktopSidebar({ currentScreen, onNavigate, onCreateEvent }: DesktopSidebarProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'explore', label: '탐색', icon: Search },
    { id: 'groups', label: '그룹', icon: Users },
    { id: 'messages', label: '메시지', icon: MessageCircle },
    { id: 'profile', label: '프로필', icon: User },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col w-64 xl:w-72 bg-card border-r border-border/50 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <AppLogo />
        <p className="text-sm text-muted-foreground mt-2">
          한국의 외국인 커뮤니티
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Create Button */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={onCreateEvent}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">모임 만들기</span>
        </button>
      </div>


    </div>
  );
}
