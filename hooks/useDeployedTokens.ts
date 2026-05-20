'use client'

import { useState, useCallback } from 'react'
import { useReadContract } from 'wagmi'
import type { Address } from 'viem'
import FactoryABI from '@/lib/abis/BaseTokenFactory.json'
import { FACTORY_ADDRESS } from '@/lib/constants'

export interface StoredToken {
  tokenAddress: Address
  txHash: string
  name: string
  symbol: string
  initialSupply: string
  decimals: number
  mintable: boolean
  burnable: boolean
  deployedAt: number
}

export function useDeployedTokens(creatorAddress?: Address) {
  const [localTokens, setLocalTokens] = useState<StoredToken[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('deployedTokens') ?? '[]')
    } catch {
      return []
    }
  })

  const refresh = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('deployedTokens') ?? '[]')
      setLocalTokens(data)
    } catch {
      setLocalTokens([])
    }
  }, [])

  // On-chain count from factory
  const { data: totalDeployed } = useReadContract({
    address: FACTORY_ADDRESS as Address,
    abi: FactoryABI,
    functionName: 'getTotalDeployed',
  })

  // On-chain tokens by creator
  const { data: onChainTokens } = useReadContract({
    address: FACTORY_ADDRESS as Address,
    abi: FactoryABI,
    functionName: 'getTokensByCreator',
    args: creatorAddress ? [creatorAddress] : undefined,
    query: { enabled: !!creatorAddress },
  })

  return {
    localTokens,
    onChainTokens: onChainTokens as Address[] | undefined,
    totalDeployed: totalDeployed as bigint | undefined,
    refresh,
  }
}
