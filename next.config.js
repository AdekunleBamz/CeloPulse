/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['celopulse.vercel.app'],
    unoptimized: false,
  },
}

module.exports = nextConfig
