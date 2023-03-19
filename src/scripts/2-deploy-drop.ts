import { readFileSync } from "fs";
import { AddressZero } from "@ethersproject/constants";

import sdk from "./1-initialize-sdk.js";

const deployContract = async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "Enjoy Hack Team",
      description: "A DAO for Enjoy Hack Team",
      image: readFileSync("src/scripts/assets/editionaDropImg.png"),
      primary_sale_recipient: AddressZero,
    });

    const editionaDrop = await sdk.getContract(
      editionDropAddress,
      "edition-drop"
    );
    const metadata = await editionaDrop.metadata.get();

    console.log(
      "Successfully deployed editionalDrop contract, address:" +
        editionDropAddress
    );
    console.log("editinalDrop metadata: " + metadata);
  } catch (error) {
    console.error("failed to deploy editionDrop contract: " + error);
  }
};

deployContract();
