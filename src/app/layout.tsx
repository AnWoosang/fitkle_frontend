import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { WebHeaderWrapper } from '@/shared/layout';
import { PreRegisterButton } from '@/shared/components';
import { Toaster } from 'sonner';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fitkle - Meetup App for Expats',
  description: 'Connect with people and join exciting events',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pretendard.variable}>
      <body>
        <QueryProvider>
          <WebHeaderWrapper />
          {children}
          <PreRegisterButton />
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
