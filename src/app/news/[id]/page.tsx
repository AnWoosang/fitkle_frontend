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

  return (
    <NewsDetailScreen
      newsId={newsId}
      onBack={handleBack}
    />
  );
}
