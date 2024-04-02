// require("dotenv").config();
import Web3 from "web3";
import Election from "./contracts/Election.json";
import { useState, useEffect } from "react";
import "./App.css";
/* global BigInt */
function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [admin, setAdmin] = useState("none");
  const [contractAddress, setContractAddress] = useState("none");
  const [count, setCount] = useState("none");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template() {
      const web3 = new Web3(provider);
      // console.log(web3);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      // console.log(deployedNetwork.address);
      const contract = new web3.eth.Contract(
        Election.abi,
        deployedNetwork.address
      );
      // console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  // console.log(state);
  useEffect(() => {
    const contract = state.contract;
    // console.log(contract);
    async function getAdmin() {
      const admin = await contract.methods.admin().call();
      setAdmin(admin);
      // console.log(admin);
    }
    contract && getAdmin();
  }, [state]);

  useEffect(() => {
    const contract = state.contract;
    // console.log(contract);
    async function getContractAddress() {
      const contractAddress = await contract._address;
      // console.log(contractAddress);
      setContractAddress(contractAddress);
      // console.log(admin);
    }
    contract && getContractAddress();
  }, [state]);
  useEffect(() => {
    const contract = state.contract;
    // console.log(contract);
    async function GetCount() {
      var count = await contract.methods.getCount().call();
      console.log(count);
      setCount(count);
      // console.log(admin);
    }
    contract && GetCount();
  }, [state]);
  useEffect(() => {
    const contract = state.contract;
    // console.log(contract);
    async function GetCount() {
      var count = await contract.methods.getCount().call();
      console.log(count);
      setCount(count);
      // console.log(admin);
    }
    contract && GetCount();
  }, [state]);

  // useEffect(() => {
  var votes;
  // console.log(contract);
  async function GetVotes() {
    const contract = state.contract;
    const cid = document.querySelector("#value3").value;
    votes = await contract.methods.getVotes(BigInt(cid)).call();
    window.location.reload();
    // console.log(votes);
    // setVotes(votes);
    // console.log(admin);
  }
  //   contract && GetVotes();
  // }, [state]);

  async function writeCandidate() {
    const { contract } = state;
    const { web3 } = state;
    const name = document.querySelector("#value1").value;
    const addr = document.querySelector("#value2").value;
    await contract.methods
      .addCandidate(name)
      .send({ from: addr, gas: "10000000" });
    window.location.reload();
  }
  async function writeVoter() {
    const { contract } = state;
    const { web3 } = state;

    const addr = document.querySelector("#value4").value;
    await contract.methods.addVoter(addr).send({ from: admin });
    window.location.reload();
  }
  async function writeVotes() {
    const { contract } = state;
    const { web3 } = state;

    const vaddr = document.querySelector("#value5").value;
    const cid = document.querySelector("#value6").value;
    await contract.methods.addVoter(cid).send({ from: vaddr });
    window.location.reload();
  }

  return (
    <div className="App">
      <h1>Voting Decentralized App</h1>
      <p>Admin : {admin}</p>
      <p>Contract Address : {contractAddress}</p>
      <p>Number of Candidates : {Number(count)}</p>
      <input type="text" id="value1" placeholder="Name"></input>
      &nbsp;&nbsp;
      <input type="text" id="value2" placeholder="Your Address"></input>
      &nbsp;&nbsp;
      <button onClick={writeCandidate}>Add Candidate</button>
      <p>
        Get Candidate's Votes &nbsp;{" "}
        <input type="text" id="value3" placeholder="Candidate ID"></input>
        &nbsp;&nbsp;
        <button onClick={GetVotes}>Get Votes</button>
        &nbsp;&nbsp;=&nbsp;&nbsp; {Number(votes)}
      </p>
      <p>
        Add Voters &nbsp;&nbsp;
        <input type="text" id="value4" placeholder="Voter ID"></input>{" "}
        &nbsp;&nbsp;<button onClick={writeVoter}>Add Voter</button>
      </p>
      <p>
        Vote &nbsp;&nbsp;
        <input type="text" id="value5" placeholder="Voter ID"></input>{" "}
        &nbsp;&nbsp;
        <input type="number" id="value6" placeholder="Candidate ID"></input>
        &nbsp;&nbsp;
        <button onClick={writeVotes}>Vote</button>
      </p>
    </div>
  );
}
export default App;
