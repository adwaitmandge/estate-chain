const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

// const TOKEN_ID = 18;

async function cancel() {
  const nftMarketplace = await ethers.getContract("NftMarketPlace");
  const basicNft = await ethers.getContract("BasicNft");
  const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
  await tx.wait(1);
  console.log("NFT Canceled!");
}

cancel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
