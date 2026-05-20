

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    base_mainnet: {
      url: "https://mainnet.base.org",
      accounts: [] // Handled by script
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
};
