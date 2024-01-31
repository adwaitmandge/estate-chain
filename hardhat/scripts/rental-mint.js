const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
  const rentalNft = await ethers.getContract("ERC4907");
  console.log("Minting NFT...");
  const mintTx = await rentalNft.nftMint();
  const mintTxReceipt = await mintTx.wait(1);
  // console.log(mintTx);
  console.log(mintTxReceipt.events[0].args.tokenId.toString());
  console.log("NFT Minted");
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
