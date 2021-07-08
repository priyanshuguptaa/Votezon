const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledManageElection = require("./build/ManageElection.json");

const provider = new HDWalletProvider(
  process.env.metamask_mnemonic_seed,
  "https://rinkeby.infura.io/v3/69a224e8cff5477da97a69dfd1a808af"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("attempting to deploy from account ", accounts[0]);

  try {
    const result = await new web3.eth.Contract(compiledManageElection.abi)
      .deploy({ data: compiledManageElection.evm.bytecode.object })
      .send({ gas: 3000000, from: accounts[0] });

    console.log("contract deployed to ", result.options.address);
  } catch (error) {
    console.log("resolve the error", error);
  }
};

deploy();
