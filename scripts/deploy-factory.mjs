#!/usr/bin/env node
/**
 * deploy-factory.mjs
 *
 * Deploys the BaseTokenFactory contract to Base Mainnet using viem.
 * Uses Foundry's forge to compile, then viem to deploy.
 *
 * Prerequisites:
 *   1. Install Foundry: https://book.getfoundry.sh/getting-started/installation
 *   2. Install OpenZeppelin: forge install OpenZeppelin/openzeppelin-contracts
 *   3. Set DEPLOYER_PRIVATE_KEY in your environment (never commit this!)
 *
 * Usage:
 *   DEPLOYER_PRIVATE_KEY=0x... node scripts/deploy-factory.mjs
 */

import { createWalletClient, createPublicClient, http, parseGwei } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Safety check: never log the private key ────────────────────────────────
const privateKey = process.env.DEPLOYER_PRIVATE_KEY
if (!privateKey) {
  console.error('❌  DEPLOYER_PRIVATE_KEY environment variable not set.')
  console.error('    Run: DEPLOYER_PRIVATE_KEY=0x... node scripts/deploy-factory.mjs')
  process.exit(1)
}

if (privateKey.length < 66) {
  console.error('❌  DEPLOYER_PRIVATE_KEY looks malformed. Expected 0x + 64 hex chars.')
  process.exit(1)
}

// ── Compile contracts ──────────────────────────────────────────────────────
console.log('🔨 Compiling contracts with Foundry…')
try {
  execSync('forge build --contracts contracts/ --out out/', {
    cwd: resolve(__dirname, '..'),
    stdio: 'inherit',
  })
} catch {
  console.error('❌  forge build failed. Is Foundry installed?')
  console.error('    Install: curl -L https://foundry.paradigm.xyz | bash && foundryup')
  process.exit(1)
}

// ── Read compiled artifacts ────────────────────────────────────────────────
const artifactPath = resolve(__dirname, '../out/BaseTokenFactory.sol/BaseTokenFactory.json')
let artifact
try {
  artifact = JSON.parse(readFileSync(artifactPath, 'utf8'))
} catch {
  console.error(`❌  Could not read compiled artifact at ${artifactPath}`)
  process.exit(1)
}

const bytecode = artifact.bytecode.object
const abi = artifact.abi

if (!bytecode || bytecode === '0x') {
  console.error('❌  Bytecode is empty. Check that the contract compiled correctly.')
  process.exit(1)
}

// ── Set up viem clients ────────────────────────────────────────────────────
const account = privateKeyToAccount(privateKey)

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http('https://mainnet.base.org'),
})

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
})

// ── Check balance ──────────────────────────────────────────────────────────
const balance = await publicClient.getBalance({ address: account.address })
console.log(`\n📍 Deployer address: ${account.address}`)
console.log(`💰 Balance: ${Number(balance) / 1e18} ETH`)

if (balance === 0n) {
  console.error('❌  Deployer has 0 ETH. Fund with Base ETH before deploying.')
  process.exit(1)
}

// ── Estimate gas ───────────────────────────────────────────────────────────
console.log('\n⛽ Estimating deployment gas…')
const gasEstimate = await publicClient.estimateContractGas({
  abi,
  bytecode,
  account: account.address,
})
const gasPrice = await publicClient.getGasPrice()
const gasCost = (gasEstimate * gasPrice * 120n) / 100n
console.log(`   Estimated gas: ${gasEstimate.toLocaleString()} units`)
console.log(`   Estimated cost: ${Number(gasCost) / 1e18} ETH (including 20% buffer)`)

// ── Deploy ─────────────────────────────────────────────────────────────────
console.log('\n🚀 Deploying BaseTokenFactory to Base Mainnet…')
const hash = await walletClient.deployContract({
  abi,
  bytecode,
  account,
  chain: base,
})

console.log(`\n✅ Transaction submitted: ${hash}`)
console.log('⏳ Waiting for confirmation…')

const receipt = await publicClient.waitForTransactionReceipt({
  hash,
  timeout: 120_000,
})

if (receipt.status !== 'success') {
  console.error('❌  Deployment transaction reverted.')
  process.exit(1)
}

const contractAddress = receipt.contractAddress
console.log('\n🎉 BaseTokenFactory deployed successfully!')
console.log(`\n   Contract Address : ${contractAddress}`)
console.log(`   Transaction Hash : ${hash}`)
console.log(`   BaseScan         : https://basescan.org/address/${contractAddress}`)
console.log('\n📝 Next steps:')
console.log(`   1. Add to .env.local:`)
console.log(`      NEXT_PUBLIC_FACTORY_ADDRESS=${contractAddress}`)
console.log('   2. (Optional) Verify on BaseScan:')
console.log(`      forge verify-contract ${contractAddress} contracts/BaseTokenFactory.sol:BaseTokenFactory --chain-id 8453 --etherscan-api-key <KEY>`)
