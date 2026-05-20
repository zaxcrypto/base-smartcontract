'use client'

import { useState, useCallback, useRef } from 'react'
import { useWalletClient, usePublicClient, useChainId } from 'wagmi'
import { encodeFunctionData, decodeEventLog, type Address, type Hash } from 'viem'
import { base } from 'wagmi/chains'
import FactoryABI from '@/lib/abis/BaseTokenFactory.json'
import { FACTORY_ADDRESS, BASE_CHAIN_ID } from '@/lib/constants'
import { validateTokenForm, sanitizeString, type TokenFormValues } from '@/lib/utils'

export type DeploymentStatus =
  | 'idle'
  | 'validating'
  | 'estimating'
  | 'confirming'
  | 'pending'
  | 'success'
  | 'error'

export interface DeploymentResult {
  tokenAddress: Address
  txHash: Hash
  name: string
  symbol: string
  initialSupply: string
  decimals: number
  mintable: boolean
  burnable: boolean
}

export interface UseTokenDeploymentReturn {
  status: DeploymentStatus
  result: DeploymentResult | null
  error: string | null
  gasEstimate: string | null
  deploy: (values: TokenFormValues) => Promise<void>
  reset: () => void
}

export function useTokenDeployment(): UseTokenDeploymentReturn {
  const [status, setStatus] = useState<DeploymentStatus>('idle')
  const [result, setResult] = useState<DeploymentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gasEstimate, setGasEstimate] = useState<string | null>(null)

  // Prevent duplicate submissions
  const isDeploying = useRef(false)

  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setGasEstimate(null)
    isDeploying.current = false
  }, [])

  const deploy = useCallback(
    async (values: TokenFormValues) => {
      // Prevent duplicate submissions
      if (isDeploying.current) return
      isDeploying.current = true

      setError(null)
      setResult(null)

      try {
        // ── 1. Network check ─────────────────────────────────────────────────
        if (chainId !== BASE_CHAIN_ID) {
          throw new Error(
            `Wrong network. Please switch to Base Mainnet (chain ID ${BASE_CHAIN_ID}) in your wallet.`
          )
        }

        if (!walletClient) {
          throw new Error('Wallet not connected. Please connect your wallet first.')
        }

        if (!publicClient) {
          throw new Error('Public client not available. Please refresh the page.')
        }

        // ── 2. Factory address check ─────────────────────────────────────────
        if (FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
          throw new Error(
            'Factory contract not deployed yet. Please set NEXT_PUBLIC_FACTORY_ADDRESS in your .env.local file.'
          )
        }

        // ── 3. Validate & sanitize inputs ────────────────────────────────────
        setStatus('validating')
        const sanitized: TokenFormValues = {
          ...values,
          name: sanitizeString(values.name),
          symbol: sanitizeString(values.symbol).toUpperCase(),
        }

        const validation = validateTokenForm(sanitized)
        if (!validation.valid) {
          const firstError = Object.values(validation.errors)[0]
          throw new Error(firstError)
        }

        const supplyBigInt = BigInt(sanitized.initialSupply)
        const decimalsBigInt = Number(sanitized.decimals)

        // ── 4. Encode call data ──────────────────────────────────────────────
        const callData = encodeFunctionData({
          abi: FactoryABI,
          functionName: 'deployToken',
          args: [
            sanitized.name,
            sanitized.symbol,
            supplyBigInt,
            decimalsBigInt,
            sanitized.mintable,
            sanitized.burnable,
          ],
        })

        // ── 5. Estimate gas ──────────────────────────────────────────────────
        setStatus('estimating')
        let estimatedGas: bigint
        try {
          estimatedGas = await publicClient.estimateGas({
            account: walletClient.account,
            to: FACTORY_ADDRESS,
            data: callData,
            value: BigInt(0),
          })

          // Add 20% buffer for safety
          const buffered = (estimatedGas * BigInt(120)) / BigInt(100)
          const gasPrice = await publicClient.getGasPrice()
          const gasCostWei = buffered * gasPrice
          const gasCostEth = Number(gasCostWei) / 1e18
          setGasEstimate(gasCostEth.toFixed(6))
        } catch (gasErr) {
          // If estimation fails (e.g. simulation revert), surface the error
          throw new Error(
            `Transaction simulation failed: ${gasErr instanceof Error ? gasErr.message : 'Unknown error'}. Please check your inputs.`
          )
        }

        // ── 6. Send transaction ──────────────────────────────────────────────
        setStatus('confirming')
        const txHash = await walletClient.writeContract({
          address: FACTORY_ADDRESS,
          abi: FactoryABI,
          functionName: 'deployToken',
          args: [
            sanitized.name,
            sanitized.symbol,
            supplyBigInt,
            decimalsBigInt,
            sanitized.mintable,
            sanitized.burnable,
          ],
          value: BigInt(0),
          chain: base,
          account: walletClient.account,
        })

        // ── 7. Wait for receipt ──────────────────────────────────────────────
        setStatus('pending')
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          timeout: 120_000, // 2 minute timeout
        })

        if (receipt.status !== 'success') {
          throw new Error('Transaction was reverted on-chain. Please try again.')
        }

        // ── 8. Parse TokenDeployed event ─────────────────────────────────────
        let tokenAddress: Address | null = null
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: FactoryABI,
              data: log.data,
              topics: log.topics,
              eventName: 'TokenDeployed',
            })
            if (decoded.args && 'tokenAddress' in decoded.args) {
              tokenAddress = decoded.args.tokenAddress as Address
            }
          } catch {
            // Not this event, continue
          }
        }

        if (!tokenAddress) {
          throw new Error('Could not parse deployed token address from transaction receipt.')
        }

        // ── 9. Store result ──────────────────────────────────────────────────
        const deploymentResult: DeploymentResult = {
          tokenAddress,
          txHash,
          name: sanitized.name,
          symbol: sanitized.symbol,
          initialSupply: sanitized.initialSupply,
          decimals: decimalsBigInt,
          mintable: sanitized.mintable,
          burnable: sanitized.burnable,
        }

        // Persist to localStorage for dashboard
        const existing = JSON.parse(localStorage.getItem('deployedTokens') ?? '[]')
        existing.unshift({ ...deploymentResult, deployedAt: Date.now() })
        localStorage.setItem('deployedTokens', JSON.stringify(existing))

        setResult(deploymentResult)
        setStatus('success')
      } catch (err) {
        let message = 'Deployment failed.'
        if (err instanceof Error) {
          // Clean up viem error messages
          if (err.message.includes('User rejected') || err.message.includes('user rejected')) {
            message = 'Transaction was rejected in your wallet.'
          } else if (err.message.includes('insufficient funds')) {
            message = 'Insufficient ETH balance for gas fees.'
          } else {
            message = err.message
          }
        }
        setError(message)
        setStatus('error')
      } finally {
        isDeploying.current = false
      }
    },
    [chainId, walletClient, publicClient]
  )

  return { status, result, error, gasEstimate, deploy, reset }
}
