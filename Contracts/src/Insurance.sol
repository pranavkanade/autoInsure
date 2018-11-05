pragma solidity ^0.4.24;

contract Insurance {
    address public cInsured;
    uint public cInsuredAmt;
    constructor () public payable {
        cInsured = msg.sender;
        cInsuredAmt = msg.value;
    }

    modifier personInsuredOnly (address caller) {
        require(cInsured == caller);
        _;
    }
}