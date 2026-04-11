import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

const shortDescription = 'MiniPay-ready Celo activity tracker.'
const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://celopulse-v2.vercel.app'
).replace(/\/+$/, '')
const ogImageUrl = `${appUrl}/og-image.png`
const talentVerificationToken =
  'b113f0ed99e7b0f3f9530432b6ff2829ce72689754dfab84dcd44622a59fa000657b8808a7e08e94bcde17a8b2bfa4b044f092ffe55c9ddef08ba41b8543cd63'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'CeloPulse | Activity Tracker & Auto-Rewards',
  description: shortDescription,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/icon.png' }],
  },
  other: {
    'talentapp:project_verification': talentVerificationToken,
  },
  openGraph: {
    title: 'CeloPulse',
    description: shortDescription,
    images: [ogImageUrl],
    url: appUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CeloPulse',
    description: shortDescription,
    images: [ogImageUrl],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="talentapp:project_verification"
          content={talentVerificationToken}
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
