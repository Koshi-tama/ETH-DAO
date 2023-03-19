import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import nextEnv from "@next/env";
import { ethers } from "ethers";

const { loadEnvConfig } = nextEnv;

//環境変数をenvファイルから取得する
const { PRIVATE_KEY, WALLET_ADDRESS, ALCHEMY_API_URL } = loadEnvConfig(
  process.cwd()
).combinedEnv;

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("PRIVATE_KEY not found");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("WALLET_ADDRESS not found");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("ALCHEMY_API_URL not found");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
  )
);

(async () => {
  try {
    if (!sdk || !("getSigner" in sdk)) return;
    const address = await sdk.getSigner()?.getAddress();
    console.log("SDK initialized by address: " + address);
  } catch (error) {
    console.error("Failed to get apps from the sdk ", error);
    process.exit(1);
  }
})();

export default sdk;
