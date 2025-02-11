async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy MyToken contract (requires initial supply)
    const initialSupply = ethers.utils.parseUnits("1000000", 18);  // 1 million tokens, 18 decimals
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(initialSupply);
    console.log("MyToken contract deployed to:", myToken.address);

    // Deploy Staking contract (requires MyToken contract instance)
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(myToken.address);
    console.log("Staking contract deployed to:", staking.address);

    // Optionally deploy Todo contract (no constructor arguments)
    const Todo = await ethers.getContractFactory("Todo");
    const todo = await Todo.deploy();
    console.log("Todo contract deployed to:", todo.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
