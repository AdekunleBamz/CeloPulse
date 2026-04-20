import { celo, celoSepolia } from 'wagmi/chains'

type MiniPayEthereumProvider = {
  isMiniPay?: boolean
  request?: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: MiniPayEthereumProvider
  }
}

const configuredChainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID?.trim() || '', 10)

export const minipayChains =
  configuredChainId === celoSepolia.id
    ? ([celoSepolia] as const)
    : ([celo] as const)

export const activeCeloChain = minipayChains[0]

export const USD_M_MAINNET_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const
export const CUSD_SEPOLIA_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as const

/** Regex that matches a valid EVM hex address */
export const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

/** Returns true when the string looks like a valid EVM address */
export function isValidEvmAddress(value: string): value is `0x${string}` {
  return EVM_ADDRESS_REGEX.test(value)
}

/** Returns true if chainId is one of the supported Celo networks */
export function isSupportedChain(chainId: number): boolean {
  return minipayChains.some((chain) => chain.id === chainId)
}

export function getCUSDAddress(): `0x${string}` {
  return (activeCeloChain.id === celo.id ? USD_M_MAINNET_ADDRESS : CUSD_SEPOLIA_ADDRESS) as `0x${string}`
}

/** Human-readable symbol for the active cUSD token */
export function getCUSDSymbol(): string {
  return activeCeloChain.id === celo.id ? 'cUSD' : 'cUSD (Sepolia)'
}

export function isMiniPayProvider(provider?: MiniPayEthereumProvider | null) {
  return Boolean(provider?.isMiniPay)
}

export function isMiniPayWallet() {
  return typeof window !== 'undefined' && isMiniPayProvider(window.ethereum)
}

export function getMiniPayFeeCurrency() {
  const feeCurrency = process.env.NEXT_PUBLIC_MINIPAY_FEE_CURRENCY?.trim()

  if (feeCurrency && EVM_ADDRESS_REGEX.test(feeCurrency)) {
    return feeCurrency as `0x${string}`
  }

  if (activeCeloChain.id === celo.id) {
    return USD_M_MAINNET_ADDRESS
  }

  if (activeCeloChain.id === celoSepolia.id) {
    return CUSD_SEPOLIA_ADDRESS
  }

  return undefined
}
