const { ethers, network } = require("hardhat");

async function mint() {
  const multiSig = await ethers.getContract("MultiSigWallet");

  const executeTx = await multiSig.executeTransaction(0);
  const executeTxReceipt = await executeTx.wait(1);

  const sender = executeTxReceipt.events[0].args.owner;
  const txIndex = executeTxReceipt.events[0].args.txIndex;

  console.log(`Sender is ${sender}`);
  console.log(`txIndex is ${txIndex}`);
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
