// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./PriceConverter.sol";

contract FundMe {
    address public immutable i_owner;

    error FundMe_onlyOwner();

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50;
    address[] public funders;
    mapping(address => uint256) addressToFundersArray;

    function fund() public payable {
        uint256 priceInUsd = msg.value.getConversionRate(priceFeed);
        require(priceInUsd >= MINIMUM_USD);
        funders.push(msg.sender);
        addressToFundersArray[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        require(i_owner == msg.sender);
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToFundersArray[funder] = 0;
        }
        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess);
    }

    modifier onlyOwner() {
        if (i_owner != msg.sender) revert FundMe_onlyOwner();
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
