import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '127.0.0.1:3050', 'localhost:3050'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/events-acheivements',
        destination: '/events-achievements',
        permanent: true,
      },
      {
        source: '/events-and-achievements',
        destination: '/events-achievements',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
