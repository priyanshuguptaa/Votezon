const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const electionPath = path.resolve(__dirname, "contracts", "Election.sol");
const source = fs.readFileSync(electionPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    "Election.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
console.log("compiling contract");
let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Contract Compiled");

console.log(compiledContract);

fs.ensureDirSync(buildPath);

for (let contract in compiledContract.contracts["Election.sol"]) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    compiledContract.contracts["Election.sol"][contract]
  );
}
