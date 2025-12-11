/**
 * User API
 * 사용자 프로필 관련 API 호출 함수
 *
 * BFF Pattern:
 * - Axios를 사용하여 Next.js API Routes (/api/users) 호출
 * - DTO → Mapper를 통해 Domain Model로 변환
 * - 백엔드에서 Supabase와 통신
 */

import { apiClient } from '@/lib/axios';
import type { UserProfile, UpdateProfileRequest } from '../types/user';
import type {
  UserProfileResponseDto,
  UpdateProfileRequestDto,
} from '../types/dto/userDto';
import { toUserProfile } from '../types/dto/userMapper';

export const userApi = {
  /**
   * 현재 로그인한 사용자 프로필 조회
   * GET /api/users/profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = (await apiClient.get(
        '/users/profile'
      )) as UserProfileResponseDto;
      return toUserProfile(response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  },

  /**
   * 프로필 업데이트
   * PUT /api/users/profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      const requestData: UpdateProfileRequestDto = {
        bio: data.bio,
        location: data.location,
        nationality: data.nationality,
        looking_for: data.lookingFor,
        tags: data.tags,
      };

      const response = (await apiClient.put(
        '/users/profile',
        requestData
      )) as UserProfileResponseDto;
      return toUserProfile(response);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },
};
