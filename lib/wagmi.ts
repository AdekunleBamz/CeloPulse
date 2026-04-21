import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { celo, celoSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

/** Chain ID for Celo Sepolia (Alfajores) testnet */
const CELO_SEPOLIA_CHAIN_ID = celoSepolia.id

/**
 * Dedicated wagmi config for CeloPulse.
 *
 * Key differences from the old RainbowKit getDefaultConfig():
 *  1. Uses createConfig() directly — avoids RainbowKit overhead inside MiniPay.
 *  2. Enables SSR hydration via cookieStorage — prevents blank-screen
 *     hydration mismatches that cause MiniPay webview failures.
 *  3. Injects the `injected()` connector explicitly so MiniPay's
 *     built-in provider is always discovered.
 */

const configuredChainId = Number.parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID?.trim() || '',
  10,
)

export const activeChains =
  configuredChainId === CELO_SEPOLIA_CHAIN_ID
    ? ([celoSepolia] as const)
    : ([celo] as const)

export function getConfig() {
  return createConfig({
    chains: activeChains,
    connectors: [injected()],
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    transports: {
      [celo.id]: http(),
      [celoSepolia.id]: http(),
    },
  })
}

/** Singleton for use outside of React context (e.g. in layout.tsx). */
let _config: ReturnType<typeof getConfig> | undefined
export function getOrCreateConfig() {
  if (!_config) _config = getConfig()
  return _config
}

/** Reset the singleton — useful in tests or when chain changes at runtime. */
export function resetConfig() {
  _config = undefined
}

export { CELO_SEPOLIA_CHAIN_ID }

/** Returns the active chain's native currency decimals (always 18 for Celo) */
export function getActiveChainDecimals(): number {
  return activeChains[0].nativeCurrency.decimals
}

/** Returns the chain ID of the currently active chain */
export function getActiveChainId(): number {
  return activeChains[0].id
}

/** Returns the human-readable name of the currently active chain */
export function getActiveChainName(): string {
  return activeChains[0].name
}

/** Returns true if the wagmi config singleton has been initialised */
export function isConfigured(): boolean {
  return _config !== undefined
}

/** Returns the block explorer base URL for the currently active chain */
export function getActiveChainBlockExplorer(): string {
  return activeChains[0].blockExplorers?.default?.url ?? 'https://celoscan.io'
}

/** Returns the RPC URL for the currently active chain */
export function getCeloRpcUrl(): string {
  return activeChains[0].rpcUrls.default.http[0]
}

/** Returns true when the app is configured to use Celo Sepolia testnet. */
export function isTestnet(): boolean {
  const id = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID?.trim() || '', 10)
  return id === 44787
}

export function getActiveChainNativeCurrency(chainId: number): string {
  return chainId === 42220 || chainId === 44787 ? 'CELO' : 'ETH'
}

export function isMainnetConfig(chainId: number): boolean {
  return chainId === 42220
}

export function getChainBlockTime(chainId: number): number {
  return chainId === 42220 || chainId === 44787 ? 5_000 : 12_000
}
