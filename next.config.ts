import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: '**.soundcloud.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.sndcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.sndcdn.com',
      },
    ],
  },
};

export default nextConfig;
