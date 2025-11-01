import { Users, Calendar, Shield, Heart, Share2, MapPin, Star, CheckCircle2, Facebook, Linkedin, Mail, User, MessageCircle, MoreVertical, Edit, UserCog, Trash2 } from 'lucide-react';
import { groups } from '@/data/groups';
import { events } from '@/data/events';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { EventCard } from '@/domains/event/components/EventCard';
import { BackButton } from '@/shared/components/BackButton';
import { HostCard } from '@/shared/components/HostCard';
import { PhotoGallery } from './PhotoGallery';
import { useState, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface GroupDetailScreenProps {
  groupId: string;
  onBack: () => void;
  onEventClick: (eventId: string) => void;
  onHostClick: (hostId: string) => void;
  isOwner?: boolean;
  onEditGroup?: () => void;
  onManageMembers?: () => void;
  onDeleteGroup?: () => void;
}

export function GroupDetailScreen({ groupId, onBack, onEventClick, onHostClick, isOwner = false, onEditGroup, onManageMembers, onDeleteGroup }: GroupDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'members' | 'photos'>('about');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  
  // Refs for scroll-to-section
  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'about' | 'events' | 'members' | 'photos') => {
    setActiveTab(tab);
    
    // Scroll to the corresponding section after state update
    setTimeout(() => {
      const refs = {
        about: aboutRef,
        events: eventsRef,
        members: membersRef,
        photos: photosRef
      };
      
      const targetRef = refs[tab];
      if (targetRef.current) {
        // Get the scroll container by ID
        const scrollContainer = document.getElementById('main-scroll-container');
        
        if (scrollContainer) {
          // Calculate the position relative to the scroll container
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = targetRef.current.getBoundingClientRect();
          const offsetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;
          
          // Scroll with offset for sticky tab bar (approximately 60px for tab bar height)
          scrollContainer.scrollTo({ 
            top: offsetTop - 60, 
            behavior: 'smooth' 
          });
        }
      }
    }, 50);
  };
  
  const group = groups.find(g => g.id === groupId);

  if (!group) {
    return <div>Group not found</div>;
  }

  // Get events for this group
  const groupEvents = events.filter(e => e.groupId === groupId);

  // Mock members data
  const members = [
    { name: 'Emma', initial: 'E', color: 'bg-pink-200' },
    { name: 'Kai', initial: 'K', color: 'bg-purple-200' },
    { name: 'Julia', initial: 'J', color: 'bg-rose-200' },
    { name: 'Min', initial: '민', color: 'bg-orange-200' },
    { name: 'Sarah', initial: 'S', color: 'bg-yellow-200' },
    { name: 'Tom', initial: 'T', color: 'bg-green-200' },
    { name: 'Lisa', initial: 'L', color: 'bg-blue-200' },
    { name: 'Kim', initial: '김', color: 'bg-indigo-200' },
  ];

  // Mock group photos
  const groupPhotos = [
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGhvbmdkYWV8ZW58MXx8fHwxNzYxMDAwMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMHBhcnR5JTIwZnJpZW5kc3xlbnwxfHx8fDE3NjEwMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBhcnR5JTIwcGVvcGxlfGVufDF8fHx8MTc2MTAwMDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2MTAwMDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzYxMDAwMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5fGVufDF8fHx8MTc2MTAwMDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGxpZmUlMjBwYXJ0eXxlbnwxfHx8fDE3NjEwMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NjEwMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcGVvcGxlfGVufDF8fHx8MTc2MTAwMDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMG1lZXR1cHxlbnwxfHx8fDE3NjEwMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // Mobile Layout
  const MobileView = () => (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain pb-6">
      {/* Header with Back Button */}
      <div className="sticky top-0 left-0 right-0 z-20 px-4 pt-4 pb-3 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
        <BackButton onClick={onBack} className="shadow-lg" />
      </div>

      {/* Group Cover Image */}
      <div className="relative -mt-14 h-56">
        <img
          src={group.image}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 space-y-5 -mt-8 relative z-10">
        {/* Group Info Card */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-lg">
          <div className="flex items-start gap-2 mb-2">
            <h1 className="flex-1">{group.name}</h1>
            <div className="flex items-center gap-2">
              {group.isVerified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1">
                  <Shield className="w-3 h-3" />
                  인증됨
                </Badge>
              )}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onEditGroup} className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-3 text-primary" />
                      <span>그룹 수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onManageMembers} className="cursor-pointer">
                      <UserCog className="w-4 h-4 mr-3 text-primary" />
                      <span>멤버 관리</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDeleteGroup} className="cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-3" />
                      <span>그룹 삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm">{group.members.toLocaleString()} 멤버</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">{group.eventCount} 이벤트</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {group.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-accent/50">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Join Button */}
          <Button className="w-full h-11 rounded-lg">
            그룹 가입
          </Button>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-3">그룹 소개</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {group.description}
            </p>
          </div>
        </div>

        {/* Organizer */}
        <div>
          <h3 className="mb-3">주최자</h3>
          <button
            onClick={() => onHostClick('1')}
            className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:bg-accent/50 hover:border-primary/30 transition-all text-left"
          >
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {group.hostName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{group.hostName}</p>
              <p className="text-sm text-muted-foreground">{group.eventCount} 이벤트 주최</p>
            </div>
          </button>
        </div>

        {/* Group Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>그룹 이벤트 ({groupEvents.length})</h3>
            {groupEvents.length > 3 && (
              <button className="text-sm text-primary">전체 보기</button>
            )}
          </div>
          {groupEvents.length > 0 ? (
            <div className="space-y-3">
              {groupEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => onEventClick(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-muted/30 rounded-xl border border-border/50">
              <p className="text-muted-foreground">예정된 이벤트가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Desktop Layout - Meetup Style
  const DesktopView = () => (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="px-8 xl:px-12 pt-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <BackButton onClick={onBack} />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Group Header */}
              <div className="flex items-start gap-6">
                {/* Group Logo */}
                <div className="w-48 h-48 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <div className="text-center">
                    <div className="text-6xl text-red-600 tracking-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>YNA</div>
                    <div className="text-red-600 text-sm mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>You're Not Alone</div>
                  </div>
                </div>

                {/* Group Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-4xl flex-1">🎊 2030 global student party in Hongdae 🎊</h1>
                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
                            <MoreVertical className="w-4 h-4" />
                            <span className="text-sm font-medium">관리</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={onEditGroup} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-3 text-primary" />
                            <span>그룹 수정</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={onManageMembers} className="cursor-pointer">
                            <UserCog className="w-4 h-4 mr-3 text-primary" />
                            <span>멤버 관리</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={onDeleteGroup} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-3" />
                            <span>그룹 삭제</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-red-500 text-red-500" />
                      ))}
                      <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                    </div>
                    <span className="text-sm">4.3 · 16 ratings</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Seoul, Korea (South)</span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">218 members · Public group</span>
                  </div>

                  {/* Share */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Share</p>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors">
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                        </svg>
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs - Sticky */}
              <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'about', icon: '🎨', label: 'About' },
                    { id: 'events', icon: '🎁', label: 'Events' },
                    { id: 'members', icon: '👥', label: 'Members' },
                    { id: 'photos', icon: '🖼️', label: 'Photos' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'about' && (
                <div ref={aboutRef} className="space-y-8">
                  {/* What we're about */}
                  <div>
                    <h2 className="mb-4">What we're about ✨</h2>
                    <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>✅ The meet-up will be held on the 5th floor❗</span>
                      </p>
                      <p>
                        Hello guys👋 This is Tyler from YNA Language Exchange in Hongdae👍
                      </p>
                      <p>
                        Our YNA Language Exchange group is a conversational platform where people from around
                        the world can exchange languages and cultures.
                      </p>
                      <p>
                        We use themed conversation cards to pick topics with members and discuss them in
                        English🔥Every 40 minutes, participants change seats to ensure everyone gets the
                        opportunity to talk with each other🎉We are an international group where people from all
                        over the world gather to practice language skills, make new friends, and learn about 
                        different cultures in a fun and relaxed environment.
                      </p>
                      <p>
                        Whether you're a beginner or fluent, everyone is welcome! Our events are designed to be 
                        inclusive and supportive, creating a space where you can improve your English while meeting 
                        amazing people from diverse backgrounds.
                      </p>
                      <p>
                        Join us for weekly meetups where we discuss everything from travel and food to movies and 
                        life experiences. Each session is carefully structured to maximize interaction and ensure 
                        everyone has a chance to participate.
                      </p>
                      <button className="text-primary text-sm hover:underline">Read more</button>
                    </div>
                  </div>

                  {/* Related topics */}
                  <div>
                    <h2 className="mb-4">Related topics</h2>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'International Relations',
                        'Dinner Parties',
                        'Coffee and Tea Socials',
                        'International Friends',
                        'English as a Second Language',
                        'Social Dancing',
                        'Language & Culture',
                        'Spanish & English Language Exchange',
                        'International and Exchange Students',
                        'Language Exchange',
                        'Korean',
                        'English',
                        'Practice English',
                        'Social Networking',
                        'Culture Exchange',
                      ].map((topic, idx) => (
                        <button
                          key={idx}
                          className="px-4 py-2 bg-muted/50 border border-border rounded-full text-sm hover:bg-muted transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ratings */}
                  <div>
                    <h2 className="mb-4">Ratings</h2>
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-5xl mb-2">4.3</div>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[1, 2, 3, 4].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-red-500 text-red-500" />
                            ))}
                            <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                          </div>
                          <p className="text-sm text-muted-foreground">16 ratings</p>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          {[
                            { stars: 5, count: 10, percentage: 62.5 },
                            { stars: 4, count: 4, percentage: 25 },
                            { stars: 3, count: 2, percentage: 12.5 },
                            { stars: 2, count: 0, percentage: 0 },
                            { stars: 1, count: 0, percentage: 0 },
                          ].map((rating) => (
                            <div key={rating.stars} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-12">
                                <span className="text-sm">{rating.stars}</span>
                                <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                              </div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${rating.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2>Reviews</h2>
                      <button className="text-sm text-primary hover:underline">See all</button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Sarah Johnson',
                          initial: 'S',
                          color: 'bg-pink-200',
                          rating: 5,
                          date: 'October 15, 2024',
                          text: 'Amazing experience! The atmosphere was so welcoming and I met so many interesting people from different countries. The conversation cards made it easy to break the ice.'
                        },
                        {
                          name: 'Kim Min-ji',
                          initial: '김',
                          color: 'bg-purple-200',
                          rating: 5,
                          date: 'October 12, 2024',
                          text: 'Great way to practice English and make friends! The organizers are super friendly and make everyone feel included. Highly recommend!'
                        },
                        {
                          name: 'Alex Martinez',
                          initial: 'A',
                          color: 'bg-blue-200',
                          rating: 4,
                          date: 'October 8, 2024',
                          text: 'Really enjoyed the event. The venue was perfect and the activities were well-organized. Looking forward to the next one!'
                        },
                      ].map((review, idx) => (
                        <div key={idx} className="bg-card border border-border rounded-2xl p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center flex-shrink-0`}>
                              <span>{review.initial}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium mb-1">{review.name}</p>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? 'fill-red-500 text-red-500'
                                          : 'fill-gray-300 text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div ref={eventsRef} className="space-y-6">
                  {/* List/Calendar Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2>Events</h2>
                      <span className="text-muted-foreground">11</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        List
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted">
                        <Calendar className="w-4 h-4" />
                        Calendar
                      </button>
                      <select className="px-3 py-1.5 border border-border rounded-lg text-sm bg-background">
                        <option>Upcoming</option>
                        <option>Past</option>
                      </select>
                    </div>
                  </div>

                  {/* Upcoming events */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2>Upcoming events</h2>
                      <button className="text-sm text-primary hover:underline">See all</button>
                    </div>

                    {/* Event Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupEvents.slice(0, 4).map((event) => (
                        <div
                          key={event.id}
                          className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => onEventClick(event.id)}
                        >
                          <div className="relative aspect-[16/9]">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <button 
                              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle bookmark action
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-2">{event.date} · {event.time}</p>
                            <h3 className="mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs mb-3">
                              <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">✅ The meet-up will be held on the 5th floor❗</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {members.slice(0, 3).map((member, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-6 h-6 rounded-full border-2 border-background ${member.color} flex items-center justify-center text-xs`}
                                  >
                                    {member.initial}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past events */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2>Past events</h2>
                        <span className="text-muted-foreground">142</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="bg-card border border-border rounded-2xl overflow-hidden"
                        >
                          <div className="relative aspect-[16/9]">
                            <img
                              src="https://images.unsplash.com/photo-1621112904887-419379ce6824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcGFydHklMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzYwODAzOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                              alt="Past event"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-2">Oct {10 + idx}, 2024 · 8:00 PM GMT+9</p>
                            <h3 className="mb-3">🎊 YNA Language Exchange Party</h3>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span>Hongdae, Seoul</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {members.slice(0, 3).map((member, midx) => (
                                  <div
                                    key={midx}
                                    className={`w-6 h-6 rounded-full border-2 border-background ${member.color} flex items-center justify-center text-xs`}
                                  >
                                    {member.initial}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{32 + idx * 3} attended</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similar events nearby */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2>Similar events nearby</h2>
                      <span className="text-2xl">🎫</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          image: 'https://images.unsplash.com/photo-1567448305512-8015a996bb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnQlMjBjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc2MDgwNDg0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
                          date: 'Sun, Oct 19',
                          time: '5:00 PM GMT+9',
                          title: 'SeoulShare HandCraft 🏺🍵 Coffee & Chat ☕ in Insadong,...',
                          organizer: 'SeoulShare Community',
                          location: 'KOTE Joseon Salon, 7, Insadong 1-gil,...'
                        },
                        {
                          image: 'https://images.unsplash.com/photo-1559149811-7f3865354317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwY2FmZXxlbnwxfHx8fDE3NjA4MDQ4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
                          date: 'Sun, Oct 19',
                          time: '3:30 PM GMT+9',
                          title: '[InnerCircle]Sunday Funday Play Boardgames & Language...',
                          organizer: 'InnerCircleSeoul',
                          location: '창신단길 커피, 16 Changsin-gil, Chan...'
                        },
                      ].map((event, idx) => (
                        <div
                          key={idx}
                          className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="relative aspect-[16/9]">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <button 
                              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle bookmark action
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-2">{event.date} · {event.time}</p>
                            <h3 className="mb-3">{event.title}</h3>
                            <div className="flex items-start gap-2 text-xs mb-2">
                              <User className="w-3 h-3 flex-shrink-0 mt-0.5 text-muted-foreground" />
                              <span className="text-muted-foreground">by {event.organizer}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div ref={membersRef}>
                  <h2 className="mb-4">Members ({members.length + 210})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                        <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center`}>
                          <span>{member.initial}</span>
                        </div>
                        <div>
                          <p className="text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">Member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div ref={photosRef}>
                  <h2 className="mb-4">Photos ({groupPhotos.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {groupPhotos.slice(0, 6).map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setGalleryStartIndex(idx);
                          setIsGalleryOpen(true);
                        }}
                        className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                      >
                        <img
                          src={photo}
                          alt={`Group photo ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {idx === 5 && groupPhotos.length > 6 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <p className="text-white text-2xl">+{groupPhotos.length - 6}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Join Button - Sticky */}
              <div className="lg:sticky lg:top-6">
                <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background mb-6">
                  Join this group
                </Button>

                {/* Organizers */}
                <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                  <h3 className="mb-4">Organizers</h3>
                  <button
                    onClick={() => onHostClick('1')}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-purple-200 text-purple-900">
                        B
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p>Becky</p>
                    </div>
                  </button>
                  <Button
                    variant="outline"
                    className="w-full mt-3 gap-2"
                    onClick={() => onHostClick('1')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                </div>

                {/* Members */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3>Members</h3>
                    <span className="text-sm text-muted-foreground">218</span>
                    <button className="text-sm text-primary hover:underline">See all</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center`}
                        title={member.name}
                      >
                        <span className="text-sm">{member.initial}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileView />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopView />
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={groupPhotos}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </>
  );
}
