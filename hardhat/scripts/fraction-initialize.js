const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1");
const COLLECTION = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const TOKEN_ID = 1;
const AMOUNT = "100000000000000000000";

async function initialize() {
  const fractionalizedNFT = await ethers.getContract("FractionalizedNFT");

  const initalizeTx = await fractionalizedNFT.initalize(
    COLLECTION,
    TOKEN_ID,
    AMOUNT
  );
  const initalizeTxReceipt = await initalizeTx.wait(1);
  console.log("Tokens initialized");
  const balance = await fractionalizedNFT.getBalance(deployer.address);
  const owner = await 
  console.log(`The balance is ${balance.toString()}`);
}

initialize()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
