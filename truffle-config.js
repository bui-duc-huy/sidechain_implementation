require("babel-register");
require("babel-polyfill");
// const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic =
  "moon stock bird piano vast major omit camp anxiety dinner cluster cart";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
  },
  contracts_directory: "./contracts/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
