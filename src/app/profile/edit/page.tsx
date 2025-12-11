import { ProtectedRoute } from '@/domains/auth';
import { ProfileEditScreen } from '@/domains/user';

/**
 * 프로필 편집 페이지
 *
 * - ProtectedRoute로 페이지 전체를 감싸서 인증 체크
 * - ProfileEditScreen은 순수한 UI 컴포넌트로 유지
 */
export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <ProfileEditScreen />
    </ProtectedRoute>
  );
}
