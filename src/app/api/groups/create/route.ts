import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  logAndRespondError,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

/**
 * POST /api/groups/create
 * 그룹 생성 (이미지는 이미 Storage에 업로드된 상태)
 * Body: JSON { transactionId, imageUrls, name, description, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 1. 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('🔐 Auth check:', {
      user: user ? { id: user.id, email: user.email } : null,
      authError,
    });

    if (authError || !user) {
      return errorResponse(
        '로그인이 필요합니다',
        HTTP_STATUS.UNAUTHORIZED,
        ApiErrorCode.UNAUTHORIZED
      );
    }

    // 2. JSON body 파싱
    const body = await request.json();
    const {
      transactionId,
      imageUrls,
      name,
      description,
      location,
      category,
      requiresApproval,
      hostId,
      hostName,
    } = body;

    console.log('📦 Request body:', {
      transactionId,
      imageUrlsCount: imageUrls?.length,
      name,
      hostId,
    });

    // 3. 입력 검증
    if (!transactionId || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return errorResponse(
        'transactionId와 imageUrls는 필수입니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    if (!name || !description || !location || !category) {
      return errorResponse(
        '필수 필드가 누락되었습니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    if (hostId !== user.id) {
      return errorResponse(
        '본인만 그룹을 생성할 수 있습니다',
        HTTP_STATUS.FORBIDDEN,
        ApiErrorCode.FORBIDDEN
      );
    }

    // 3-1. 카테고리 code로 ID 조회
    const { data: categoryData, error: categoryError } = await supabase
      .from('group_categories')
      .select('id')
      .eq('code', category)
      .single();

    if (categoryError || !categoryData) {
      console.error('❌ Category not found:', category, categoryError);
      return errorResponse(
        `유효하지 않은 카테고리입니다: ${category}`,
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    // 4. group 테이블에 그룹 생성 (테이블명은 단수형 'group')
    const { data: group, error: groupError } = await supabase
      .from('group')
      .insert({
        id: transactionId, // Storage와 동일한 ID 사용
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        group_category_id: categoryData.id, // 카테고리 UUID
        host_id: hostId,
        host_name: hostName,
        requires_approval: requiresApproval,
        total_members: 1, // 호스트 포함 (컬럼명은 total_members)
        thumbnail_image_url: imageUrls[0], // 첫 번째 이미지를 썸네일로 사용
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (groupError) {
      console.error('❌ Group creation failed:', groupError);

      // TODO: orphaned_images 테이블에 기록 (나중에 구현)
      // await supabase.from('orphaned_images').insert({
      //   transaction_id: transactionId,
      //   image_urls: imageUrls,
      //   created_at: new Date().toISOString(),
      // });

      return logAndRespondError(
        groupError,
        'Group Creation',
        '그룹 생성 실패'
      );
    }

    console.log('✅ Group created:', group);

    // 5. group_image 테이블에 이미지 URL 저장 (테이블명은 group_image)
    const photoInserts = imageUrls.map((url: string, index: number) => ({
      group_id: group.id,
      image_url: url, // 컬럼명은 image_url
      display_order: index,
      created_at: new Date().toISOString(),
    }));

    const { error: photoError } = await supabase
      .from('group_image')
      .insert(photoInserts);

    if (photoError) {
      console.error('❌ Photo insert failed:', photoError);

      // 6. Photo 저장 실패 시 그룹도 롤백
      const { error: deleteError } = await supabase
        .from('group')
        .delete()
        .eq('id', group.id);

      if (deleteError) {
        console.error('❌ Group rollback failed:', deleteError);
      }

      // TODO: orphaned_images 테이블에 기록 (나중에 구현)
      // await supabase.from('orphaned_images').insert({
      //   transaction_id: transactionId,
      //   image_urls: imageUrls,
      //   created_at: new Date().toISOString(),
      // });

      return logAndRespondError(
        photoError,
        'Photo Insert',
        '그룹 사진 저장 실패'
      );
    }

    console.log('✅ Photos inserted:', photoInserts.length);

    // 7. group_member 테이블에 호스트 추가 (테이블명은 group_member, 단수형)
    const { error: memberError } = await supabase
      .from('group_member')
      .insert({
        group_id: group.id,
        member_id: hostId, // 컬럼명은 member_id
        role: 'admin', // role은 'admin', 'moderator', 'member' 중 하나 (host는 없음)
        created_at: new Date().toISOString(),
      });

    if (memberError) {
      console.error('⚠️ Member insert failed (non-critical):', memberError);
      // 호스트 추가 실패는 치명적이지 않으므로 계속 진행
    }

    // 8. 성공 응답
    return successResponse({
      group,
      photoCount: imageUrls.length,
    });
  } catch (error) {
    return logAndRespondError(
      error,
      'Group Creation Handler',
      '그룹 생성 중 오류가 발생했습니다'
    );
  }
}
