'use client';

import { Users, Calendar, MapPin, Star, Award, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useMyGroups } from '../hooks/useMyGroups';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import type { Group } from '../types/group';

interface MyGroupsListScreenProps {
  onBack: () => void;
  onGroupClick: (groupId: string, isOwner?: boolean) => void;
  initialFilter?: 'created' | 'joined';
}

export function MyGroupsListScreen({ onBack: _onBack, onGroupClick, initialFilter = 'created' }: MyGroupsListScreenProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>(initialFilter);

  // initialFilter가 변경되면 activeTab도 업데이트 (URL 변경 시)
  useEffect(() => {
    setActiveTab(initialFilter);
  }, [initialFilter]);

  // 인증 체크
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUtils();

  // 내 그룹 조회 (호스트인 그룹 + 멤버로 참여 중인 그룹)
  const { data: myGroups = [], isLoading: groupsLoading } = useMyGroups({
    enabled: isAuthenticated, // 인증된 경우에만 실행
  });

  // 탭별 필터링
  const createdGroups = myGroups.filter(g => g.hostId === user?.id);
  const joinedGroups = myGroups.filter(g => g.hostId !== user?.id);

  // 통계 데이터 (실제 값으로 계산)
  const stats = [
    {
      icon: Users,
      label: 'Total Groups',
      value: (createdGroups.length + joinedGroups.length).toString(),
      color: 'bg-gradient-to-br from-primary to-primary/80',
      iconBg: 'bg-primary/20',
    },
    {
      icon: Calendar,
      label: 'Created Groups',
      value: createdGroups.length.toString(),
      color: 'bg-gradient-to-br from-accent-sage to-accent-sage/80',
      iconBg: 'bg-accent-sage/20',
    },
    {
      icon: Award,
      label: 'Joined Groups',
      value: joinedGroups.length.toString(),
      color: 'bg-gradient-to-br from-accent-rose to-accent-rose/80',
      iconBg: 'bg-accent-rose/20',
    },
  ];

  // 로딩 상태
  const isLoading = authLoading || groupsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">그룹을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 비인증 상태 처리
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl mb-2">로그인이 필요합니다</h3>
          <p className="text-sm text-muted-foreground mb-6">
            내 그룹을 확인하려면 로그인해주세요
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  const getActivityColor = (eventCount: number) => {
    if (eventCount >= 15) return 'bg-emerald-500';
    if (eventCount >= 8) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getActivityLabel = (eventCount: number) => {
    if (eventCount >= 15) return 'Very Active';
    if (eventCount >= 8) return 'Active';
    return 'New';
  };

  const GroupCard = ({ group, isOwner = false }: { group: Group, isOwner?: boolean }) => (
    <button
      onClick={() => onGroupClick(group.id, isOwner)}
      className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left group"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={group.image}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Badge */}
        <div className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3">
          {isOwner ? (
            <div className="px-2 py-0.5 lg:px-2.5 lg:py-1 bg-primary/90 backdrop-blur-sm text-white text-[10px] lg:text-xs rounded-full shadow-lg font-medium flex items-center gap-1">
              <Edit className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
              <span>관리자</span>
            </div>
          ) : (
            <div className={`px-2 py-0.5 lg:px-2.5 lg:py-1 ${getActivityColor(group.eventCount)}/90 backdrop-blur-sm text-white text-[10px] lg:text-xs rounded-full shadow-lg font-medium`}>
              {getActivityLabel(group.eventCount)}
            </div>
          )}
        </div>
        
        {/* Member Count & Rating */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 lg:bottom-3 lg:left-3 lg:right-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 lg:gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full shadow-lg">
              <Users className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary" />
              <span className="text-[10px] lg:text-xs text-foreground font-medium">
                {group.members >= 1000 
                  ? `${(group.members / 1000).toFixed(1)}k` 
                  : group.members.toLocaleString()}
              </span>
            </div>
            
            {group.rating && (
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full shadow-lg">
                <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] lg:text-xs text-foreground font-medium">{group.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 lg:p-3.5">
        {/* Category Badge */}
        <div className="mb-1.5 lg:mb-2">
          <span className="inline-block text-[10px] lg:text-xs px-2 py-0.5 lg:px-2.5 lg:py-1 bg-primary/10 text-primary rounded-lg font-medium">
            {group.categoryName || group.categoryCode || 'Category'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xs lg:text-sm mb-1.5 lg:mb-2 line-clamp-2 leading-tight">{group.name}</h3>

        {/* Stats */}
        <div className="flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs text-muted-foreground">
          <div className="flex items-center gap-0.5 lg:gap-1">
            <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary flex-shrink-0" />
            <span>{group.eventCount}</span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center gap-0.5 lg:gap-1 min-w-0 flex-1">
            <MapPin className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{group.location}</span>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-white">
        <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 py-5 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">My Groups</h1>
              <p className="text-sm text-muted-foreground">
                Your communities and connections
              </p>
            </div>
          </div>

          {/* Stats Cards - Desktop Compact */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-card/50"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs & Groups Grid */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'created' | 'joined')}>
          {/* Tabs */}
          <div className="bg-background">
            <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto">
              <TabsList className="bg-transparent border-0 p-0 h-auto">
                <TabsTrigger
                  value="created"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  내가 만든 그룹 ({createdGroups.length})
                </TabsTrigger>
                <TabsTrigger
                  value="joined"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  가입한 그룹 ({joinedGroups.length})
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="created" className="mt-0 px-8 lg:px-24 xl:px-32 2xl:px-40 py-6 pb-6">
            <div className="max-w-[1600px] mx-auto">
              {createdGroups.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {createdGroups.map((group) => (
                    <GroupCard key={group.id} group={group} isOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Edit className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">만든 그룹이 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    새로운 그룹을 만들어보세요
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="joined" className="mt-0 px-8 lg:px-24 xl:px-32 2xl:px-40 py-6 pb-6">
            <div className="max-w-[1600px] mx-auto">
              {joinedGroups.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {joinedGroups.map((group) => (
                    <GroupCard key={group.id} group={group} isOwner={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">가입한 그룹이 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    관심사를 공유하는 사람들과 연결되세요
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
