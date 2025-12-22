import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  outputFileTracingIncludes: {
    '/legal/terms-of-service': ['./public/legal/**/*'],
    '/legal/privacy-policy': ['./public/legal/**/*'],
    '/legal/location-terms': ['./public/legal/**/*'],
  },
  // 정적 에러 페이지 생성 스킵
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
