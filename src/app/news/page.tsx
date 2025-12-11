"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NewsListScreen } from '@/domains/home/components';
import { NewsCategory } from '@/domains/home/types/news';

function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 카테고리 파라미터 읽기
  const categoryParam = searchParams.get('category');
  const initialCategory = categoryParam as NewsCategory | 'ALL' || 'ALL';

  const handleNewsClick = (newsId: string) => {
    router.push(`/news/${newsId}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <NewsListScreen
      onNewsClick={handleNewsClick}
      onBackClick={handleBackClick}
      initialCategory={initialCategory}
    />
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsContent />
    </Suspense>
  );
}
