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

    struct LogEntry {
        uint256 id;
        address user;
        string role;
        string action;
        uint256 timestamp;
    }

    Prescription[] public prescriptions; // Dynamic array for prescriptions
    LogEntry[] public logs; // Dynamic array for logs

    event PrescriptionAdded(uint256 indexed id, address indexed doctor, address indexed patient, string timings, uint256 durationDays, string comments);
    event ActionLogged(uint256 indexed id, address indexed user, string role, string action, uint256 timestamp);

    // Add a new prescription (Only Doctors)
    function addPrescription(
        address _patient, 
        string memory _encryptedData, 
        string memory _timings, 
        uint256 _days, 
        string memory _comments
    ) public {
        uint256 prescriptionId = prescriptions.length; // ID is array index
        prescriptions.push(Prescription(
            prescriptionId,
            msg.sender, 
            _patient, 
            _encryptedData, 
            _timings, 
            _days, 
            _comments, 
            block.timestamp
        ));
        
        emit PrescriptionAdded(prescriptionId, msg.sender, _patient, _timings, _days, _comments);
    }

    // Retrieve a prescription (Only Doctor or Patient)
    function getPrescription(uint256 _id) public view returns (
        uint256, address, address, string memory, string memory, uint256, string memory, uint256
    ) {
        require(_id < prescriptions.length, "Invalid prescription ID");
        Prescription memory pres = prescriptions[_id];
        require(pres.patient == msg.sender || pres.doctor == msg.sender, "Unauthorized access");
        
        return (pres.id, pres.doctor, pres.patient, pres.encryptedData, pres.timings, pres.durationDays, pres.comments, pres.timestamp);
    }

    // Retrieve all prescriptions for a patient
    function getAllPrescriptions(address _patient) public view returns (Prescription[] memory) {
        uint256 count = 0;

        // Count how many prescriptions belong to the patient
        for (uint256 i = 0; i < prescriptions.length; i++) {
            if (prescriptions[i].patient == _patient) {
                count++;
            }
        }

        // Create a new array with the correct size
        Prescription[] memory result = new Prescription[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < prescriptions.length; i++) {
            if (prescriptions[i].patient == _patient) {
                result[index] = prescriptions[i];
                index++;
            }
        }

        return result;
    }

    // Log an action (Admin/Doctor)
    function logAction(address _user, string memory _role, string memory _action) public {
        uint256 logId = logs.length;
        logs.push(LogEntry(
            logId,
            _user,
            _role,
            _action,
            block.timestamp
        ));
        
        emit ActionLogged(logId, _user, _role, _action, block.timestamp);
    }

    // Retrieve all logs from blockchain
    function getAllLogs() public view returns (LogEntry[] memory) {
        return logs;
    }
}

