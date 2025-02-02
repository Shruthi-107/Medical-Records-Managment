// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    struct Prescription {
        uint256 id;
        address doctor;
        address patient;
        string encryptedData;  // Encrypted prescription details
        string timings;
        uint256 durationDays;
        string comments;
        uint256 timestamp;
    }

    mapping(uint256 => Prescription) public prescriptions;
    uint256 public prescriptionCount;

    event PrescriptionAdded(uint256 indexed id, address indexed doctor, address indexed patient, string timings, uint256 durationDays, string comments);

    // Add a new prescription (Only Doctors)
    function addPrescription(address _patient, string memory _encryptedData, string memory _timings, uint256 _days, string memory _comments) public {
        prescriptionCount++;
        prescriptions[prescriptionCount] = Prescription(
            prescriptionCount,
            msg.sender, 
            _patient, 
            _encryptedData, 
            _timings, 
            _days, 
            _comments, 
            block.timestamp
        );
        
        emit PrescriptionAdded(prescriptionCount, msg.sender, _patient, _timings, _days, _comments);
    }

    // Retrieve a prescription (Only Doctor or Patient)
    function getPrescription(uint256 _id) public view returns (uint256, address, address, string memory, string memory, uint256, string memory, uint256) {
        require(prescriptions[_id].patient == msg.sender || prescriptions[_id].doctor == msg.sender, "Unauthorized access");
        
        Prescription memory pres = prescriptions[_id];
        return (pres.id, pres.doctor, pres.patient, pres.encryptedData, pres.timings, pres.durationDays, pres.comments, pres.timestamp);
    }

    // Retrieve all prescriptions for a patient
    function getAllPrescriptions(address _patient) public view returns (Prescription[] memory) {
        Prescription[] memory result = new Prescription[](prescriptionCount);
        uint count = 0;
        
        for (uint i = 1; i <= prescriptionCount; i++) {
            if (prescriptions[i].patient == _patient) {
                result[count] = prescriptions[i];
                count++;
            }
        }

        // Resize the array to remove empty slots
        assembly { mstore(result, count) }
        return result;
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
// =====================

//    Replacing 'MedicalRecords'
//    --------------------------
//    > transaction hash:    0x4f0873553926d628d36d348d76715ffd2a07717be903fa98a925a950a178ec59
//    > Blocks: 0            Seconds: 0
//    > contract address:    0x64f98B76838360DFd607225eD09F7a5c35D70810
//    > block number:        4
//    > block timestamp:     1738505578
//    > account:             0xD4C0A1665BbB867EF1B2BEE8Df536fE563b5A425
//    > balance:             99.990577304825504209
//    > gas used:            1286175 (0x13a01f)
//    > gas price:           3.131836377 gwei
//    > value sent:          0 ETH
//    > total cost:          0.004028089652187975 ETH

//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.004028089652187975 ETH

// Summary
// =======
// > Total deployments:   1
// > Final cost:          0.004028089652187975 ETH