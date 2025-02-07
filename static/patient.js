const patientprofile = document.getElementById('patient-profile');
const requestAppointment = document.getElementById('request-appointment');
const patientappointments = document.getElementById('patient-appointments');
const logout = document.getElementById('logout');
const content = document.getElementById('content');

// Fetch data and dynamically populate forms
function fetchDepartmentsAndDoctors() {
    return fetch('/test-db')
        .then(response => response.json())
        .then(data => ({
            departments: data.departments || [],
            doctors: data.doctors || [],
            patients: data.patients || [],
        }))
        .catch(err => console.error('Error fetching data:', err));
}

// Fetch data for the doctor dashboard
function fetchPatientData(route) {
    return fetch(route)
        .then(response => response.json())
        .catch(err => console.error('Error fetching data:', err));
}

// Display patient's profile
patientprofile.addEventListener('click', () => {
    // Prompt patient for their private key
    const privateKey = prompt("Enter your private key to decrypt prescriptions:");

    if (!privateKey) {
        alert("Private key is required to decrypt prescriptions.");
        return;
    }

    // Send private key along with the request
    fetch(apiRoutes.patientprofile, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ private_key: privateKey }) // Send private key
    })
    .then(response => response.json()).then(data => {
        console.log(data); // Debug: log the fetched data
        if (data.success) {
            const profile = data['patient-profile']; // Extract the "patient-profile" object
            content.innerHTML = `
            <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                <legend style="text-align: center;color:#fe4066"><h1>My Profile</h1></legend><br>
                <table cellspacing="15px">
                        <tr>
                            <td><label for="name"><strong>Name:</strong></label></td>
                            <td><p> ${profile.name}</p></td>
                        </tr>
                        <tr>
                            <td><label for="email"><strong>Email:</strong></label></td>
                            <td><p> ${profile.email}</p></td>
                        </tr>
                        <tr>
                            <td><label for="department"><strong>Department:</strong></label></td>
                            <td><p>${profile.department}</p></td>
                        </tr>
                        <tr>
                            <td><label for="phone"><strong>Phone:</strong></label></td>
                            <td><p>${profile.phone}</p></td>
                        </tr>
                </table>
            </fieldset>

            <br>
                        <br>
                        <br>
                        
                        <h2 style="color:#fe4066">Prescriptions</h2>
                        <table style="border:3px solid #fe4066; border-collapse: collapse;">
                            <thead>
                                <tr style="border:3px solid #fe4066">
                                    <th style="border:3px solid #fe4066; padding:10px">Medicine</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Timings</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Days</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Date Issued</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Comments</th>
                                </tr>
                            </thead>
                            <tbody id="prescriptions-body">
                                ${data.prescriptions.map(prescription => ` 
                                    <tr style="border:3px solid #fe4066">
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.medication}</td>
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.timings}</td>
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.days}</td>
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.timestamp}</td>
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.comments}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

            `;
        } else {
            content.innerHTML = `
                <h2>My Profile</h2>
                <p>Error: ${data.message}</p>
            `;
        }
    }).catch(err => {
        console.error('Error fetching profile data:', err);
        content.innerHTML = `
            <h2>My Profile</h2>
            <p>Error fetching profile data. Please try again later.</p>
        `;
    });
});



// // Display patients assigned to the doctor
// mypatients.addEventListener('click', () => {
//     fetchDoctorData(apiRoutes.mypatients)
//         .then(data => {
//             console.log(data)
//             if (data.success && Array.isArray(data['my-patients'])) {
//                 const patientRows = data['my-patients']//.patients
//                     .map(
//                         patient => `
//                         <tr style="border:3px solid #fe4066">
//                             <td style="border:3px solid #fe4066; padding:10px">${patient.id}</td>
//                             <td style="border:3px solid #fe4066; padding:10px">${patient.name}</td>
//                             <td style="border:3px solid #fe4066; padding:10px">${patient.email}</td>
//                             <td style="border:3px solid #fe4066; padding:10px">${patient.phone}</td>
//                         </tr>
//                     `
//                     )
//                     .join('');

//                 content.innerHTML = `
//                     <h2>Assigned Patients</h2>
//                     <table style="border:3px solid #fe4066;border-collapse: collapse;">
//                         <thead>
//                             <tr style="border:3px solid #fe4066">
//                                 <th style="border:3px solid #fe4066; padding:10px">ID</th>
//                                 <th style="border:3px solid #fe4066; padding:10px">Name</th>
//                                 <th style="border:3px solid #fe4066; padding:10px">Email</th>
//                                 <th style="border:3px solid #fe4066; padding:10px">Phone</th>
//                             </tr>
//                         </thead>
//                         <tbody>${patientRows}</tbody>
//                     </table>
//                 `;
//             } else {
//                 content.innerHTML = `
//                     <h2>Assigned Patients</h2>
//                     <p>No patients found.</p>
//                 `;
//             }
//         })
//         .catch(err => {
//             console.error('Error fetching patients:', err);
//             content.innerHTML = `
//                 <h2>Assigned Patients</h2>
//                 <p>Error fetching patients. Please try again later.</p>
//             `;
//         });
// });

// Book appointment
// requestAppointment.addEventListener('click', () => {
//     fetchDepartmentsAndDoctors().then(({ doctors, patients,departments }) => {
//         content.innerHTML = `
//              <form id="request-appointment-form" action="${apiRoutes.requestAppointment}" method="post" style="display: flex; justify-content: center;">
//                 <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
//                     <legend style="text-align: center;color:#fe4066"><h2>Request Appointment</h2></legend>
//                     <table cellspacing="15px">
//                         <tr>
//                             <td><label for="patient_id"><strong>Patient:</strong></label></td>
//                             <td><select name="patient_id" id="patient_id" required>
//                                 <option value="" disabled selected>--</option>
//                                 ${patients.map(pat => `<option value="${pat.id}">${pat.name}</option>`).join('')}
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td><label for="department_id"><strong>Department:</strong></label></td>
//                             <td>
//                                 <select name="department_id" id="department_id" required>
//                                     <option value="" disabled selected>--</option>
//                                     ${departments.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td><label for="date"><strong>Date and Time:</strong></label></td>
//                             <td><input type="datetime-local" name="date" id="date" required></td>
//                         </tr>
//                         <tr>
//                             <td><label for="doctor_id"><strong>Doctor:</strong></label></td>
//                             <td><select name="doctor_id" id="doctor_id" required>
//                                 <option value="" disabled selected>---------</option>
//                                 <!--${doctors.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('')}-->
//                                 </select>
//                             </td>
//                         </tr>
                        
//                     </table>
//                     <br>
//                     <input type="submit" value="Submit" style="margin-left: 100px;">
//                     <input type="reset" value="Reset" style="margin-left: 190px;">
//                 </fieldset>
//             </form>
//         `;

//         // Add event listener to department dropdown
//         const departmentDropdown = document.getElementById('department_id');
//         const doctorDropdown = document.getElementById('doctor_id');

//         departmentDropdown.addEventListener('change', function () {
//             const selectedDepartmentId = this.value;

//             // Filter doctors based on selected department
//             const filteredDoctors = doctors.filter(doc => doc.department_id == selectedDepartmentId);

//             // Update the doctor dropdown
//             doctorDropdown.innerHTML = `
//                 <option value="" disabled selected>Select Doctor</option>
//                 ${filteredDoctors.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('')}
//             `;
//         });
//     });
// });
requestAppointment.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ doctors, departments }) => {
        content.innerHTML = `
             <form id="request-appointment-form" action="/request-appointment" method="POST" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                    <legend style="text-align: center;color:#fe4066"><h2>Request Appointment</h2></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="department_id"><strong>Department:</strong></label></td>
                            <td>
                                <select name="department_id" id="department_id" required>
                                    <option value="" disabled selected>--</option>
                                    ${departments.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="date"><strong>Date and Time:</strong></label></td>
                            <td><input type="datetime-local" name="date" id="date" required></td>
                        </tr>
                        <tr>
                            <td><label for="doctor_id"><strong>Doctor:</strong></label></td>
                            <td>
                                <select name="doctor_id" id="doctor_id" required>
                                    <option value="" disabled selected>---------</option>
                                </select>
                            </td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;

        // Add event listener to department dropdown
        const departmentDropdown = document.getElementById('department_id');
        const doctorDropdown = document.getElementById('doctor_id');

        departmentDropdown.addEventListener('change', function () {
            const selectedDepartmentId = this.value;
            const selectedTime = document.getElementById('date').value;

            // Fetch available doctors based on department and time
            if (selectedDepartmentId && selectedTime) {
                fetch('/get-available-doctors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        department_id: selectedDepartmentId,
                        selected_time: selectedTime,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            const availableDoctors = data.available_doctors;
                            doctorDropdown.innerHTML = `
                                <option value="" disabled selected>Select Doctor</option>
                                ${availableDoctors
                                    .map((doc) => `<option value="${doc.id}">${doc.name}</option>`)
                                    .join('')}
                            `;
                        } else {
                            doctorDropdown.innerHTML = `<option value="" disabled selected>No doctors available</option>`;
                        }
                    })
                    .catch((err) =>
                        console.error('Error fetching available doctors:', err)
                    );
            }
        });

        // Add event listener to update doctors on date change
        document.getElementById('date').addEventListener('change', function () {
            const selectedDepartmentId = departmentDropdown.value;
            const selectedTime = this.value;

            if (selectedDepartmentId && selectedTime) {
                departmentDropdown.dispatchEvent(new Event('change'));
            }
        });
    });
});


// Display appointments
patientappointments.addEventListener('click', () => {
    fetchPatientData(apiRoutes.patientappointments).then(data => {
        console.log(data); // Debugging
        if (data.success && Array.isArray(data['patient-appointments'])) {
            const appointmentRows = data['patient-appointments']
                .map(
                    appt => `
                    <tr style="border:3px solid #fe4066">
                        <td style="border:3px solid #fe4066; padding:10px">${appt.id}</td>
                        <td style="border:3px solid #fe4066; padding:10px">${appt.doctor_name}</td>
                        <td style="border:3px solid #fe4066; padding:10px">${appt.date}</td>
                        <td style="border:3px solid #fe4066; padding:10px">${appt.status}</td>
                    </tr>
                `
                )
                .join('');

            content.innerHTML = `
                <h2>Appointments</h2>
                <table style="border:3px solid #fe4066;border-collapse: collapse;">
                    <thead>
                        <tr style="border:3px solid #fe4066">
                            <th style="border:3px solid #fe4066; padding:10px">ID</th>
                            <th style="border:3px solid #fe4066; padding:10px">Doctor Name</th>
                            <th style="border:3px solid #fe4066; padding:10px">Date</th>
                            <th style="border:3px solid #fe4066; padding:10px">Status</th>
                        </tr>
                    </thead>
                    <tbody>${appointmentRows}</tbody>
                </table>
            `;
        } else {
            content.innerHTML = `
                <h2>Appointments</h2>
                <p>No appointments found.</p>
            `;
        }
    }).catch(err => {
        console.error('Error fetching appointments:', err);
        content.innerHTML = `
            <h2>Appointments</h2>
            <p>Error fetching appointments. Please try again later.</p>
        `;
    });
});



// Logout functionality
logout.addEventListener('click', () => {
    fetch(apiRoutes.logout, { method: 'POST' })
        .then(() => {
            alert('Logged out successfully!');
            window.location.href = '/';
        })
        .catch(err => console.error('Error during logout:', err));
});

// Function to handle form submission using fetch
function submitForm(formId, route) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found!`);
        return;
    }
    console.log(`Form submission initialized for route: ${route}`);
    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent the default form submission
        const formData = new FormData(form);
        
        fetch(route, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Data submitted successfully!');
            window.location.reload();  // Reload the page to show updated data
        })
        .catch(error => console.error('Error:', error));
    });
}

// Call the submitForm function for Add Doctor and Add Patient forms
// submitForm('patient-profile-form', '/patient-profile');
// submitForm('my-patients-form', '/my-patient');
submitForm('request-appointment-form', '/request-appointment');
// submitForm('logout-form', '/logout');
