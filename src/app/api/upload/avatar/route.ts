import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server';

/**
 * 프로필 아바타 업로드 API
 *
 * 보안 이유로 BFF를 경유하여 업로드:
 * - Supabase URL/Key를 클라이언트에 노출하지 않음
 * - 서버에서 파일 검증 (타입, 크기)
 * - DB 업데이트와 함께 원자적 처리
 */
export async function POST(request: NextRequest) {
  try {
    const { client: supabase, cookieStore } = createSupabaseRouteHandlerClient(request);

    // 세션 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: '인증이 필요합니다. 다시 로그인해주세요.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증 (이미지만 허용)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다. (JPG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 기존 아바타 URL 가져오기 (삭제용)
    const { data: userData } = await supabase
      .from('member')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    const oldAvatarUrl = userData?.avatar_url;

    // Supabase Storage에 업로드
    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const fileName = `avatars/${userId}/${timestamp}.${fileExt}`;

    console.log('📤 Uploading avatar:', {
      userId,
      fileName,
      fileSize: file.size,
      fileType: file.type,
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fitkle')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // 새 파일명이므로 덮어쓰기 불필요
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return NextResponse.json(
        { error: `업로드 실패: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Public URL 생성
    const { data: urlData } = supabase.storage
      .from('fitkle')
      .getPublicUrl(uploadData.path);

    const newAvatarUrl = urlData.publicUrl;

    console.log('✅ Upload success:', {
      path: uploadData.path,
      url: newAvatarUrl,
    });

    // DB 업데이트 (member.avatar_url)
    const { error: updateError } = await supabase
      .from('member')
      .update({
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ DB update error:', updateError);

      // 롤백: 업로드한 파일 삭제
      await supabase.storage
        .from('fitkle')
        .remove([uploadData.path]);

      return NextResponse.json(
        { error: 'DB 업데이트 실패' },
        { status: 500 }
      );
    }

    // 성공 시 기존 아바타 삭제 (선택적)
    if (oldAvatarUrl && oldAvatarUrl.includes('fitkle')) {
      try {
        // URL에서 경로 추출
        const urlObj = new URL(oldAvatarUrl);
        const pathParts = urlObj.pathname.split('/storage/v1/object/public/fitkle/');
        const oldPath = pathParts[1];

        if (oldPath) {
          await supabase.storage
            .from('fitkle')
            .remove([oldPath]);

          console.log('🗑️ Old avatar deleted:', oldPath);
        }
      } catch (error) {
        // 기존 파일 삭제 실패는 무시 (중요하지 않음)
        console.warn('⚠️ Failed to delete old avatar:', error);
      }
    }

    // 응답 생성 (쿠키 설정 포함)
    const response = NextResponse.json({
      success: true,
      avatarUrl: newAvatarUrl,
      message: '프로필 사진이 성공적으로 업데이트되었습니다.',
    });

    // 쿠키 설정
    cookieStore.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS 핸들러 (CORS preflight)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
