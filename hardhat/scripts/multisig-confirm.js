const { ethers, network } = require("hardhat");

async function mint() {
  const accounts = await ethers.getSigners();
  const account = accounts[2];
  const multiSig = await ethers.getContract("MultiSigWallet", account);

  const confirmTx = await multiSig.confirmTransaction(0);
  const confirmTxReceipt = await confirmTx.wait(1);

  const sender = confirmTxReceipt.events[0].args.owner;
  const txIndex = confirmTxReceipt.events[0].args.txIndex;

  console.log(`Sender is ${sender}`);
  console.log(`txIndex is ${txIndex}`);
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
