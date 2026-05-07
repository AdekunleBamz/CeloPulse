/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'celopulse-v2.vercel.app' }],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Stub out optional native/Node-only deps that can't be resolved in the
      // browser bundle: @metamask/sdk uses React Native AsyncStorage, and
      // pino (via WalletConnect) optionally requires pino-pretty.
      // Using alias: false emits an empty module instead of a runtime throw.
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      }
    }
    return config
  },
}

module.exports = nextConfig
