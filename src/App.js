import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoABI from "./abis/Todo.json";
import MyTokenABI from "./abis/MyToken.json";
import StakingABI from "./abis/Staking.json";

const todoAddress = "YOUR_TODO_CONTRACT_ADDRESS";  // Replace with deployed address
const tokenAddress = "YOUR_TOKEN_CONTRACT_ADDRESS";  // Replace with deployed address
const stakingAddress = "YOUR_STAKING_CONTRACT_ADDRESS";  // Replace with deployed address

const App = () => {
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [todoContract, setTodoContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempTodoContract = new ethers.Contract(todoAddress, TodoABI, tempSigner);
      const tempTokenContract = new ethers.Contract(tokenAddress, MyTokenABI, tempSigner);
      const tempStakingContract = new ethers.Contract(stakingAddress, StakingABI, tempSigner);

      setProvider(tempProvider);
      setSigner(tempSigner);
      setTodoContract(tempTodoContract);
      setTokenContract(tempTokenContract);
      setStakingContract(tempStakingContract);

      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        setAccount(accounts[0]);
      });
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const addTask = async () => {
    if (newTask && todoContract) {
      await todoContract.addTask(newTask);
      fetchTasks();
    }
  };

  const fetchTasks = async () => {
    if (todoContract) {
      const taskList = await todoContract.getTasks();
      setTasks(taskList);
    }
  };

  const completeTask = async (taskId) => {
    if (todoContract) {
      await todoContract.completeTask(taskId);
      fetchTasks();
    }
  };

  const stakeTokens = async (amount) => {
    if (stakingContract && tokenContract) {
      await tokenContract.approve(stakingAddress, amount);
      await stakingContract.stake(amount);
    }
  };

  const withdrawTokens = async (amount) => {
    if (stakingContract) {
      await stakingContract.withdraw(amount);
    }
  };

  const claimReward = async () => {
    if (stakingContract) {
      await stakingContract.claimReward();
    }
  };

  useEffect(() => {
    if (todoContract) {
      fetchTasks();
    }
  }, [todoContract]);

  return (
    <div>
      <h1>Decentralized To-Do List</h1>
      <p>Account: {account}</p>

      <h2>Add Task</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter task description"
      />
      <button onClick={addTask}>Add Task</button>

      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.description} - {task.isCompleted ? "Completed" : "Pending"}</p>
          {!task.isCompleted && <button onClick={() => completeTask(task.id)}>Complete</button>}
        </div>
      ))}

      <h2>Token Staking</h2>
      <button onClick={() => stakeTokens(10)}>Stake 10 Tokens</button>
      <button onClick={() => withdrawTokens(10)}>Withdraw 10 Tokens</button>
      <button onClick={claimReward}>Claim Reward</button>
    </div>
  );
};

export default App;
