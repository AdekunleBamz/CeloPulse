'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, type State } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { getOrCreateConfig } from '@/lib/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

/**
 * App-wide providers.
 *
 * RainbowKitProvider is always rendered — it is a context-only provider
 * (no visible UI by itself) so it is safe in MiniPay's WebView.
 * The MiniPay-specific UI is gated inside page.tsx via its own
 * isMiniPay state, which avoids a race condition that previously caused
 * ConnectButton.Custom to lose its RainbowKit context and crash.
 */
export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode
  initialState?: State
}) {
  const config = getOrCreateConfig()

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
