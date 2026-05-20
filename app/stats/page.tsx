'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { 
  Trophy, Flame, Calendar, Activity, Coins, Layers, 
  ArrowUpRight, Copy, Check, Search, Sparkles, ExternalLink, HelpCircle, ArrowLeft
} from 'lucide-react'
import { PortalBackground } from '@/components/PortalBackground'

interface TxData {
  hash: string
  blockNumber: string
  timeStamp: string
  from: string
  to: string
  value: string
  gasUsed: string
  isError: string
  contractAddress: string
}

interface TokenTxData {
  hash: string
  tokenName: string
  tokenSymbol: string
  value: string
  tokenDecimal: string
  from: string
  to: string
  contractAddress: string
}

interface NFTTxData {
  hash: string
  tokenName: string
  tokenSymbol: string
  tokenID: string
  from: string
  to: string
  contractAddress: string
}

export default function StatsPage() {
  const { address: connectedAddress, isConnected } = useAccount()
  
  const [searchAddress, setSearchAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Compiled results
  const [dataAddress, setDataAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [txs, setTxs] = useState<TxData[]>([])
  const [erc20s, setErc20s] = useState<TokenTxData[]>([])
  const [nfts, setNfts] = useState<NFTTxData[]>([])
  
  // Analytics state
  const [onchainScore, setOnchainScore] = useState(0)
  const [uniqueDays, setUniqueDays] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [activityPeriod, setActivityPeriod] = useState(0)
  const [deployedContractsCount, setDeployedContractsCount] = useState(0)
  const [swapsCount, setSwapsCount] = useState(0)
  const [totalEthVolume, setTotalEthVolume] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'txs' | 'tokens' | 'nfts'>('txs')
  
  // Heatmap generation
  const [heatmapData, setHeatmapData] = useState<{ [dateStr: string]: number }>({})

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  // Pre-fill search field when wallet is connected
  useEffect(() => {
    if (isConnected && connectedAddress && !dataAddress) {
      setSearchAddress(connectedAddress)
    }
  }, [isConnected, connectedAddress])

  const fetchStats = async (target: string) => {
    const cleanTarget = target.trim().toLowerCase()
    
    // Strict EVM address validation
    if (!cleanTarget || !cleanTarget.startsWith('0x') || cleanTarget.length !== 42 || !/^0x[a-f0-9]{40}$/.test(cleanTarget)) {
      setError('Please enter a valid 42-character Base wallet address starting with 0x.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/stats?address=${cleanTarget}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch analytics from Base RPC')
      }

      const rawBalance = json.balance
      const transactions: TxData[] = json.transactions
      const tokens: TokenTxData[] = json.erc20
      const nftArray: NFTTxData[] = json.nft

      // Convert balance to ETH
      const ethBalance = (parseFloat(rawBalance) / 1e18).toFixed(4)

      // Calculate sent volume with robust BigInt precision
      const volumeSentWei = transactions.reduce((acc, tx) => {
        if (tx.from.toLowerCase() === cleanTarget.toLowerCase()) {
          try {
            return acc + BigInt(tx.value || '0')
          } catch {
            return acc
          }
        }
        return acc
      }, 0n)
      const ethVolume = parseFloat((Number(volumeSentWei) / 1e18).toFixed(4))

      // Smart contracts deployed
      const deploys = transactions.filter(tx => {
        const isDeploy = !tx.to || tx.to === '' || tx.contractAddress !== ''
        return isDeploy && tx.from.toLowerCase() === cleanTarget.toLowerCase()
      }).length

      // Count unique dates active
      const datesList = Array.from(new Set(transactions.map(tx => {
        const d = new Date(parseInt(tx.timeStamp) * 1000)
        return d.toISOString().split('T')[0]
      }))).sort((a, b) => b.localeCompare(a))

      // Compile unique swaps / transfers
      const swaps = tokens.filter(tok => {
        return tok.from.toLowerCase() === cleanTarget.toLowerCase() || tok.to.toLowerCase() === cleanTarget.toLowerCase()
      }).length

      // Dynamic Heatmap density dictionary
      const densityDict: { [dateStr: string]: number } = {}
      transactions.forEach(tx => {
        const dStr = new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0]
        densityDict[dStr] = (densityDict[dStr] || 0) + 1
      })

      // Streaks and activity calculations
      let curStreak = 0
      let maxStreak = 0
      let actPeriod = 0

      if (datesList.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0]
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        // Active period
        const newestDate = new Date(datesList[0])
        const oldestDate = new Date(datesList[datesList.length - 1])
        actPeriod = Math.ceil(Math.abs(newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)) || 1

        // Current Streak
        if (datesList[0] === todayStr || datesList[0] === yesterdayStr) {
          curStreak = 1
          for (let i = 0; i < datesList.length - 1; i++) {
            const d1 = new Date(datesList[i])
            const d2 = new Date(datesList[i + 1])
            const diffDays = Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDays === 1) {
              curStreak++
            } else {
              break
            }
          }
        }

        // Longest Streak
        let sortedOldest = [...datesList].sort((a, b) => a.localeCompare(b))
        let tempStreak = 1
        maxStreak = 1
        for (let i = 0; i < sortedOldest.length - 1; i++) {
          const d1 = new Date(sortedOldest[i])
          const d2 = new Date(sortedOldest[i + 1])
          const diffDays = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            tempStreak++
            if (tempStreak > maxStreak) {
              maxStreak = tempStreak
            }
          } else if (diffDays > 1) {
            tempStreak = 1
          }
        }
      }

      // Dynamic Onchain Score Algorithm (0-100)
      const txWeight = Math.min(30, transactions.length) * 1.5       // 30 points max for activity count
      const dateWeight = Math.min(20, datesList.length) * 1.5         // 30 points max for unique days
      const volWeight = Math.min(10, ethVolume) * 2.0                 // 20 points max for transfer volume
      const deployWeight = Math.min(5, deploys) * 2.0                 // 10 points max for deploys
      const tokenWeight = Math.min(5, Array.from(new Set(tokens.map(t => t.contractAddress))).length) * 2.0 // 10 points max for token diversity
      
      const calculatedScore = Math.min(100, Math.round(txWeight + dateWeight + volWeight + deployWeight + tokenWeight))

      // State commitments
      setDataAddress(cleanTarget)
      setBalance(ethBalance)
      setTxs(transactions)
      setErc20s(tokens)
      setNfts(nftArray)
      setOnchainScore(calculatedScore || (transactions.length > 0 ? 12 : 0)) // Elegant fallback for new wallets
      setUniqueDays(datesList.length)
      setCurrentStreak(curStreak)
      setLongestStreak(maxStreak)
      setActivityPeriod(actPeriod)
      setDeployedContractsCount(deploys)
      setSwapsCount(swaps)
      setTotalEthVolume(ethVolume)
      setHeatmapData(densityDict)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to analyze Base wallet logs. Please verify the address.')
    } finally {
      setLoading(false)
    }
  }

  // Generate GitHub heatmap days list
  const renderHeatmap = () => {
    const days = []
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setDate(today.getDate() - 364)

    let currentDate = new Date(oneYearAgo)
    
    while (currentDate <= today) {
      const dStr = currentDate.toISOString().split('T')[0]
      const count = heatmapData[dStr] || 0
      
      // Clean elegant blue gradients
      let colorClass = 'bg-slate-100 dark:bg-slate-900 border-[0.5px] border-slate-200/20'
      if (count === 1) colorClass = 'bg-blue-100 dark:bg-blue-950 border-[0.5px] border-blue-800/10'
      if (count >= 2 && count <= 3) colorClass = 'bg-blue-300 dark:bg-blue-800 border-[0.5px] border-blue-600/10'
      if (count >= 4 && count <= 6) colorClass = 'bg-blue-500 dark:bg-blue-600'
      if (count >= 7) colorClass = 'bg-blue-700 dark:bg-blue-400'

      days.push({
        date: dStr,
        count,
        color: colorClass
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] px-4 flex flex-col items-center justify-start overflow-hidden py-12">
      <PortalBackground />
      <div className="ambient-glow" />

      {/* Structural Column Wrapper */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col gap-4">
        
        {/* Back to Home Button */}
        <div className="w-full flex justify-start">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Curved Header Panel */}
        <div className="liquid-glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-transparent">
              <img src="/base.png" alt="Base Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-[var(--text-primary)]">
                Base Wallet Stats
              </h1>
              <p className="text-3xs text-[var(--text-secondary)] font-medium">
                Compute live activity streak, transaction volumes, and score directly on Base Mainnet.
              </p>
            </div>
          </div>
          
          {/* Quick Connect & Autofill block */}
          <div className="flex items-center gap-3 scale-95 origin-right">
            {isConnected && (
              <button
                onClick={() => {
                  setSearchAddress(connectedAddress || '')
                  fetchStats(connectedAddress || '')
                }}
                className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--accent-color)] hover:bg-[var(--accent-soft)] transition-colors focus:outline-none"
              >
                Use Connected Wallet
              </button>
            )}
            <ConnectButton showBalance={false} />
          </div>
        </div>

        {/* Search Deck Container */}
        <div className="liquid-glass-card p-5">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Paste Base Wallet Address (0x...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] placeholder-[var(--text-muted)] transition-all"
              />
            </div>
            <button
              onClick={() => fetchStats(searchAddress)}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white text-xs font-bold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Analyze Wallet</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-3xs font-medium text-red-500 text-left pl-1">
              {error}
            </p>
          )}
        </div>

        {/* Dynamic Analytics Dashboard */}
        {dataAddress && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Left Deck: base.org/basenames Specular Look */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Premium Basenames Activity Layout */}
              <div className="liquid-glass-card p-6 flex flex-col gap-8 text-left">
                
                {/* Header Title with Small Blue Bullet */}
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Activity</span>
                </div>

                <div className="flex flex-col md:flex-row items-stretch gap-8 justify-between">
                  
                  {/* Center Onchain Score display */}
                  <div className="flex flex-col justify-center items-start min-w-[200px]">
                    <div className="flex items-center gap-1 text-5xs font-bold tracking-wider text-slate-500 uppercase">
                      <span>Onchain Score</span>
                      <span title="Calculated in real-time from active wallet events">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                      </span>
                    </div>
                    <div className="text-5xl font-black text-slate-900 dark:text-white mt-2 leading-none">
                      {onchainScore}<span className="text-xl font-normal text-slate-400">/100</span>
                    </div>
                    <div className="mt-4 px-2.5 py-1 text-5xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                      Rank: top {(100 - onchainScore * 0.9).toFixed(0)}%
                    </div>
                  </div>

                  {/* GitHub Heatmap Grid strictly styled like Basenames */}
                  <div className="flex-1 flex flex-col gap-3 justify-center items-start lg:items-start">
                    <div className="w-full overflow-hidden pb-1">
                      <div className="flex gap-[4px] justify-start lg:justify-start">
                        {Array.from({ length: 26 }).map((_, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-[4px]">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                              const dayList = renderHeatmap()
                              const startOffset = Math.max(0, dayList.length - 26 * 7)
                              const dayObj = dayList[startOffset + (weekIndex * 7 + dayIndex)]
                              if (!dayObj) return <div key={dayIndex} className="w-[11.5px] h-[11.5px] rounded-[2.5px]" />
                              return (
                                <div
                                  key={dayIndex}
                                  className={`w-[11.5px] h-[11.5px] rounded-[2.5px] transition-all duration-300 ${dayObj.color}`}
                                  title={`${dayObj.date}: ${dayObj.count} txs`}
                                />
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-start lg:justify-start gap-1.5 text-5xs font-medium text-slate-400">
                      <span>Less</span>
                      <div className="w-2.5 h-2.5 rounded-[1.5px] bg-slate-100 dark:bg-slate-900" />
                      <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-100 dark:bg-blue-950" />
                      <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-300 dark:bg-blue-800" />
                      <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-500" />
                      <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-700" />
                      <span>More</span>
                    </div>
                  </div>
                </div>

                {/* 5-Column Stats Grid (Row 1) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {txs.length}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Transactions on Base
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {uniqueDays}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Unique days active
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {longestStreak}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Day longest streak
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {currentStreak}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Day current streak
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {activityPeriod}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Day activity period
                    </span>
                  </div>
                </div>

                {/* 5-Column Stats Grid (Row 2) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {swapsCount}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Token swaps performed
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {erc20s.length}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Token transfers
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {nfts.length}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      NFT transfers
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {deployedContractsCount}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Smart contracts deployed
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {parseFloat(balance) > 0 ? parseFloat(balance).toFixed(4) : '0.0000'}
                    </span>
                    <span className="text-5xs text-slate-500 font-medium tracking-tight mt-1 leading-tight">
                      Native ETH Balance
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Deck: Live Lists & Status stacking */}
            <div className="flex flex-col gap-6">
              
              {/* Transactions details listing block */}
              <div className="liquid-glass-card p-6 flex flex-col gap-4 text-left">
                <div className="flex border-b border-[var(--border-primary)] pb-1">
                  <button
                    onClick={() => setActiveTab('txs')}
                    className={`pb-2 px-3 text-4xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === 'txs'
                        ? 'border-[var(--accent-color)] text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Txs ({txs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('tokens')}
                    className={`pb-2 px-3 text-4xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === 'tokens'
                        ? 'border-[var(--accent-color)] text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Tokens ({erc20s.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('nfts')}
                    className={`pb-2 px-3 text-4xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === 'nfts'
                        ? 'border-[var(--accent-color)] text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    NFTs ({nfts.length})
                  </button>
                </div>

                {/* Tab content renderer */}
                <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin">
                  
                  {activeTab === 'txs' && (
                    txs.length === 0 ? (
                      <p className="text-3xs text-center py-6 text-[var(--text-secondary)]">No recorded transactions found on Base.</p>
                    ) : (
                      txs.map((tx, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-between gap-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-4xs font-mono font-bold text-[var(--text-primary)]">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </span>
                            <span className="text-5xs text-[var(--text-secondary)]">
                              Block {tx.blockNumber} • {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xs font-bold text-[var(--text-primary)]">
                              {(parseFloat(tx.value) / 1e18).toFixed(4)} ETH
                            </span>
                            <a
                              href={`https://basescan.org/tx/${tx.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))
                    )
                  )}

                  {activeTab === 'tokens' && (
                    erc20s.length === 0 ? (
                      <p className="text-3xs text-center py-6 text-[var(--text-secondary)]">No ERC-20 transfers recorded.</p>
                    ) : (
                      erc20s.map((tx, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-between gap-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-4xs font-mono font-bold text-[var(--text-primary)]">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </span>
                            <span className="text-5xs text-[var(--text-secondary)]">
                              {tx.tokenName} ({tx.tokenSymbol})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xs font-bold text-[var(--accent-color)]">
                              {(parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toFixed(2)} {tx.tokenSymbol}
                            </span>
                            <a
                              href={`https://basescan.org/token/${tx.contractAddress}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))
                    )
                  )}

                  {activeTab === 'nfts' && (
                    nfts.length === 0 ? (
                      <p className="text-3xs text-center py-6 text-[var(--text-secondary)]">No NFT movements recorded.</p>
                    ) : (
                      nfts.map((tx, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-between gap-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-4xs font-mono font-bold text-[var(--text-primary)]">
                              {tx.tokenName} ({tx.tokenSymbol})
                            </span>
                            <span className="text-5xs text-[var(--text-secondary)]">
                              Token ID: #{tx.tokenID}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xs font-bold text-pink-500 uppercase">
                              NFT Transfer
                            </span>
                            <a
                              href={`https://basescan.org/token/${tx.contractAddress}?a=${tx.tokenID}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))
                    )
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}
