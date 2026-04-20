'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { celoPulseABI, erc20ABI } from '@/lib/abis'
import { getMiniPayFeeCurrency, getCUSDAddress, isMiniPayWallet } from '@/lib/minipay'
import { formatUnits, parseUnits } from 'viem'

/** How often to refetch user stats (ms) */
const USER_REFETCH_INTERVAL = 2000

/** How often to refetch rewards / claim eligibility (ms) */
const REWARDS_REFETCH_INTERVAL = 1000

/** Delay before retrying MiniPay auto-connect if provider wasn't ready (ms) */
const MINIPAY_RETRY_DELAY_MS = 500

/** How long to show the "Copied!" feedback before resetting (ms) */
const COPY_ADDRESS_TIMEOUT_MS = 2000

const ACTION_NAMES: Record<number, string> = {
  1: 'Check-In',
  2: 'Complete Task',
  3: 'Claim Reward',
  4: 'Compound',
  5: 'Stake',
  6: 'Unstake',
  7: 'Boost',
  8: 'Quest',
}

/** Maximum token amount (uint256 max) to reject absurdly large inputs early */
const MAX_TOKEN_INPUT = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

function parsePositiveWholeNumber(value: string): bigint | null {
  const normalized = value.trim()
  if (!/^\d+$/.test(normalized)) {
    return null
  }

  const parsedValue = BigInt(normalized)
  if (parsedValue > MAX_TOKEN_INPUT) return null
  return parsedValue > 0n ? parsedValue : null
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnectingWallet, error: connectError } = useConnect()
  const [activeTab, setActiveTab] = useState<'actions' | 'events' | 'quests' | 'wallet'>('actions')
  const [selectedStakeAmount, setSelectedStakeAmount] = useState('')
  const [selectedUnstakeAmount, setSelectedUnstakeAmount] = useState('')
  const [logoSrc, setLogoSrc] = useState('/icon.png')
  const [isMiniPay, setIsMiniPay] = useState(false)
  const [txNotice, setTxNotice] = useState<string | null>(null)
  const miniPayAutoConnectStarted = useRef(false)
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [isLoadingApp, setIsLoadingApp] = useState(true)

  const configuredContractAddress = process.env.NEXT_PUBLIC_CELOPULSE_CONTRACT?.trim()
  const contractAddress = configuredContractAddress
    ? (configuredContractAddress as `0x${string}`)
    : undefined
  const miniPayFeeCurrency = getMiniPayFeeCurrency()
  const cusdAddress = getCUSDAddress()
  const parsedStakeAmount = parsePositiveWholeNumber(selectedStakeAmount)
  const parsedUnstakeAmount = parsePositiveWholeNumber(selectedUnstakeAmount)

  // Debug: Log contract address (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Contract Address:', contractAddress)
      console.log('Wallet Address:', address)
      console.log('Is Connected:', isConnected)
      console.log('MiniPay Detected:', isMiniPay)
    }
  }, [contractAddress, address, isConnected, isMiniPay])

  const attemptMiniPayConnect = useCallback((forceRetry = false) => {
    if (isConnected) return
    if (miniPayAutoConnectStarted.current && !forceRetry) return
    miniPayAutoConnectStarted.current = true
    connect({ connector: injected() })
  }, [connect, isConnected])

  useEffect(() => {
    // Poll every 250ms for up to 5s — MiniPay provider may inject late.
    let attempts = 0
    const timer = setInterval(() => {
      attempts++
      const detected = isMiniPayWallet()
      if (detected || attempts >= 20) {
        clearInterval(timer)
        if (detected) {
          setIsMiniPay(true)
          attemptMiniPayConnect()
        }
      }
    }, 250)
    return () => clearInterval(timer)
  }, [attemptMiniPayConnect])

  // Read user data
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getUser',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress,
      refetchInterval: USER_REFETCH_INTERVAL,
    },
  })

  const [activityScore, totalActions, currentStreak, longestStreak, stakedScore, dailyActions, achievements] = 
    userData as [bigint, bigint, bigint, bigint, bigint, bigint, bigint] || [0n, 0n, 0n, 0n, 0n, 0n, 0n]

  // Read pending rewards
  const { data: pendingRewards } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getPendingRewards',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress,
      refetchInterval: REWARDS_REFETCH_INTERVAL,
    },
  })

  // Check if can claim/compound
  const { data: canClaim } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'canClaim',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress,
      refetchInterval: REWARDS_REFETCH_INTERVAL,
    },
  })

  const { data: canCompound } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'canCompound',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress,
      refetchInterval: REWARDS_REFETCH_INTERVAL,
    },
  })

  // Read recent actions (event feed)
  const { data: recentActions } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getRecentActions',
    args: [BigInt(20)],
    query: {
      enabled: !!contractAddress,
      refetchInterval: 3000,
    },
  })

  // Read leaderboard
  const { data: leaderboard } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getLeaderboard',
    query: {
      enabled: !!contractAddress,
      refetchInterval: 5000,
    },
  })

  // Read registered status
  const { data: isRegistered } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'isRegistered',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress,
    },
  })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({ hash })

  // cUSD balance
  const { data: cusdRawBalance, refetch: refetchCUSD } = useReadContract({
    address: cusdAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  })
  const formattedCUSD = cusdRawBalance != null ? parseFloat(formatUnits(cusdRawBalance, 18)).toFixed(4) : '0.0000'

  useEffect(() => {
    if (isSuccess) {
      refetchUser()
      refetchCUSD()
      setTxNotice(null)
      setSendTo('')
      setSendAmount('')
      // Reset form inputs after successful transaction
      setSelectedStakeAmount('')
      setSelectedUnstakeAmount('')
    }
  }, [isSuccess, refetchUser, refetchCUSD])

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingApp(false), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (writeError || txError) {
      console.error('Transaction error:', writeError || txError)
    }
  }, [writeError, txError])

  const handleAction = (action: string, args?: readonly unknown[]) => {
    if (!address) {
      console.error('No wallet address')
      setTxNotice('Connect a wallet before submitting a transaction.')
      return
    }
    if (!contractAddress) {
      console.error('Contract address not configured')
      setTxNotice(
        'Contract address not configured. Please set NEXT_PUBLIC_CELOPULSE_CONTRACT in your .env.local file.',
      )
      return
    }
    try {
      setTxNotice(null)
      // Use live detection as safety net — state may lag on first render
      const _isMiniPay = isMiniPay || isMiniPayWallet()
      const contractCall: Parameters<typeof writeContract>[0] = {
        address: contractAddress,
        abi: celoPulseABI,
        functionName: action as any,
        ...(args && args.length > 0 ? { args: args as any } : {}),
        ...(_isMiniPay ? { type: 'legacy' } : {}),
        ...(_isMiniPay && miniPayFeeCurrency ? { feeCurrency: miniPayFeeCurrency } : {}),
      } as any
      writeContract(contractCall)
    } catch (error) {
      console.error('Error calling writeContract:', error)
      setTxNotice('Unable to send this transaction. Please verify your inputs and try again.')
    }
  }

  const handleSendCUSD = () => {
    if (!address) { setTxNotice('Connect wallet first.'); return }
    const trimmedTo = sendTo.trim()
    const trimmedAmount = sendAmount.trim()
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedTo)) { setTxNotice('Invalid recipient address.'); return }
    const amount = parseFloat(trimmedAmount)
    if (isNaN(amount) || amount <= 0) { setTxNotice('Enter a valid amount greater than 0.'); return }
    const decimals = trimmedAmount.includes('.') ? trimmedAmount.split('.')[1].length : 0
    if (decimals > 18) { setTxNotice('Amount supports up to 18 decimal places.'); return }
    if (parseFloat(formattedCUSD) < amount) { setTxNotice('Insufficient cUSD balance.'); return }
    try {
      setTxNotice(null)
      const _isMiniPay = isMiniPay || isMiniPayWallet()
      writeContract({
        address: cusdAddress,
        abi: erc20ABI,
        functionName: 'transfer',
        args: [trimmedTo as `0x${string}`, parseUnits(trimmedAmount, 18)],
        ...(isMiniPay ? { type: 'legacy' } : {}),
        ...(isMiniPay && miniPayFeeCurrency ? { feeCurrency: miniPayFeeCurrency } : {}),
      } as any)
    } catch {
      setTxNotice('Failed to send cUSD. Please try again.')
    }
  }

  const copyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), COPY_ADDRESS_TIMEOUT_MS)
    } catch {
      setTxNotice('Could not copy address to clipboard.')
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-6 grid-bg relative overflow-hidden">
      {/* MiniPay loading splash */}
      {isLoadingApp && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center">
          <div className="text-6xl mb-6 animate-bounce">📊</div>
          <h2 className="text-2xl font-bold text-teal-400 mb-3">CeloPulse</h2>
          <div className="w-12 h-1 bg-teal-500 rounded-full animate-pulse" />
        </div>
      )}
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pulse-ring"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pulse-ring"></div>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image
              src={logoSrc}
              alt="CeloPulse logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg shadow-[0_0_24px_rgba(20,184,166,0.25)]"
              priority
              unoptimized
              onError={() => setLogoSrc('/favicon.png')}
            />
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                CeloPulse
              </h1>
              <p className="text-gray-400 mono-font text-sm">Real-time Activity Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div id="status-indicator" className="flex items-center gap-2 glass-cyber px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full event-indicator"></div>
              <span className="text-sm mono-font">LIVE</span>
            </div>
            {isConnected && (
              isMiniPay ? (
                <div id="minipay-badge" className="glass-cyber px-4 py-2 rounded-lg text-sm font-bold text-emerald-300">
                  ✓ MiniPay
                </div>
              ) : (
                <ConnectButton />
              )
            )}
          </div>
        </div>
        {txNotice && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/40 rounded-lg">
            <p className="text-amber-300 text-sm">{txNotice}</p>
          </div>
        )}

        {!isConnected ? (
          <div id="connect-screen" className="glass-cyber rounded-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {isMiniPay ? 'Connecting to MiniPay…' : 'Connect to Start Tracking'}
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                {isMiniPay
                  ? 'Auto-connecting your MiniPay wallet.'
                  : 'Monitor your on-chain activity and earn automated rewards'}
              </p>
            </div>
            {isMiniPay ? (
              <div className="space-y-4">
                {isConnectingWallet ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="spinner"></div>
                    <span className="mono-font text-sm text-gray-400">Connecting…</span>
                  </div>
                ) : connectError ? (
                  <div className="space-y-3">
                    <p className="text-red-400 text-sm">Connection failed. Please try again.</p>
                    <button
                      id="retry-minipay-btn"
                      onClick={() => {
                        miniPayAutoConnectStarted.current = false
                        attemptMiniPayConnect()
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg font-bold text-lg hover:scale-105 transition-transform glow-teal"
                    >
                      Retry MiniPay
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 glass-cyber px-5 py-3 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full event-indicator"></div>
                    <span className="mono-font text-sm">MiniPay ready</span>
                  </div>
                )}
              </div>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    id="connect-wallet-btn"
                    onClick={openConnectModal}
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg font-bold text-lg hover:scale-105 transition-transform glow-teal"
                  >
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        ) : !isRegistered ? (
          <div className="glass-cyber rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to CeloPulse!</h2>
            <p className="text-gray-400 mb-6">Register to start tracking your on-chain activity</p>
            {!contractAddress && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">⚠️ Contract address not configured. Please set NEXT_PUBLIC_CELOPULSE_CONTRACT in your .env.local file</p>
              </div>
            )}
            {(writeError || txError) && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">Error: {(writeError || txError)?.message || 'Transaction failed'}</p>
              </div>
            )}
            <button
              id="register-btn"
              onClick={() => handleAction('register')}
              disabled={isPending || isConfirming || !contractAddress}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-bold text-lg hover:scale-105 transition-transform glow-teal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming ? 'Registering...' : 'Register Now'}
            </button>
            {isPending && (
              <p className="mt-4 text-sm text-gray-400">Please confirm the transaction in your wallet...</p>
            )}
            {isConfirming && (
              <p className="mt-4 text-sm text-gray-400">Transaction confirmed! Waiting for block confirmation...</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1 mono-font">Activity Score</div>
                <div className="text-3xl font-bold text-teal-400">{Number(activityScore).toLocaleString()}</div>
              </div>
              <div className="glass-cyber rounded-xl p-4 cursor-pointer" onClick={() => setActiveTab('wallet')}>
                <div className="text-gray-400 text-sm mb-1 mono-font">cUSD Balance</div>
                <div className="text-2xl font-bold text-yellow-400">{formattedCUSD}</div>
              </div>
              <div className="glass-cyber rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1 mono-font">Streak</div>
                <div className="text-3xl font-bold text-blue-400">{Number(currentStreak)} 🔥</div>
              </div>
              <div className="glass-cyber rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1 mono-font">Total Actions</div>
                <div className="text-3xl font-bold text-purple-400">{Number(totalActions)}</div>
              </div>
            </div>

            {/* Auto-Rewards Status */}
            {stakedScore > 0n && (
              <div className="glass-cyber rounded-xl p-6 border-2 border-teal-500/50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-400 mb-1">Auto-Rewards Active</h3>
                    <p className="text-sm text-gray-400 mono-font">Earning {Number(pendingRewards || 0n).toLocaleString()} points</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction('claimRewards')}
                      disabled={!canClaim || isPending || isConfirming}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Claim
                    </button>
                    <button
                      onClick={() => handleAction('compoundRewards')}
                      disabled={!canCompound || isPending || isConfirming}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Compound
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse" style={{ width: `${canClaim ? 100 : 50}%` }}></div>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 glass-cyber rounded-xl p-2 overflow-x-auto">
              {(['actions', 'events', 'quests', 'wallet'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-fit py-3 px-3 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {tab === 'wallet' ? '💳 Wallet' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'actions' && (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {/* Quick Actions */}
                  <div className="glass-cyber rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-teal-400">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        id="checkin-btn"
                        onClick={() => handleAction('checkIn')}
                        disabled={isPending || isConfirming}
                        className="p-4 bg-gradient-to-br from-teal-500/20 to-teal-500/10 hover:from-teal-500/30 hover:to-teal-500/20 rounded-lg font-bold border border-teal-500/30 transition-all disabled:opacity-50"
                      >
                        ✓ Check-In
                      </button>
                      <button
                        onClick={() => handleAction('completeTask')}
                        disabled={isPending || isConfirming}
                        className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 rounded-lg font-bold border border-emerald-500/30 transition-all disabled:opacity-50"
                      >
                        ✓ Complete Task
                      </button>
                      <button
                        onClick={() => handleAction('activateBoost')}
                        disabled={activityScore < 50n || isPending || isConfirming}
                        className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/10 hover:from-blue-500/30 hover:to-blue-500/20 rounded-lg font-bold border border-blue-500/30 transition-all disabled:opacity-50"
                      >
                        ⚡ Boost (50)
                      </button>
                      <button
                        disabled
                        className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-lg font-bold border border-purple-500/30 opacity-50 cursor-not-allowed"
                      >
                        🎯 More Soon
                      </button>
                    </div>
                  </div>

                  {/* Staking */}
                  <div className="glass-cyber rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-emerald-400">Staking</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mono-font mb-2 block">Stake Score</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={selectedStakeAmount}
                            onChange={(e) => setSelectedStakeAmount(e.target.value)}
                            placeholder="Amount"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            className="flex-1 bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => parsedStakeAmount && handleAction('stakeScore', [parsedStakeAmount])}
                            disabled={!parsedStakeAmount || isPending || isConfirming}
                            className="px-6 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold transition-colors disabled:opacity-50"
                          >
                            Stake
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mono-font mb-2 block">Unstake Score</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={selectedUnstakeAmount}
                            onChange={(e) => setSelectedUnstakeAmount(e.target.value)}
                            placeholder="Amount"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            className="flex-1 bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => parsedUnstakeAmount && handleAction('unstakeScore', [parsedUnstakeAmount])}
                            disabled={!parsedUnstakeAmount || isPending || isConfirming}
                            className="px-6 bg-teal-500 hover:bg-teal-600 rounded-lg font-bold transition-colors disabled:opacity-50"
                          >
                            Unstake
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-cyber rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 text-teal-400">Event Stream</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recentActions && Array.isArray(recentActions) && recentActions[0]?.length > 0 ? (
                      (recentActions[0] as readonly `0x${string}`[]).map((addr: string, idx: number) => {
                        const actionType = (recentActions[1] as readonly bigint[])[idx]
                        const timestamp = (recentActions[2] as readonly bigint[])[idx]
                        const score = (recentActions[3] as readonly bigint[])[idx]
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-teal-500/20">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <div>
                                <div className="font-mono text-sm text-gray-400">
                                  {addr.slice(0, 6)}...{addr.slice(-4)}
                                </div>
                                <div className="text-xs text-teal-400">
                                  {ACTION_NAMES[Number(actionType)] || `Action ${actionType}`}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-emerald-400">+{Number(score)}</div>
                              <div className="text-xs text-gray-500 mono-font">
                                {new Date(Number(timestamp) * 1000).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-400">No recent activity</div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'quests' && (
                <motion.div
                  key="quests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="glass-cyber rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-purple-400">Daily Quests</h3>
                    <div className="space-y-3">
                      {[0, 1, 2, 3, 4].map((questId) => (
                        <button
                          key={questId}
                          onClick={() => handleAction('completeQuest', [BigInt(questId)])}
                          disabled={isPending || isConfirming}
                          className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 text-left"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold">Quest #{questId + 1}</div>
                              <div className="text-sm text-gray-400">Reward: {(5 + questId) * 10} points</div>
                            </div>
                            <div className="text-2xl">🎯</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-cyber rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-yellow-400">Achievements</h3>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg ${Number(achievements) & 1 ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-black/20 border border-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">First Step</div>
                            <div className="text-sm text-gray-400">Complete your first action</div>
                          </div>
                          <div className="text-2xl">{Number(achievements) & 1 ? '🏆' : '🔒'}</div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${Number(achievements) & 2 ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-black/20 border border-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">Getting Started</div>
                            <div className="text-sm text-gray-400">Complete 10 actions</div>
                          </div>
                          <div className="text-2xl">{Number(achievements) & 2 ? '🏆' : '🔒'}</div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${Number(achievements) & 4 ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-black/20 border border-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">Power User</div>
                            <div className="text-sm text-gray-400">Complete 50 actions</div>
                          </div>
                          <div className="text-2xl">{Number(achievements) & 4 ? '🏆' : '🔒'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wallet' && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* cUSD Balance Card */}
                  <div className="glass-cyber rounded-xl p-6 border-2 border-yellow-500/40">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 mono-font text-sm">cUSD Balance</span>
                      <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">Celo Stablecoin</span>
                    </div>
                    <div className="text-4xl font-bold text-yellow-400 mb-1">{formattedCUSD} <span className="text-lg text-gray-400">cUSD</span></div>
                    <div className="text-sm text-gray-500 mono-font">≈ ${formattedCUSD} USD</div>
                  </div>

                  {/* Wallet Address */}
                  <div className="glass-cyber rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-3 mono-font">Your Wallet Address</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 mono-font text-xs text-gray-300 break-all">
                        {address}
                      </div>
                      <button
                        onClick={copyAddress}
                        className={`shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          copySuccess
                            ? 'bg-emerald-500 text-white'
                            : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {copySuccess ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Share this address to receive cUSD on Celo</p>
                  </div>

                  {/* Send cUSD */}
                  <div className="glass-cyber rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-teal-400">Send cUSD</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400 mono-font mb-1 block">Recipient Address</label>
                        <input
                          type="text"
                          value={sendTo}
                          onChange={(e) => setSendTo(e.target.value)}
                          placeholder="0x..."
                          className="w-full bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500 mono-font text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mono-font mb-1 block">Amount (cUSD)</label>
                        <input
                          type="number"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          className="w-full bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500 text-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Available: {formattedCUSD} cUSD</p>
                      </div>
                      <button
                        onClick={handleSendCUSD}
                        disabled={isPending || isConfirming || !sendTo || !sendAmount}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-teal"
                      >
                        {isPending || isConfirming ? 'Sending...' : 'Send cUSD'}
                      </button>
                    </div>
                  </div>

                  {/* Staked score info */}
                  <div className="glass-cyber rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-xs mb-1 mono-font">Staked Score</div>
                        <div className="text-2xl font-bold text-emerald-400">{Number(stakedScore).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1 mono-font">Longest Streak</div>
                        <div className="text-2xl font-bold text-orange-400">{Number(longestStreak)} 🏆</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Bar */}
            {(isPending || isConfirming) && (
              <div className="glass-cyber rounded-xl p-4 border-2 border-teal-500">
                <div className="flex items-center justify-center gap-3">
                  <div className="spinner"></div>
                  <span className="font-bold mono-font">
                    {isPending ? 'Confirming in wallet...' : 'Processing transaction...'}
                  </span>
                </div>
              </div>
            )}
            {(writeError || txError) && (
              <div className="glass-cyber rounded-xl p-4 border-2 border-red-500">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-red-400 font-bold mono-font">
                    Error: {(writeError || txError)?.message || 'Transaction failed. Please try again.'}
                  </span>
                </div>
              </div>
            )}
            {/* Footer */}
            <footer className="mt-12 py-8 border-t border-teal-500/20 text-center">
              <div className="flex justify-center gap-6 mb-4">
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-teal-400 transition-colors mono-font">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-teal-400 transition-colors mono-font">
                  Terms of Service
                </Link>
              </div>
              <p className="text-[10px] text-gray-600 mono-font">
                © 2026 CeloPulse. Decentralized Activity Engine.
              </p>
            </footer>
          </div>
        )}
      </div>
    </main>
  )
}
