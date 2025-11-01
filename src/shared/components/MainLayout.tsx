import { ReactNode } from 'react';
import Image from 'next/image';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  showLogo?: boolean;
}

export function MainLayout({ 
  children, 
  title, 
  subtitle,
  headerContent,
  headerClassName = '',
  contentClassName = '',
  showLogo = true,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain pb-24">
      {/* Header */}
      <div className={`sticky top-0 z-10 bg-background border-b border-border/30 ${headerClassName}`}>
        <div className="px-4 pt-4 pb-3">
          {showLogo && (
            <div className="flex justify-center items-center mb-2">
              <Image
                src="/logo.png"
                alt="fitkle"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
            </div>
          )}
          
          {title && (
            <h2 className="text-2xl mb-3 text-center">{title}</h2>
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
