import { AddressZero } from "@ethersproject/constants";

import sdk from "./1-initialize-sdk.js";

const deployToken = async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: "Enjoy Hack Team Governance Token",
      symbol: "EHT",
      primary_sale_recipient: AddressZero,
    });
    console.log("Successfully deployed token module, address: ", tokenAddress);
  } catch (error) {
    console.error(error);
  }
};

deployToken();
