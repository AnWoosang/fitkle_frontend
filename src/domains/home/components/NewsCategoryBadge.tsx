import { NewsCategory } from '@/domains/home/types/news';

interface NewsCategoryBadgeProps {
  category: NewsCategory;
  className?: string;
}

export function NewsCategoryBadge({ category, className = '' }: NewsCategoryBadgeProps) {
  // 카테고리 라벨 매핑
  const categoryLabel = {
    'ANNOUNCEMENT': '공지사항',
    'INFORMATION': '정보',
    'COMMUNICATION': '소통',
  }[category] || category;

  return (
    <span className={`inline-flex items-center px-2 py-1 bg-primary text-white rounded-md text-xs font-medium ${className}`}>
      {categoryLabel}
    </span>
  );
}
