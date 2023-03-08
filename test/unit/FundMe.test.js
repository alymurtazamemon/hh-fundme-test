const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");

let fundMe;
let mockV3Aggregator;
let deployer;
describe("FundMe", async function () {
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    fundMe = await ethers.getContract("FundMe", deployer);
  });

  describe("constructor", async function () {
    it("Sets the aggregator addresses correctly", async function () {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", async function () {
    it("Should not revert", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more gas"
      );
    });
  });
});
