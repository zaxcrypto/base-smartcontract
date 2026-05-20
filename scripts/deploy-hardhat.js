import hre from "hardhat";
import fs from "fs";

async function main() {
  const privateKey = fs.readFileSync("key.txt", "utf8").trim();
  const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);

  console.log("Deploying contracts with the account:", wallet.address);

  const factory = await hre.ethers.getContractFactory("BaseTokenFactory", wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("BaseTokenFactory deployed to:", address);

  // Update .env.local
  let envConfig = fs.readFileSync(".env.local", "utf8");
  envConfig = envConfig.replace(
    /NEXT_PUBLIC_FACTORY_ADDRESS=.*/,
    `NEXT_PUBLIC_FACTORY_ADDRESS=${address}`
  );
  fs.writeFileSync(".env.local", envConfig);
  console.log("Updated .env.local with new factory address");
  
  // Delete key.txt for security
  fs.unlinkSync("key.txt");
  console.log("Deleted key.txt securely");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
