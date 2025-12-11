import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { ClientLayout } from '@/shared/layout';
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
    <html lang="en" className={pretendard.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>
          <WebHeaderWrapper />
          {children}
        </ClientLayout>

        {/* Daum 우편번호 서비스 */}
        <Script
          src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
