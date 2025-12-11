/**
 * Categories API Route
 *
 * GET /api/categories?type=event - 이벤트 카테고리 조회
 * GET /api/categories?type=group - 그룹 카테고리 조회
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
  errorResponse,
  ApiErrorCode,
} from '@/lib/api';

/**
 * 카테고리 목록 조회
 *
 * Query Parameters:
 * - type: 'event' | 'group' (선택, 기본값: 'event')
 *
 * @example
 * GET /api/categories
 * GET /api/categories?type=event
 * GET /api/categories?type=group
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 추출 (기본값: event)
    const type = searchParams.get('type') || 'event';

    // type 검증
    if (type !== 'event' && type !== 'group') {
      return errorResponse(
        'type parameter must be either "event" or "group"',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    // 테이블 선택
    const tableName = type === 'event' ? 'event_categories' : 'group_categories';

    // 카테고리 조회 (활성화된 것만, 정렬 순서대로)
    const { data, error } = await supabase
      .from(tableName)
      .select('id, code, name, emoji, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch categories');
    }

    // 카테고리 데이터 변환 (기존 형식과 호환)
    const categories = (data || []).map((category) => ({
      id: category.id,
      code: category.code,
      name: category.name,
      icon: category.emoji || '🎯',
      emoji: category.emoji || '🎯',
      color: getCategoryColor(category.name),
      sort_order: category.sort_order,
    }));

    return successResponse(categories, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/categories',
      'Failed to fetch categories'
    );
  }
}

/**
 * 카테고리 이름에 따른 아이콘 매핑
 * TODO: 향후 사용 예정
 */
// function getCategoryIcon(name: string): string {
//   const iconMap: Record<string, string> = {
//     '운동': '⚽',
//     '스포츠': '🏃',
//     '음식': '🍜',
//     '요리': '👨‍🍳',
//     '문화': '🎨',
//     '예술': '🎭',
//     '언어': '💬',
//     '야외활동': '🏕️',
//     '자연': '🌲',
//     '기술': '💻',
//     'IT': '⌨️',
//     '음악': '🎵',
//     '독서': '📚',
//     '사진': '📷',
//     '여행': '✈️',
//   };

//   // 부분 매칭
//   for (const [key, icon] of Object.entries(iconMap)) {
//     if (name.includes(key)) {
//       return icon;
//     }
//   }

//   // 기본 아이콘
//   return '🎯';
// }

/**
 * 카테고리 이름에 따른 색상 매핑
 */
function getCategoryColor(name: string): string {
  const colorMap: Record<string, string> = {
    '운동': 'blue',
    '스포츠': 'blue',
    '음식': 'orange',
    '요리': 'orange',
    '문화': 'purple',
    '예술': 'purple',
    '언어': 'green',
    '야외활동': 'emerald',
    '자연': 'emerald',
    '기술': 'indigo',
    'IT': 'indigo',
    '음악': 'pink',
    '독서': 'amber',
    '사진': 'cyan',
    '여행': 'sky',
  };

  // 부분 매칭
  for (const [key, color] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return color;
    }
  }

  // 기본 색상
  return 'slate';
}
