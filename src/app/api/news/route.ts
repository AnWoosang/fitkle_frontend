/**
 * News API Routes
 *
 * GET /api/news - 전체 뉴스 조회 또는 필터링된 뉴스 조회
 * POST /api/news - 새 뉴스 생성 (관리자 전용)
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  validateRequiredFields,
  validateEnum,
  logAndRespondError,
  HTTP_STATUS,
} from '@/lib/api';

const NEWS_CATEGORIES = ['ANNOUNCEMENT', 'INFORMATION', 'COMMUNICATION'];

/**
 * GET /api/news
 *
 * Query Parameters:
 * - category: 'ANNOUNCEMENT' | 'INFORMATION' | 'COMMUNICATION' (선택)
 * - searchQuery: string (선택, title LIKE 검색)
 *
 * @example
 * GET /api/news
 * GET /api/news?category=ANNOUNCEMENT
 * GET /api/news?searchQuery=update
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 추출
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('searchQuery');

    // Supabase 쿼리 빌더 시작 (deleted_at이 null인 것만 조회)
    let query = supabase
      .from('news')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false }); // 최신순 정렬

    // Category 필터 적용
    if (category) {
      const validationError = validateEnum(
        category,
        NEWS_CATEGORIES,
        'category'
      );
      if (validationError) {
        return validationError;
      }
      query = query.eq('category', category);
    }

    // Search Query 필터 적용 (title 검색)
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // 쿼리 실행
    const { data, error } = await query;

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch news');
    }

    return successResponse(data, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(error, 'GET /api/news', 'Failed to fetch news');
  }
}

/**
 * POST /api/news
 *
 * Body:
 * {
 *   "title": string (필수),
 *   "content": string (필수),
 *   "author": string (필수),
 *   "category": 'ANNOUNCEMENT' | 'INFORMATION' | 'COMMUNICATION' (필수),
 *   "thumbnail_image_url": string (선택),
 *   "like_count": number (선택)
 * }
 *
 * @example
 * POST /api/news
 * Content-Type: application/json
 * {
 *   "title": "Fitkle에 오신 것을 환영합니다",
 *   "content": "Welcome to Fitkle...",
 *   "author": "Fitkle Team",
 *   "category": "ANNOUNCEMENT",
 *   "thumbnail_image_url": "https://..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // TODO: 관리자 권한 체크
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    // }

    // 필수 필드 검증
    const validationError = validateRequiredFields(body, [
      'title',
      'content',
      'author',
      'category',
    ]);

    if (validationError) {
      return validationError;
    }

    // Category 검증
    const categoryError = validateEnum(
      body.category,
      NEWS_CATEGORIES,
      'category'
    );
    if (categoryError) {
      return categoryError;
    }

    // 뉴스 데이터 준비
    const newsData = {
      title: body.title,
      content: body.content,
      author: body.author,
      category: body.category,
      thumbnail_image_url: body.thumbnail_image_url || null,
      like_count: body.like_count || 0,
    };

    // 뉴스 생성
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to create news');
    }

    return successResponse(data, HTTP_STATUS.CREATED, 'News created successfully');
  } catch (error) {
    return logAndRespondError(error, 'POST /api/news', 'Failed to create news');
  }
}
