"use client";

import { Home, Search, Users, MessageCircle, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/useTranslations';
import { ROUTES } from '@/app/router/routes';

interface BottomNavigationProps {
  onCreateEvent?: () => void;
}

export function BottomNavigation({}: BottomNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');

  const navItems = [
    {
      icon: Home,
      label: t('home'),
      route: ROUTES.HOME,
      isActive: pathname === ROUTES.HOME,
    },
    {
      icon: Search,
      label: t('explore'),
      route: '/explore',
      isActive: pathname?.startsWith('/explore') || pathname?.startsWith('/events'),
    },
    {
      icon: Users,
      label: t('groups'),
      route: ROUTES.GROUPS,
      isActive: pathname?.startsWith('/groups'),
    },
    {
      icon: MessageCircle,
      label: t('messages'),
      route: ROUTES.MESSAGES,
      isActive: pathname?.startsWith('/messages'),
    },
    {
      icon: User,
      label: t('profile'),
      route: ROUTES.PROFILE,
      isActive: pathname?.startsWith('/profile'),
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/50 shadow-lg">
      <div className="flex items-center justify-around px-1 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                item.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
