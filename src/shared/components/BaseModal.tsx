'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { BaseModalProps } from '@/shared/types/modal';

/**
 * 기본 모달 컴포넌트
 *
 * @example
 * ```tsx
 * <BaseModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="모달 제목"
 *   size="medium"
 *   preventBodyScroll
 * >
 *   <div>모달 내용</div>
 * </BaseModal>
 * ```
 */
export default function BaseModal({
  isOpen,
  onClose,
  title,
  icon,
  size = 'medium',
  children,
  footer,
  closable = true,
  closeOnBackdrop = true,
  preventBodyScroll = false,
  className = '',
}: BaseModalProps) {
  // body 스크롤 방지
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, preventBodyScroll]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 배경 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 모달 크기별 클래스
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl',
    full: 'w-screen h-screen',
  };

  // 풀스크린 여부
  const isFullScreen = size === 'full';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        ${isFullScreen ? 'bg-black/90' : 'bg-black/30'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white ${isFullScreen ? '' : 'rounded-lg shadow-xl'}
          ${sizeClasses[size]} w-full
          ${isFullScreen ? '' : 'max-h-[90vh]'}
          flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || closable) && (
          <div
            className={`flex items-center justify-between
              ${isFullScreen ? 'p-6' : 'p-4'}
              border-b border-gray-200`}
          >
            <div className="flex items-center gap-2">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
            </div>
            {closable && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-gray-100
                  rounded-full transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* 컨텐츠 */}
        <div
          className={`flex-1 ${isFullScreen ? 'p-6' : 'p-4'}
            ${isFullScreen ? '' : 'overflow-y-auto'}`}
        >
          {children}
        </div>

        {/* 푸터 */}
        {footer && (
          <div
            className={`${isFullScreen ? 'p-6' : 'p-4'}
              border-t border-gray-200`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
