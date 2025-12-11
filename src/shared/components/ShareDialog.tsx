"use client";

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '@/shared/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useUIStore } from '@/shared/store/uiStore';
import { toast } from 'sonner';

export function ShareDialog() {
  const { isShareDialogOpen, shareDialogData, closeShareDialog } = useUIStore();

  const {
    title = '공유하기',
    description = '친구들과 공유하세요.',
    url,
    shareText = '',
  } = shareDialogData;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async (platform: 'facebook' | 'twitter' | 'email' | 'copy') => {
    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('링크가 클립보드에 복사되었습니다!');
          } else {
            // Fallback for older browsers or non-HTTPS contexts
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              toast.success('링크가 클립보드에 복사되었습니다!');
            } catch (err) {
              toast.error('링크 복사에 실패했습니다.');
            }
            document.body.removeChild(textArea);
          }
        } catch (err) {
          toast.error('링크 복사에 실패했습니다.');
        }
        break;
    }
  };

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={closeShareDialog}>
      <DialogPortal>
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeShareDialog} />
        <DialogPrimitive.Content
          className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="relative group">
            <button
              className="w-14 h-14 rounded-full bg-[#3b5998] hover:bg-[#3b5998]/90 text-white flex items-center justify-center transition-colors shadow-md"
              onClick={() => handleShare('facebook')}
              aria-label="Facebook"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Facebook에 공유
            </div>
          </div>
          <div className="relative group">
            <button
              className="w-14 h-14 rounded-full bg-black hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-md"
              onClick={() => handleShare('twitter')}
              aria-label="X"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              X에 공유
            </div>
          </div>
          <div className="relative group">
            <button
              className="w-14 h-14 rounded-full bg-[#EA4335] hover:bg-[#EA4335]/90 text-white flex items-center justify-center transition-colors shadow-md"
              onClick={() => handleShare('email')}
              aria-label="Email"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              이메일로 공유
            </div>
          </div>
          <div className="relative group">
            <button
              className="w-14 h-14 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors shadow-md"
              onClick={() => handleShare('copy')}
              aria-label="Copy Link"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              링크 복사
            </div>
          </div>
        </div>
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
