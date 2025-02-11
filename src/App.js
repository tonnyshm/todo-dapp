import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoABI from "./abis/Todo.json";
import MyTokenABI from "./abis/MyToken.json";
import StakingABI from "./abis/Staking.json";

const todoAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";  // Replace with deployed address
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";  // Replace with deployed address
const stakingAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";  // Replace with deployed address

const App = () => {
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [todoContract, setTodoContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state for transaction feedback

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
      setLoading(true);  // Set loading to true when transaction is sent
      try {
        await todoContract.addTask(newTask);
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
      setLoading(false);  // Set loading to false after transaction is done
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
      setLoading(true);  // Set loading to true when transaction is sent
      try {
        await todoContract.completeTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error("Error completing task:", error);
      }
      setLoading(false);  // Set loading to false after transaction is done
    }
  };

  const stakeTokens = async (amount) => {
    if (stakingContract && tokenContract) {
      setLoading(true);  // Set loading to true when transaction is sent
      try {
        await tokenContract.approve(stakingAddress, amount);
        await stakingContract.stake(amount);
      } catch (error) {
        console.error("Error staking tokens:", error);
      }
      setLoading(false);  // Set loading to false after transaction is done
    }
  };

  const withdrawTokens = async (amount) => {
    if (stakingContract) {
      setLoading(true);  // Set loading to true when transaction is sent
      try {
        await stakingContract.withdraw(amount);
      } catch (error) {
        console.error("Error withdrawing tokens:", error);
      }
      setLoading(false);  // Set loading to false after transaction is done
    }
  };

  const claimReward = async () => {
    if (stakingContract) {
      setLoading(true);  // Set loading to true when transaction is sent
      try {
        await stakingContract.claimReward();
      } catch (error) {
        console.error("Error claiming reward:", error);
      }
      setLoading(false);  // Set loading to false after transaction is done
    }
  };

  useEffect(() => {
    if (todoContract) {
      fetchTasks();
    }

    // Listen for staking contract events (e.g., Withdrawals)
    if (stakingContract) {
      stakingContract.on("Withdrawal", (amount, when) => {
        console.log(`Withdrawn ${amount} at ${when}`);
        alert(`You have withdrawn ${ethers.utils.formatUnits(amount, 18)} tokens at ${new Date(when * 1000)}`);
      });
    }

    return () => {
      // Cleanup the event listener
      if (stakingContract) {
        stakingContract.off("Withdrawal");
      }
    };
  }, [todoContract, stakingContract]);

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
      <button onClick={addTask} disabled={loading}>
        {loading ? "Adding Task..." : "Add Task"}
      </button>

      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.description} - {task.isCompleted ? "Completed" : "Pending"}</p>
          {!task.isCompleted && <button onClick={() => completeTask(task.id)} disabled={loading}>Complete</button>}
        </div>
      ))}

      <h2>Token Staking</h2>
      <button onClick={() => stakeTokens(10)} disabled={loading}>
        {loading ? "Staking..." : "Stake 10 Tokens"}
      </button>
      <button onClick={() => withdrawTokens(10)} disabled={loading}>
        {loading ? "Withdrawing..." : "Withdraw 10 Tokens"}
      </button>
      <button onClick={claimReward} disabled={loading}>
        {loading ? "Claiming Reward..." : "Claim Reward"}
      </button>

      {loading && <p>Transaction in progress...</p>}
    </div>
  );
};

export default App;
