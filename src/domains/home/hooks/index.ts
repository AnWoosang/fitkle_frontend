// Low-Level Query & Mutation Hooks
export {
  useNews,
  useNewsById,
  useIncrementNewsViews,
  useLikeNews,
  useBookmarkNews,
} from './useNewsQueries';

// Mid-Level Business Logic Hooks
export { useNewsLike } from './useNewsInteraction';

// High-Level Page Hooks
export { useNewsDetail } from './useNewsDetail';

// Other Hooks
export { useFilteredNews } from './useFilteredNews';
export { useCategories } from './useCategories';
