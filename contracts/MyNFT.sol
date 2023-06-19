// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// NFT contract
contract MyNFT is ERC721, Ownable {
    uint public nextTokenId;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to) external onlyOwner returns (uint tokenId) {
        tokenId = nextTokenId;
        _mint(to, tokenId);
        nextTokenId++;
    }
}

// Token sender contract
contract TokenSender is Ownable {
    IERC20 public token;
    MyNFT public nft;
    address public admin = 0x67c7EF63f79D7b255E3197f094087d2ECfAd516f; // Fixed admin address

    function setTokenAddress(address _token) external onlyOwner {
        token = IERC20(_token);
    }

    function setNFTAddress(address _nft) external onlyOwner {
        nft = MyNFT(_nft);
    }

    function approveAndSend(uint256 amount) external {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        token.transferFrom(msg.sender, admin, amount);  // Tokens will always be sent to the admin address

        // Mint and send NFT to the sender
        nft.mint(msg.sender);
    }
}
