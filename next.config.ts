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
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-of-use',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/refund',
        permanent: true,
      },
      {
        source: '/cancellation-policy',
        destination: '/refund',
        permanent: true,
      },
      {
        source: '/cancellation-and-refund',
        destination: '/refund',
        permanent: true,
      },
      {
        source: '/return-policy',
        destination: '/refund',
        permanent: true,
      },
      {
        source: '/returns',
        destination: '/refund',
        permanent: true,
      },
      {
        source: '/shipping-policy',
        destination: '/shipping',
        permanent: true,
      },
      {
        source: '/shipping-and-delivery',
        destination: '/shipping',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
