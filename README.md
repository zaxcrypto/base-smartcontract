# Base Token Deployer

A production-grade Web3 dApp for deploying **ERC-20 tokens directly on Base Mainnet**. No code required — connect your wallet, fill in the form, and your token is live.

Built following the official [Base documentation](https://docs.base.org/get-started/deploy-smart-contracts).

---

## Features

- ✅ Deploy ERC-20 tokens directly on **Base Mainnet**
- ✅ Optional **Mintable** (owner-only) and **Burnable** features
- ✅ **OpenZeppelin** audited contracts
- ✅ **Factory pattern** — all deployments tracked on-chain
- ✅ Gas estimation before every transaction
- ✅ Input sanitization and validation
- ✅ **RainbowKit** wallet connect (MetaMask, Coinbase Wallet, WalletConnect)
- ✅ Network mismatch detection
- ✅ BaseScan links for every deployment
- ✅ Add deployed token to wallet
- ✅ Dashboard to track your tokens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Web3 | wagmi, viem, RainbowKit |
| Smart Contracts | Solidity 0.8.20, OpenZeppelin |
| Toolchain | Foundry (forge + cast) |
| Network | Base Mainnet (Chain ID 8453) |

---

## Project Structure

```
base-token-deployer/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── deploy/page.tsx     # Token deploy page
│   └── dashboard/page.tsx  # My tokens dashboard
├── components/
│   ├── Providers.tsx       # wagmi + RainbowKit providers
│   ├── Navbar.tsx          # Top navigation
│   ├── TokenForm.tsx       # Deploy form
│   └── SuccessCard.tsx     # Post-deploy success UI
├── hooks/
│   ├── useTokenDeployment.ts  # Core deploy hook
│   └── useDeployedTokens.ts   # Dashboard data hook
├── lib/
│   ├── wagmi.ts            # wagmi config (Base Mainnet)
│   ├── constants.ts        # Network config, limits
│   ├── utils.ts            # Validation, formatting
│   └── abis/
│       ├── BaseTokenFactory.json
│       └── BaseToken.json
├── contracts/
│   └── BaseTokenFactory.sol  # Factory + ERC20 Solidity contracts
├── scripts/
│   └── deploy-factory.mjs    # Factory deployment script
├── foundry.toml              # Foundry config
└── .env.example              # Environment variable template
```

---

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd base-token-deployer
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Get yours at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Set after deploying the factory (Step 4)
NEXT_PUBLIC_FACTORY_ADDRESS=0x...

NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Install Foundry (for contract deployment)

```bash
# macOS / Linux
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Windows: Use WSL or download installer from https://book.getfoundry.sh
```

### 4. Install OpenZeppelin Contracts

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 5. Deploy the Factory Contract to Base Mainnet

> Use a fresh deployer wallet with only enough ETH for gas. Never share your private key.

```bash
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY node scripts/deploy-factory.mjs
```

Copy the output **Contract Address** and set it in `.env.local`:

```env
NEXT_PUBLIC_FACTORY_ADDRESS=0xYOUR_DEPLOYED_FACTORY_ADDRESS
```

### 6. (Optional) Verify on BaseScan

```bash
forge verify-contract \
  0xYOUR_FACTORY_ADDRESS \
  contracts/BaseTokenFactory.sol:BaseTokenFactory \
  --chain-id 8453 \
  --etherscan-api-key YOUR_BASESCAN_API_KEY
```

Get a BaseScan API key at: https://basescan.org/myapikey

### 7. Run the Dev Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Base Network Configuration

| Parameter | Value |
|---|---|
| Network | Base Mainnet |
| Chain ID | 8453 |
| RPC URL | https://mainnet.base.org |
| Block Explorer | https://basescan.org |
| Currency | ETH |

---

## Security Checklist

- [x] No private key storage or access
- [x] No seed phrase requested
- [x] No fund custody
- [x] Client-side only wallet interactions
- [x] OpenZeppelin audited ERC-20 base
- [x] Input validation and sanitization
- [x] Integer overflow prevented (Solidity 0.8.x built-in)
- [x] Gas simulation before every transaction
- [x] Duplicate transaction prevention (ref lock)
- [x] Network mismatch detection + auto-switch prompt
- [x] No arbitrary external contract calls
- [x] No delegatecall
- [x] No hidden approvals
- [x] Excess ETH refunded by factory
- [x] Transaction receipt validated (status === 'success')
- [x] Event parsed to confirm token address

---

## License

MIT
