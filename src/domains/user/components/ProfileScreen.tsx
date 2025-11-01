import { Edit2, MapPin, Calendar, Globe, Mail, Sparkles, Users, Heart, Shield, TrendingUp, Award, HelpCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { ProfileEditScreen } from './ProfileEditScreen';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

interface ProfileScreenProps {
  onLogout?: () => void;
  onEventsClick?: () => void;
  onGroupsClick?: () => void;
  onAuthClick?: () => void;
}

export function ProfileScreen({ onLogout, onEventsClick, onGroupsClick, onAuthClick }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: 'Tony',
    email: 'show19971002@gmail.com',
    location: 'Seoul, KR',
    nationality: '🇺🇸 United States',
    memberSince: 'Oct 2025',
    groups: 2,
    interests: 6,
    bio: '안녕하세요! 서울에서 새로운 친구들을 만나고 다양한 활동을 즐기는 것을 좋아합니다. 카페 투어, 하이킹, 문화 체험 등 재미있는 것이라면 무엇이든 환영입니다! 😊',
    // Trust Score System
    trustScore: 92,
    attendanceRate: 95,
    eventsAttended: 18,
    totalRSVPs: 19,
    trustLevel: 'Excellent' as 'Excellent' | 'Good' | 'Fair' | 'Poor',
  });

  const handleSaveProfile = (updatedProfile: { bio: string; lookingFor: string[]; tags: string[] }) => {
    // Handle profile updates
  };

  if (isEditing) {
    return (
      <ProfileEditScreen
        onBack={() => setIsEditing(false)}
        currentProfile={{
          bio: '',
          lookingFor: [],
          tags: [],
        }}
        onSave={handleSaveProfile}
      />
    );
  }

  const myInterests = ['Social', 'Outdoors', 'New In Town', 'Make New Friends', 'Fun Times', 'Social Networking'];
  
  const myGroups = [
    {
      id: '1',
      name: 'Darklight_Seoul',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
      members: 342,
    },
    {
      id: '2',
      name: 'Seoul Social and Wellness Meetup',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
      members: 156,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-10">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/30 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-accent-rose via-accent-rose/80 to-accent-rose-dark flex items-center justify-center shadow-lg ring-4 ring-white">
                <span className="text-5xl lg:text-6xl text-white">T</span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-4 border-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:scale-110"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h2>{profile.name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-all flex items-center justify-center lg:justify-start gap-2 px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary/10 border border-primary/20"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit profile
                </button>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Joined {profile.memberSince}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{profile.nationality}</span>
                </div>
              </div>

              {/* Trust Score */}
              <div className="pt-5 mt-5 border-t border-border/30">
                <TooltipProvider>
                  <div className="space-y-4">
                    {/* Trust Score Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-foreground">Trust Score</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground hover:text-primary transition-colors">
                                <HelpCircle className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs p-3 bg-card border-primary/20">
                              <div className="space-y-2">
                                <p className="text-sm">
                                  <strong>신뢰도 점수란?</strong>
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  RSVP 후 실제 참석률을 기반으로 계산됩니다. 노쇼 시 점수가 감소하며, 꾸준히 참석하면 높은 신뢰도를 유지할 수 있습니다.
                                </p>
                                <div className="pt-2 border-t border-border/50 space-y-1 text-xs">
                                  <p><strong>90-100점:</strong> Excellent 🌟</p>
                                  <p><strong>70-89점:</strong> Good 👍</p>
                                  <p><strong>50-69점:</strong> Fair ⚠️</p>
                                  <p><strong>0-49점:</strong> Poor ⛔</p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl text-primary">{profile.trustScore}</div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          <Award className="w-3 h-3 mr-1" />
                          {profile.trustLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-700"
                          style={{ width: `${profile.trustScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span className="text-xs">참석률</span>
                            </div>
                            <div className="text-xl text-foreground">{profile.attendanceRate}<span className="text-sm text-muted-foreground ml-0.5">%</span></div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">RSVP한 이벤트 중 실제 참석한 비율입니다.</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span className="text-xs">참석</span>
                            </div>
                            <div className="text-xl text-foreground">{profile.eventsAttended}<span className="text-sm text-muted-foreground ml-0.5">/ {profile.totalRSVPs}</span></div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">참석한 이벤트 / 전체 RSVP 이벤트</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* About Me */}
          <div className="bg-card rounded-3xl p-6 lg:p-7 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2>About me</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* My Interests */}
          <div className="bg-card rounded-3xl p-6 lg:p-7 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="w-5 h-5 text-primary" />
              <h2>My interests <span className="text-muted-foreground">({profile.interests})</span></h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {myInterests.map((interest, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-gradient-to-r from-muted to-muted/80 hover:from-primary/10 hover:to-primary/5 text-foreground border border-border/50 px-4 py-2.5 cursor-pointer transition-all hover:scale-105 hover:shadow-sm"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* My Groups */}
          <div className="bg-card rounded-3xl p-6 lg:p-7 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-primary" />
              <h2>내 그룹 <span className="text-muted-foreground">({profile.groups})</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={onGroupsClick}
                  className="text-left bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-hidden hover:from-primary/5 hover:to-primary/10 transition-all border border-border/40 hover:border-primary/30 group hover:shadow-md"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    <img 
                      src={group.image} 
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{group.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span>{group.members} members</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Find Your People Banner */}
          <div className="bg-gradient-to-br from-accent-sage/30 via-primary/10 to-accent-sage/20 rounded-3xl p-6 lg:p-8 border border-primary/20 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl group-hover:scale-110 transition-transform">👋</div>
                <div>
                  <h3 className="mb-1">Find your people</h3>
                  <p className="text-sm text-muted-foreground">Join a new group near you!</p>
                </div>
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-2.5 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
