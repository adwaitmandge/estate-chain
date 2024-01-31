const { network } = require("hardhat");

function sleep(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

//we need moveblocks to mine additional blocks so that transactions can be confirmed,but on testnet or mainnet we cannot do this,but on local chain we can do this
async function moveBlocks(amount, sleepAmount = 0) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
    //we can sleep for a bit to make sure that the block is mined
    if (sleepAmount) {
      console.log(`Sleeping for ${sleepAmount}`);
      await sleep(sleepAmount);
    }
  }
  console.log(`Moved ${amount} blocks`);
}

module.exports = {
  moveBlocks,
  sleep,
};
