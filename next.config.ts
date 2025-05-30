import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**', // Match all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**', // Match all paths under this hostname
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Suppresses ESLint errors during the build
  },
};

export default nextConfig;
