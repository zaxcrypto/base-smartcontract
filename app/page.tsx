'use client'

import Link from 'next/link'
import { Rocket, LayoutDashboard, Zap, ShieldCheck, Sparkles } from 'lucide-react'
import { PortalBackground } from '@/components/PortalBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive 3D Space Portal Ellipse Line Background */}
      <PortalBackground />
      
      {/* Soft Ambient Spot Glow */}
      <div className="ambient-glow" />

      {/* Floating Curved Liquid Glass Window (z-10 stacking foreground) */}
      <div className="relative z-10 liquid-glass-card px-6 sm:px-12 py-16 sm:py-20 max-w-xl w-full flex flex-col items-center justify-center text-center">
        
        {/* Architectural corner intersection marks */}
        <div className="absolute -top-2.5 -left-2 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute -top-2.5 -right-2 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute -bottom-3.5 -left-2 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute -bottom-3.5 -right-2 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>

        <div className="w-full space-y-8 animate-fade-in">
          {/* Network Capsule */}
          <div className="flex justify-center">
            <div className="premium-badge premium-badge-blue inline-flex items-center gap-1.5 py-1 px-3">
              <img src="/base.png" alt="Base Logo" className="h-3.5 w-3.5 object-contain mr-0.5" />
              <span>Base Mainnet Live</span>
            </div>
          </div>

          {/* Master Title */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
              Launch ERC-20 Tokens
              <br />
              <span className="text-[var(--accent-color)]">on Base Mainnet</span>
            </h1>
            
            {/* Description */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold max-w-sm mx-auto leading-relaxed">
              Configure parameters, simulate gas limits, and deploy standard contracts instantly to Layer-2.
            </p>
          </div>

          {/* Luxury CTA Deck */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto w-full pt-2">
            <Link
              href="/deploy"
              className="premium-btn-primary w-full sm:w-auto px-6 py-3.5 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-xs"
            >
              <Rocket className="h-4.5 w-4.5" />
              Deploy Contract
            </Link>
            
            <Link
              href="/dashboard"
              className="premium-btn-secondary w-full sm:w-auto px-5 py-3.5 flex items-center justify-center gap-2 text-xs"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-[var(--text-secondary)]" />
              Dashboard
            </Link>

            <Link
              href="/stats"
              className="premium-btn-secondary w-full sm:w-auto px-5 py-3.5 flex items-center justify-center gap-2 text-xs border-[var(--accent-color)]/25 bg-[var(--accent-soft)] hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <Sparkles className="h-4.5 w-4.5 text-[var(--accent-color)] animate-pulse" />
              Wallet Stats
            </Link>
          </div>

          {/* Bottom Security Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold pt-10 border-t border-[var(--border-primary)] max-w-xs mx-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Zero Custom Exploit Surfaces
          </div>
        </div>
      </div>
    </div>
  )
}
