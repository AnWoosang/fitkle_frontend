"use client";

import {
  Home, Search, Users, MessageCircle, User,
  FileText, UserCircle, Building2, LogIn, UserPlus,
  Plus, MessagesSquare, Newspaper, Calendar, UsersRound,
  Edit, X, Grid3x3, UserCog, ShieldCheck
} from 'lucide-react';

interface ScreenGalleryProps {
  onScreenSelect: (screen: string, eventId?: string, groupId?: string, userId?: string, newsId?: string) => void;
  onClose: () => void;
}

export function ScreenGallery({ onScreenSelect, onClose }: ScreenGalleryProps) {
  const screens = [
    // Main Navigation Screens
    {
      id: 'home',
      name: 'Home',
      description: '홈 화면 - 예정된 이벤트, 저장된 이벤트, 그룹, Fitkle News',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      category: 'Main Navigation'
    },
    {
      id: 'explore',
      name: 'Explore',
      description: '탐색 화면 - 이벤트 검색, 필터링, 카테고리별 탐색',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      category: 'Main Navigation'
    },
    {
      id: 'groups',
      name: 'Groups',
      description: '그룹 화면 - 그룹 탐색, 검색, 필터링',
      icon: Users,
      color: 'from-green-500 to-green-600',
      category: 'Main Navigation'
    },
    {
      id: 'messages',
      name: 'Messages',
      description: '메시지 화면 - 대화 목록',
      icon: MessageCircle,
      color: 'from-pink-500 to-pink-600',
      category: 'Main Navigation'
    },
    {
      id: 'profile',
      name: 'Profile',
      description: '프로필 화면 - 사용자 정보, 통계, 자기소개',
      icon: User,
      color: 'from-orange-500 to-orange-600',
      category: 'Main Navigation'
    },

    // Detail Screens
    {
      id: 'detail',
      name: 'Event Detail',
      description: '이벤트 상세 화면 - 날짜, 위치, 참가자, 호스트 정보',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      category: 'Detail Screens',
      params: { eventId: 'c610e78f-8377-447e-9d3d-20bfed978d72' }
    },
    {
      id: 'userProfile',
      name: 'User Profile',
      description: '사용자 프로필 화면 - 호스트/참가자 정보',
      icon: UserCircle,
      color: 'from-cyan-500 to-cyan-600',
      category: 'Detail Screens',
      params: { userId: 'host-1' }
    },
    {
      id: 'groupDetail',
      name: 'Group Detail',
      description: '그룹 상세 화면 - 그룹 정보, 멤버, 이벤트',
      icon: Building2,
      color: 'from-teal-500 to-teal-600',
      category: 'Detail Screens',
      params: { groupId: 'seoul-hikers' }
    },
    {
      id: 'newsDetail',
      name: 'News Detail',
      description: 'Fitkle News 상세 화면',
      icon: Newspaper,
      color: 'from-amber-500 to-amber-600',
      category: 'Detail Screens',
      params: { newsId: 'news-1' }
    },

    // List Screens
    {
      id: 'myEventsList',
      name: 'My Events List',
      description: '참여한 이벤트 전체 목록',
      icon: Calendar,
      color: 'from-violet-500 to-violet-600',
      category: 'List Screens'
    },
    {
      id: 'myGroupsList',
      name: 'My Groups List',
      description: '참여한 그룹 전체 목록',
      icon: UsersRound,
      color: 'from-emerald-500 to-emerald-600',
      category: 'List Screens'
    },

    // Action Screens
    {
      id: 'createEvent',
      name: 'Create Event',
      description: '이벤트 만들기 화면',
      icon: Plus,
      color: 'from-rose-500 to-rose-600',
      category: 'Action Screens'
    },
    {
      id: 'createGroup',
      name: 'Create Group',
      description: '그룹 만들기 화면',
      icon: Plus,
      color: 'from-lime-500 to-lime-600',
      category: 'Action Screens'
    },
    {
      id: 'editEvent',
      name: 'Edit Event',
      description: '이벤트 수정 화면',
      icon: Edit,
      color: 'from-sky-500 to-sky-600',
      category: 'Action Screens',
      params: { eventId: '21' }
    },
    {
      id: 'editGroup',
      name: 'Edit Group',
      description: '그룹 수정 화면',
      icon: Edit,
      color: 'from-teal-500 to-teal-600',
      category: 'Action Screens',
      params: { groupId: 'seoul-hikers' }
    },
    {
      id: 'manageAttendees',
      name: 'Manage Attendees',
      description: '이벤트 참가자 관리 (승인/거부)',
      icon: UserCog,
      color: 'from-orange-500 to-orange-600',
      category: 'Action Screens',
      params: { eventId: '21' }
    },
    {
      id: 'manageMembers',
      name: 'Manage Members',
      description: '그룹 멤버 관리 (역할 부여, 추방)',
      icon: ShieldCheck,
      color: 'from-amber-500 to-amber-600',
      category: 'Action Screens',
      params: { groupId: 'seoul-hikers' }
    },
    {
      id: 'chat',
      name: 'Chat',
      description: '1:1 채팅 화면',
      icon: MessagesSquare,
      color: 'from-fuchsia-500 to-fuchsia-600',
      category: 'Action Screens',
      params: { userId: 'host-1', userName: 'Jiyoung Park' }
    },

    // Auth Screens
    {
      id: 'login',
      name: 'Login',
      description: '로그인 화면',
      icon: LogIn,
      color: 'from-gray-500 to-gray-600',
      category: 'Auth Screens'
    },
    {
      id: 'signup',
      name: 'Sign Up',
      description: '회원가입 화면',
      icon: UserPlus,
      color: 'from-slate-500 to-slate-600',
      category: 'Auth Screens'
    },
  ];

  const categories = Array.from(new Set(screens.map(s => s.category)));

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl">Screen Gallery</h1>
                <p className="text-sm text-muted-foreground">
                  {screens.length}개의 화면 · 인터랙션 테스트
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Screen Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-xl mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screens
                .filter(screen => screen.category === category)
                .map((screen) => {
                  const Icon = screen.icon;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => {
                        if (screen.params) {
                          const { eventId, groupId, userId, newsId } = screen.params as any;
                          onScreenSelect(screen.id, eventId, groupId, userId, newsId);
                        } else {
                          onScreenSelect(screen.id);
                        }
                      }}
                      className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all text-left overflow-hidden"
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${screen.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${screen.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="mb-2 group-hover:text-primary transition-colors">
                        {screen.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {screen.description}
                      </p>

                      {/* Params Badge */}
                      {screen.params && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <span className="text-xs text-muted-foreground font-mono">
                            {Object.entries(screen.params).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}

                      {/* Hover Arrow */}
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary">→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center text-sm text-muted-foreground">
          <p>💡 각 화면을 클릭하여 실제 동작을 확인하세요</p>
          <p className="mt-2">모든 인터랙션과 네비게이션이 연결되어 있습니다</p>
        </div>
      </div>
    </div>
  );
}
