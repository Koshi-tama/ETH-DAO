import sdk from "./1-initialize-sdk.js";

const deployVote = async () => {
  try {
    const voteCOntractAddress = await sdk.deployer.deployVote({
      name: "Vote",
      voting_token_address: "0x30Bf07924F01992844c201D01a279AD20f3095b3",
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });
    console.log(
      "Successfully deployed vote contract, address:",
      voteCOntractAddress
    );
  } catch (error) {
    console.error(error);
  }
};

deployVote();
