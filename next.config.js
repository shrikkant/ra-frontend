const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isDev = process.env.NODE_ENV === 'development'

// Content-Security-Policy directives
const cspDirectives = [
  // Default: only same-origin
  "default-src 'self'",
  // Scripts: self, inline (Next.js needs it), eval (dev), and trusted third parties
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://cdn.heapanalytics.com https://app.statwide.com https://cdn.pendo.io https://static.cloudflareinsights.com https://checkout.razorpay.com https://cdn.razorpay.com https://cdn.jsdelivr.net${isDev ? ' http://localhost:*' : ''}`,
  // Workers: Statwide tracker creates a blob worker
  "worker-src 'self' blob:",
  // Styles: self and inline (Tailwind injects styles)
  "style-src 'self' 'unsafe-inline' https://accounts.google.com https://app.statwide.com",
  // Images: self, data URIs, and known image hosts
  "img-src 'self' data: blob: https://rentacross.com https://cdn.sanity.io https://lh3.googleusercontent.com https://www.google.com https://www.gstatic.com https://cdn.pendo.io",
  // Fonts: self (next/font self-hosts)
  "font-src 'self'",
  // Connect (API calls, analytics): self and known backends
  `connect-src 'self' https://accounts.google.com https://rentacross.com https://dev.rentacross.com https://cdn.sanity.io https://www.google.com https://app.statwide.com https://cdn.heapanalytics.com https://www.google-analytics.com https://cdn.pendo.io https://static.cloudflareinsights.com https://api.razorpay.com https://cdn.razorpay.com https://lumberjack.razorpay.com${isDev ? ' http://localhost:*' : ''}`,
  // Frames: reCAPTCHA + Google Identity Services button/popup
  "frame-src 'self' https://accounts.google.com https://rentacross.com https://www.google.com https://www.gstatic.com https://api.razorpay.com https://checkout.razorpay.com https://app.statwide.com",
  // Prevent embedding this site in iframes on other domains
  "frame-ancestors 'self'",
  // Forms can only submit to self
  "form-action 'self'",
  // Base URI restricted
  "base-uri 'self'",
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  compress: true,
  reactStrictMode: true,
  output: 'standalone',
  // Listing routes prerender (city × subCategory) combos at build time.
  // Slow combos (low-inventory categories where the backend takes a
  // while to return an empty result) can blow past the default 60s
  // per-page limit. Be generous — builds are infrequent and we'd rather
  // wait than fall back to dynamic.
  staticPageGenerationTimeout: 300,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  experimental: {
    viewTransition: true,
    // Cap build-time worker count. Default is os.cpus().length - 1, which
    // fans out a lot of concurrent backend hits per page batch and adds
    // memory pressure on the build host. Two workers is a saner default —
    // slower wall-clock, but each worker gets backend headroom and the
    // build completes on smaller boxes.
    cpus: 2,
    workerThreads: false,
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
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/api/**',
      },
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
      // Local-dev image hosts (matches productPhotoUrl helper). Safe in
      // prod — `next/image` just allows them; nothing routes here unless
      // we explicitly build that URL.
      {
        protocol: 'https',
        hostname: 'labs.rentacross.com',
        port: '',
        pathname: '/api/products/**',
      },
      {
        protocol: 'https',
        hostname: 'alpha.rentacross.com',
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
