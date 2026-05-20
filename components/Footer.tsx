'use client'

import React from 'react'

export function Footer() {
  return (
    <footer className="w-full py-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)] flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 gap-4 text-center sm:text-left z-10">
      <div className="text-[10px] font-bold text-[var(--text-secondary)]/60 tracking-widest uppercase">
        © {new Date().getFullYear()} Base.fun
      </div>
      
      <a
        href="https://x.com/0x_zax"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1 text-4xs sm:text-3xs font-extrabold text-[var(--text-secondary)]/90 tracking-tight rounded-full border border-blue-500/10 dark:border-blue-500/20 bg-blue-500/[0.01] dark:bg-blue-950/[0.02] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
      >
        <div className="relative w-5 h-5 rounded-full p-[1px] bg-gradient-to-tr from-blue-600 to-cyan-400">
          <img
            src="https://unavatar.io/twitter/0x_zax"
            alt="0x_zax Avatar"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/base.png"
            }}
          />
        </div>
        <span>
          Built by <span className="text-blue-500 dark:text-blue-400">@0x_zax</span>
        </span>
        <svg className="h-2.5 w-2.5 fill-current text-[var(--text-secondary)]/60" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </footer>
  )
}
