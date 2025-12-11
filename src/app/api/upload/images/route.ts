import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * 다중 이미지 업로드 API (범용)
 *
 * POST /api/upload/images
 * - 여러 이미지를 한 번에 업로드
 * - BFF를 통해 인증된 사용자만 업로드 가능
 * - 그룹/이벤트 등 다양한 용도로 사용 가능
 *
 * Request:
 * - Content-Type: multipart/form-data
 * - files: File[] (최대 500개)
 * - folder: string (예: 'group', 'event', 'profile')
 *
 * Response:
 * - success: boolean
 * - uploadedUrls: string[]
 * - transactionId: string
 * - failedCount: number
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 1. 세션 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('🔐 Upload - Auth check:', {
      user: user ? { id: user.id, email: user.email } : null,
      authError,
    });

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: '인증이 필요합니다. 다시 로그인해주세요.',
        },
        { status: 401 }
      );
    }

    // 2. FormData 파싱
    const formData = await request.formData();
    const folder = (formData.get('folder') as string) || 'uploads';

    // 모든 파일 추출
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    console.log('📦 Upload request:', {
      folder,
      fileCount: files.length,
      userId: user.id,
    });

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '업로드할 파일이 없습니다.',
        },
        { status: 400 }
      );
    }

    // 3. 파일 개수 제한 (500개)
    if (files.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: '한 번에 최대 500개의 파일만 업로드 가능합니다.',
        },
        { status: 400 }
      );
    }

    // 4. 트랜잭션 ID 생성
    const transactionId = uuidv4();
    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    // 5. 각 파일 업로드
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 파일 타입 검증
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/avif',
        'image/heic',
        'image/heif',
      ];

      if (!allowedTypes.includes(file.type)) {
        console.warn(`⚠️ Invalid file type: ${file.type}`);
        failedFiles.push(file.name);
        continue;
      }

      // 파일 크기 검증 (5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.warn(`⚠️ File too large: ${file.size} bytes`);
        failedFiles.push(file.name);
        continue;
      }

      // 파일명 생성
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileUuid = uuidv4();
      const fileName = `${folder}/${transactionId}/${i}_${fileUuid}.${fileExtension}`;

      // Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('fitkle')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error(`❌ Upload error for ${file.name}:`, uploadError);
        failedFiles.push(file.name);
        continue;
      }

      // Public URL 생성
      const { data: urlData } = supabase.storage
        .from('fitkle')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);

      console.log(`✅ Uploaded ${i + 1}/${files.length}:`, fileName);
    }

    // 6. 응답
    const allSuccess = failedFiles.length === 0;

    console.log('📊 Upload complete:', {
      total: files.length,
      success: uploadedUrls.length,
      failed: failedFiles.length,
      transactionId,
    });

    return NextResponse.json({
      success: allSuccess,
      uploadedUrls,
      transactionId,
      failedCount: failedFiles.length,
      failedFiles: failedFiles.length > 0 ? failedFiles : undefined,
      error: failedFiles.length > 0
        ? `${failedFiles.length}개 파일 업로드 실패`
        : undefined,
    });
  } catch (error) {
    console.error('💥 Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
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
