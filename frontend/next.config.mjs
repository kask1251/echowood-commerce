/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.62.246.215',
        port: '4001', // Allow images from Staging Backend
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '72.62.246.215',
        port: '4000', // Allow images from Prod Backend (in case data references it)
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/uploads/**',
      }
    ],
  },
  // Proxy API calls to the STAGING backend (4001)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4001/:path*',
      },
    ];
  },
};

export default nextConfig;