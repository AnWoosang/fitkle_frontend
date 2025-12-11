import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

/**
 * POST /api/auth/complete-profile
 *
 * 추가 프로필 정보를 저장하고 member 테이블에 레코드를 생성합니다.
 *
 * Body:
 * {
 *   "phone": string?, // 선택, 정규식: ^01[0-9]-?\d{3,4}-?\d{4}$
 *   "nationality": string,
 *   "gender": "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY",
 *   "bio": string?, // 선택, 최대 2000자
 *   "languages": string[],
 *   "interests": string[], // UUID 배열 (내부 데이터 관리용)
 *   "preferences": string[], // UUID 배열 (그룹/이벤트 추천용)
 *   "region": string,
 *   "district": string,
 *   "language": string, // UI 언어 (account_settings용)
 *   "contactPermission": string, // 연락 허용 설정
 *   "emailNotifications": boolean,
 *   "pushNotifications": boolean,
 *   "eventReminders": boolean,
 *   "groupUpdates": boolean,
 *   "newsletterSubscription": boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      phone,
      nationality,
      gender,
      bio,
      languages,
      interests,
      preferences,
      region,
      district,
      language,
      contactPermission,
      emailNotifications,
      pushNotifications,
      eventReminders,
      groupUpdates,
      newsletterSubscription,
    } = await request.json();

    console.log('[complete-profile] 프로필 완성 시도:', {
      phone,
      nationality,
      gender,
      bio: bio ? `${bio.substring(0, 50)}...` : undefined,
      languages,
      interests,
      preferences,
      region,
      district,
      language,
      contactPermission,
      emailNotifications,
      pushNotifications,
      eventReminders,
      groupUpdates,
      newsletterSubscription,
    });

    // 필수 필드 검증
    if (!nationality || !gender || !region || !district) {
      return errorResponse(
        '필수 정보를 입력해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'REQUIRED_FIELDS_MISSING' as ApiErrorCode
      );
    }

    // gender 검증
    if (!['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY'].includes(gender)) {
      return errorResponse(
        '올바른 성별을 선택해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_GENDER' as ApiErrorCode
      );
    }

    // phone 검증 (선택 필드, 입력된 경우에만 검증)
    if (phone) {
      const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
      if (!phoneRegex.test(phone)) {
        return errorResponse(
          '올바른 전화번호 형식이 아닙니다',
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_PHONE_FORMAT' as ApiErrorCode
        );
      }
    }

    // bio 길이 검증 (선택 필드, 입력된 경우에만 검증)
    if (bio && bio.length > 2000) {
      return errorResponse(
        '자기소개는 최대 2000자까지 입력 가능합니다',
        HTTP_STATUS.BAD_REQUEST,
        'BIO_TOO_LONG' as ApiErrorCode
      );
    }

    // languages 검증 - 임시 주석 처리
    // if (!Array.isArray(languages) || languages.length === 0) {
    //   return errorResponse(
    //     '최소 1개 이상의 언어를 선택해주세요',
    //     HTTP_STATUS.BAD_REQUEST,
    //     'LANGUAGES_REQUIRED' as ApiErrorCode
    //   );
    // }

    // interests 검증
    if (!Array.isArray(interests) || interests.length === 0) {
      return errorResponse(
        '최소 1개 이상의 관심사를 선택해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'INTERESTS_REQUIRED' as ApiErrorCode
      );
    }

    // preferences 검증
    if (!Array.isArray(preferences) || preferences.length === 0) {
      return errorResponse(
        '최소 1개 이상의 선호 카테고리를 선택해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'PREFERENCES_REQUIRED' as ApiErrorCode
      );
    }

    const supabase = await createSupabaseClientWithCookie();

    // 현재 로그인된 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse(
        '로그인이 필요합니다',
        HTTP_STATUS.UNAUTHORIZED,
        ApiErrorCode.UNAUTHORIZED
      );
    }

    // 이메일 인증 여부 확인
    if (!user.email_confirmed_at) {
      return errorResponse(
        '이메일 인증이 필요합니다',
        HTTP_STATUS.BAD_REQUEST,
        'EMAIL_NOT_VERIFIED' as ApiErrorCode
      );
    }

    // member 테이블에 레코드 생성
    const location = `${district}, ${region}`;
    const memberInsertData: any = {
      id: user.id,
      email: user.email!,
      nickname: user.user_metadata?.nickname,
      nationality,
      gender,
      location,
    };

    // phone이 있으면 추가
    if (phone) {
      memberInsertData.phone = phone;
    }

    // bio가 있으면 추가
    if (bio) {
      memberInsertData.bio = bio;
    }

    const { data: memberData, error: memberError } = await supabase
      .from('member')
      .insert(memberInsertData)
      .select()
      .single();

    if (memberError) {
      console.error('[complete-profile] member 테이블 생성 실패:', memberError);
      return errorResponse(
        '프로필 저장에 실패했습니다',
        HTTP_STATUS.BAD_REQUEST,
        'PROFILE_SAVE_FAILED' as ApiErrorCode
      );
    }

    // member_interests 테이블에 관심사 저장
    if (interests && interests.length > 0) {
      const interestRecords = interests.map((interestId) => ({
        member_id: user.id,
        interest_id: interestId,
      }));

      const { error: interestError } = await supabase
        .from('member_interests')
        .insert(interestRecords);

      if (interestError) {
        console.error('[complete-profile] 관심사 저장 실패:', interestError);
        // 관심사 저장 실패는 치명적이지 않으므로 경고만 로깅
      }
    }

    // member_preference 테이블에 선호 카테고리 저장
    if (preferences && preferences.length > 0) {
      const preferenceRecords = preferences.map((preferenceId) => ({
        member_id: user.id,
        preference_id: preferenceId,
      }));

      const { error: preferenceError } = await supabase
        .from('member_preference')
        .insert(preferenceRecords);

      if (preferenceError) {
        console.error('[complete-profile] 선호 카테고리 저장 실패:', preferenceError);
        // 선호 카테고리 저장 실패는 치명적이지 않으므로 경고만 로깅
      }
    }

    // account_settings 테이블 업데이트
    // (auth.users 생성 시 트리거로 이미 account_settings가 생성되었으므로 UPDATE 사용)
    const { error: accountSettingsError } = await supabase
      .from('account_settings')
      .update({
        language: language || 'ko',
        contact_permission: contactPermission || 'ANYONE',
        email_notifications: emailNotifications ?? true,
        push_notifications: pushNotifications ?? true,
        event_reminders: eventReminders ?? true,
        group_updates: groupUpdates ?? true,
        newsletter_subscription: newsletterSubscription ?? false,
      })
      .eq('member_id', user.id);

    if (accountSettingsError) {
      console.error('[complete-profile] account_settings 업데이트 실패:', accountSettingsError);
      // account_settings 업데이트 실패는 치명적이지 않으므로 경고만 로깅
    }

    // user_metadata에 프로필 정보 저장
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        has_completed_profile: true,
        languages, // 언어 정보도 user_metadata에 저장
        region,
        district,
      },
    });

    if (updateError) {
      console.error('[complete-profile] user_metadata 업데이트 실패:', updateError);
      // metadata 업데이트 실패해도 member 레코드는 생성되었으므로 성공으로 처리
    }

    console.log('[complete-profile] 프로필 완성 성공');

    return successResponse(
      { member: memberData },
      HTTP_STATUS.CREATED,
      '프로필이 완성되었습니다'
    );
  } catch (error: any) {
    console.error('Complete profile error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
