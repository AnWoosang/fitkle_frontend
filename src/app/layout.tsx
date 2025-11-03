import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { WebHeaderWrapper } from '@/shared/layout';
import { PreRegisterButton } from '@/shared/components';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fitkle - Meetup App for Expats',
  description: 'Connect with people and join exciting events',
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <WebHeaderWrapper />
            {children}
            <PreRegisterButton />
            <Toaster position="top-center" richColors />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
