'use client';

import { useRouter, useParams } from 'next/navigation';
import { NewsDetailScreen } from '@/domains/home/components/NewsDetailScreen';

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const handleBack = () => {
    router.back();
  };

  const handleNewsViewMoreClick = (category?: string) => {
    // 카테고리가 있으면 해당 카테고리로 필터링, 없으면 전체
    if (category) {
      router.push(`/news?category=${category}`);
    } else {
      router.push('/news');
    }
  };

  return (
    <NewsDetailScreen
      newsId={newsId}
      onBack={handleBack}
      onNewsViewMoreClick={handleNewsViewMoreClick}
    />
  );
}
