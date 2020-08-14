"use-strict";

const app = require("express");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const Web3 = require("web3");

io.listen(port);

const tokenSidechainAbi = require("./build/contracts/EthSwap.json");
const tokenSidechainAddress = tokenSidechainAbi.networks["5777"].address;

const receiveContractAbi = require("./ReceiveAbi.json");
const receiveContractAddress = "0xe80661277fccf9f5dac61b0ed2328282b4581bb2";

const web3Ethereum = new Web3(
  new Web3.providers.WebsocketProvider("ws://128.199.64.114:8550")
);

const web3Ganache = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545")
);

const ReceiveContract = new web3Ethereum.eth.Contract(
  receiveContractAbi,
  receiveContractAddress
);

const TokenContract = new web3Ganache.eth.Contract(
  tokenSidechainAbi.abi,
  tokenSidechainAddress
);

const receiveEtherEvent = web3Ethereum.eth.subscribe(
  "logs",
  {
    address: receiveContractAddress,
  },
  async (err, log) => {
    let { topics } = log;
    topics = topics = topics.slice(1, 3);
    const result = web3Ethereum.eth.abi.decodeLog(
      [
        {
          type: "address",
          name: "sender",
          indexed: true,
        },
        {
          type: "uint",
          name: "amount",
          indexed: true,
        },
      ],
      "0x",
      topics
    );
    const etherAmount = web3Ethereum.utils.fromWei(amount, "Ether");
    const accounts = await web3Ganache.eth.getAccounts();
    TokenContract.methods
      .sendToken(etherAmount, result.sender)
      .send({ from: accounts[0] });
  }
);

const amount = "1000000000000000000";

console.log(`app listen on port ${port}`);
