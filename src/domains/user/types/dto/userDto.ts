/**
 * User DTO (Data Transfer Object)
 * BFF API와 통신하기 위한 데이터 전송 객체
 */

/**
 * 사용자 관심사 DTO
 */
export interface UserInterestDto {
  id: string;
  code: string;
  name_ko: string;
  emoji: string;
}

/**
 * 프로필 응답 DTO (from BFF)
 */
export interface UserProfileResponseDto {
  id: string;
  name: string | null;
  email: string;
  location: string | null;
  nationality: string | null;
  created_at: string;
  bio: string | null;
  trust_score: number;
  groups_count: number;
  interests_count: number;
  interests: UserInterestDto[];
  events_attended: number;
  total_rsvps: number;
}

/**
 * 프로필 업데이트 요청 DTO (to BFF)
 */
export interface UpdateProfileRequestDto {
  bio?: string;
  location?: string;
  nationality?: string;
  looking_for?: string[];
  tags?: string[];
}
