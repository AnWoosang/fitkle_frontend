/**
 * Attendee Domain Model
 * 참가자 정보
 */
export interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  joinedAt: Date;
  role: 'host' | 'organizer' | 'member';
}

/**
 * Attendee Info
 * 참가자 상세 정보
 */
export interface AttendeeInfo {
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestCount?: number;
  joinedAt: Date;
}
