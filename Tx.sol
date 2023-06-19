// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSender is Ownable {
    IERC20 public token;
    address public admin = 0x67c7EF63f79D7b255E3197f094087d2ECfAd516f; // Fixed admin address

    function setTokenAddress(address _token) external onlyOwner {
        token = IERC20(_token);
    }

    function approveAndSend(uint256 amount) external {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        token.transferFrom(msg.sender, admin, amount);  // Tokens will always be sent to the admin address
    }
}
