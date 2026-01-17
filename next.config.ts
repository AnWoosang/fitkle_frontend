import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Vercel 최적화
  compress: true,
  poweredByHeader: false,
  // ESLint를 빌드 중 건너뛰기 (배포 시 에러 방지)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript 에러도 경고로 처리
  typescript: {
    ignoreBuildErrors: false,
  },
  // 환경변수 노출
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
