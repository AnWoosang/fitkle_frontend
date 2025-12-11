"use client";

import { ArrowLeft, User, Heart, Share2, ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/useTranslations';
import { useNewsDetail } from '@/domains/home/hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ShareDialog } from '@/shared/components/ShareDialog';
import { useUIStore } from '@/shared/store/uiStore';
import { NewsCategoryBadge } from './NewsCategoryBadge';

interface NewsDetailScreenProps {
  newsId: string;
  onBack: () => void;
  onNewsViewMoreClick?: (category?: string) => void;
}

export function NewsDetailScreen({ newsId, onBack, onNewsViewMoreClick }: NewsDetailScreenProps) {
  const tCommon = useTranslations('common');
  const { openShareDialog } = useUIStore();

  // ✅ High-Level 훅 하나로 모든 로직 처리
  const {
    post,
    relatedNews,
    isLoading,
    error,
    isLiked,
    likeCount,
    // TODO: view_count 컬럼 추가 후 활성화
    // viewCount,
    handleLike,
  } = useNewsDetail(newsId);

  // ==================== 로딩 상태 ====================
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{tCommon('back')}</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // ==================== 에러 상태 ====================
  if (!post || error) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{tCommon('back')}</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">뉴스를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  // ==================== 헬퍼 함수 ====================
  const getContent = () => post.content;
  const getTitle = () => post.title;

  // 카테고리 라벨 매핑
  const categoryLabel = {
    'ANNOUNCEMENT': '공지사항',
    'INFORMATION': '정보',
    'COMMUNICATION': '소통',
  }[post.category] || post.category;

  // ==================== 렌더링 ====================
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-24">
      {/* Content Container */}
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 lg:px-24 xl:px-32 2xl:px-40 py-4 md:py-5">
        {/* Category Badge */}
        <div className="mb-2 md:mb-3">
          <span className="text-xs md:text-sm text-muted-foreground">
            FITKLE News &gt; {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 leading-tight">{getTitle()}</h1>

        {/* Author Info & Actions */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
          {/* Author */}
          <div className="flex items-center gap-2 md:gap-3">
            {post.thumbnailImageUrl ? (
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={post.thumbnailImageUrl}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-medium text-foreground">{post.author}</span>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '날짜 없음'
                  }
                </span>
                {/* TODO: view_count 컬럼 추가 후 활성화 */}
                {/* <span>·</span>
                <span>조회 {viewCount}</span> */}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Share Button */}
            <button
              className="w-9 h-9 md:w-10 md:h-10 hover:bg-card rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              onClick={() =>
                openShareDialog({
                  title: '뉴스 공유하기',
                  description: '뉴스를 친구들과 공유하세요.',
                  shareText: post?.title || '',
                })
              }
              aria-label="공유"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content (Markdown) */}
        <div className="mb-6 prose prose-sm md:prose-base max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-h1:text-xl md:prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6
          prose-h2:text-lg md:prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5
          prose-h3:text-base md:prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
          prose-p:text-foreground/90 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
          prose-strong:text-foreground prose-strong:font-semibold
          prose-ul:text-foreground/90 prose-ul:mb-4 prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:space-y-2
          prose-ol:text-foreground/90 prose-ol:mb-4 prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:space-y-2
          prose-li:leading-relaxed prose-li:text-sm md:prose-li:text-base
          prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-3 md:prose-blockquote:pl-4
          prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:bg-gradient-to-r
          prose-blockquote:from-primary/5 prose-blockquote:to-transparent prose-blockquote:rounded-r-lg prose-blockquote:text-foreground/80
          prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs md:prose-code:text-sm
          prose-code:border prose-code:border-border/30 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
          prose-img:rounded-xl md:prose-img:rounded-2xl prose-img:shadow-sm md:prose-img:shadow-md
          prose-img:my-6 md:prose-img:my-8 prose-img:w-full prose-img:h-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {getContent()}
          </ReactMarkdown>
        </div>

        {/* Like Button */}
        <div className="flex justify-center py-4 border-y border-border/60">
          <button
            onClick={handleLike}
            className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center gap-2 rounded-xl transition-all shadow-sm ${
              isLiked
                ? 'bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 border border-red-200'
                : 'bg-gradient-to-br from-card to-muted/30 text-muted-foreground hover:from-muted/50 hover:to-muted/40 border border-border/40'
            }`}
            aria-label="좋아요"
          >
            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-red-600' : ''}`} />
          </button>
        </div>

        <div className="text-center py-2">
          <span className="text-sm text-muted-foreground">{likeCount}명이 좋아합니다</span>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-6 md:mt-8">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="flex items-center gap-2 text-base md:text-lg">
                <span>관련 뉴스</span>
                <span className="text-xs md:text-sm text-muted-foreground font-normal">
                  ({relatedNews.length})
                </span>
              </h3>
              <button
                onClick={() => onNewsViewMoreClick?.(post.category)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 md:space-y-3">
              {relatedNews.map(relatedPost => (
                <button
                  key={relatedPost.id}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                  className="w-full bg-gradient-to-br from-card to-card/50 rounded-xl p-3 md:p-4 border border-border/60 hover:border-primary/50 hover:shadow-md transition-all text-left"
                >
                  <div className="flex gap-3">
                    {relatedPost.thumbnailImageUrl && (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-muted/30 to-muted/60">
                        <img
                          src={relatedPost.thumbnailImageUrl}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 md:py-1">
                      <div>
                        <div className="mb-1.5 md:mb-2">
                          <NewsCategoryBadge category={relatedPost.category} />
                        </div>
                        <p className="text-sm md:text-base font-medium mb-1 line-clamp-2 leading-snug">
                          {relatedPost.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {relatedPost.createdAt
                            ? new Date(relatedPost.createdAt).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric'
                              })
                            : '날짜 없음'
                          }
                        </span>
                        {relatedPost.likeCount !== undefined && relatedPost.likeCount > 0 && (
                          <>
                            <span>•</span>
                            <span>❤️ {relatedPost.likeCount}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog />
    </div>
  );
}
