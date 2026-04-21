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

/** Returns true when the address is the EVM zero address */
export function isZeroAddress(address: string): boolean {
  return address.trim().toLowerCase() === ('0x' + '0'.repeat(40))
}

/** Returns a lowercase, trimmed copy of address */
export function normalizeAddress(value: string): string {
  return value.trim().toLowerCase()
}

/** Returns true when the two addresses refer to the same wallet (case-insensitive) */
export function isSameAddress(a: string, b: string): boolean {
  if (!a || !b) return false
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function getCUSDAddress(): `0x${string}` {
  return (activeCeloChain.id === celo.id ? USD_M_MAINNET_ADDRESS : CUSD_SEPOLIA_ADDRESS) as `0x${string}`
}

/** Human-readable symbol for the active cUSD token */
export function getCUSDSymbol(): string {
  return activeCeloChain.id === celo.id ? 'cUSD' : 'cUSD (Sepolia)'
}

/** Returns a shortened display version of an address (e.g. "0x1234...5678") */
export function formatAddress(address: string, start = 6, end = 4): string {
  const trimmedAddress = address.trim()
  if (trimmedAddress.length <= start + end) return trimmedAddress
  return `${trimmedAddress.slice(0, start)}...${trimmedAddress.slice(-end)}`
}

export function isMiniPayProvider(provider?: MiniPayEthereumProvider | null) {
  return Boolean(provider?.isMiniPay)
}

export function isMiniPayWallet() {
  return typeof window !== 'undefined' && isMiniPayProvider(window.ethereum)
}

/** Returns the block explorer base URL for the active chain */
export function getExplorerUrl(): string {
  return activeCeloChain.id === celo.id
    ? 'https://celoscan.io'
    : 'https://sepolia.celoscan.io'
}

/** Returns the full display label for the active chain, e.g. "Celo" or "Celo Sepolia" */
export function getActiveChainLabel(): string {
  return activeCeloChain.name
}

/** Returns true when the app is running against the Celo mainnet */
export function isMainnet(): boolean {
  return activeCeloChain.id === celo.id
}

/** Returns true when the app is running against Celo Sepolia (testnet) */
export function isTestnet(): boolean {
  return activeCeloChain.id === celoSepolia.id
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

/** Returns the native token symbol for the active chain */
export function getNativeTokenSymbol(): string {
  return 'CELO'
}

/** Returns a link to an address on the active chain's block explorer */
export function getAddressExplorerUrl(address: string): string {
  return `${getExplorerUrl()}/address/${address.trim()}`
}

/** Returns a link to a tx hash on the active chain's block explorer */
export function getTxExplorerUrl(hash: string): string {
  return `${getExplorerUrl()}/tx/${hash.trim()}`
}

/** Returns 'mainnet' or 'testnet' label for the active chain */
export function getNetworkType(): 'mainnet' | 'testnet' {
  return activeCeloChain.id === celo.id ? 'mainnet' : 'testnet'
}

/** Returns true when the address passes the EVM regex and is not the zero address */
export function isUsableAddress(address: string): boolean {
  return isValidEvmAddress(address) && !isZeroAddress(address)
}

/** Returns the display label to show for the connected environment */
export function getWalletEnvLabel(): string {
  return typeof window !== 'undefined' && isMiniPayProvider(window.ethereum)
    ? 'MiniPay'
    : 'Browser Wallet'
}

/** Returns true when the MiniPay window.ethereum provider is available. */
export function isMiniPayAvailable(): boolean {
  return typeof window !== 'undefined' && window.ethereum?.isMiniPay === true
}

/** Returns the active chain's native currency symbol. */
export function getActiveChainSymbol(): string {
  return activeCeloChain.nativeCurrency.symbol
}

/** Returns the active fee currency address based on the configured chain. */
export function getActiveFeeTokenAddress(): `0x${string}` {
  return activeCeloChain.id === celoSepolia.id ? CUSD_SEPOLIA_ADDRESS : USD_M_MAINNET_ADDRESS
}

/** Returns true if the active chain is Celo mainnet. */
export function isMainnet(): boolean {
  return activeCeloChain.id === celo.id
}

/** Returns the block explorer URL for the active chain. */
export function getExplorerUrl(txHash: string): string {
  const base = isMainnet()
    ? 'https://explorer.celo.org/mainnet/tx/'
    : 'https://explorer.celo.org/alfajores/tx/'
  return `${base}${txHash}`
}

export function isCeloMainnet(chainId: number): boolean {
  return chainId === 42220
}

export function isCeloSepolia(chainId: number): boolean {
  return chainId === 44787
}
