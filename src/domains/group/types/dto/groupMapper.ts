import { Group, GroupForm } from '../group';
import { GroupResponseDto, CreateGroupRequestDto } from './groupDto';
import type { CategoryResponse } from '@/shared/types';

/**
 * GroupResponseDto → Group Domain Model 변환
 * snake_case (DB) → camelCase (Frontend)
 * @param dto - 그룹 응답 DTO
 * @param categories - 카테고리 목록 (선택적, 클라이언트 사이드 조인용)
 */
export function toGroup(dto: GroupResponseDto, categories?: CategoryResponse[]): Group {
  const createdAt = new Date(dto.created_at);

  // 카테고리 ID로 카테고리 정보 조회 (클라이언트 사이드 조인)
  const category = categories?.find(cat => cat.id === dto.categoryId);

  return {
    // DB fields (camelCase로 변환)
    id: dto.id,
    name: dto.name,
    description: dto.description,
    // 카테고리 정보 (클라이언트 사이드 조인)
    categoryId: dto.categoryId,
    categoryCode: category?.code,
    categoryName: category?.name,
    categoryEmoji: category?.emoji,
    members: dto.total_members, // DB: total_members → Frontend: members
    image: dto.thumbnail_image_url || '/images/placeholder-group.jpg', // DB: thumbnail_image_url → Frontend: image
    hostName: dto.host_name, // DB: host_name → Frontend: hostName
    hostId: dto.host_id, // DB: host_id → Frontend: hostId
    eventCount: dto.event_count, // DB: event_count → Frontend: eventCount
    location: dto.location,
    requiresApproval: dto.requires_approval ?? false, // DB: requires_approval → Frontend: requiresApproval
    tags: dto.tags ?? [],
    createdAt,
    updatedAt: new Date(dto.updated_at),

    // Computed fields (optional)
    // rating은 나중에 review 데이터로부터 계산 가능
  };
}

/**
 * GroupResponseDto[] → Group[] 변환
 * @param dtos - 그룹 응답 DTO 배열
 * @param categories - 카테고리 목록 (선택적, 클라이언트 사이드 조인용)
 */
export function toGroups(dtos: GroupResponseDto[], categories?: CategoryResponse[]): Group[] {
  return dtos.map(dto => toGroup(dto, categories));
}

/**
 * GroupForm → CreateGroupRequestDto 변환
 * camelCase (Frontend) → snake_case (DB)
 */
export function toCreateGroupRequestDto(form: GroupForm): CreateGroupRequestDto {
  return {
    name: form.name,
    description: form.description,
    category: form.category,
    location: form.location,
    thumbnail_image_url: form.image, // Frontend: image → DB: thumbnail_image_url
    tags: form.tags,
  };
}
