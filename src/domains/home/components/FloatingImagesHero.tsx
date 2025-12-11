"use client";

import { Button } from '@/shared/components/ui/button';

interface FloatingImagesHeroProps {
  onSignupClick: () => void;
}

export function FloatingImagesHero({ onSignupClick }: FloatingImagesHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-3xl overflow-hidden py-16 px-8">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          새로운 친구와<br />특별한 경험을 만나보세요
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          한국에서 외국인들과 함께하는 다양한 이벤트와 모임
        </p>
        <Button
          onClick={onSignupClick}
          size="lg"
          className="px-8 py-6 text-lg"
        >
          가입하기
        </Button>
      </div>

      {/* Floating Images - Decorative */}
      <div className="absolute top-4 left-4 w-32 h-32 rounded-2xl overflow-hidden opacity-20 rotate-12">
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400"
          alt="Event"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-8 right-8 w-40 h-40 rounded-2xl overflow-hidden opacity-20 -rotate-6">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"
          alt="Event"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
