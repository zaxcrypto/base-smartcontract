import { type Address } from 'viem'

// ─── Factory Contract ────────────────────────────────────────────────────────
// Replace with your deployed factory address after running deploy script
export const FACTORY_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address) ?? '0x0000000000000000000000000000000000000000'

// ─── Base Network ────────────────────────────────────────────────────────────
export const BASE_CHAIN_ID = 8453
export const BASE_RPC_URL = 'https://mainnet.base.org'
export const BASE_SCAN_URL = 'https://basescan.org'
export const BASE_SCAN_TX_URL = `${BASE_SCAN_URL}/tx`
export const BASE_SCAN_TOKEN_URL = `${BASE_SCAN_URL}/token`
export const BASE_SCAN_ADDRESS_URL = `${BASE_SCAN_URL}/address`

// ─── Token Validation Limits ─────────────────────────────────────────────────
export const MAX_TOKEN_NAME_LENGTH = 64
export const MAX_TOKEN_SYMBOL_LENGTH = 12
export const MIN_SUPPLY = 1
export const MAX_SUPPLY = 1_000_000_000_000
export const MAX_DECIMALS = 18
export const DEFAULT_DECIMALS = 18

// ─── UI ───────────────────────────────────────────────────────────────────────
export const SITE_NAME = 'Base Token Deployer'
export const SITE_DESCRIPTION = 'Deploy your own ERC-20 token on Base Mainnet in seconds. No code required.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://base-token-deployer.vercel.app'
