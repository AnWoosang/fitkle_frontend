import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { WebHeaderWrapper } from '@/shared/layout';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fitkle - Meetup App for Expats',
  description: 'Connect with people and join exciting events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <QueryProvider>
          <WebHeaderWrapper />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
