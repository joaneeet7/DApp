const notas = artifacts.require("notas");

module.exports = function (deployer) {
  deployer.deploy(notas);
};
