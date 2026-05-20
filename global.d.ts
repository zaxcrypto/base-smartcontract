/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Extend the Window interface for MetaMask / EIP-1193 provider
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>
    on: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void
    isMetaMask?: boolean
    isCoinbaseWallet?: boolean
    selectedAddress?: string
    chainId?: string
  }
}
