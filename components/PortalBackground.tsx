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
    </div>
  )
}
