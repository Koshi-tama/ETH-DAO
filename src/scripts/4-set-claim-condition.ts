import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const setClimeConditions = async () => {
  const claimConditions = [
    {
      startTime: new Date(),
      maxQuantity: 50_000,
      price: 0,
      quantityLimitPerTransaction: 1,
      waitInSeconds: MaxUint256,
    },
  ];

  const editionDrop = await sdk.getContract(
    "0x5343a3EC218Da8208fE4F7DaE9d08BbD26ecE869",
    "edition-drop"
  );

  try {
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("Succcess set claim condition.");
  } catch (error) {
    console.error("Failed to set claim condition " + error);
  }
};

setClimeConditions();
