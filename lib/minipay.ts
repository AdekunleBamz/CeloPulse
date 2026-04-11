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
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export const USD_M_MAINNET_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const

export function isMiniPayProvider(provider?: MiniPayEthereumProvider | null) {
  return Boolean(provider?.isMiniPay)
}

export function isMiniPayWallet() {
  return typeof window !== 'undefined' && isMiniPayProvider(window.ethereum)
}

export function getMiniPayFeeCurrency() {
  const feeCurrency = process.env.NEXT_PUBLIC_MINIPAY_FEE_CURRENCY?.trim()

  if (feeCurrency && ADDRESS_REGEX.test(feeCurrency)) {
    return feeCurrency as `0x${string}`
  }

  if (activeCeloChain.id === celo.id) {
    return USD_M_MAINNET_ADDRESS
  }

  return undefined
}
