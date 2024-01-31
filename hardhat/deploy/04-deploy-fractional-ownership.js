const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  const arguments = [];
  const fractionalOwnership = await deploy("FractionalizedNFT", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: 1,
  });

  // Verify the deployment
  if (!developmentChains.includes(network.name)) {
    log("Verifying...");
    await verify(fractionalOwnership.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "fraction"];
