import web3 from "./web3";
import ManageElection from "./build/ManageElection.json";

const instance = new web3.eth.Contract(
  ManageElection.abi,
  "0x680f330969d5E92eeE7E199E5Ac40E2a3AF247CE"
);

export default instance;
