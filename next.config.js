const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  output: 'standalone',
  publicRuntimeConfig: {
    BASE_API_URL: process.env.REACT_APP_API_URL,
  },
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    qualities: [75, 80, 85],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [32, 64, 128, 256],
    domains: [],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    disableStaticImages: false,
    minimumCacheTTL: 3600,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; img-src 'self' data: https://cdn.sanity.io https://rentacross.com;",
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rentacross.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'rentacross.com',
        port: '',
        pathname: '/api/products/**',
      },
      {
        protocol: 'http',
        hostname: 'dev.rentacross.com',
        port: '',
        pathname: '/api/products/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
    unoptimized: false,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
