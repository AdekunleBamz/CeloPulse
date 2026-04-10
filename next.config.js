/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['celopulse-v2.vercel.app'],
    unoptimized: false,
  },
}

module.exports = nextConfig
