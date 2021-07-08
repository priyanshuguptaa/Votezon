import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  window.alert("Please install metamask for better interactivity");
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/69a224e8cff5477da97a69dfd1a808af"
  );

  web3 = new Web3(provider);
}

export default web3;
