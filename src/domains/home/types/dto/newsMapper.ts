import { News, NewsForm } from '../news';
import { NewsResponseDto, CreateNewsRequestDto } from './newsDto';

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
 * NewsResponseDto → News Domain Model 변환
 */
export function toNews(dto: NewsResponseDto): News {
  const createdAt = new Date(dto.created_at);

  return {
    // DB fields
    id: dto.id,
    title: dto.title,
    content: dto.content,
    category: dto.category,
    author: dto.author,
    thumbnailImageUrl: dto.thumbnail_image_url ?? undefined,
    likeCount: dto.like_count,
    createdAt,
    updatedAt: new Date(dto.updated_at),

    // Computed fields
    isNew: isWithinDays(createdAt, 7), // 7일 이내 뉴스는 "새 글"
  };
}

/**
 * NewsResponseDto[] → News[] 변환
 */
export function toNewsList(dtos: NewsResponseDto[]): News[] {
  return dtos.map(toNews);
}

/**
 * NewsForm → CreateNewsRequestDto 변환
 */
export function toCreateNewsRequestDto(form: NewsForm): CreateNewsRequestDto {
  return {
    title: form.title,
    content: form.content,
    category: form.category,
    author: form.author,
    thumbnail_image_url: form.thumbnailImageUrl,
    like_count: form.likeCount,
  };
}
