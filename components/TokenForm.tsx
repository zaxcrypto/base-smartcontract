'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTokenDeployment, type DeploymentStatus } from '@/hooks/useTokenDeployment'
import { type TokenFormValues } from '@/lib/utils'
import { BASE_CHAIN_ID, DEFAULT_DECIMALS } from '@/lib/constants'
import {
  Flame, Coins, Settings2, AlertCircle, Loader2, CheckCircle2,
  ChevronDown, ChevronUp, Zap, Network, ShieldCheck
} from 'lucide-react'

interface TokenFormProps {
  onSuccess: (result: NonNullable<ReturnType<typeof useTokenDeployment>['result']>) => void
}

export function TokenForm({ onSuccess }: TokenFormProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { status, result, error, gasEstimate, deploy, reset } = useTokenDeployment()

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [values, setValues] = useState<TokenFormValues>({
    name: '',
    symbol: '',
    initialSupply: '1000000',
    decimals: String(DEFAULT_DECIMALS),
    mintable: false,
    burnable: false,
  })

  const isWrongNetwork = isConnected && chainId !== BASE_CHAIN_ID
  const isLoading = ['validating', 'estimating', 'confirming', 'pending'].includes(status)

  useEffect(() => {
    if (result) {
      onSuccess(result)
    }
  }, [result, onSuccess])

  const handleChange = (field: keyof TokenFormValues, value: string | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const e = { ...prev }; delete e[field]; return e })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    reset()
    setFieldErrors({})
    
    const errors: Record<string, string> = {}
    if (!values.name.trim()) errors.name = 'Token Name is required'
    if (!values.symbol.trim()) errors.symbol = 'Ticker Symbol is required'
    if (Number(values.initialSupply) <= 0) errors.initialSupply = 'Supply must be greater than zero'
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    
    await deploy(values)
  }

  const statusLabel: Record<DeploymentStatus, string> = {
    idle: 'Deploy Token',
    validating: 'Validating Inputs…',
    estimating: 'Simulating Gas…',
    confirming: 'Confirm in Wallet…',
    pending: 'Confirming on Base…',
    success: 'Deployed!',
    error: 'Try Again',
  }

  const getStepStatus = (stepName: 'validate' | 'simulate' | 'sign' | 'confirm') => {
    if (status === 'idle' || status === 'error') return 'pending'
    switch (stepName) {
      case 'validate':
        if (status === 'validating') return 'active'
        return 'completed'
      case 'simulate':
        if (status === 'validating') return 'pending'
        if (status === 'estimating') return 'active'
        return 'completed'
      case 'sign':
        if (['validating', 'estimating'].includes(status)) return 'pending'
        if (status === 'confirming') return 'active'
        return 'completed'
      case 'confirm':
        if (['validating', 'estimating', 'confirming'].includes(status)) return 'pending'
        if (status === 'pending') return 'active'
        if (status === 'success') return 'completed'
        return 'pending'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Token Name Row */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="token-name" className="premium-label">
            Token Name <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">Max 64 characters</span>
        </div>
        <input
          id="token-name"
          type="text"
          placeholder="e.g. Base Protocol Token"
          maxLength={64}
          value={values.name}
          onChange={e => handleChange('name', e.target.value)}
          disabled={isLoading}
          className="premium-input"
        />
        {fieldErrors.name && (
          <p className="text-2xs text-rose-500 font-semibold">{fieldErrors.name}</p>
        )}
      </div>

      {/* 2. Ticker Symbol Row */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="token-symbol" className="premium-label">
            Ticker Symbol <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">e.g. BPT</span>
        </div>
        <input
          id="token-symbol"
          type="text"
          placeholder="e.g. DEPLOY"
          maxLength={12}
          value={values.symbol}
          onChange={e => handleChange('symbol', e.target.value.toUpperCase())}
          disabled={isLoading}
          className="premium-input font-mono font-bold tracking-wider"
        />
        {fieldErrors.symbol && (
          <p className="text-2xs text-rose-500 font-semibold">{fieldErrors.symbol}</p>
        )}
      </div>

      {/* 3. Initial Supply Row */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="token-supply" className="premium-label">
            Initial Supply <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">Excluding decimals</span>
        </div>
        <input
          id="token-supply"
          type="text"
          pattern="^[0-9]+$"
          placeholder="e.g. 1000000"
          value={values.initialSupply}
          onChange={e => handleChange('initialSupply', e.target.value.replace(/[^0-9]/g, ''))}
          disabled={isLoading}
          className="premium-input font-mono font-bold"
        />
        {fieldErrors.initialSupply && (
          <p className="text-2xs text-rose-500 font-semibold">{fieldErrors.initialSupply}</p>
        )}
      </div>

      {/* 4. Collapsible Advanced parameters */}
      <div className="border border-[var(--border-primary)] rounded-xl overflow-hidden bg-[var(--bg-primary)]">
        <button
          type="button"
          onClick={() => setShowAdvanced(p => !p)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-[var(--text-secondary)]" />
            <span className="text-2xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Advanced Settings</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-4 space-y-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] animate-fade-in">
            {/* Decimals */}
            <div className="space-y-1.5">
              <label htmlFor="token-decimals" className="premium-label">Token Decimals</label>
              <input
                id="token-decimals"
                type="number"
                min="0"
                max="18"
                step="1"
                value={values.decimals}
                onChange={e => handleChange('decimals', e.target.value)}
                disabled={isLoading}
                className="premium-input w-24 font-mono font-bold"
              />
            </div>

            {/* Features Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <ToggleSwitch
                id="mintable"
                label="Mintable"
                description="Allows dynamic token supply minting."
                icon={<Zap className="h-3.5 w-3.5 text-amber-500" />}
                checked={values.mintable}
                onChange={v => handleChange('mintable', v)}
                disabled={isLoading}
              />
              <ToggleSwitch
                id="burnable"
                label="Burnable"
                description="Allows token holders to burn supply."
                icon={<Flame className="h-3.5 w-3.5 text-orange-500" />}
                checked={values.burnable}
                onChange={v => handleChange('burnable', v)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gas Estimate Display */}
      {gasEstimate && !error && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] px-3.5 py-2.5 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent-color)] flex-shrink-0" />
          <p className="text-2xs font-semibold text-[var(--accent-color)]">
            Simulation successful. Estimated gas cost: <span className="font-bold">{gasEstimate} ETH</span>
          </p>
        </div>
      )}

      {/* Simulation/Deployment Error display */}
      {error && status === 'error' && (
        <div className="flex items-start gap-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 px-3.5 py-2.5 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-2xs font-semibold text-rose-500 leading-normal">{error}</p>
        </div>
      )}

      {/* Active Pipeline Stepper */}
      {isLoading && (
        <div className="p-4 border border-[var(--border-primary)] rounded-xl bg-[var(--bg-primary)] space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">Pipeline Logs</span>
            <span className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[var(--accent-color)] uppercase">
              <Loader2 className="h-3 w-3 animate-spin" />
              Executing
            </span>
          </div>

          <div className="stepper-container">
            <StepperStep
              label="Inputs Validated"
              desc="Checked parameters & bounds."
              status={getStepStatus('validate')}
            />
            <StepperStep
              label="Gas Simulation"
              desc="Checked transaction call success."
              status={getStepStatus('simulate')}
            />
            <StepperStep
              label="Signature Prompt"
              desc="Awaiting wallet confirm."
              status={getStepStatus('sign')}
            />
            <StepperStep
              label="Base Blockchain Sync"
              desc="Deploying standard contract."
              status={getStepStatus('confirm')}
            />
          </div>
        </div>
      )}

      {/* Wrong Network Notification */}
      {isWrongNetwork && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-500/5 border border-rose-500/20 px-3.5 py-2.5 animate-fade-in">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-rose-500 flex-shrink-0" />
            <p className="text-2xs font-semibold text-rose-500">Switch wallet chain to Base Mainnet</p>
          </div>
          <button
            type="button"
            onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
            className="text-2xs font-bold text-[var(--accent-color)] hover:underline focus:outline-none"
          >
            Switch
          </button>
        </div>
      )}

      {/* Deploy Button / Wallet Prompt */}
      {isConnected ? (
        <button
          id="deploy-btn"
          type="submit"
          disabled={isLoading || isWrongNetwork}
          className="premium-btn-primary"
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              {statusLabel[status]}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              {statusLabel[status]}
            </span>
          )}
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[var(--border-secondary)] rounded-xl bg-[var(--bg-primary)]">
          <Coins className="h-7 w-7 text-[var(--text-secondary)] mb-2 opacity-70" />
          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Authenticate Wallet</h4>
          <p className="text-[10px] text-[var(--text-secondary)] font-medium mb-4 text-center max-w-xs">
            Connect your Web3 address in order to deploy ERC-20 contract assets to Base.
          </p>
          <div className="scale-95">
            <ConnectButton label="Authenticate Wallet" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-center text-[9.5px] uppercase tracking-wider text-[var(--text-muted)] font-bold mt-2">
        <ShieldCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
        Zero Exploit Surfaces · Fully On-chain Autonomous Deployments
      </div>
    </form>
  )
}

function ToggleSwitch({
  id, label, description, icon, checked, onChange, disabled,
}: {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      htmlFor={id}
      className={`premium-toggle-card ${checked ? 'active' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <p className="text-[9.5px] font-extrabold uppercase tracking-wide text-[var(--text-primary)]">{label}</p>
          <p className="text-[8.5px] text-[var(--text-secondary)] font-medium mt-0.5 leading-tight">{description}</p>
        </div>
      </div>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-8 h-4.5 rounded-full transition-colors duration-200 ${
            checked ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-secondary)]'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-3.5' : ''
          }`}
        />
      </div>
    </label>
  )
}

function StepperStep({
  label, desc, status
}: {
  label: string
  desc: string
  status: 'pending' | 'active' | 'completed'
}) {
  return (
    <div className={`step-item ${status === 'active' ? 'active' : ''} ${status === 'completed' ? 'completed' : ''}`}>
      <div className="step-bullet" />
      <div>
        <p className="text-2xs font-extrabold text-[var(--text-primary)] tracking-tight leading-none">{label}</p>
        <p className="text-[8.5px] text-[var(--text-secondary)] font-medium mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
