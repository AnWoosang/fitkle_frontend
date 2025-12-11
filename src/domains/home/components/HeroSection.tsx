"use client";

interface HeroSectionProps {
  onFindEventsClick?: () => void;
}

export function HeroSection({ onFindEventsClick }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-3xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 items-center p-12">
        {/* 왼쪽: 텍스트 컨텐츠 */}
        <div className="text-white space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            오늘 뭐 할까?
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            새로운 취미를 시작하고, 같은 관심사를 가진 사람들과<br />
            특별한 순간을 만들어보세요.
          </p>
          {onFindEventsClick && (
            <button
              onClick={onFindEventsClick}
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              이벤트 둘러보기
            </button>
          )}
        </div>

        {/* 오른쪽: 이미지 */}
        <div className="relative h-64 md:h-80">
          <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
            <div className="text-white/40 text-6xl">🎉</div>
          </div>
        </div>
      </div>
    </div>
  );
}
