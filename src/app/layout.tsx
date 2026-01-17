import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'FITKLE',
  description: '친구들과 함께 즐기는 파티 게임 - 눈치게임, 369게임, 베스킨라빈스31 등',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
