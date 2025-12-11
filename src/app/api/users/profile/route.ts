/**
 * User Profile API Routes
 *
 * GET /api/users/profile - 현재 로그인한 사용자 프로필 조회
 * PUT /api/users/profile - 사용자 프로필 업데이트
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
  errorResponse,
} from '@/lib/api';

/**
 * GET /api/users/profile
 *
 * 현재 로그인한 사용자의 프로필 정보를 반환합니다.
 * - member 테이블에서 사용자 정보 조회
 * - 그룹 수, 이벤트 참석 정보 등 통계 계산
 * - 데이터가 없으면 자동으로 member 레코드 생성
 *
 * @returns UserProfileResponseDto
 */
export async function GET() {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 현재 로그인한 사용자 확인
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    console.log('🔍 Fetching profile for user:', authUser.email);

    // member 테이블에서 사용자 정보 조회
    const { data: memberData, error: memberError } = await supabase
      .from('member')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // member 데이터가 없으면 생성
    if (!memberData || memberError) {
      console.log('📝 Creating new member record for:', authUser.email);

      const { data: newMember, error: insertError } = await supabase
        .from('member')
        .insert({
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          email: authUser.email,
          trust_score: 0,
        })
        .select()
        .single();

      if (insertError) {
        return handleSupabaseError(insertError, 'Failed to create member profile');
      }

      // 새로 생성된 member로 응답
      return successResponse(
        {
          ...newMember,
          groups_count: 0,
          interests_count: 0,
          events_attended: 0,
          total_rsvps: 0,
        },
        HTTP_STATUS.OK
      );
    }

    // 통계 데이터 조회

    // 1. 그룹 수 조회 (group_member 테이블에서 계산)
    const { count: groupsCount } = await supabase
      .from('group_member')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', authUser.id)
      .is('deleted_at', null);

    // 2. 관심사 수 및 목록 조회 (member_interests 테이블에서 계산)
    const { data: userInterestsData, count: interestsCount } = await supabase
      .from('member_interests')
      .select(`
        interest_id,
        interests (
          id,
          code,
          name,
          emoji
        )
      `, { count: 'exact' })
      .eq('member_id', authUser.id);

    // 관심사 목록을 간단한 형태로 변환
    const userInterests = userInterestsData?.map((item: any) => ({
      id: item.interests?.id,
      code: item.interests?.code,
      name_ko: item.interests?.name,
      emoji: item.interests?.emoji,
    })) || [];

    // 3. attended_events와 total_rsvps는 member 테이블에 있음
    const attendedEvents = memberData.attended_events || 0;
    const totalRsvps = memberData.total_rsvps || 0;

    // 4. Trust Score 계산: (attended_events / total_rsvps * 100)
    const trustScore = totalRsvps > 0
      ? Math.round((attendedEvents / totalRsvps) * 100)
      : 0;

    // 응답 데이터 구성
    const profileData = {
      id: memberData.id,
      name: memberData.nickname || memberData.email?.split('@')[0] || 'User',
      email: memberData.email,
      location: memberData.location,
      nationality: memberData.nationality,
      created_at: memberData.created_at,
      bio: memberData.bio,
      trust_score: trustScore,
      groups_count: groupsCount || 0,
      interests_count: interestsCount || 0,
      interests: userInterests,
      events_attended: attendedEvents,
      total_rsvps: totalRsvps,
    };

    console.log('✅ Profile fetched successfully:', profileData.email);

    return successResponse(profileData, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/users/profile',
      'Failed to fetch user profile'
    );
  }
}

/**
 * PUT /api/users/profile
 *
 * 사용자 프로필 정보를 업데이트합니다.
 *
 * Body:
 * {
 *   "bio": string (선택) - 자기소개 (최대 2000자),
 *   "location": string (선택) - 위치,
 *   "nationality": string (선택) - 국적,
 *   "nickname": string (선택) - 닉네임 (2-20자),
 *   "phone": string (선택) - 전화번호,
 *   "gender": string (선택) - 성별,
 *   "birthdate": string (선택) - 생년월일 (YYYY-MM-DD),
 *   "facebook_handle": string (선택) - Facebook 핸들,
 *   "instagram_handle": string (선택) - Instagram 핸들,
 *   "twitter_handle": string (선택) - Twitter 핸들,
 *   "linkedin_handle": string (선택) - LinkedIn 핸들,
 *   "email_handle": string (선택) - Email 핸들,
 *   "interests": string[] (선택) - 관심사 ID 배열
 * }
 *
 * @returns 업데이트된 UserProfileResponseDto
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 현재 로그인한 사용자 확인
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = await request.json();

    console.log('📝 Updating profile for user:', authUser.email, body);

    // member 레코드가 있는지 확인
    const { data: existingMember } = await supabase
      .from('member')
      .select('id')
      .eq('id', authUser.id)
      .single();

    let memberData;

    if (!existingMember) {
      // member 레코드가 없으면 생성 (회원가입 완료 시점)
      console.log('📝 Creating new member record for:', authUser.email);

      const { data: newMember, error: insertError } = await supabase
        .from('member')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.nickname || authUser.email?.split('@')[0],
          nationality: body.nationality,
          location: body.location,
        })
        .select()
        .single();

      if (insertError) {
        return handleSupabaseError(insertError, 'Failed to create member profile');
      }

      memberData = newMember;
    } else {
      // member 레코드가 있으면 업데이트
      const updateData: {
        bio?: string;
        location?: string;
        nationality?: string;
        nickname?: string;
        phone?: string;
        gender?: string;
        birthdate?: string;
        facebook_handle?: string;
        instagram_handle?: string;
        twitter_handle?: string;
        linkedin_handle?: string;
        email_handle?: string;
      } = {};

      if (body.bio !== undefined) updateData.bio = body.bio;
      if (body.location !== undefined) updateData.location = body.location;
      if (body.nationality !== undefined) updateData.nationality = body.nationality;
      if (body.nickname !== undefined) updateData.nickname = body.nickname;
      if (body.phone !== undefined) updateData.phone = body.phone;
      if (body.gender !== undefined) updateData.gender = body.gender;
      if (body.birthdate !== undefined) updateData.birthdate = body.birthdate;
      if (body.facebook_handle !== undefined) updateData.facebook_handle = body.facebook_handle;
      if (body.instagram_handle !== undefined) updateData.instagram_handle = body.instagram_handle;
      if (body.twitter_handle !== undefined) updateData.twitter_handle = body.twitter_handle;
      if (body.linkedin_handle !== undefined) updateData.linkedin_handle = body.linkedin_handle;
      if (body.email_handle !== undefined) updateData.email_handle = body.email_handle;

      const { data, error } = await supabase
        .from('member')
        .update(updateData)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) {
        return handleSupabaseError(error, 'Failed to update profile');
      }

      memberData = data;
    }

    // interests가 제공된 경우 member_interests 테이블 업데이트
    if (body.interests && Array.isArray(body.interests)) {
      // 기존 관심사 삭제
      await supabase.from('member_interests').delete().eq('user_id', authUser.id);

      // 새로운 관심사 추가
      if (body.interests.length > 0) {
        const interestsToInsert = body.interests.map((interestId: string) => ({
          user_id: authUser.id,
          interest_id: interestId,
        }));

        const { error: interestsError } = await supabase
          .from('member_interests')
          .insert(interestsToInsert);

        if (interestsError) {
          console.error('Failed to update interests:', interestsError);
          return handleSupabaseError(interestsError, 'Failed to update interests');
        }
      }
    }

    // TODO: languages 저장 로직 - 별도 테이블이나 member 테이블 컬럼 추가 필요

    // 통계 데이터 추가 (GET과 동일한 로직)

    // 1. 그룹 수 조회
    const { count: groupsCount } = await supabase
      .from('group_member')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', authUser.id)
      .is('deleted_at', null);

    // 2. 관심사 수 및 목록 조회
    const { data: userInterestsData, count: interestsCount } = await supabase
      .from('member_interests')
      .select(`
        interest_id,
        interests (
          id,
          code,
          name_ko,
          name_en,
          emoji
        )
      `, { count: 'exact' })
      .eq('member_id', authUser.id);

    // 관심사 목록을 간단한 형태로 변환
    const userInterests = userInterestsData?.map((item: any) => ({
      id: item.interests?.id,
      code: item.interests?.code,
      name_ko: item.interests?.name_ko,
      name_en: item.interests?.name_en,
      emoji: item.interests?.emoji,
    })) || [];

    // 3. attended_events와 total_rsvps는 member 테이블에 있음
    const attendedEvents = memberData.attended_events || 0;
    const totalRsvps = memberData.total_rsvps || 0;

    // 4. Trust Score 계산
    const trustScore = totalRsvps > 0
      ? Math.round((attendedEvents / totalRsvps) * 100)
      : 0;

    const profileData = {
      id: memberData.id,
      name: memberData.nickname || memberData.email?.split('@')[0] || 'User',
      email: memberData.email,
      location: memberData.location,
      nationality: memberData.nationality,
      created_at: memberData.created_at,
      bio: memberData.bio,
      trust_score: trustScore,
      groups_count: groupsCount || 0,
      interests_count: interestsCount || 0,
      interests: userInterests,
      events_attended: attendedEvents,
      total_rsvps: totalRsvps,
    };

    console.log('✅ Profile updated successfully:', profileData.email);

    return successResponse(profileData, HTTP_STATUS.OK, '프로필이 업데이트되었습니다');
  } catch (error) {
    return logAndRespondError(
      error,
      'PUT /api/users/profile',
      'Failed to update user profile'
    );
  }
}
