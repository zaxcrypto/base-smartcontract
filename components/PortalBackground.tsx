'use client'

import { useState, useEffect } from 'react'

export function PortalBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Generate 48 rays radiating out from the center (50%, 45%) to cover the screen
  const rayCount = 48
  const rays = Array.from({ length: rayCount }).map((_, i) => {
    const angle = (i * 360) / rayCount
    const rad = (angle * Math.PI) / 180
    // Extend end points far beyond viewport boundaries (180% radius)
    const x2 = 50 + Math.cos(rad) * 180
    const y2 = 45 + Math.sin(rad) * 180
    return {
      x2: `${x2}%`,
      y2: `${y2}%`,
      width: i % 2 === 0 ? '18' : '10', // Variable thickness for organic density
      opacity: i % 3 === 0 ? '1.0' : i % 2 === 0 ? '0.75' : '0.45', // Varied intensities
    }
  })

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none bg-[var(--bg-primary)]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Vertical Halftone/Dashed Stripe Pattern */}
          <pattern id="base-vertical-dashes" width="10" height="10" patternUnits="userSpaceOnUse">
            <line 
              x1="5" 
              y1="0" 
              x2="5" 
              y2="10" 
              stroke="#0052FF" 
              strokeWidth="2" 
              strokeDasharray="2, 3" 
            />
          </pattern>

          {/* Mask to shape the vertical dashed lines into the radiating sunburst */}
          <mask id="base-sunburst-mask">
            {/* Draw base black to hide everything by default */}
            <rect width="100%" height="100%" fill="black" />
            
            {/* Draw radiating lines in white to make the pattern visible along the rays */}
            {rays.map((ray, idx) => (
              <line
                key={idx}
                x1="50%"
                y1="45%"
                x2={ray.x2}
                y2={ray.y2}
                stroke="white"
                strokeWidth={ray.width}
                opacity={ray.opacity}
                strokeLinecap="round"
              />
            ))}
          </mask>

          {/* Vignette/Fade radial gradient to blend the pattern into the screen edges */}
          <radialGradient id="base-vignette" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="var(--bg-primary)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--bg-primary)" stopOpacity="0.15" />
            <stop offset="70%" stopColor="var(--bg-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* The radiating vertical halftone stripes */}
        <rect
          width="100%"
          height="100%"
          fill="url(#base-vertical-dashes)"
          mask="url(#base-sunburst-mask)"
          className="opacity-25 dark:opacity-35"
        />

        {/* Soft Vignette Overlay for smooth blending */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#base-vignette)" 
        />
      </svg>
    </div>
  )
}
