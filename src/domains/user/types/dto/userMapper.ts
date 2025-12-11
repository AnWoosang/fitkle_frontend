/**
 * User DTO Mapper
 * DTO ↔ Domain Model 변환 유틸리티
 */

import type { UserProfile, TrustLevel, UserInterest } from '../user';
import type { UserProfileResponseDto } from './userDto';

/**
 * Trust Score를 기반으로 Trust Level 계산
 */
const calculateTrustLevel = (score: number): TrustLevel => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
};

/**
 * 가입일 포맷팅 (예: "Jan 2024")
 */
const formatMemberSince = (createdAt: string): string => {
  try {
    return new Date(createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
};

/**
 * UserProfileResponseDto → UserProfile 변환
 */
export const toUserProfile = (dto: UserProfileResponseDto): UserProfile => {
  // Trust Score는 이미 API에서 계산됨 (attended_events / total_rsvps * 100)
  const trustScore = dto.trust_score || 0;

  // Attendance Rate는 Trust Score와 동일
  const attendanceRate = trustScore;

  // 관심사 목록 변환
  const interestsList: UserInterest[] = dto.interests?.map(interest => ({
    id: interest.id,
    code: interest.code,
    name_ko: interest.name_ko,
    emoji: interest.emoji,
  })) || [];

  return {
    id: dto.id,
    name: dto.name || 'User',
    email: dto.email,
    location: dto.location || 'Seoul, KR',
    nationality: dto.nationality || '🇰🇷 South Korea',
    memberSince: formatMemberSince(dto.created_at),
    groups: dto.groups_count || 0,
    interests: dto.interests_count || 0,
    interestsList,
    bio: dto.bio || '프로필을 작성해주세요.',
    trustScore,
    attendanceRate,
    eventsAttended: dto.events_attended || 0,
    totalRSVPs: dto.total_rsvps || 0,
    trustLevel: calculateTrustLevel(trustScore),
  };
};
