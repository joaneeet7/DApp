import Web3 from 'web3';

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
}

/*
https://medium.com/@parag.chirde/building-a-dapp-on-ethereum-with-vuejs-and-solidity-d01a24b54c1f

https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
 */
window.addEventListener("load", async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
    } catch (error) {
      alert('User denied account access...');
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
});

export default web3;