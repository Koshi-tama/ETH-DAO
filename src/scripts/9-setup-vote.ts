import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import sdk from "./1-initialize-sdk.js";

const setupVote = async () => {
  const vote = await sdk.getContract(
    "0x2158b23ABda3962B8a7c7C9be909dB2d848bfda9",
    "vote"
  );
  const token = await sdk.getContract(
    "0x30Bf07924F01992844c201D01a279AD20f3095b3",
    "token"
  );

  try {
    await token.roles.grant("minter", vote.getAddress());
    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS!
    );

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent99 = (Number(ownedAmount) / 100) * 99;

    await token.transfer(vote.getAddress(), percent99);

    console.log(
      "Successfully transferd " + percent99 + " tokens to vote contract"
    );
  } catch (error) {
    console.log(error);
  }
};

setupVote();
