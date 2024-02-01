require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const REPORT_GAS = process.env.REPORT_GAS || false;
MAINNET_RPC_URL =
  "https://eth-mainnet.g.alchemy.com/v2/pWcX8ihXg5mkG5_JM3Jpu5DAhV0gMetX";
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // If you want to do some forking, uncomment this
      forking: {
        url: MAINNET_RPC_URL,
      },
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
    customChains: [],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  contractSizer: {
    runOnCompile: false,
    only: ["NftMarketPlace"],
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.8.7",
      },
      {
        version: "0.8.8",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};
