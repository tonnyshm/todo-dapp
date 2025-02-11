// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyToken.sol";

contract Staking {
    MyToken public token;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public rewardBalances;

    constructor(MyToken _token) {
        token = _token;
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Amount should be greater than 0");
        stakedBalances[msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount) public {
        require(stakedBalances[msg.sender] >= _amount, "Insufficient balance");
        stakedBalances[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
    }

    function calculateReward(address _user) public view returns (uint256) {
        return stakedBalances[_user] * 10 / 100;  // reward is  10%
    }

    function claimReward() public {
        uint256 reward = calculateReward(msg.sender);
        rewardBalances[msg.sender] += reward;
        token.transfer(msg.sender, reward);
    }
}
