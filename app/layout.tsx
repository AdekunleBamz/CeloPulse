import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'CeloPulse | Activity Tracker & Auto-Rewards',
  description: 'Track your on-chain activity, earn rewards, and climb the leaderboard with automated transactions!',
  openGraph: {
    title: 'CeloPulse',
    description: 'Real-time blockchain activity tracker with auto-rewards',
    images: ['https://celopulse.vercel.app/og-image.png'],
    url: 'https://celopulse.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CeloPulse',
    description: 'Real-time blockchain activity tracker with auto-rewards',
    images: ['/og-image.png'],
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
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
