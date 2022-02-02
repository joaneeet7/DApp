const main = artifacts.require("main");

module.exports = function(deployer) {
  deployer.deploy(main);
};
