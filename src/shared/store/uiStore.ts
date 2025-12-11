'use client';

import { create } from 'zustand';

/**
 * 공유 다이얼로그 데이터 인터페이스
 */
interface ShareDialogData {
  title?: string;
  description?: string;
  url?: string;
  shareText?: string;
}

/**
 * UI 상태 인터페이스
 */
interface UIState {
  /** 로그인 모달 표시 여부 */
  isLoginModalOpen: boolean;

  /** 로그인 모달 열기 */
  openLoginModal: () => void;

  /** 로그인 모달 닫기 */
  closeLoginModal: () => void;

  /** 회원가입 모달 표시 여부 */
  isSignupModalOpen: boolean;

  /** 회원가입 모달 열기 */
  openSignupModal: () => void;

  /** 회원가입 모달 닫기 */
  closeSignupModal: () => void;

  /** 인증 필요 시 로그인 모달 표시 */
  requireAuth: () => boolean;

  /** 공유 다이얼로그 표시 여부 */
  isShareDialogOpen: boolean;

  /** 공유 다이얼로그 데이터 */
  shareDialogData: ShareDialogData;

  /** 공유 다이얼로그 열기 */
  openShareDialog: (data?: ShareDialogData) => void;

  /** 공유 다이얼로그 닫기 */
  closeShareDialog: () => void;
}

/**
 * UI 상태 관리 Zustand Store
 *
 * @example
 * ```tsx
 * const { openLoginModal, closeLoginModal, isLoginModalOpen } = useUIStore();
 *
 * // 로그인 모달 열기
 * openLoginModal();
 *
 * // 인증 확인 후 모달 열기
 * if (!requireAuth()) return;
 *
 * // 공유 다이얼로그 열기
 * openShareDialog({ title: '그룹 공유하기', shareText: '그룹 이름' });
 * ```
 */
export const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isShareDialogOpen: false,
  shareDialogData: {},

  // 액션들
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  openSignupModal: () => set({ isSignupModalOpen: true }),
  closeSignupModal: () => set({ isSignupModalOpen: false }),

  // 인증 필요 시 로그인 모달 표시
  requireAuth: () => {
    set({ isLoginModalOpen: true });
    return false;
  },

  // 공유 다이얼로그 액션들
  openShareDialog: (data = {}) =>
    set({ isShareDialogOpen: true, shareDialogData: data }),
  closeShareDialog: () =>
    set({ isShareDialogOpen: false, shareDialogData: {} }),
}));
