'use client'

import { useState, useEffect } from 'react'

export function PortalBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const strokeColor = 'var(--accent-color)'
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle core spotlight glow behind the center */}
          <radialGradient id="portal-glow" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.02" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.14" />
          </radialGradient>

          {/* Directional Linear Gradients for Razor-Thin Rays (Fully visible edges fading to 0 opacity in center) */}
          <linearGradient id="grad-tl" x1="0%" y1="0%" x2="50%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="85%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-tr" x1="100%" y1="0%" x2="50%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="85%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-bl" x1="0%" y1="100%" x2="50%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="85%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-br" x1="100%" y1="100%" x2="50%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="85%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-top" x1="0%" y1="0%" x2="0%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="45%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-bottom" x1="0%" y1="100%" x2="0%" y2="45%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="45%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-left" x1="0%" y1="0%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="45%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="grad-right" x1="100%" y1="0%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="45%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient base spotlight */}
        <rect width="100%" height="100%" fill="url(#portal-glow)" />

        {/* ─── 16 Razor-Thin Minimal 3D Perspective Lines (Tapering from edges to center) ─── */}
        
        {/* Corner Diagonals */}
        <line x1="0" y1="0" x2="50%" y2="45%" stroke="url(#grad-tl)" strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="50%" y2="45%" stroke="url(#grad-tr)" strokeWidth="1.5" />
        <line x1="0" y1="100%" x2="50%" y2="45%" stroke="url(#grad-bl)" strokeWidth="1.5" />
        <line x1="100%" y1="100%" x2="50%" y2="45%" stroke="url(#grad-br)" strokeWidth="1.5" />

        {/* Top Boundary Rays */}
        <line x1="20%" y1="0" x2="50%" y2="45%" stroke="url(#grad-tl)" strokeWidth="1.2" />
        <line x1="40%" y1="0" x2="50%" y2="45%" stroke="url(#grad-tl)" strokeWidth="1.2" />
        <line x1="60%" y1="0" x2="50%" y2="45%" stroke="url(#grad-tr)" strokeWidth="1.2" />
        <line x1="80%" y1="0" x2="50%" y2="45%" stroke="url(#grad-tr)" strokeWidth="1.2" />

        {/* Bottom Boundary Rays */}
        <line x1="20%" y1="100%" x2="50%" y2="45%" stroke="url(#grad-bl)" strokeWidth="1.2" />
        <line x1="40%" y1="100%" x2="50%" y2="45%" stroke="url(#grad-bl)" strokeWidth="1.2" />
        <line x1="60%" y1="100%" x2="50%" y2="45%" stroke="url(#grad-br)" strokeWidth="1.2" />
        <line x1="80%" y1="100%" x2="50%" y2="45%" stroke="url(#grad-br)" strokeWidth="1.2" />

        {/* Left Edge Rays */}
        <line x1="0" y1="25%" x2="50%" y2="45%" stroke="url(#grad-tl)" strokeWidth="1.2" />
        <line x1="0" y1="50%" x2="50%" y2="45%" stroke="url(#grad-bl)" strokeWidth="1.2" />
        <line x1="0" y1="75%" x2="50%" y2="45%" stroke="url(#grad-bl)" strokeWidth="1.2" />

        {/* Right Edge Rays */}
        <line x1="100%" y1="25%" x2="50%" y2="45%" stroke="url(#grad-tr)" strokeWidth="1.2" />
        <line x1="100%" y1="50%" x2="50%" y2="45%" stroke="url(#grad-br)" strokeWidth="1.2" />
        <line x1="100%" y1="75%" x2="50%" y2="45%" stroke="url(#grad-br)" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
