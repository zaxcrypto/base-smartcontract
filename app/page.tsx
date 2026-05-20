'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { PortalBackground } from '@/components/PortalBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive 3D Space Portal Ellipse Line Background */}
      <PortalBackground />
      
      {/* Soft Ambient Spot Glows for Rich Static Color Depth */}
      <div className="ambient-glow" />
      <div className="absolute top-[10%] left-[5%] w-80 h-80 rounded-full bg-indigo-500/8 dark:bg-indigo-500/12 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-cyan-500/8 dark:bg-cyan-500/12 blur-[120px] pointer-events-none z-0" />

      {/* Floating Curved Liquid Glass Window (z-10 stacking foreground) */}
      <div className="relative z-10 liquid-glass-card px-6 sm:px-12 py-16 sm:py-20 max-w-xl w-full flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Precision Top Color Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

        {/* Architectural corner intersection marks */}
        <div className="absolute top-3 left-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute top-3 right-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute bottom-3.5 left-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute bottom-3.5 right-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>

        <div className="w-full space-y-8 stage-container relative z-10">
          {/* Network Capsule */}
          <div className="flex justify-center">
            <div className="premium-badge premium-badge-blue inline-flex items-center gap-1.5 py-1 px-3 border-blue-500/20 bg-blue-500/5">
              <img src="/base.png" alt="Base Logo" className="h-3.5 w-3.5 object-contain mr-0.5" />
              <span className="font-extrabold tracking-wider uppercase text-[10px]">Base Mainnet Live</span>
            </div>
          </div>

          {/* Master Title */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.2]">
              Launch ERC-20 Tokens
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                on Base Mainnet
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold max-w-sm mx-auto leading-relaxed">
              Configure parameters, simulate gas limits, and deploy standard contracts instantly to Layer-2.
            </p>
          </div>

          {/* Luxury CTA Deck (Equal Width/Height Buttons, Emoji & Icon Free) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto w-full pt-2">
            <Link
              href="/deploy"
              className="premium-btn-primary w-full sm:w-[136px] h-[46px] rounded-xl flex items-center justify-center text-4xs uppercase tracking-widest font-black transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Deploy Token
            </Link>
            
            <Link
              href="/dashboard"
              className="premium-btn-secondary w-full sm:w-[136px] h-[46px] rounded-xl flex items-center justify-center text-4xs uppercase tracking-widest font-black transition-all duration-200 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
            >
              Dashboard
            </Link>

            <Link
              href="/stats"
              className="premium-btn-secondary w-full sm:w-[136px] h-[46px] rounded-xl flex items-center justify-center text-4xs uppercase tracking-widest font-black transition-all duration-200 border border-[var(--accent-color)]/25 bg-[var(--accent-soft)] hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[var(--text-primary)]"
            >
              Wallet Stats
            </Link>
          </div>

          {/* Bottom Security Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-black pt-10 border-t border-[var(--border-primary)] max-w-xs mx-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Zero Custom Exploit Surfaces
          </div>
        </div>
      </div>
    </div>
  )
}
