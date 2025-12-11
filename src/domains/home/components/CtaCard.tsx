"use client";

import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  onSignupClick: () => void;
}

export function CtaCard({ onSignupClick }: CtaCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-12 text-center border border-primary/20">
      <h2 className="text-3xl font-bold mb-4">
        지금 바로 시작하세요
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Fitkle과 함께 새로운 친구를 만나고, 특별한 경험을 쌓아보세요
      </p>
      <Button
        onClick={onSignupClick}
        size="lg"
        className="px-8 py-6 text-lg"
      >
        무료로 시작하기
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}
