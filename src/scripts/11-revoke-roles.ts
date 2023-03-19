import sdk from "./1-initialize-sdk.js";

const updateRole = async () => {
  const token = await sdk.getContract(
    "0x30Bf07924F01992844c201D01a279AD20f3095b3",
    "token"
  );

  try {
    const allRoles = await token.roles.getAll();

    console.log("Roles that exist right now: " + allRoles);

    await token.roles.setAll({ admin: [], minter: [] });
    console.log("Roles after revoking ourseleves", await token.roles.getAll());
    console.log(
      "Succcessfully revoked our superpowers from the ERC-20 contract"
    );
  } catch (error) {
    console.error(error);
  }
};

updateRole();
