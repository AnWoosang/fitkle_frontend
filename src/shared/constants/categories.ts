import categoryLabels from '@/assets/category_labels.json';

/**
 * 카테고리 인터페이스
 *
 * @deprecated 이 인터페이스는 정적 데이터에서 사용됩니다.
 * 새로운 코드에서는 CategoryResponse 타입과 useEventCategories/useGroupCategories 훅을 사용하세요.
 */
export interface Category {
  key: string;      // DB에 저장되는 값 (예: "ARTS")
  label: string;    // 사용자에게 보이는 값 (예: "Arts & Creative")
  emoji: string;    // 카테고리 이모지
}

/**
 * 카테고리 키 타입
 *
 * @deprecated 이 타입은 정적 데이터에서 사용됩니다.
 * 새로운 코드에서는 CategoryCode 타입을 사용하세요.
 */
export type CategoryKey = keyof typeof categoryLabels;

/**
 * 전체 카테고리 목록 (이모지 포함)
 *
 * @deprecated 이 상수는 정적 데이터입니다.
 * 새로운 코드에서는 useEventCategories() 또는 useGroupCategories() 훅을 사용하여
 * DB에서 실시간으로 카테고리를 가져오세요.
 *
 * @example
 * // 이전 방식 (deprecated)
 * import { CATEGORIES } from '@/shared/constants/categories';
 *
 * // 새로운 방식 (권장)
 * import { useEventCategories } from '@/shared/hooks';
 * const { data: categories } = useEventCategories();
 */
export const CATEGORIES: Category[] = [
  { key: 'ARTS', label: categoryLabels.ARTS, emoji: '🎨' },
  { key: 'BUSINESS', label: categoryLabels.BUSINESS, emoji: '💼' },
  { key: 'COMMUNITY', label: categoryLabels.COMMUNITY, emoji: '🤝' },
  { key: 'DANCE', label: categoryLabels.DANCE, emoji: '💃' },
  { key: 'GAMING', label: categoryLabels.GAMING, emoji: '🎮' },
  { key: 'WELLNESS', label: categoryLabels.WELLNESS, emoji: '🧘' },
  { key: 'HOBBIES', label: categoryLabels.HOBBIES, emoji: '🎨' },
  { key: 'LANGUAGE', label: categoryLabels.LANGUAGE, emoji: '💬' },
  { key: 'LGBTQ', label: categoryLabels.LGBTQ, emoji: '🏳️‍🌈' },
  { key: 'EDUCATION', label: categoryLabels.EDUCATION, emoji: '📚' },
  { key: 'FILM', label: categoryLabels.FILM, emoji: '🎬' },
  { key: 'MUSIC', label: categoryLabels.MUSIC, emoji: '🎵' },
  { key: 'SPIRITUALITY', label: categoryLabels.SPIRITUALITY, emoji: '🕉️' },
  { key: 'MYSTICISM', label: categoryLabels.MYSTICISM, emoji: '🔮' },
  { key: 'FAMILY', label: categoryLabels.FAMILY, emoji: '👨‍👩‍👧‍👦' },
  { key: 'PETS', label: categoryLabels.PETS, emoji: '🐾' },
  { key: 'FAITH', label: categoryLabels.FAITH, emoji: '🙏' },
  { key: 'SCIFI', label: categoryLabels.SCIFI, emoji: '🚀' },
  { key: 'SOCIAL', label: categoryLabels.SOCIAL, emoji: '🎉' },
  { key: 'FITNESS', label: categoryLabels.FITNESS, emoji: '⚽' },
  { key: 'SUPPORT', label: categoryLabels.SUPPORT, emoji: '💪' },
  { key: 'TECH', label: categoryLabels.TECH, emoji: '💻' },
  { key: 'OUTDOOR', label: categoryLabels.OUTDOOR, emoji: '🏔️' },
  { key: 'WRITING', label: categoryLabels.WRITING, emoji: '✍️' },
];

/**
 * 카테고리 키로 라벨 조회
 */
export const getCategoryLabel = (key: string): string => {
  return categoryLabels[key as CategoryKey] || key;
};

/**
 * 카테고리 키로 카테고리 객체 조회
 */
export const getCategoryByKey = (key: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.key === key);
};

/**
 * 카테고리 라벨로 키 조회
 */
export const getCategoryKeyByLabel = (label: string): string | undefined => {
  const category = CATEGORIES.find(cat => cat.label === label);
  return category?.key;
};
