const SpaceSecurityLogger = artifacts.require("SpaceSecurityLogger");

module.exports = function (deployer) {
  deployer.deploy(SpaceSecurityLogger);
};