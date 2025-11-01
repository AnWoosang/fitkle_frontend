"use client";

import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { newsPosts } from '@/data/news';
import { Badge } from '@/shared/components/ui/badge';

interface NewsDetailScreenProps {
  newsId: string;
  onBack: () => void;
}

export function NewsDetailScreen({ newsId, onBack }: NewsDetailScreenProps) {
  const post = newsPosts.find(p => p.id === newsId);
  
  if (!post) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">뉴스를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const getContent = () => post.contentKo;
  const getTitle = () => post.titleKo;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Fitkle News</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Category Badge */}
        <div className="mb-4">
          <Badge className="bg-primary/10 text-primary border-0">
            {post.category === 'announcement' ? '공지' :
             post.category === 'update' ? '업데이트' :
             post.category === 'event' ? '이벤트' :
             post.category === 'community' ? '커뮤니티' : post.category}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-2xl mb-4">{getTitle()}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={post.image} 
              alt={getTitle()}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <div className="text-base leading-relaxed whitespace-pre-line">
            {getContent()}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-muted/50 text-muted-foreground rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border/50 rounded-xl hover:bg-accent transition-colors">
            <Share2 className="w-4 h-4" />
            <span>공유하기</span>
          </button>
        </div>

        {/* Related News */}
        <div className="mt-8">
          <h3 className="mb-4">관련 뉴스</h3>
          <div className="space-y-3">
            {newsPosts
              .filter(p => p.id !== newsId && p.category === post.category)
              .slice(0, 3)
              .map(relatedPost => (
                <button
                  key={relatedPost.id}
                  onClick={() => {
                    // Navigate to this news post
                    window.scrollTo(0, 0);
                  }}
                  className="w-full bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all text-left"
                >
                  <div className="flex gap-3">
                    {relatedPost.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={relatedPost.image}
                          alt={relatedPost.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-1 line-clamp-2">
                        {relatedPost.titleKo}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{relatedPost.date}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
