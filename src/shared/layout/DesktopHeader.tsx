import { Home, Search, Users, MessageCircle, User, Plus } from 'lucide-react';
import { AppLogo } from '@/shared/components/AppLogo';

interface DesktopHeaderProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onCreateEvent: () => void;
}

export function DesktopHeader({ currentScreen, onNavigate, onCreateEvent }: DesktopHeaderProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'explore', label: '탐색', icon: Search },
    { id: 'groups', label: '그룹', icon: Users },
    { id: 'messages', label: '메시지', icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <AppLogo compact />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Create Event Button */}
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">모임 만들기</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentScreen === 'profile'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">프로필</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
