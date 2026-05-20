'use client'

import { useState, useEffect } from 'react'

export function PortalBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none bg-[var(--bg-primary)]">
      {/* Central Thick Saturated Blue Glow Spot */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[550px] sm:h-[850px] rounded-full bg-gradient-to-tr from-blue-600/12 via-blue-500/22 to-indigo-500/12 dark:from-blue-600/22 dark:via-blue-500/32 dark:to-indigo-500/18 blur-[120px]" />
      
      {/* Core Saturated Blue Highlight layer for extra thickness */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-blue-600/18 dark:bg-blue-600/28 blur-[70px]" />

      {/* SVG Canvas for n8n Dotted Grid Pattern overlay */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="n8n-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="1.1" className="fill-blue-600/10 dark:fill-blue-500/22" />
          </pattern>
          {/* Radial gradient mask to fade dots out towards the edge of the layout */}
          <radialGradient id="dots-vignette" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="45%" stopColor="white" stopOpacity="0.75" />
            <stop offset="90%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="dots-mask">
            <rect width="100%" height="100%" fill="url(#dots-vignette)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#n8n-dots)" mask="url(#dots-mask)" />
      </svg>
    </div>
  )
}
