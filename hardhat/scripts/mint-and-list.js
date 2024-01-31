const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
async function mindAndList() {
  const nftMarketplace = await ethers.getContract("NftMarketPlace");
  const basicNft = await ethers.getContract("BasicNft");
  const [owner, addr1] = await ethers.getSigners();
  console.log("Minting Nft......");
  const mintTx = await basicNft.mintNft();
  const mintReceipt = await mintTx.wait(1);
  const tokenId = mintReceipt.events[1].args.tokenId;
  console.log(
    `Minted tokenId ${tokenId.toString()} from contract: ${basicNft.address}`
  );
  console.log("Approving Nft.....");
  const approveTx = await basicNft.approve(
    nftMarketplace.address,
    tokenId.toString()
  );
  await approveTx.wait(1);
  console.log("Listing Nft ....");
  const listTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE
  );
  const listReceipt = await listTx.wait(1);
  console.log("Nft Listed.....");
}
mindAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
