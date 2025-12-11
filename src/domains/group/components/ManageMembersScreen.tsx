"use client";

import { useState } from 'react';
import { BackButton } from '@/shared/components/BackButton';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, UserMinus, Shield, ShieldCheck, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';

interface ManageMembersScreenProps {
  groupId: string;
  onBack: () => void;
}

type MemberRole = 'owner' | 'admin' | 'member';

interface Member {
  id: string;
  name: string;
  country: string;
  joinedDate: string;
  status: 'confirmed' | 'pending';
  role: MemberRole;
}

export function ManageMembersScreen({ onBack }: ManageMembersScreenProps) {
  // Mock data - 실제로는 API에서 가져옴
  const [confirmedMembers, setConfirmedMembers] = useState<Member[]>([
    { id: '1', name: 'Jiyoung Park', country: '🇰🇷', joinedDate: '2024.09.01', status: 'confirmed', role: 'owner' },
    { id: '2', name: 'Sarah Kim', country: '🇺🇸', joinedDate: '2024.09.15', status: 'confirmed', role: 'admin' },
    { id: '3', name: 'Emma Lee', country: '🇬🇧', joinedDate: '2024.10.01', status: 'confirmed', role: 'member' },
    { id: '4', name: 'Maria Garcia', country: '🇪🇸', joinedDate: '2024.10.05', status: 'confirmed', role: 'member' },
    { id: '5', name: 'Lisa Chen', country: '🇩🇪', joinedDate: '2024.10.10', status: 'confirmed', role: 'member' },
    { id: '6', name: 'Anna Park', country: '🇫🇷', joinedDate: '2024.10.12', status: 'confirmed', role: 'member' },
  ]);

  const [pendingMembers, setPendingMembers] = useState<Member[]>([
    { id: '7', name: 'Sophie Johnson', country: '🇨🇦', joinedDate: '2024.10.20', status: 'pending', role: 'member' },
    { id: '8', name: 'Michael Brown', country: '🇦🇺', joinedDate: '2024.10.21', status: 'pending', role: 'member' },
  ]);

  const handleApprove = (memberId: string) => {
    const member = pendingMembers.find(m => m.id === memberId);
    if (member) {
      setPendingMembers(prev => prev.filter(m => m.id !== memberId));
      setConfirmedMembers(prev => [...prev, { ...member, status: 'confirmed' }]);
    }
  };

  const handleReject = (memberId: string) => {
    setPendingMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleRemove = (memberId: string) => {
    if (confirm('이 멤버를 추방하시겠습니까?')) {
      setConfirmedMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  const handlePromoteToAdmin = (memberId: string) => {
    setConfirmedMembers(prev => 
      prev.map(m => m.id === memberId ? { ...m, role: 'admin' as MemberRole } : m)
    );
  };

  const handleDemoteToMember = (memberId: string) => {
    setConfirmedMembers(prev => 
      prev.map(m => m.id === memberId ? { ...m, role: 'member' as MemberRole } : m)
    );
  };

  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 flex items-center gap-1">
          <Crown className="w-3 h-3" />
          그룹장
        </Badge>;
      case 'admin':
        return <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          부관리자
        </Badge>;
      default:
        return <Badge variant="outline">멤버</Badge>;
    }
  };

  const MemberCard = ({ member, isPending = false }: { member: Member; isPending?: boolean }) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className={`${
              member.role === 'owner' 
                ? 'bg-amber-500/20 text-amber-700' 
                : member.role === 'admin'
                ? 'bg-primary/20 text-primary'
                : 'bg-primary/10 text-primary'
            }`}>
              {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate">{member.name}</p>
              <span className="text-lg flex-shrink-0">{member.country}</span>
            </div>
            <div className="flex items-center gap-2">
              {getRoleBadge(member.role)}
              <span className="text-xs text-muted-foreground">가입일: {member.joinedDate}</span>
            </div>
          </div>
        </div>
        
        {isPending ? (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => handleApprove(member.id)}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-1" />
              승인
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(member.id)}
            >
              <X className="w-4 h-4 mr-1" />
              거부
            </Button>
          </div>
        ) : member.role === 'owner' ? (
          <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30">
            나 (그룹장)
          </Badge>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex-shrink-0">
              관리
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {member.role === 'member' ? (
                <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.id)}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  부관리자로 승격
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleDemoteToMember(member.id)}>
                  <Shield className="w-4 h-4 mr-2" />
                  일반 멤버로 강등
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRemove(member.id)}
                className="text-destructive focus:text-destructive"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                그룹에서 추방
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  // Desktop Layout
  const DesktopView = () => (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="px-8 xl:px-12 pt-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <BackButton onClick={onBack} />
        </div>
      </div>

      <div className="px-8 xl:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl mb-8">멤버 관리</h1>

          <Tabs defaultValue="confirmed" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="confirmed">
                멤버 ({confirmedMembers.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                가입 대기 ({pendingMembers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed" className="space-y-4">
          {/* Role Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                <Crown className="w-5 h-5 text-amber-700" />
              </div>
              <p className="text-sm text-amber-700">그룹장</p>
              <p className="font-medium text-amber-700">
                {confirmedMembers.filter(m => m.role === 'owner').length}
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-primary">부관리자</p>
              <p className="font-medium text-primary">
                {confirmedMembers.filter(m => m.role === 'admin').length}
              </p>
            </div>
            <div className="bg-muted border border-border rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">일반 멤버</p>
              <p className="font-medium">
                {confirmedMembers.filter(m => m.role === 'member').length}
              </p>
            </div>
          </div>

          {confirmedMembers.length > 0 ? (
            confirmedMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserMinus className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">멤버가 없습니다</p>
            </div>
          )}
        </TabsContent>

            <TabsContent value="pending" className="space-y-3">
          {pendingMembers.length > 0 ? (
            pendingMembers.map((member) => (
              <MemberCard key={member.id} member={member} isPending />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">가입 대기 중인 멤버가 없습니다</p>
            </div>
          )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  return <DesktopView />;
}
