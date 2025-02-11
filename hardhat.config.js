require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.28",  // Specify the exact Solidity version used in your contract
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // For Hardhat local network
    },
  },
};
