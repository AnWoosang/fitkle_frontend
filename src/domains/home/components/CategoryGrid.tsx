"use client";

import { useCategories } from '../hooks/useCategories';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';

interface CategoryGridProps {
  onCategoryClick: (category: string) => void;
}

// 커스텀 화살표 컴포넌트
interface ArrowProps {
  onClick?: () => void;
}

function NextArrow({ onClick }: ArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -mr-5"
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function PrevArrow({ onClick }: ArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -ml-5"
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { data: categories = [], isLoading, error } = useCategories();

  // 디버깅: 카테고리 데이터 확인
  console.log('🔍 [CategoryGrid] Debug Info:', {
    categoriesCount: categories.length,
    categories: categories.slice(0, 3),
    isLoading,
    error,
  });

  // Slider settings - 4개씩 2줄 표시 (총 8개)
  const sliderSettings: Settings = {
    dots: false,
    infinite: categories.length > 8,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2,
    slidesPerRow: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          rows: 2,
          infinite: categories.length > 8,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 2,
          infinite: categories.length > 6,
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
          infinite: categories.length > 4,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
          infinite: categories.length > 2,
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-5">카테고리 둘러보기</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">인기 카테고리 둘러보기</h2>
      <div className="relative -mx-2">
        <Slider {...sliderSettings}>
          {categories.map((category) => (
            <div key={category.id} className="px-2 pb-4">
              <button
                onClick={() => onCategoryClick(category.id)}
                className="group w-full h-32 bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary hover:shadow-lg transition-all text-left relative overflow-hidden flex flex-col justify-between"
              >
                {/* Bottom color accent - primary 색상 사용 */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all group-hover:h-2"
                />

                <div className="flex items-start justify-between">
                  <span className="text-4xl">{category.icon}</span>
                  <ChevronRight
                    className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                  />
                </div>

                <h3 className="text-base font-semibold" style={{ color: 'rgb(45,51,25)' }}>
                  {category.name}
                </h3>
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
