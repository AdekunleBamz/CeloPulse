'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { celoPulseABI } from '@/lib/abis'

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

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'actions' | 'events' | 'quests'>('actions')
  const [selectedStakeAmount, setSelectedStakeAmount] = useState('')
  const [selectedUnstakeAmount, setSelectedUnstakeAmount] = useState('')
  const [selectedQuestId, setSelectedQuestId] = useState(0)
  
  const contractAddress = process.env.NEXT_PUBLIC_CELOPULSE_CONTRACT as `0x${string}`

  // Read user data
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getUser',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
      refetchInterval: 2000,
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
      enabled: !!address,
      refetchInterval: 1000,
    },
  })

  // Check if can claim/compound
  const { data: canClaim } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'canClaim',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
      refetchInterval: 1000,
    },
  })

  const { data: canCompound } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'canCompound',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
      refetchInterval: 1000,
    },
  })

  // Read recent actions (event feed)
  const { data: recentActions } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getRecentActions',
    args: [BigInt(20)],
    query: {
      refetchInterval: 3000,
    },
  })

  // Read leaderboard
  const { data: leaderboard } = useReadContract({
    address: contractAddress,
    abi: celoPulseABI,
    functionName: 'getLeaderboard',
    query: {
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
      enabled: !!address,
    },
  })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) {
      refetchUser()
      // Reset form inputs after successful transaction
      setSelectedStakeAmount('')
      setSelectedUnstakeAmount('')
    }
  }, [isSuccess, refetchUser])

  useEffect(() => {
    if (writeError || txError) {
      console.error('Transaction error:', writeError || txError)
    }
  }, [writeError, txError])

  const handleAction = (action: string, args?: any[]) => {
    if (!address) {
      console.error('No wallet address')
      return
    }
    if (!contractAddress) {
      console.error('Contract address not configured')
      alert('Contract address not configured. Please set NEXT_PUBLIC_CELOPULSE_CONTRACT in your .env.local file')
      return
    }
    try {
      writeContract({
        address: contractAddress,
        abi: celoPulseABI,
        functionName: action as any,
        args: args || [],
      })
    } catch (error) {
      console.error('Error calling writeContract:', error)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 grid-bg relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pulse-ring"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pulse-ring"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              CeloPulse
            </h1>
            <p className="text-gray-400 mono-font text-sm">Real-time Activity Tracker</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass-cyber px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full event-indicator"></div>
              <span className="text-sm mono-font">LIVE</span>
            </div>
            {isConnected && (
              <ConnectButton />
            )}
          </div>
        </div>

        {!isConnected ? (
          <div className="glass-cyber rounded-2xl p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold mb-2">Connect to Start Tracking</h2>
              <p className="text-gray-400">Monitor your on-chain activity and earn automated rewards</p>
            </div>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-bold text-lg hover:scale-105 transition-transform glow-teal"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
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
              <div className="glass-cyber rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1 mono-font">Staked</div>
                <div className="text-3xl font-bold text-emerald-400">{Number(stakedScore).toLocaleString()}</div>
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
            <div className="flex gap-2 glass-cyber rounded-xl p-2">
              {(['actions', 'events', 'quests'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                            className="flex-1 bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => handleAction('stakeScore', [BigInt(selectedStakeAmount || '0')])}
                            disabled={!selectedStakeAmount || isPending || isConfirming}
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
                            className="flex-1 bg-black/30 border border-teal-500/30 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => handleAction('unstakeScore', [BigInt(selectedUnstakeAmount || '0')])}
                            disabled={!selectedUnstakeAmount || isPending || isConfirming}
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
                    {recentActions && (recentActions as any[])[0]?.length > 0 ? (
                      (recentActions as any[])[0].map((addr: string, idx: number) => {
                        const actionType = (recentActions as any[])[1][idx]
                        const timestamp = (recentActions as any[])[2][idx]
                        const score = (recentActions as any[])[3][idx]
                        
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
          </div>
        )}
      </div>
    </main>
  )
}
