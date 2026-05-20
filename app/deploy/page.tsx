'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TokenForm } from '@/components/TokenForm'
import { SuccessCard } from '@/components/SuccessCard'
import { type DeploymentResult } from '@/hooks/useTokenDeployment'
import { PortalBackground } from '@/components/PortalBackground'

export default function DeployPage() {
  const [deployedResult, setDeployedResult] = useState<DeploymentResult | null>(null)

  const handleSuccess = (result: DeploymentResult) => {
    setDeployedResult(result)
  }

  const handleDeployAnother = () => {
    setDeployedResult(null)
  }

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
          <div className="text-center pb-4 border-b border-[var(--border-primary)] mb-6 flex flex-col items-center justify-center">
            <img src="/base.png" alt="Base Logo" className="h-6 w-6 object-contain mb-2" />
            <h1 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Deploy Token
            </h1>
            <p className="text-[var(--text-secondary)] text-3xs font-medium mt-1">
              Launch a standard ERC-20 contract directly on Base Mainnet.
            </p>
          </div>

          {deployedResult ? (
            <SuccessCard result={deployedResult} onDeployAnother={handleDeployAnother} />
          ) : (
            <TokenForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}
