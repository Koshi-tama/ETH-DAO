import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const createNFT = async () => {
  const editionDrop = await sdk.getContract(
    "0x5343a3EC218Da8208fE4F7DaE9d08BbD26ecE869",
    "edition-drop"
  );

  try {
    await editionDrop.createBatch([
      {
        name: "Member's Limited Hacker Coin",
        description:
          "This is a limited item that allows you to participate in the Enjoy Hack Team.",
        image: readFileSync("src/scripts/assets/NFT.png"),
      },
    ]);
    console.log("Successfully created a new NFT in the drop.");
  } catch (error) {
    console.error("failed to create the new NFT " + error);
  }
};

createNFT();
