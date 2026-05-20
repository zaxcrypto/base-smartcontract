import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Base Mainnet — official RPC from docs.base.org
export const BASE_MAINNET_RPC = 'https://mainnet.base.org'
export const BASE_CHAIN_ID = 8453
export const BASE_SCAN_URL = 'https://basescan.org'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '824aeb025d9589f775bd1c20d71220c9'

export const wagmiConfig = getDefaultConfig({
  appName: 'Base Token Deployer',
  projectId: walletConnectProjectId,
  chains: [base],
  transports: {
    [base.id]: http(BASE_MAINNET_RPC),
  },
  ssr: true,
})

export { base }
