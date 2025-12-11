"use client";

import { useState } from 'react';
import { BackButton } from '@/shared/components/BackButton';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Check, X, UserMinus } from 'lucide-react';
import {
  confirmedAttendees as initialConfirmedAttendees,
  pendingAttendees as initialPendingAttendees
} from '@/data/attendees';

interface ManageAttendeesScreenProps {
  eventId: string;
  onBack: () => void;
}

export function ManageAttendeesScreen({ onBack }: ManageAttendeesScreenProps) {
  // Use imported mock data as initial state
  const [confirmedAttendees, setConfirmedAttendees] = useState(initialConfirmedAttendees);
  const [pendingAttendees, setPendingAttendees] = useState(initialPendingAttendees);

  const handleApprove = (attendeeId: string) => {
    const attendee = pendingAttendees.find(a => a.id === attendeeId);
    if (attendee) {
      setPendingAttendees(prev => prev.filter(a => a.id !== attendeeId));
      setConfirmedAttendees(prev => [...prev, { ...attendee, status: 'confirmed' }]);
    }
  };

  const handleReject = (attendeeId: string) => {
    setPendingAttendees(prev => prev.filter(a => a.id !== attendeeId));
  };

  const handleRemove = (attendeeId: string) => {
    if (confirm('이 참가자를 제거하시겠습니까?')) {
      setConfirmedAttendees(prev => prev.filter(a => a.id !== attendeeId));
    }
  };

  const AttendeeCard = ({ attendee, isPending = false }: { attendee: any, isPending?: boolean }) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary">
              {attendee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{attendee.name}</p>
              <span className="text-lg flex-shrink-0">{attendee.country}</span>
            </div>
            <p className="text-sm text-muted-foreground">가입일: {attendee.joinedDate}</p>
          </div>
        </div>
        
        {isPending ? (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => handleApprove(attendee.id)}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-1" />
              승인
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(attendee.id)}
            >
              <X className="w-4 h-4 mr-1" />
              거부
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRemove(attendee.id)}
            className="flex-shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <UserMinus className="w-4 h-4 mr-1" />
            제거
          </Button>
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
          <h1 className="text-3xl mb-8">참가자 관리</h1>

          <Tabs defaultValue="confirmed" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="confirmed">
                확정 참가자 ({confirmedAttendees.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                승인 대기 ({pendingAttendees.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed" className="space-y-3">
          {confirmedAttendees.length > 0 ? (
            confirmedAttendees.map((attendee) => (
              <AttendeeCard key={attendee.id} attendee={attendee} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserMinus className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">확정된 참가자가 없습니다</p>
            </div>
          )}
        </TabsContent>

            <TabsContent value="pending" className="space-y-3">
          {pendingAttendees.length > 0 ? (
            pendingAttendees.map((attendee) => (
              <AttendeeCard key={attendee.id} attendee={attendee} isPending />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">승인 대기 중인 참가자가 없습니다</p>
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
