import { Event, EventType, EventForm, EventFormat } from '../event';
import { Attendee } from '../attendee';
import { EventResponseDto, AttendeeResponseDto, CreateEventRequestDto } from './eventDto';
import type { CategoryResponse } from '@/shared/types';

/**
 * Helper: Check if date is within N days from now
 */
function isWithinDays(date: Date, days: number): boolean {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
}

/**
 * EventResponseDto → Event Domain Model 변환
 * BFF에서 이미 camelCase로 변환된 응답을 사용
 * @param dto - 이벤트 응답 DTO
 * @param categories - 카테고리 목록 (선택적, 클라이언트 사이드 조인용)
 */
export function toEvent(dto: EventResponseDto, categories?: CategoryResponse[]): Event {
  const createdAt = new Date(dto.createdAt);

  // 카테고리 ID로 카테고리 정보 조회 (클라이언트 사이드 조인)
  const category = categories?.find(cat => cat.id === dto.categoryId);

  return {
    // DB fields (BFF에서 camelCase로 변환됨)
    id: dto.id,
    title: dto.title,
    date: dto.date,
    time: dto.time,
    datetime: dto.datetime,
    format: dto.format === 'ONLINE' ? EventFormat.ONLINE : EventFormat.OFFLINE,
    attendees: dto.attendees,
    maxAttendees: dto.maxAttendees,
    image: dto.image, // BFF: image (not image_url)
    // 카테고리 정보 (클라이언트 사이드 조인)
    categoryId: dto.categoryId,
    categoryCode: category?.code,
    categoryName: category?.name,
    categoryEmoji: category?.emoji,
    groupId: dto.groupId ?? undefined,
    groupName: dto.groupName,
    description: dto.description ?? undefined,
    hostName: dto.hostName ?? undefined,
    hostId: dto.hostId, // BFF: hostId (not host_member_id)
    createdAt,
    updatedAt: new Date(dto.updatedAt),
    streetAddress: dto.streetAddress ?? undefined, // ONLINE: URL, OFFLINE: 실제 주소
    detailAddress: dto.detailAddress ?? undefined, // 상세 주소
    latitude: dto.latitude ?? undefined,
    longitude: dto.longitude ?? undefined,
    tags: dto.tags ?? [],
    isGroupMembersOnly: dto.isGroupMembersOnly,

    // Computed fields
    type: dto.groupId ? EventType.GROUP : EventType.PERSONAL,
    isHot: dto.tags?.includes('hot') ?? false,
    isNew: isWithinDays(createdAt, 7), // Events within 7 days are "new"
  };
}

/**
 * EventResponseDto[] → Event[] 변환
 * @param dtos - 이벤트 응답 DTO 배열
 * @param categories - 카테고리 목록 (선택적, 클라이언트 사이드 조인용)
 */
export function toEvents(dtos: EventResponseDto[], categories?: CategoryResponse[]): Event[] {
  return dtos.map(dto => toEvent(dto, categories));
}

/**
 * EventForm → CreateEventRequestDto 변환
 */
export function toCreateEventRequestDto(form: EventForm): CreateEventRequestDto {
  return {
    title: form.title,
    date: form.date,
    time: form.time,
    type: form.format === EventFormat.ONLINE ? 'online' : 'offline',
    online_link: form.onlineLink,
    max_attendees: form.maxAttendees,
    image_url: form.image,
    category: form.category,
    group_id: form.groupId,
    description: form.description,
    street_address: form.streetAddress,
    detail_address: form.detailAddress,
    latitude: form.latitude,
    longitude: form.longitude,
  };
}

/**
 * AttendeeResponseDto → Attendee Domain Model 변환
 */
export function toAttendee(dto: AttendeeResponseDto): Attendee {
  return {
    id: dto.id,
    name: dto.name,
    avatar: dto.avatar_url,
    country: dto.country,
    joinedAt: new Date(dto.joined_at),
    role: dto.role,
  };
}

/**
 * AttendeeResponseDto[] → Attendee[] 변환
 */
export function toAttendees(dtos: AttendeeResponseDto[]): Attendee[] {
  return dtos.map(toAttendee);
}
