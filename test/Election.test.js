const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const CompiledManageElection = require("../ethereum/build/ManageElection.json");
const CompiledElection = require("../ethereum/build/Election.json");

let accounts;
let manageElections;
let electionAddress;
let election;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  try {
    manageElections = await new web3.eth.Contract(CompiledManageElection.abi)
      .deploy({ data: CompiledManageElection.evm.bytecode.object })
      .send({ from: accounts[0], gas: 3000000 });

    await manageElections.methods.createElections("PM elections").send({
      from: accounts[0],
      gas: 3000000,
    });

    [electionAddress] = await manageElections.methods
      .getDeployedElections()
      .call();
    election = await new web3.eth.Contract(
      CompiledElection.abi,
      electionAddress
    );
  } catch (err) {
    console.log("resolve this error", err);
  }
});

describe("Election", () => {
  it("deploys a election manager and election", () => {
    assert.ok(manageElections.options.address);
    assert.ok(election.options.address);
  });

  it("check the owner", async () => {
    assert.strictEqual(
      await election.methods.ownerOfElection().call(),
      accounts[0]
    );
  });

  it("check the name of election", async () => {
    assert.strictEqual(
      await election.methods.electionName().call(),
      "PM elections"
    );
  });
});
