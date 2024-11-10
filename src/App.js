import { useEffect, useState } from "react";
import "./App.css";
import lottery from "./lottery";
// eslint-disable-next-line
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getManager = async () => {
      const manager = await lottery.methods.manager().call();
      setManager(manager);
    };
    const getPlayers = async () => {
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
    };
    const getBalance = async () => {
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
    };
    getBalance();
    getPlayers();
    getManager();
  }, []);

  const onSubmit = async (e) => { 
    e.preventDefault();
    setMessage("Waiting on transaction success...");
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setMessage("You have been entered!"); 
  }

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("A winner has been picked!");
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}<br />
        There are currently {players.length} people entered in the lottery<br />
        Competing to win the prize: {web3.utils.fromWei(balance, "ether")}{" "}
        ether!
      </p>
      <hr />
      <form
        onSubmit={ onSubmit}
      >
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input 
            value={value}
            onChange={(e) => setValue(e.target.value  )} 
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>  
    </div>
  );
}

export default App;
