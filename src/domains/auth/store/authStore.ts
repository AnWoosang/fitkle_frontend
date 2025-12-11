import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { User } from '../types/auth';

// Auth Store 인터페이스
interface AuthStore {
  // 인증 상태
  user: User | null;
  isLoggedIn: boolean;

  // 인증 액션
  setUser: (user: User | null) => void;
  logout: () => void;

  // 로그인 모달 상태
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  // 인증 필요 시 모달 열기
  requireAuth: () => boolean;

  // 토스트 메시지 표시
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Zustand Store 생성 (로컬 스토리지에 persist)
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isLoggedIn: false,
      isLoginModalOpen: false,

      // 유저 설정 (로그인 시)
      setUser: (user: User | null) => {
        set({ user, isLoggedIn: !!user });
      },

      // 로그아웃
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      // 로그인 모달 열기
      openLoginModal: () => {
        set({ isLoginModalOpen: true });
      },

      // 로그인 모달 닫기
      closeLoginModal: () => {
        set({ isLoginModalOpen: false });
      },

      // 인증 필요 시 모달 열기 (인증 필요한 기능 클릭 시 사용)
      requireAuth: () => {
        const { isLoggedIn, openLoginModal } = get();
        if (!isLoggedIn) {
          openLoginModal();
          return false; // 인증되지 않았음을 반환
        }
        return true; // 인증됨을 반환
      },

      // 토스트 메시지 표시
      showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        switch (type) {
          case 'success':
            toast.success(message);
            break;
          case 'error':
            toast.error(message);
            break;
          default:
            toast(message);
        }
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지 키 이름
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }), // user와 isLoggedIn만 persist
    }
  )
);
