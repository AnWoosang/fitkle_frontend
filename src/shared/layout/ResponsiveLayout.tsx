'use client';

import { ReactNode } from 'react';
import { MobileLayout } from './MobileLayout';
import { WebLayout } from './WebLayout';
import { useMediaQuery } from '@/shared/hooks';

interface MobileLayoutProps {
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

interface WebLayoutProps {
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  maxWidth?: 'default' | 'wide' | 'full';
  noPadding?: boolean;
}

interface ResponsiveLayoutProps {
  mobileContent: ReactNode;
  webContent: ReactNode;
  mobileLayoutProps?: MobileLayoutProps;
  webLayoutProps?: WebLayoutProps;
}

export function ResponsiveLayout({
  mobileContent,
  webContent,
  mobileLayoutProps,
  webLayoutProps,
}: ResponsiveLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileLayout {...mobileLayoutProps}>{mobileContent}</MobileLayout>;
  }

  return <WebLayout {...webLayoutProps}>{webContent}</WebLayout>;
}
