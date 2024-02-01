const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1");

const TO = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
const VALUE = 234;
const DATA = "0x01";

async function mint() {
  const multiSig = await ethers.getContract("MultiSigWallet");
  console.log("Minting NFT...");
  const submitTx = await multiSig.submitTransaction(TO, VALUE, DATA);
  const submitTxReceipt = await submitTx.wait(1);
  // console.log(mintTx);
  const submitEvent = submitTxReceipt.events[0].args;
  const sender = submitEvent.owner;
  const txIndex = submitEvent.txIndex;
  const to = submitEvent.to;
  const value = submitEvent.value;
  const data = submitEvent.data;
  console.log(`Sender is ${sender}`);
  console.log(`txIndex is ${txIndex}`);
  console.log(`to is ${to}`);
  console.log(`value is ${value}`);
  console.log(`data is ${data}`);
  console.log("Transaction Submitted");

  const accounts = await ethers.getSigners();

  const confirmTx1 = await multiSig.confirmTransaction(0);
  const confirmTx1Receipt = await confirmTx1.wait(1);

  const sender1 = confirmTx1Receipt.events[0].args.owner;
  const txIndex1 = confirmTx1Receipt.events[0].args.txIndex;

  console.log(`Sender1 is ${sender1}`);
  console.log(`txIndex1 is ${txIndex}`);
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
