import sdk from "./1-initialize-sdk.js";

const initToken = async () => {
  const token = await sdk.getContract(
    "0x30Bf07924F01992844c201D01a279AD20f3095b3",
    "token"
  );

  try {
    const amount = 1000000;
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    console.log(
      "There now is ",
      totalSupply.displayValue,
      "$EHT in circulation"
    );
  } catch (error) {
    console.error(error);
  }
};

initToken();
