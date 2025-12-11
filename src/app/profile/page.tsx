import { ProtectedRoute } from '@/domains/auth';
import { ProfileScreen } from '@/domains/user';

/**
 * 프로필 페이지
 *
 * Pickdam 패턴:
 * - ProtectedRoute로 페이지 전체를 감싸서 인증 체크
 * - ProfileScreen은 순수한 UI 컴포넌트로 유지
 */
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileScreen />
    </ProtectedRoute>
  );
}
