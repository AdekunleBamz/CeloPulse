'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, type State } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getOrCreateConfig } from '@/lib/wagmi'
import { isMiniPayWallet } from '@/lib/minipay'

const queryClient = new QueryClient()

/**
 * App-wide providers.
 *
 * Critical changes vs. old implementation:
 *  - Accepts `initialState` from server-side cookies so wagmi can
 *    hydrate without a mismatch (the #1 cause of MiniPay blank screens).
 *  - Only renders RainbowKitProvider when NOT inside MiniPay, since
 *    MiniPay uses its own injected provider and RainbowKit's modal
 *    is useless / confusing in that context.
 */
export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode
  initialState?: State
}) {
  const config = getOrCreateConfig()
  const [isMiniPay, setIsMiniPay] = useState(false)

  useEffect(() => {
    // MiniPay injects window.ethereum asynchronously — poll for up to 5s
    // instead of a single synchronous check that often fires too early.
    let attempts = 0
    const timer = setInterval(() => {
      attempts++
      if (isMiniPayWallet()) {
        clearInterval(timer)
        setIsMiniPay(true)
      } else if (attempts >= 20) {
        clearInterval(timer)
      }
    }, 250)
    return () => clearInterval(timer)
  }, [])

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {isMiniPay ? (
          /* Inside MiniPay — skip RainbowKit entirely to avoid
             unnecessary modals, bundle weight, and provider conflicts. */
          children
        ) : (
          <RainbowKitProvider>{children}</RainbowKitProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
