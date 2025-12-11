/**
 * Group API
 * 그룹 관련 API 호출 함수
 *
 * BFF Pattern:
 * - Axios를 사용하여 Next.js API Routes (/api/groups) 호출
 * - DTO → Mapper를 통해 Domain Model로 변환
 * - 백엔드에서 Supabase와 통신
 */

import { apiClient } from '@/lib/axios';
import type {
  Group,
  GroupFilters,
  GroupMember,
  GroupImage
} from '../types/group';
import type {
  CreateGroupRequestDto,
  UpdateGroupRequestDto,
  GroupResponseDto,
} from '../types/dto/groupDto';
import { toGroup, toGroups } from '../types/dto/groupMapper';

export const groupApi = {
  /**
   * 전체 그룹 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/groups
   */
  getGroups: async (): Promise<Group[]> => {
    try {
      // 그룹과 카테고리를 병렬로 조회
      const [groupsData, categoriesData] = await Promise.all([
        apiClient.get('/groups') as Promise<{ data: GroupResponseDto[] }>,
        apiClient.get('/categories?type=group') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toGroups(groupsData.data || [], categoriesData || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups');
    }
  },

  /**
   * 단일 그룹 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/groups/:id
   */
  getGroupById: async (id: string): Promise<Group | undefined> => {
    try {
      // 그룹과 카테고리를 병렬로 조회
      const [groupData, categoriesData] = await Promise.all([
        apiClient.get(`/groups/${id}`) as Promise<GroupResponseDto>,
        apiClient.get('/categories?type=group') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toGroup(groupData, categoriesData || []);
    } catch (error: any) {
      // 404 에러는 undefined 반환
      if (error?.code === 'NOT_FOUND') {
        console.warn('Group not found:', id);
        return undefined;
      }
      console.error('Error fetching group by id:', error);
      throw new Error('Failed to fetch group');
    }
  },

  /**
   * 필터링된 그룹 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/groups?category=...&location=...
   */
  getFilteredGroups: async (filters: GroupFilters): Promise<Group[]> => {
    try {
      console.log('🔍 [groupApi.getFilteredGroups] 호출:', filters);

      // 쿼리 파라미터 생성
      const params: Record<string, string> = {};

      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }

      if (filters.location) {
        params.location = filters.location;
      }

      // 그룹과 카테고리를 병렬로 조회
      const [groupsData, categoriesData] = await Promise.all([
        apiClient.get('/groups', { params }) as Promise<{ data: GroupResponseDto[] }>,
        apiClient.get('/categories?type=group') as Promise<any[]>,
      ]);

      const filteredData = groupsData.data || [];

      // 클라이언트 사이드 조인
      return toGroups(filteredData, categoriesData || []);
    } catch (error) {
      console.error('❌ [groupApi] Error fetching filtered groups:', error);
      throw new Error('Failed to fetch filtered groups');
    }
  },

  /**
   * 그룹 생성 (카테고리 클라이언트 사이드 조인)
   * POST /api/groups
   */
  createGroup: async (data: CreateGroupRequestDto): Promise<Group> => {
    try {
      const requestData = {
        name: data.name,
        description: data.description,
        category: data.category,
        location: data.location,
        host_member_id: 'temp-host-id', // TODO: 실제 로그인한 사용자 ID
        host_name: 'Temp Host',
        thumbnail_image_url: data.thumbnail_image_url || null,
        tags: [],
      };

      // 그룹 생성과 카테고리 조회를 병렬로
      const [groupData, categoriesData] = await Promise.all([
        apiClient.post('/groups', requestData) as Promise<GroupResponseDto>,
        apiClient.get('/categories?type=group') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toGroup(groupData, categoriesData || []);
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('Failed to create group');
    }
  },

  /**
   * 그룹 수정 (카테고리 클라이언트 사이드 조인)
   * PUT /api/groups/:id
   */
  updateGroup: async (
    id: string,
    data: UpdateGroupRequestDto
  ): Promise<Group> => {
    try {
      const updateData: any = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.thumbnail_image_url !== undefined)
        updateData.thumbnail_image_url = data.thumbnail_image_url;
      if (data.tags !== undefined) updateData.tags = data.tags;

      // 그룹 수정과 카테고리 조회를 병렬로
      const [groupData, categoriesData] = await Promise.all([
        apiClient.put(`/groups/${id}`, updateData) as Promise<GroupResponseDto>,
        apiClient.get('/categories?type=group') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toGroup(groupData, categoriesData || []);
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group');
    }
  },

  /**
   * 그룹 삭제
   * DELETE /api/groups/:id
   */
  deleteGroup: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/groups/${id}`);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  },

  /**
   * 그룹 멤버 조회
   * GET /api/groups/:id/members
   */
  getGroupMembers: async (groupId: string): Promise<GroupMember[]> => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/members`);
      return response as unknown as GroupMember[];
    } catch (error: any) {
      // 404 에러인 경우 빈 배열 반환
      if (error?.response?.status === 404 || error?.code === 'NOT_FOUND') {
        return [];
      }
      throw error;
    }
  },

  /**
   * 그룹 이미지 조회
   * GET /api/groups/:id/images
   */
  getGroupImages: async (groupId: string): Promise<GroupImage[]> => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/images`);
      return response as unknown as GroupImage[];
    } catch (error: any) {
      // 404 에러인 경우 빈 배열 반환
      if (error?.response?.status === 404 || error?.code === 'NOT_FOUND') {
        return [];
      }
      throw error;
    }
  },

  /**
   * 그룹 이벤트 조회
   * GET /api/groups/:id/events
   */
  getGroupEvents: async (groupId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/events`);
      return response as unknown as any[];
    } catch (error: any) {
      // 404 에러인 경우 빈 배열 반환
      if (error?.response?.status === 404 || error?.code === 'NOT_FOUND') {
        return [];
      }
      throw error;
    }
  },

  /**
   * 사용자가 호스트인 그룹 조회 (Raw DTO만 반환 - 카테고리 조인은 Hook에서 처리)
   * GET /api/groups/my-groups
   */
  getMyGroupsRaw: async (): Promise<GroupResponseDto[]> => {
    try {
      const data = await apiClient.get('/groups/my-groups') as GroupResponseDto[];
      return data;
    } catch (error: any) {
      // 인증 오류나 404인 경우 빈 배열 반환
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch my groups');
    }
  },
};
