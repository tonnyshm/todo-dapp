async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Todo = await ethers.getContractFactory("Todo");
    const todo = await Todo.deploy();
    console.log("Todo contract deployed to:", todo.address);
  
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    console.log("MyToken contract deployed to:", myToken.address);
  
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();
    console.log("Staking contract deployed to:", staking.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  