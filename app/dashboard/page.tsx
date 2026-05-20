'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useDeployedTokens } from '@/hooks/useDeployedTokens'
import { type Address } from 'viem'
import { PortalBackground } from '@/components/PortalBackground'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { localTokens, refresh } = useDeployedTokens(address as Address | undefined)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  if (!isMounted) return null

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive 3D Space Portal Ellipse Line Background */}
      <PortalBackground />
      
      {/* Soft Ambient Spot Glow */}
      <div className="ambient-glow" />

      {/* Structural layout column keylines */}
      <div className="relative z-10 border-x border-[var(--border-primary)] px-4 sm:px-8 py-12 max-w-xl w-full flex flex-col items-center justify-center">
        
        {/* Intersection corner plus signs */}
        <div className="absolute -top-2.5 -left-2 text-xs font-light text-[var(--text-muted)] select-none opacity-45 font-mono">+</div>
        <div className="absolute -top-2.5 -right-2 text-xs font-light text-[var(--text-muted)] select-none opacity-45 font-mono">+</div>
        <div className="absolute -bottom-3.5 -left-2 text-xs font-light text-[var(--text-muted)] select-none opacity-45 font-mono">+</div>
        <div className="absolute -bottom-3.5 -right-2 text-xs font-light text-[var(--text-muted)] select-none opacity-45 font-mono">+</div>

        {/* Back to Home Button */}
        <div className="w-full flex justify-start mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Curved Liquid Glass Panel */}
        <div className="w-full liquid-glass-card p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6">
            <div className="flex items-center gap-2">
              <img src="/base.png" alt="Base Logo" className="h-6 w-6 object-contain" />
              <div>
                <h1 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  My Dashboard
                </h1>
                <p className="text-[var(--text-secondary)] text-3xs font-medium mt-1">
                  Your compiled and active tokens on Base.
                </p>
              </div>
            </div>
            <button
              onClick={refresh}
              className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
            >
              Refresh
            </button>
          </div>

          {!isConnected ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Connect your wallet to read your deployed contracts.
              </p>
              <div className="flex justify-center scale-95">
                <ConnectButton />
              </div>
            </div>
          ) : localTokens.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                No deployed contracts detected under this address.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {localTokens.map((token) => (
                <div
                  key={token.txHash}
                  className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--accent-soft-border)] transition-all animate-fade-in"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-extrabold text-[var(--text-primary)]">{token.name}</span>
                        <span className="premium-badge text-4xs py-0.5 px-1.5 font-bold uppercase">{token.symbol}</span>
                      </div>
                      <div className="text-4xs text-[var(--text-secondary)] font-semibold">
                        Supply: <span className="text-[var(--text-primary)] font-bold">{Number(token.initialSupply).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <code className="text-4xs font-mono font-bold text-green-500">
                          {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                        </code>
                        <button
                          onClick={() => handleCopy(token.tokenAddress, token.txHash)}
                          className="p-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none"
                        >
                          {copiedId === token.txHash ? (
                            <span className="text-4xs text-green-500 font-bold">Copied!</span>
                          ) : (
                            <span className="text-4xs text-[var(--text-muted)] font-bold">Copy</span>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href={`https://basescan.org/token/${token.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xs font-bold text-[var(--accent-color)] hover:underline flex-shrink-0"
                    >
                      BaseScan →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
