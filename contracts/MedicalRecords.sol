// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    struct Prescription {
        uint256 id;
        address doctor;
        address patient;
        string encryptedData;  // Encrypted prescription details
        uint256 timestamp;
    }

    mapping(uint256 => Prescription) public prescriptions;
    uint256 public prescriptionCount;

    event PrescriptionAdded(uint256 indexed id, address indexed doctor, address indexed patient);

    // Add a new prescription (Only Doctors)
    function addPrescription(address _patient, string memory _encryptedData) public {
        prescriptionCount++;
        prescriptions[prescriptionCount] = Prescription(prescriptionCount, msg.sender, _patient, _encryptedData, block.timestamp);
        emit PrescriptionAdded(prescriptionCount, msg.sender, _patient);
    }

    // Retrieve a prescription (Only Doctor or Patient)
    function getPrescription(uint256 _id) public view returns (string memory) {
        require(prescriptions[_id].patient == msg.sender || prescriptions[_id].doctor == msg.sender, "Unauthorized access");
        return prescriptions[_id].encryptedData;
    }

    function getAllPrescriptions(address _patient) public view returns (Prescription[] memory) {
    Prescription[] memory patientPrescriptions = new Prescription[](prescriptionCount);
    uint256 count = 0;

    for (uint256 i = 1; i <= prescriptionCount; i++) {
        if (prescriptions[i].patient == _patient) {
            patientPrescriptions[count] = prescriptions[i];
            count++;
        }
    }
    return patientPrescriptions;
    }

}

// PS D:\Major_Project\practice2> truffle migrate --network development
   
// Compiling your contracts...
// ===========================
// > Compiling .\contracts\MedicalRecords.sol
// > Artifacts written to D:\Major_Project\practice2\build\contracts
// > Compiled successfully using:
//    - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang


// Starting migrations...
// ======================
// > Network name:    'development'
// > Network id:      5777
// > Block gas limit: 6721975 (0x6691b7)


// 2_deploy_contracts.js
// > Block gas limit: 6721975 (0x6691b7)


// 2_deploy_contracts.js

// 2_deploy_contracts.js
// 2_deploy_contracts.js
// =====================

//    Replacing 'MedicalRecords'
//    --------------------------
//    > transaction hash:    0x894e8ca38019011d360ebb320875eb5c2cfddd4057a36b9cea478a9cddd8e1df
//    > Blocks: 0            Seconds: 0
//    > contract address:    0x3E3C97c3dFA3aCEC357D07c461F9BbB274C4ef6E
//    > block number:        3
//    > block timestamp:     1738502753
//    > account:             0xD4C0A1665BbB867EF1B2BEE8Df536fE563b5A425
//    > balance:             99.994605394477692184
//    > gas used:            942208 (0xe6080)
//    > gas price:           3.194293577 gwei
//    > value sent:          0 ETH
//    > total cost:          0.003009688962598016 ETH

//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.003009688962598016 ETH

// Summary
// =======
//    Replacing 'MedicalRecords'
//    --------------------------
//    > transaction hash:    0x894e8ca38019011d360ebb320875eb5c2cfddd4057a36b9cea478a9cddd8e1df
//    > Blocks: 0            Seconds: 0
//    > contract address:    0x3E3C97c3dFA3aCEC357D07c461F9BbB274C4ef6E
//    > block number:        3
//    > block timestamp:     1738502753
//    > account:             0xD4C0A1665BbB867EF1B2BEE8Df536fE563b5A425
//    > balance:             99.994605394477692184
//    > gas used:            942208 (0xe6080)
//    > gas price:           3.194293577 gwei
//    > value sent:          0 ETH
//    > total cost:          0.003009688962598016 ETH

//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.003009688962598016 ETH

// Summary
// =======
//    > gas used:            942208 (0xe6080)
//    > gas price:           3.194293577 gwei
//    > value sent:          0 ETH
//    > total cost:          0.003009688962598016 ETH

//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.003009688962598016 ETH

// Summary
// =======
//    > Total cost:     0.003009688962598016 ETH

// Summary
// =======
// Summary
// =======
// =======
// > Total deployments:   1
// > Final cost:          0.003009688962598016 ETH