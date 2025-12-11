import { ReactNode } from 'react';

/**
 * 모달 크기 옵션
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

/**
 * 확인 버튼 스타일 옵션
 */
export type ConfirmVariant = 'destructive' | 'warning' | 'primary';

/**
 * BaseModal Props 타입
 */
export interface BaseModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 콜백 함수 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 제목 옆에 표시할 아이콘 */
  icon?: ReactNode;
  /** 모달 크기 (기본값: 'medium') */
  size?: ModalSize;
  /** 모달 내용 */
  children: ReactNode;
  /** 하단 푸터 영역 */
  footer?: ReactNode;
  /** X 버튼 표시 여부 (기본값: true) */
  closable?: boolean;
  /** 배경 클릭으로 닫기 허용 여부 (기본값: true) */
  closeOnBackdrop?: boolean;
  /** body 스크롤 방지 여부 (기본값: false) */
  preventBodyScroll?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * ConfirmDialog Props 타입
 */
export interface ConfirmDialogProps {
  /** 다이얼로그 표시 여부 */
  isOpen: boolean;
  /** 다이얼로그 닫기 콜백 함수 */
  onClose: () => void;
  /** 확인 버튼 클릭 시 실행되는 함수 */
  onConfirm: () => void;
  /** 확인 메시지 (\\n으로 줄바꿈 가능) */
  message: string;
  /** 확인 버튼 텍스트 (기본값: '예') */
  confirmText?: string;
  /** 취소 버튼 텍스트 (기본값: '아니오') */
  cancelText?: string;
  /** 확인 버튼 스타일 (기본값: 'primary') */
  confirmVariant?: ConfirmVariant;
  /** 다이얼로그 너비 (기본값: 'w-90') */
  width?: string;
  /** 헤더 아이콘 */
  icon?: ReactNode;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 다이얼로그 제목 */
  title?: string;
}
