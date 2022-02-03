require('babel-register');
require('babel-polyfill');

// Introduce tu clave privada (12 palabras) de Metamask
var HDWalletProvider = require("@truffle/hdwallet-provider")
var mnemonic = "Tus 12 palabras"

module.exports = {
  networks: {

    // Ganache (ID: 5777)
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    // Rinkeby (ID: 4)
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/d2275b005f7f48cca3cbde70c8a5c2cc")
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
    },

    // Binance Smart Chain (BSC) (ID: 97)
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, "https://data-seed-prebsc-1-s1.binance.org:8545"),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
