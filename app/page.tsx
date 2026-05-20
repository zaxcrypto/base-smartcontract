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
      <div className="relative z-10 liquid-glass-card px-6 sm:px-12 pt-32 pb-16 max-w-xl w-full flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Top Base Brand Halftone Sunburst Banner */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-[#0052FF] overflow-hidden border-b border-blue-500/25 flex items-end justify-end p-2 select-none">
          <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="banner-dashes" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="4" y1="0" x2="4" y2="8" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.5" strokeDasharray="1.5, 2" />
              </pattern>
              <mask id="banner-mask">
                <rect width="100%" height="100%" fill="black" />
                {Array.from({ length: 36 }).map((_, i) => {
                  const rad = ((i * 10) * Math.PI) / 180;
                  const x2 = 50 + Math.cos(rad) * 150;
                  const y2 = 50 + Math.sin(rad) * 150;
                  return (
                    <line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="white"
                      strokeWidth={i % 2 === 0 ? "10" : "5"}
                      opacity="0.85"
                    />
                  );
                })}
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#banner-dashes)" mask="url(#banner-mask)" />
          </svg>
          
          {/* Base Logo Branding matching the requested image */}
          <div className="relative z-10 flex items-center gap-1.5 opacity-95 mr-3 mb-1">
            <div className="w-3.5 h-3.5 bg-white" />
            <span className="font-sans font-black text-white text-base tracking-tighter leading-none">base</span>
          </div>
        </div>

        {/* Architectural corner intersection marks */}
        <div className="absolute top-[108px] left-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute top-[108px] right-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute bottom-3.5 left-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>
        <div className="absolute bottom-3.5 right-2.5 text-xs font-light text-[var(--text-muted)] select-none opacity-40 font-mono">+</div>

        <div className="w-full space-y-8 stage-container relative z-10">
          {/* Network Capsule */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full border border-blue-500/20 bg-blue-500/5 shadow-sm shadow-blue-500/5">
              <img src="/base.png" alt="Base Logo" className="h-3 w-3 object-contain" />
              <span className="font-extrabold tracking-widest uppercase text-[9px] text-[var(--accent-color)]">
                Base Mainnet Live
              </span>
            </div>
          </div>

          {/* Master Title & Typography */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.15]">
              Launch ERC-20 Tokens
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                on Base Mainnet
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]/80 font-medium max-w-sm mx-auto leading-relaxed">
              Configure parameters, simulate gas limits, and deploy standard contracts instantly to Layer-2.
            </p>
          </div>

          {/* Luxury CTA Deck (Equal 150px Width to Prevent wrapping, clean premium buttons) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto w-full pt-1">
            <Link
              href="/deploy"
              className="premium-btn-primary w-full sm:w-[150px] h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Deploy Token
            </Link>
            
            <Link
              href="/dashboard"
              className="premium-btn-secondary w-full sm:w-[150px] h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
            >
              Dashboard
            </Link>

            <Link
              href="/stats"
              className="premium-btn-secondary w-full sm:w-[150px] h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 border border-[var(--accent-color)]/25 bg-[var(--accent-soft)] hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[var(--text-primary)]"
            >
              Wallet Stats
            </Link>
          </div>

          {/* Bottom Security Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-extrabold pt-8 border-t border-[var(--border-primary)] max-w-xs mx-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Zero Custom Exploit Surfaces
          </div>
        </div>
      </div>
    </div>
  )
}
