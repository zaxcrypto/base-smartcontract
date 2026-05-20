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
            <h1 className="text-[25px] sm:text-[32px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.25]">
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

          {/* Organized CTA Deck: Top row primary button, Bottom row side-by-side helper buttons */}
          <div className="flex flex-col items-center justify-center gap-3.5 max-w-[314px] mx-auto w-full pt-1">
            {/* Top row: Deploy Token */}
            <Link
              href="/deploy"
              className="premium-btn-primary w-full h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Deploy Token
            </Link>
            
            {/* Bottom row: Side-by-side Dashboard & Wallet Stats */}
            <div className="flex w-full gap-3.5">
              <Link
                href="/dashboard"
                className="w-[150px] h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 border border-blue-500/30 dark:border-blue-500/45 bg-[var(--bg-secondary)] hover:border-[#0052FF] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:shadow-sm hover:shadow-blue-500/10"
              >
                Dashboard
              </Link>

              <Link
                href="/stats"
                className="w-[150px] h-[45px] rounded-xl flex items-center justify-center text-[10px] uppercase tracking-wider font-extrabold transition-all duration-200 border border-blue-500/30 dark:border-blue-500/45 bg-[var(--bg-secondary)] hover:border-[#0052FF] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:shadow-sm hover:shadow-blue-500/10"
              >
                Wallet Stats
              </Link>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-extrabold pt-8 border-t border-[var(--border-primary)] max-w-xs mx-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Zero Custom Exploit Surfaces
          </div>
        </div>
      </div>

      {/* Twitter profile branding card */}
      <div className="relative z-10 mt-6 w-full max-w-xl animate-fade-in">
        <div className="liquid-glass-card p-4 sm:p-5 flex items-center justify-between gap-4 border border-blue-500/15 dark:border-blue-500/25 bg-blue-500/[0.02] dark:bg-blue-950/[0.05] rounded-3xl">
          <div className="flex items-center gap-4">
            {/* Avatar with glowing blue border */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-md shadow-blue-500/15 flex-shrink-0">
              <img 
                src="https://unavatar.io/twitter/0x_zax" 
                alt="0x_zax Avatar" 
                className="w-full h-full rounded-full object-cover border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/base.png"
                }}
              />
            </div>
            {/* Text details */}
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] tracking-[0.12em] font-extrabold text-[var(--text-secondary)]/80 uppercase">
                <span className="w-4 h-[1px] bg-[var(--text-secondary)]/40" />
                This Site Built By
              </div>
              <h4 className="text-sm sm:text-md font-black text-blue-600 dark:text-blue-400 tracking-tight mt-0.5">
                0x_zax
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-secondary)]/90 font-medium mt-0.5">
                Follow for <span className="text-blue-500 dark:text-blue-400 font-bold">more Web3 content</span> 🚀
              </p>
            </div>
          </div>

          {/* Follow Button */}
          <a
            href="https://x.com/0x_zax"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider px-4 sm:px-5 h-9 sm:h-10 rounded-full flex items-center gap-1.5 shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow
          </a>
        </div>
      </div>
    </div>
  )
}
