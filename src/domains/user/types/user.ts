/**
 * User Domain Types
 * 사용자 프로필 도메인 모델
 */

/**
 * 신뢰도 레벨
 */
export type TrustLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

/**
 * 사용자 관심사
 */
export interface UserInterest {
  id: string;
  code: string;
  name_ko: string;
  emoji: string;
}

/**
 * 사용자 프로필 도메인 모델
 */
export interface UserProfile {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  avatar_url?: string;
  location?: string;
  nationality?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  bio?: string;

  // Social media handles
  facebook_handle?: string;
  instagram_handle?: string;
  twitter_handle?: string;
  linkedin_handle?: string;
  email_handle?: string;

  // Verification status
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  profile_completed?: boolean;

  // Event statistics
  hosted_events?: number;
  attended_events?: number;
  total_rsvps?: number;

  // Computed fields (may not be in DB)
  memberSince?: string;
  groups?: number;
  interests?: number;
  interestsList?: UserInterest[];
  trustScore?: number;
  attendanceRate?: number;
  eventsAttended?: number;
  totalRSVPs?: number;
  trustLevel?: TrustLevel;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  name_updated_at?: string;
  deleted_at?: string;
}

/**
 * 프로필 업데이트 요청 데이터
 */
export interface UpdateProfileRequest {
  bio?: string;
  nickname?: string;
  location?: string;
  nationality?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  lookingFor?: string[];
  tags?: string[];
  interests?: string[];

  // Social media handles
  facebook_handle?: string;
  instagram_handle?: string;
  twitter_handle?: string;
  linkedin_handle?: string;
  email_handle?: string;
}
