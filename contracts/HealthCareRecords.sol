// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//truffle migrate --reset
//const instance = await HealthCareRecords.deployed()
contract HealthcareRecords {
    address owner;
    struct Record {
        uint256 recordID;
        string patientName;
        string treatment;
        string diagnosis;
        uint256 timestamp;
    }

    // Stores patient records
    mapping(uint256 => Record[]) private patientRecords;

    // To check only defined people access
    mapping(address => bool) private authorizedProviders;

    // To control who can call the function
    modifier onlyOwner {
        require(msg.sender == owner, "Only the contract's owner is allowed to call it.");
        _;
    }

    modifier onlyAuthorizedProvider {
        require(authorizedProviders[msg.sender], "Sender is not a registered healthcare provider.");
        _;
    }

    // Who deploys contract he will be the owner
    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // Only owner can access
    function authorizedProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;
    }

    // Function to check if an address is authorized
    function isAuthorizedProvider(address provider) public view returns (bool) {
        return authorizedProviders[provider];
    }

    // Only authorized providers can access this function
    function addRecord(uint256 patientID, string memory patientName, string memory diagnosis, string memory treatment) public onlyAuthorizedProvider {
        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(Record(recordID, patientName, diagnosis, treatment, block.timestamp));
    }

    function getPatientRecords(uint256 patientID) public view onlyAuthorizedProvider returns (Record[] memory) {
        return patientRecords[patientID];
    }
}