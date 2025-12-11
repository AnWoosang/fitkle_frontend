"use client";

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, User, Settings, Heart, Share2 } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: typeof User;
  path: string;
}

export function ProfileSettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { id: 'editProfile', label: 'Edit Profile', shortLabel: 'Profile', icon: User, path: '/profile/edit' },
    { id: 'account', label: 'Account', shortLabel: 'Account', icon: Settings, path: '/profile/account' },
    { id: 'personal', label: 'Personal Info', shortLabel: 'Personal', icon: Heart, path: '/profile/personal' },
    { id: 'social', label: 'Social Media', shortLabel: 'Social', icon: Share2, path: '/profile/social' },
  ];

  const handleBack = () => {
    router.push('/profile');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-72 flex-shrink-0">
      <div className="sticky top-6">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Back Button */}
          <div className="border-b border-border px-6 py-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>뒤로 가기</span>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5 border-l-4 border-primary'
                      : 'text-foreground hover:bg-secondary border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
