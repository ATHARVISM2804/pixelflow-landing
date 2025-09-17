/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
    unoptimized: true
  },
  // Support for PDF files and other assets
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Handle static file serving
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/public/:path*',
      },
    ];
  },
}

module.exports = nextConfig