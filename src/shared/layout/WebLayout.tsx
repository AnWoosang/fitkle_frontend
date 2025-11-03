import { ReactNode } from 'react';

interface WebLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  maxWidth?: 'default' | 'wide' | 'full';
  noPadding?: boolean;
}

export function WebLayout({ 
  children, 
  title, 
  subtitle,
  headerContent,
  headerClassName = '',
  contentClassName = '',
  maxWidth = 'default',
  noPadding = false,
}: WebLayoutProps) {
  const maxWidthClass = {
    default: 'max-w-[1600px]',
    wide: 'max-w-[2000px]',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-background overflow-hidden">
      {/* Header */}
      {(title || subtitle || headerContent) && (
        <div className={`bg-background border-b border-border/30 ${headerClassName}`}>
          <div className={`${maxWidthClass} mx-auto ${noPadding ? '' : 'px-8 lg:px-24 xl:px-32 2xl:px-40 py-6'}`}>
            {title && (
              <h1 className="mb-2">{title}</h1>
            )}

            {subtitle && (
              <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
            )}

            {headerContent}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col overflow-y-auto ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
