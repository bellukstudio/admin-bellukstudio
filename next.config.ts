import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**', // Match all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Corrected: Removed protocol
        pathname: '/**', // Match all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
