let ToDo = artifacts.require("./ToDoApp.sol")

module.exports = function (deployer) {
    deployer.deploy(ToDo)
}