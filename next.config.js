/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  publicRuntimeConfig: {
    BASE_API_URL: process.env.REACT_APP_API_URL,
  },
  images: {
    domains: ["images.pexels.com"],
  },
}

module.exports = nextConfig
