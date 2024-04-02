var Election = artifacts.require("./Election.sol");
const myAddress = "0x1c0A9E387c75230e5adA2ddaB3802F10D1d50317";
module.exports = function (deployer) {
  deployer.deploy(Election, myAddress);
};
