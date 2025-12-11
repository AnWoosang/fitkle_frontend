'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ConfirmDialogProps } from '@/shared/types/modal';

/**
 * 확인 대화상자 컴포넌트
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   title="삭제 확인"
 *   message="정말로 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다."
 *   confirmText="삭제"
 *   cancelText="취소"
 *   confirmVariant="destructive"
 *   isLoading={isDeleting}
 * />
 * ```
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '예',
  cancelText = '아니오',
  confirmVariant = 'primary',
  width = 'w-90',
  icon,
  isLoading = false,
  title,
}: ConfirmDialogProps) {
  // 키보드 이벤트 처리
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose, isLoading]);

  // 다이얼로그가 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 배경 클릭 핸들러 (로딩 중에는 무시)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!isLoading && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 확인 버튼 스타일
  const confirmButtonStyles = {
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${width}
          max-w-md mx-4 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || icon) && (
          <div
            className="flex items-center justify-between p-4
              border-b border-gray-200"
          >
            <div className="flex items-center gap-2">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
            </div>
            {!isLoading && (
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

        {/* 메시지 */}
        <div className="p-6">
          <p className="text-gray-700 text-center whitespace-pre-wrap">
            {message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200
              text-gray-700 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${confirmButtonStyles[confirmVariant]}
              flex items-center justify-center gap-2`}
          >
            {isLoading && (
              <div
                className="w-4 h-4 border-2 border-white
                  border-t-transparent rounded-full animate-spin"
              />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
