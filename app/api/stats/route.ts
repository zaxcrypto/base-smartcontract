import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 })
  }

  // Ensure clean format
  const targetAddress = address.trim().toLowerCase()

  // Strict 42-character EVM address verification
  if (!/^0x[a-f0-9]{40}$/.test(targetAddress)) {
    return NextResponse.json({ error: 'Invalid Base Mainnet address length or format.' }, { status: 400 })
  }

  try {
    // 1. Fetch balance directly from public Base RPC (fast and 100% reliable)
    const rpcPromise = fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [targetAddress, 'latest']
      })
    })
      .then(res => res.json())
      .then(json => (json?.result ? BigInt(json.result).toString() : '0'))
      .catch(() => '0')

    // 2. Fetch ALL transactions in a single instant query using Etherscan-compatible endpoint
    const txPromise = fetch(`https://base.blockscout.com/api?module=account&action=txlist&address=${targetAddress}&startblock=0&endblock=99999999&sort=desc`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => (json.status === '1' && Array.isArray(json.result) ? json.result : []))
      .catch(() => [])

    // 3. Fetch ALL ERC-20 token transfers instantly in a single query
    const tokenPromise = fetch(`https://base.blockscout.com/api?module=account&action=tokentx&address=${targetAddress}&startblock=0&endblock=99999999&sort=desc`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => (json.status === '1' && Array.isArray(json.result) ? json.result : []))
      .catch(() => [])

    // 4. Fetch ALL NFT transfers instantly in a single query
    const nftPromise = fetch(`https://base.blockscout.com/api?module=account&action=tokennfttx&address=${targetAddress}&startblock=0&endblock=99999999&sort=desc`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => (json.status === '1' && Array.isArray(json.result) ? json.result : []))
      .catch(() => [])

    // Execute fetches in parallel (blindingly fast!)
    const [nativeBalance, rawTxs, rawTokens, rawNfts] = await Promise.all([
      rpcPromise,
      txPromise,
      tokenPromise,
      nftPromise
    ])

    // Map Blockscout Transactions back to frontend standard TxData format
    const transactions = rawTxs.map((tx: any) => ({
      hash: tx.hash || '',
      blockNumber: tx.blockNumber || '0',
      timeStamp: tx.timeStamp || '0',
      from: tx.from || '',
      to: tx.to || '',
      value: tx.value || '0',
      gasUsed: tx.gasUsed || '0',
      isError: tx.isError || '0',
      contractAddress: tx.contractAddress || ''
    }))

    // Filter and map ERC-20 transfers
    const erc20 = rawTokens.map((t: any) => ({
      hash: t.hash || '',
      tokenName: t.tokenName || 'Token',
      tokenSymbol: t.tokenSymbol || 'TKN',
      value: t.value || '0',
      tokenDecimal: t.tokenDecimal || '18',
      from: t.from || '',
      to: t.to || '',
      contractAddress: t.contractAddress || ''
    }))

    // Filter and map NFT transfers
    const nft = rawNfts.map((t: any) => ({
      hash: t.hash || '',
      tokenName: t.tokenName || 'NFT Collection',
      tokenSymbol: t.tokenSymbol || 'NFT',
      tokenID: t.tokenID || '0',
      from: t.from || '',
      to: t.to || '',
      contractAddress: t.contractAddress || ''
    }))

    return NextResponse.json({
      success: true,
      address: targetAddress,
      balance: nativeBalance,
      transactions,
      erc20,
      nft
    })

  } catch (error: any) {
    console.error('Wallet analytics fetch failed:', error)
    return NextResponse.json({
      error: 'Failed to retrieve analytics from Base Mainnet',
      details: error.message || error
    }, { status: 500 })
  }
}
