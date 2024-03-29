const { ethers } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30",
  },
  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    mintEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
    daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  11155111: {
    name: "sepolia",
    subscriptionId: "6829",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "10",
    mintFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    ethUsdPriceFee: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 4;
const frontEndContractsFile =
  "../nextjs-nft-marketplace/constants/networkMapping.json";
// const frontEndContractsFile2 = "../client/constants/networkMapping.json";
const frontEndAbiLocation = "../nextjs-nft-marketplace/constants/";
// const frontEndAbiLocation2 = "../../client/constants/";
module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  // frontEndContractsFile2,
  frontEndAbiLocation,
  // frontEndAbiLocation2,
};
