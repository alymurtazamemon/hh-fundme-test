const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const { deployer } = await getNamedAccounts();

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const mockV3Aggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = mockV3Aggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }
  log("Deploying fundMe");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
  log(`FundMe contract address: ${fundMe.address}`);
};

module.exports.tags = ["all", "fundMe"];
