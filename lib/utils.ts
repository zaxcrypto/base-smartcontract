'use client'

import {
  MAX_TOKEN_NAME_LENGTH,
  MAX_TOKEN_SYMBOL_LENGTH,
  MIN_SUPPLY,
  MAX_SUPPLY,
  MAX_DECIMALS,
} from './constants'

export interface TokenFormValues {
  name: string
  symbol: string
  initialSupply: string
  decimals: string
  mintable: boolean
  burnable: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Sanitize a string input — strip HTML/script injection chars
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>"'`]/g, '') // strip dangerous chars
    .trim()
}

/**
 * Validate all token form fields before deployment
 */
export function validateTokenForm(values: TokenFormValues): ValidationResult {
  const errors: Record<string, string> = {}

  // ── Name ────────────────────────────────────────────────────────────────
  const name = sanitizeString(values.name)
  if (!name) {
    errors.name = 'Token name is required.'
  } else if (name.length > MAX_TOKEN_NAME_LENGTH) {
    errors.name = `Token name must be ${MAX_TOKEN_NAME_LENGTH} characters or less.`
  }

  // ── Symbol ───────────────────────────────────────────────────────────────
  const symbol = sanitizeString(values.symbol)
  if (!symbol) {
    errors.symbol = 'Token symbol is required.'
  } else if (symbol.length > MAX_TOKEN_SYMBOL_LENGTH) {
    errors.symbol = `Symbol must be ${MAX_TOKEN_SYMBOL_LENGTH} characters or less.`
  } else if (!/^[A-Za-z0-9]+$/.test(symbol)) {
    errors.symbol = 'Symbol can only contain letters and numbers.'
  }

  // ── Supply ───────────────────────────────────────────────────────────────
  const supply = Number(values.initialSupply)
  if (!values.initialSupply || isNaN(supply)) {
    errors.initialSupply = 'Initial supply is required.'
  } else if (!Number.isInteger(supply)) {
    errors.initialSupply = 'Supply must be a whole number.'
  } else if (supply < MIN_SUPPLY) {
    errors.initialSupply = `Supply must be at least ${MIN_SUPPLY.toLocaleString()}.`
  } else if (supply > MAX_SUPPLY) {
    errors.initialSupply = `Supply cannot exceed ${MAX_SUPPLY.toLocaleString()}.`
  }

  // ── Decimals ─────────────────────────────────────────────────────────────
  const decimals = Number(values.decimals)
  if (values.decimals === '' || isNaN(decimals)) {
    errors.decimals = 'Decimals is required.'
  } else if (!Number.isInteger(decimals) || decimals < 0 || decimals > MAX_DECIMALS) {
    errors.decimals = `Decimals must be a whole number between 0 and ${MAX_DECIMALS}.`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Format a BigInt supply value for display
 */
export function formatSupply(supply: bigint, decimals: number): string {
  const divisor = BigInt("1" + "0".repeat(decimals))
  const whole = supply / divisor
  return whole.toLocaleString()
}

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format a timestamp (seconds) to human-readable date
 */
export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString()
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
