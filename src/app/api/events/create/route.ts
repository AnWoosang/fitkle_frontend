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
 * POST /api/events/create
 * 이벤트 생성 (이미지는 이미 Storage에 업로드된 상태)
 * Body: JSON { transactionId, imageUrls, title, description, date, time, ... }
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
      imageUrls = [],
      title,
      description,
      date,
      time,
      category,
      maxAttendees,
      hostId,
      hostName,
      type,
      location,
      address,
      latitude,
      longitude,
      onlineLink,
      groupId,
      isGroupMembersOnly,
    } = body;

    console.log('📦 Request body:', {
      transactionId,
      imageUrlsCount: imageUrls?.length,
      title,
      hostId,
      type,
    });

    // 3. 입력 검증
    if (!transactionId) {
      return errorResponse(
        'transactionId는 필수입니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    if (!title || !description || !date || !time || !category || !maxAttendees) {
      return errorResponse(
        '필수 필드가 누락되었습니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    // 타입별 필수 필드 검증
    if (type === 'offline' && (!location || latitude === null || longitude === null)) {
      return errorResponse(
        '오프라인 이벤트는 위치 정보가 필요합니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    if (type === 'online' && !onlineLink) {
      return errorResponse(
        '온라인 이벤트는 링크가 필요합니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    if (hostId !== user.id) {
      return errorResponse(
        '본인만 이벤트를 생성할 수 있습니다',
        HTTP_STATUS.FORBIDDEN,
        ApiErrorCode.FORBIDDEN
      );
    }

    // 4-1. 카테고리 code로 ID 조회
    const { data: categoryData, error: categoryError } = await supabase
      .from('event_categories')
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

    // 4-2. event 테이블에 이벤트 생성
    // date와 time을 datetime으로 합치기
    const datetime = new Date(`${date}T${time}`).toISOString();

    const eventData: any = {
      id: transactionId, // Storage와 동일한 ID 사용
      title: title.trim(),
      description: description.trim(),
      datetime, // 날짜+시간 합침
      event_category_id: categoryData.id, // 카테고리 UUID
      max_attendees: parseInt(maxAttendees),
      host_member_id: hostId,
      host_name: hostName,
      type: type.toUpperCase(), // 'online' -> 'ONLINE', 'offline' -> 'OFFLINE'
      thumbnail_image_url: imageUrls.length > 0 ? imageUrls[0] : null, // 첫 번째 이미지를 썸네일로 사용
      created_at: new Date().toISOString(),
    };

    // 타입별 필드 추가
    if (type === 'offline') {
      eventData.street_address = location.trim(); // 오프라인: 도로명 주소
      eventData.detail_address = address ? address.trim() : null; // 오프라인: 상세 주소
      eventData.latitude = latitude;
      eventData.longitude = longitude;
    } else if (type === 'online') {
      eventData.street_address = onlineLink.trim(); // 온라인: 링크를 address에 저장
    }

    // 그룹 이벤트 필드
    if (groupId) {
      eventData.group_id = groupId;
      eventData.is_group_members_only = isGroupMembersOnly;
    }

    const { data: event, error: eventError } = await supabase
      .from('event')
      .insert(eventData)
      .select()
      .single();

    if (eventError) {
      console.error('❌ Event creation failed:', eventError);
      return logAndRespondError(
        eventError,
        'Event Creation',
        '이벤트 생성 실패'
      );
    }

    console.log('✅ Event created:', event);

    // 5. event_image 테이블에 이미지 URL 저장 (이미지가 있는 경우만)
    if (imageUrls.length > 0) {
      const photoInserts = imageUrls.map((url: string, index: number) => ({
        event_id: event.id,
        image_url: url,
        display_order: index,
        created_at: new Date().toISOString(),
      }));

      const { error: photoError } = await supabase
        .from('event_image')
        .insert(photoInserts);

      if (photoError) {
        console.error('❌ Photo insert failed:', photoError);

        // 6. Photo 저장 실패 시 이벤트도 롤백
        const { error: deleteError } = await supabase
          .from('event')
          .delete()
          .eq('id', event.id);

        if (deleteError) {
          console.error('❌ Event rollback failed:', deleteError);
        }

        return logAndRespondError(
          photoError,
          'Photo Insert',
          '이벤트 사진 저장 실패'
        );
      }

      console.log('✅ Photos inserted:', photoInserts.length);
    }

    // 7. event_participant 테이블에 호스트 추가
    const { error: attendeeError } = await supabase
      .from('event_participant')
      .insert({
        event_id: event.id,
        member_id: hostId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      });

    if (attendeeError) {
      console.error('⚠️ Participant insert failed (non-critical):', attendeeError);
      // 호스트 추가 실패는 치명적이지 않으므로 계속 진행
    }

    // 8. 성공 응답
    return successResponse({
      event,
      photoCount: imageUrls.length,
    });
  } catch (error) {
    return logAndRespondError(
      error,
      'Event Creation Handler',
      '이벤트 생성 중 오류가 발생했습니다'
    );
  }
}