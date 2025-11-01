import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppLogo } from '@/shared/components/AppLogo';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  showLogo?: boolean;
  stickyHeader?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function MobileLayout({ 
  children, 
  title, 
  subtitle,
  headerContent,
  headerClassName = '',
  contentClassName = '',
  showLogo = true,
  stickyHeader = true,
  showBackButton = false,
  onBack,
}: MobileLayoutProps) {
  return (
    <div className="flex flex-col min-h-full bg-background pb-24">
      {/* Header */}
      <div className={`${stickyHeader ? 'sticky top-0 z-10' : ''} bg-background border-b border-border/30 ${headerClassName}`}>
        <div className="px-4 pt-4 pb-3">
          {showBackButton && onBack && (
            <div className="flex items-center mb-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          )}
          {showLogo && !showBackButton && (
            <div className="flex justify-center items-center mb-2">
              <AppLogo compact />
            </div>
          )}
          
          {title && (
            <h2 className="mb-3 text-center">{title}</h2>
          )}
          
          {subtitle && (
            <p className="text-sm text-muted-foreground text-center mb-3">{subtitle}</p>
          )}
          
          {headerContent}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
