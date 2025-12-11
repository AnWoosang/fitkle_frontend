/**
 * Event API
 * 이벤트 관련 API 호출 함수
 *
 * BFF Pattern:
 * - Axios를 사용하여 Next.js API Routes (/api/events) 호출
 * - DTO → Mapper를 통해 Domain Model로 변환
 * - 백엔드에서 Supabase와 통신
 */

import { apiClient } from '@/lib/axios';
import type { Event, EventFilters } from '../types/event';
import type {
  CreateEventRequestDto,
  UpdateEventRequestDto,
  EventResponseDto,
} from '../types/dto/eventDto';
import { toEvent, toEvents } from '../types/dto/eventMapper';

export const eventApi = {
  /**
   * 전체 이벤트 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/events
   */
  getEvents: async (): Promise<Event[]> => {
    try {
      // 이벤트와 카테고리를 병렬로 조회
      // interceptor가 response.data.data를 자동 추출함
      const [eventsData, categoriesData] = await Promise.all([
        apiClient.get('/events') as Promise<{ data: EventResponseDto[]; pagination: any }>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      // eventsData는 { data: [...], pagination: {...} } 형태
      // categoriesData는 CategoryResponse[] 형태 (interceptor가 이미 추출함)
      return toEvents(eventsData.data || [], categoriesData || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  /**
   * 단일 이벤트 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/events/:id
   */
  getEventById: async (id: string): Promise<Event | undefined> => {
    try {
      // 이벤트와 카테고리를 병렬로 조회
      const [eventData, categoriesData] = await Promise.all([
        apiClient.get(`/events/${id}`) as Promise<EventResponseDto>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toEvent(eventData, categoriesData || []);
    } catch (error: any) {
      // 404 에러는 undefined 반환
      if (error?.code === 'NOT_FOUND') {
        console.warn('Event not found:', id);
        return undefined;
      }
      console.error('Error fetching event by id:', error);
      throw new Error('Failed to fetch event');
    }
  },

  /**
   * 필터링된 이벤트 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/events?type=...&category=...
   */
  getFilteredEvents: async (filters: EventFilters): Promise<Event[]> => {
    try {
      console.log('🔍 [eventApi.getFilteredEvents] 호출:', filters);

      // 쿼리 파라미터 생성
      const params: Record<string, string> = {};

      if (filters.type && filters.type !== 'all') {
        params.type = filters.type;
      }

      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }

      if (filters.location) {
        params.location = filters.location;
      }

      if (filters.searchQuery) {
        params.searchQuery = filters.searchQuery;
      }

      // 이벤트와 카테고리를 병렬로 조회
      const [eventsData, categoriesData] = await Promise.all([
        apiClient.get('/events', { params }) as Promise<{ data: EventResponseDto[] }>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      let filteredData = eventsData.data || [];
      console.log('📦 [eventApi] 서버에서 받은 데이터:', filteredData.length, '개');

      // Date 필터 (클라이언트 사이드)
      if (filters.date && filters.date !== 'all') {
        const originalLength = filteredData.length;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(today.getDate() + 7);
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        if (filters.date === 'today') {
          filteredData = filteredData.filter((dto) => {
            if (!dto.datetime) return false;
            const eventDate = new Date(dto.datetime);
            return eventDate.toDateString() === today.toDateString();
          });
        } else if (filters.date === 'thisWeek') {
          filteredData = filteredData.filter((dto) => {
            if (!dto.datetime) return false;
            const eventDate = new Date(dto.datetime);
            return eventDate >= today && eventDate < thisWeekEnd;
          });
        } else if (filters.date === 'thisMonth') {
          filteredData = filteredData.filter((dto) => {
            if (!dto.datetime) return false;
            const eventDate = new Date(dto.datetime);
            return eventDate >= today && eventDate <= thisMonthEnd;
          });
        }
        console.log(`🔍 date 필터 (${filters.date}): ${originalLength} → ${filteredData.length}`);
      }

      console.log('✅ [eventApi] 최종 필터링 결과:', filteredData.length, '개');

      // 클라이언트 사이드 조인
      return toEvents(filteredData, categoriesData || []);
    } catch (error) {
      console.error('❌ [eventApi] Error fetching filtered events:', error);
      throw new Error('Failed to fetch filtered events');
    }
  },

  /**
   * 이벤트 생성 (카테고리 클라이언트 사이드 조인)
   * POST /api/events
   */
  createEvent: async (data: CreateEventRequestDto): Promise<Event> => {
    try {
      const requestData = {
        title: data.title,
        date: data.date,
        time: data.time,
        type: data.type,
        online_link: data.online_link || null,
        max_attendees: data.max_attendees,
        image_url: data.image_url || null,
        category: data.category,
        group_id: data.group_id || null,
        description: data.description || null,
        host_member_id: 'temp-host-id', // TODO: 실제 로그인한 사용자 ID
        host_name: null,
        street_address: data.street_address || null,
        detail_address: data.detail_address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        tags: data.tags || [],
      };

      // 이벤트 생성과 카테고리 조회를 병렬로
      const [eventData, categoriesData] = await Promise.all([
        apiClient.post('/events', requestData) as Promise<EventResponseDto>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toEvent(eventData, categoriesData || []);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  },

  /**
   * 이벤트 수정 (카테고리 클라이언트 사이드 조인)
   * PUT /api/events/:id
   */
  updateEvent: async (
    id: string,
    data: UpdateEventRequestDto
  ): Promise<Event> => {
    try {
      const updateData: any = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.time !== undefined) updateData.time = data.time;
      if (data.street_address !== undefined) updateData.street_address = data.street_address;
      if (data.detail_address !== undefined) updateData.detail_address = data.detail_address;
      if (data.max_attendees !== undefined)
        updateData.max_attendees = data.max_attendees;
      if (data.image_url !== undefined) updateData.image_url = data.image_url;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined)
        updateData.description = data.description;

      // 이벤트 수정과 카테고리 조회를 병렬로
      const [eventData, categoriesData] = await Promise.all([
        apiClient.put(`/events/${id}`, updateData) as Promise<EventResponseDto>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toEvent(eventData, categoriesData || []);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  },

  /**
   * 이벤트 삭제
   * DELETE /api/events/:id
   */
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  },

  /**
   * 내 이벤트 조회 (RSVP한 이벤트) - 카테고리 클라이언트 사이드 조인
   * GET /api/events/my-events
   */
  getMyEvents: async (): Promise<Event[]> => {
    try {
      // 내 이벤트와 카테고리를 병렬로 조회
      const [eventsData, categoriesData] = await Promise.all([
        apiClient.get('/events/my-events') as Promise<EventResponseDto[]>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toEvents(eventsData, categoriesData || []);
    } catch (error) {
      console.error('Error fetching my events:', error);
      throw new Error('Failed to fetch my events');
    }
  },

  /**
   * 인기 이벤트 조회 (카테고리 클라이언트 사이드 조인)
   * GET /api/events/trending
   */
  getTrendingEvents: async (): Promise<Event[]> => {
    try {
      // 인기 이벤트와 카테고리를 병렬로 조회
      const [eventsData, categoriesData] = await Promise.all([
        apiClient.get('/events/trending') as Promise<EventResponseDto[]>,
        apiClient.get('/categories?type=event') as Promise<any[]>,
      ]);

      // 클라이언트 사이드 조인
      return toEvents(eventsData, categoriesData || []);
    } catch (error) {
      console.error('Error fetching trending events:', error);
      throw new Error('Failed to fetch trending events');
    }
  },

  /**
   * 이벤트 참가자 조회
   * GET /api/events/:id/participants
   */
  getEventParticipants: async (eventId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/events/${eventId}/participants`);
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
   * 이벤트 이미지 조회
   * GET /api/events/:id/images
   */
  getEventImages: async (eventId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/events/${eventId}/images`);
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
   * 이벤트 호스트 정보 조회
   * GET /api/events/:id/host
   */
  getEventHost: async (eventId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/events/${eventId}/host`);
      return response as unknown as any;
    } catch (error: any) {
      // 404 에러인 경우 null 반환
      if (error?.response?.status === 404 || error?.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  },
};
