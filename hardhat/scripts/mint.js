const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
  const basicNft = await ethers.getContract("BasicNft");
  console.log("Minting NFT...");
  const mintTx = await basicNft.mintNft();
  console.log(mintTx);
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
