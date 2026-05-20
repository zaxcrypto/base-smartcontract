'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useChainId } from 'wagmi'
import { BASE_CHAIN_ID } from '@/lib/constants'
import { AlertTriangle, Zap, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function Navbar() {
  const chainId = useChainId()
  const { theme, toggleTheme } = useTheme()
  const isWrongNetwork = chainId !== 0 && chainId !== BASE_CHAIN_ID
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-blue-500/25 bg-[#0052FF] transition-all duration-300 overflow-hidden shadow-md shadow-blue-900/10">
      {/* Subtle Navbar Brand Halftone Sunburst Pattern overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="nav-dashes" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="4" y1="0" x2="4" y2="8" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="1.5, 2" />
            </pattern>
            <mask id="nav-mask">
              <rect width="100%" height="100%" fill="black" />
              {/* Radiating lines in mask, centered around logo/link start (12% X, 50% Y) */}
              {Array.from({ length: 30 }).map((_, i) => {
                const rad = ((i * 12) * Math.PI) / 180;
                const x2 = 12 + Math.cos(rad) * 120;
                const y2 = 50 + Math.sin(rad) * 120;
                return (
                  <line
                    key={i}
                    x1="12%"
                    y1="50%"
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="white"
                    strokeWidth={i % 2 === 0 ? "14" : "6"}
                    opacity="0.85"
                  />
                );
              })}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#nav-dashes)" mask="url(#nav-mask)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center bg-transparent group-hover:scale-105 transition-all duration-300">
              {/* Custom curved base logo matching the branding */}
              <div className="w-6 h-6 bg-white rounded-[5px] flex items-center justify-center shadow-sm shadow-blue-900/10">
                <div className="w-4 h-4 bg-[#0052FF] rounded-[2.5px]" />
              </div>
            </div>
            <span className="text-md font-extrabold tracking-tight text-white">
              Base<span className="text-blue-200">.fun</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/deploy"
              className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-200"
            >
              Deploy Token
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-200"
            >
              My Dashboard
            </Link>
            <Link
              href="/stats"
              className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-200"
            >
              Wallet Stats
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {isWrongNetwork && (
              <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                <span className="text-2xs font-bold uppercase tracking-wider text-rose-500">Wrong Network</span>
              </div>
            )}

            {/* Connect Button */}
            <div className="scale-95 origin-right">
              <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus="address"
              />
            </div>

            {/* Premium Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-200 focus:outline-none"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-4.5 w-4.5 rounded-full bg-white/20 animate-pulse" />
              ) : theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
