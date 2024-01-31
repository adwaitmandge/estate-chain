const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1");
const TOKEN_ID = 1;
const USER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const EXPIRES = Math.floor(Date.now() / 1000) + 3600; // Sets EXPIRES to one hour from now in Unix timestamp format

async function setUser() {
  const rentalNft = await ethers.getContract("ERC4907");
  console.log("Setting user of NFT...");
  const setUserTx = await rentalNft.setUser(TOKEN_ID, USER, EXPIRES);
  console.log(setUserTx);

  console.log("User Assigned");
  console.log("Retrieving new user");
}

setUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
