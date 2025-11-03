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
  // Skip static error pages during build
  skipTrailingSlashRedirect: true,
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
