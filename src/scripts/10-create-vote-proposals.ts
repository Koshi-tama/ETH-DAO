import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteProposal = async () => {
  const vote = await sdk.getContract(
    "0x2158b23ABda3962B8a7c7C9be909dB2d848bfda9",
    "vote"
  );
  const token = await sdk.getContract(
    "0x30Bf07924F01992844c201D01a279AD20f3095b3",
    "token"
  );

  try {
    // Create a proposal to mint new tokens
    const amount = 420_000;
    const description =
      "Should the DAO mint an additional " +
      amount +
      " tokens into the treasury?";
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);
    console.log("Successfully created proposal to mint tokens");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    const description =
      "Should the DAO transfer " +
      amount +
      " tokens from the treasury to " +
      process.env.WALLET_ADDRESS +
      " for being awesome?";

    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("transfer", [
          process.env.WALLET_ADDRESS!,
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);
    console.log(
      "Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.log(error);
  }
};

voteProposal();
