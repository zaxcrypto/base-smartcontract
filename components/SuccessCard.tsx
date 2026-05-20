'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type DeploymentResult } from '@/hooks/useTokenDeployment'
import { BASE_SCAN_TX_URL, BASE_SCAN_TOKEN_URL } from '@/lib/constants'
import { copyToClipboard } from '@/lib/utils'
import {
  CheckCircle2, Copy, Check, ExternalLink, Plus, LayoutDashboard, Coins, ArrowUpRight, PlusCircle
} from 'lucide-react'

interface SuccessCardProps {
  result: DeploymentResult
  onDeployAnother: () => void
}

export function SuccessCard({ result, onDeployAnother }: SuccessCardProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedTx, setCopiedTx] = useState(false)
  const [addingToWallet, setAddingToWallet] = useState(false)
  const [addedToWallet, setAddedToWallet] = useState(false)

  const handleCopyAddress = async () => {
    await copyToClipboard(result.tokenAddress)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleCopyTx = async () => {
    await copyToClipboard(result.txHash)
    setCopiedTx(true)
    setTimeout(() => setCopiedTx(false), 2000)
  }

  const handleAddToWallet = async () => {
    if (!window.ethereum) return
    setAddingToWallet(true)
    try {
      // Switch wallet to Base network first (0x2105 is hex for 8453)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }],
        })
      } catch (switchError: any) {
        // Code 4902 means the chain has not been added to the wallet yet
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          })
        }
      }

      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: result.tokenAddress,
            symbol: result.symbol,
            decimals: Number(result.decimals),
          },
        },
      })
      setAddedToWallet(true)
    } catch (e) {
      console.error('Failed to add token to wallet', e)
    } finally {
      setAddingToWallet(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in text-[var(--text-primary)]">
      {/* Success Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--success-bg)] border border-[var(--success-border)] mb-2 shadow-sm shadow-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Contract Deployed!</h2>
        <p className="text-xs text-[var(--text-secondary)] font-medium max-w-md mx-auto">
          Your token <span className="font-bold text-[var(--accent-color)]">{result.name}</span> ({result.symbol}) is now compiled, verified, and live on Base.
        </p>
      </div>

      {/* Token Details Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-1.5 pb-2 border-b border-[var(--border-primary)]">
          <Coins className="h-4 w-4 text-[var(--text-secondary)]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Token Specifications</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InfoChip label="Name" value={result.name} />
          <InfoChip label="Symbol" value={result.symbol} />
          <InfoChip label="Total Supply" value={Number(result.initialSupply).toLocaleString()} />
          <InfoChip label="Decimals" value={String(result.decimals)} />
          <InfoChip label="Mintable" value={result.mintable ? 'Enabled' : 'Disabled'} highlight={result.mintable} />
          <InfoChip label="Burnable" value={result.burnable ? 'Enabled' : 'Disabled'} highlight={result.burnable} />
        </div>
      </div>

      {/* Contract & Transaction Details */}
      <div className="space-y-4 pt-2">
        {/* Address */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-secondary)]">Contract Address</span>
            <a
              href={`${BASE_SCAN_TOKEN_URL}/${result.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[var(--accent-color)] hover:underline"
            >
              BaseScan <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3">
            <code className="flex-1 text-xs font-mono font-bold text-green-500 break-all select-all">
              {result.tokenAddress}
            </code>
            <button
              onClick={handleCopyAddress}
              className="flex-shrink-0 p-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              title="Copy address"
            >
              {copiedAddress ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-secondary)]">Transaction Hash</span>
            <a
              href={`${BASE_SCAN_TX_URL}/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[var(--accent-color)] hover:underline"
            >
              View Tx <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3">
            <code className="flex-1 text-xs font-mono font-medium text-[var(--text-secondary)] break-all select-all">
              {result.txHash}
            </code>
            <button
              onClick={handleCopyTx}
              className="flex-shrink-0 p-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              title="Copy tx hash"
            >
              {copiedTx ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action CTA Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--border-primary)]">
        <button
          onClick={handleAddToWallet}
          disabled={addingToWallet || addedToWallet}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] disabled:opacity-60 px-4 py-3 text-xs font-bold text-white transition-all duration-200 shadow-md shadow-blue-500/10 focus:outline-none"
        >
          {addedToWallet ? (
            <><Check className="h-4 w-4" /> Token In Wallet</>
          ) : (
            <><PlusCircle className="h-4 w-4" /> Add to Wallet</>
          )}
        </button>

        <Link
          href="/dashboard"
          className="premium-btn-secondary flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <button
          onClick={onDeployAnother}
          className="premium-btn-secondary flex items-center justify-center gap-2 focus:outline-none"
        >
          <Plus className="h-4 w-4" />
          Deploy Another
        </button>
      </div>
    </div>
  )
}

function InfoChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2.5">
      <p className="text-[8.5px] uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">{label}</p>
      <p className={`text-xs font-bold truncate ${highlight ? 'text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
    </div>
  )
}
