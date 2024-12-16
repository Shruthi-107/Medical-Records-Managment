// const HealthCareRecords= artifacts.require("HealthCareRecords");

// module.exports=function(deployer){
//     deployer.deploy(HealthCareRecords);
// };

const HealthCareRecords = artifacts.require("HealthCareRecords");

module.exports = function (deployer) {
  deployer.deploy(HealthCareRecords).then(() => {
    console.log("Contract deployed at:", HealthCareRecords.address);
  });
};
