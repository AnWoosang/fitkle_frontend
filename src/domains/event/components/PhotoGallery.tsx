import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';

interface PhotoGalleryProps {
  photos: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function PhotoGallery({ photos, isOpen, onClose, initialIndex = 0 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset to initial index when modal opens
  useState(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[85vw] sm:!max-w-[85vw] w-[85vw] h-[90vh] max-h-[90vh] p-0 gap-0 bg-white border border-border overflow-hidden [&>button:last-child]:hidden">
        {/* Accessibility - Hidden Title and Description */}
        <DialogTitle className="sr-only">이벤트 사진 갤러리</DialogTitle>
        <DialogDescription className="sr-only">
          이벤트의 사진들을 확대하여 볼 수 있습니다. {photos.length}장의 사진이 있습니다.
        </DialogDescription>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm shadow-lg hover:shadow-xl border border-border/50"
          aria-label="닫기"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Main Content Wrapper */}
        <div className="flex flex-col h-full max-h-full overflow-hidden">
          {/* Main Image Area */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-20 py-8 md:py-12 bg-background">
            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-muted/80 hover:bg-muted rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-sm shadow-md"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-muted/80 hover:bg-muted rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-sm shadow-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-muted/90 backdrop-blur-md rounded-full shadow-lg">
              <p className="text-sm text-foreground">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="flex-shrink-0 bg-card border-t border-border p-4 md:p-5">
            <div className="w-full mx-auto">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all border-2 ${
                      index === currentIndex
                        ? 'border-primary scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
