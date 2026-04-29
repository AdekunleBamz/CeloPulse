import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

const shortDescription = 'MiniPay-ready Celo activity tracker.'
const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://celopulse-v2.vercel.app'
).replace(/\/+$/, '')
const ogImageUrl = `${appUrl}/og-image.png`
const talentVerificationToken =
  '29cdaebe307898eb2932a2745b19c5c67ae77af9754be3bd11fe1842a6faf9c8d0a6f538cfefd478be5756f5ee857105fd3372e6a0428620966e0e297050593f'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: 'CeloPulse',
  title: 'CeloPulse | Activity Tracker & Auto-Rewards',
  description: shortDescription,
  themeColor: '#020617',
  manifest: '/site.webmanifest',
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
