const { ethers } = require("hardhat");

const TOKEN_ID = 1;

async function getUser() {
  const rentalNft = await ethers.getContract("ERC4907");
  console.log(`Getting user of tokenId... ${TOKEN_ID}`);
  const user = await rentalNft.userOf(TOKEN_ID);
  console.log(`The user is ${user}`);
}

getUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
