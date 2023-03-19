import sdk from "./1-initialize-sdk.js";

const airropToken = async () => {
  const editionDrop = await sdk.getContract(
    "0x5343a3EC218Da8208fE4F7DaE9d08BbD26ecE869",
    "edition-drop"
  );
  const token = await sdk.getContract(
    "0x30Bf07924F01992844c201D01a279AD20f3095b3",
    "token"
  );

  try {
    // Get all addresses of membership token holders
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      );
      process.exit(0);
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("Gong to airdrop", randomAmount, "token to " + address);

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("Successfully aridrop tokens to all the holders of the NFT!");
  } catch (error) {
    console.error(error);
  }
};

airropToken();
