"use client";

import { Edit2, MapPin, Calendar, Globe, Mail, Sparkles, Users, Heart, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useProfile } from '../hooks';
import type { TrustLevel } from '../types/user';

interface ProfileScreenProps {
  onLogout?: () => void;
  onEventsClick?: () => void;
  onGroupsClick?: () => void;
  onAuthClick?: () => void;
}

export function ProfileScreen({}: ProfileScreenProps) {
  const router = useRouter();

  // 커스텀 훅으로 프로필 데이터 관리
  const { data: profile, isLoading } = useProfile();

  // 편집 페이지로 이동
  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 프로필이 없을 때
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // Trust Score 관련 유틸 함수
  const getTrustColor = (score: number | undefined) => {
    if (!score) return 'from-gray-400 to-gray-500';
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-blue-500 to-cyan-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getTrustEmoji = (level: TrustLevel | undefined) => {
    if (!level) return '❓';
    switch (level) {
      case 'Excellent': return '🌟';
      case 'Good': return '👍';
      case 'Fair': return '⚠️';
      default: return '⛔';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Banner */}
      <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent-sage/20 border-b border-border/30">  
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-rose via-accent-rose/80 to-accent-rose-dark flex items-center justify-center shadow-xl ring-4 ring-white/50">
                  <span className="text-4xl text-white">T</span>
                </div>
                <button
                  onClick={handleEditClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:scale-110"
                >
                  <Edit2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">@{profile.name.toLowerCase()}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {profile.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all border border-border/30 shadow-md hover:shadow-lg"
            >
              <Edit2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Edit profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 2단 레이아웃 */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* 기본 정보 Card */}
            <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-sm">
              <h3 className="font-semibold mb-4">기본 정보</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">이메일</p>
                    <p className="text-xs font-medium truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">위치</p>
                    <p className="text-xs font-medium">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">국적</p>
                    <p className="text-xs font-medium">{profile.nationality}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">그룹</p>
                    <p className="text-xs font-medium">{profile.groups}개 참여 중</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">About me</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* My Interests */}
            <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">My interests <span className="text-sm text-muted-foreground">({profile.interests})</span></h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interestsList && profile.interestsList.length > 0 ? (
                  profile.interestsList.map((interest) => (
                    <Badge
                      key={interest.id}
                      variant="outline"
                      className="px-3 py-1 text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 cursor-pointer transition-all"
                    >
                      {interest.emoji && `${interest.emoji} `}{interest.name_ko}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">관심사를 추가해주세요.</p>
                )}
              </div>
            </div>

            {/* Find Your People Banner */}
            <div className="bg-gradient-to-br from-accent-sage/30 via-primary/10 to-accent-sage/20 rounded-2xl p-5 border border-primary/20 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform">👋</div>
                  <div>
                    <h3 className="text-sm font-semibold mb-0.5">Find your people</h3>
                    <p className="text-xs text-muted-foreground">Join a new group near you!</p>
                  </div>
                </div>
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-4 py-2 text-sm shadow-md hover:shadow-lg transition-all">
                  Explore
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trust Score Card */}
            <div className="bg-card rounded-2xl p-5 border border-border/30 shadow-sm">
              <TooltipProvider>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTrustColor(profile.trustScore)} flex items-center justify-center shadow-lg`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">Trust Score</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground hover:text-primary transition-colors">
                                <HelpCircle className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs p-3 bg-black text-white border-black">
                              <div className="space-y-2">
                                <p className="text-xs font-medium">신뢰도 점수란?</p>
                                <p className="text-xs text-gray-300">
                                  RSVP 후 실제 참석률을 기반으로 계산됩니다.
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-bold text-primary">{profile.trustScore}</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {getTrustEmoji(profile.trustLevel)} {profile.trustLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${getTrustColor(profile.trustScore)} transition-all duration-700`}
                        style={{ width: `${profile.trustScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Attendance Rate */}
                    <div className="flex flex-col items-center p-3 rounded-xl bg-muted/20 border border-border/30">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 mb-1.5" />
                      <span className="text-xs text-muted-foreground mb-1">Attendance</span>
                      <span className="text-xs font-semibold">{profile.attendanceRate}%</span>
                    </div>

                    {/* Total RSVPs */}
                    <div className="flex flex-col items-center p-3 rounded-xl bg-muted/20 border border-border/30">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 mb-1.5" />
                      <span className="text-xs text-muted-foreground mb-1">RSVP</span>
                      <span className="text-xs font-semibold">{profile.totalRSVPs}</span>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
