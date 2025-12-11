'use client';

import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PhoneVerificationBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">
              핏클의 모든 기능을 이용하기 위해서는 휴대폰 인증이 필요합니다
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/verify-phone')}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white h-8 px-4 text-sm whitespace-nowrap"
            >
              휴대폰 인증하기
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-yellow-600 hover:text-yellow-800 p-1"
              aria-label="배너 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
