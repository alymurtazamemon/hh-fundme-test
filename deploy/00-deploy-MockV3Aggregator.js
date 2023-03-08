const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const DECIMALS = 8;
  const INITIAL_ANSWER = 200000000;

  if (developmentChains.includes(network.name)) {
    log("Deploying mockV3Aggregator");
    const mockV3Aggregator = await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      log: true,
    });
    log(`mockV3Aggregator contract address: ${mockV3Aggregator.address}`);
  }
};

module.exports.tags = ["all", "mocks"];
