/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['celopulse-v2.vercel.app'],
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
}

module.exports = nextConfig
