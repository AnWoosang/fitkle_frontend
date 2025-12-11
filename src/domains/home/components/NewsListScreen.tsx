"use client";

import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { useNews } from '@/domains/home/hooks';
import { NewsCategory } from '@/domains/home/types/news';
import { Footer } from '@/shared/components';

interface NewsListScreenProps {
  onNewsClick?: (newsId: string) => void;
  onBackClick?: () => void;
  initialCategory?: NewsCategory | 'ALL';
}

export function NewsListScreen({
  onNewsClick,
  initialCategory = 'ALL',
}: NewsListScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>(initialCategory);
  const { data: allNews = [], isLoading } = useNews();

  // 카테고리 필터링
  const filteredNews = selectedCategory === 'ALL'
    ? allNews
    : allNews.filter(news => news.category === selectedCategory);

  // 카테고리 목록
  const categories: Array<{ value: NewsCategory | 'ALL'; label: string }> = [
    { value: 'ALL', label: '전체' },
    { value: NewsCategory.ANNOUNCEMENT, label: '공지사항' },
    { value: NewsCategory.INFORMATION, label: '정보' },
    { value: NewsCategory.COMMUNICATION, label: '커뮤니케이션' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 z-30 bg-white border-b border-border/50 shadow-sm">
        <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto">
          <div className="py-4">
            <div className="flex items-center gap-3 pb-2 border-b border-border/30">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-primary" />
                FITKLE News
              </h1>
            </div>

            {/* 카테고리 필터 */}
            <div className="py-3 flex items-center gap-2">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm flex-shrink-0 ${
                      selectedCategory === category.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border/50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {filteredNews.length}개의 뉴스
          </p>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.map((news) => {
              const title = news.title;
              const content = news.content;
              const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;

              // 카테고리 라벨 매핑
              const categoryLabel = {
                'ANNOUNCEMENT': '공지사항',
                'INFORMATION': '정보',
                'COMMUNICATION': '소통',
              }[news.category] || news.category;

              return (
                <button
                  key={news.id}
                  onClick={() => onNewsClick?.(news.id)}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all text-left group"
                >
                  {/* 썸네일 이미지 */}
                  {news.thumbnailImageUrl && (
                    <div className="w-full aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={news.thumbnailImageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* 카드 내용 */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {news.isNew && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                          🆕 NEW
                        </span>
                      )}
                      <span className="px-2 py-1 bg-secondary/80 text-foreground rounded-md text-xs font-medium border border-border/50">
                        {categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {preview}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="line-clamp-1">{news.author}</span>
                      <span>•</span>
                      <span>
                        {news.createdAt
                          ? new Date(news.createdAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '날짜 없음'
                        }
                      </span>
                      {news.likeCount !== undefined && news.likeCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            ❤️ {news.likeCount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Newspaper className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">해당 카테고리의 뉴스가 없습니다</p>
            <p className="text-sm text-muted-foreground">다른 카테고리를 선택해보세요</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
