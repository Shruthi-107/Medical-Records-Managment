
// // Get content area
// const content = document.getElementById('content');
const myprofile = document.getElementById('my-profile');
const mypatients = document.getElementById('my-patients');
const myappointments = document.getElementById('my-appointments');
const logout = document.getElementById('logout');
const content = document.getElementById('content');

// Fetch data and dynamically populate forms
// function fetchDepartmentsAndDoctors() {
//     return fetch('/test-db')
//         .then(response => response.json())
//         .then(data => ({
//             departments: data.departments || [],
//             doctors: data.doctors || [],
//         }))
//         .catch(err => console.error('Error fetching data:', err));
// }

// Fetch data for the doctor dashboard
function fetchDoctorData(route) {
    return fetch(route)
        .then(response => response.json())
        .catch(err => console.error('Error fetching data:', err));
}

// Display doctor's profile
myprofile.addEventListener('click', () => {
    fetchDoctorData(apiRoutes.myprofile).then(data => {
        console.log(data); // Debug: log the fetched data
        if (data.success) {
            const profile = data['my-profile']; // Extract the "my-profile" object
            content.innerHTML = `
            <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                <legend style="text-align: center;color:#fe4066"><h1>My Profile</h1></legend>
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


// add prescription
function attachAddPrescriptionHandler() {
    const form = document.getElementById('add-prescription-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch('/doctor/add-prescription', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Prescription added successfully!');
                form.reset();
                // Optionally reload the patient's details to show updated prescriptions
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => console.error('Error:', err));
    });
}

//history page
content.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('history-button')) {
        const patientId = e.target.getAttribute('data-id');

        fetch(`/doctor/get-history/${patientId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // ✅ Fix: Make sure `data.patient` exists before using it
                    if (!data.patient) {
                        alert('Patient details not found!');
                        return;
                    }

                    const patient = data.patient;
                    let historyContent = `
                        <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                            <legend style="text-align: center;color:#fe4066"><h2>Patient Profile</h2></legend>
                            <table cellspacing="15px">
                                <tr><td><strong>Name:</strong></td><td>${patient.name}</td></tr>
                                <tr><td><strong>Phone:</strong></td><td>${patient.phone}</td></tr>
                                <tr><td><strong>Email:</strong></td><td>${patient.email}</td></tr>
                                <tr><td><strong>Comment:</strong></td><td>${patient.comment || "No comment provided"}</td></tr>
                            </table>
                        </fieldset>
                        <br>
                        <br>
                        <br>
                        <br>
                        <h2 style="color:#fe4066;">Prescription History</h2>
                        <table style="border:3px solid #fe4066;border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border:3px solid #fe4066; padding:10px">Medicine</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Timings</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Days</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Doctor</th>
                                    <th style="border:3px solid #fe4066; padding:10px">Issued Date</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    // Append prescriptions
                    data.prescriptions.forEach(prescription => {
                        historyContent += `
                            <tr style="border:3px solid #fe4066">
                                <td style="border:3px solid #fe4066; padding:10px">${prescription.medication}</td>
                                <td style="border:3px solid #fe4066; padding:10px">${prescription.timings}</td>
                                <td style="border:3px solid #fe4066; padding:10px">${prescription.days}</td>
                                <td style="border:3px solid #fe4066; padding:10px">${prescription.doctor || "Unknown"}</td>
                                <td style="border:3px solid #fe4066; padding:10px">${new Date(prescription.timestamp * 1000).toLocaleString()}</td>
                            </tr>
                        `;
                    });

                    historyContent += `</tbody></table>`;
                    content.innerHTML = historyContent;
                } else {
                    alert('Error fetching Prescription History: ' + data.message);
                }
            })
            .catch(err => console.error('Error fetching Prescription History:', err));
    }
});


// prescription page
content.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('more-button')) {
        const patientId = e.target.getAttribute('data-id');
        fetch(`/doctor/patient-details/${patientId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Display patient details
                    const patient = data.patient;
                    content.innerHTML = `
                        <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                            <legend style="text-align: center;color:#fe4066"><h2>Patient Profile</h2></legend>
                            <table cellspacing="15px">
                                    <tr>
                                        <td><label for="name"><strong>Name:</strong></label></td>
                                        <td><p> ${patient.name}</p></td>
                                    </tr>
                                    <tr>
                                        <td><label for="phn"><strong>Phone:</strong></label></td>
                                        <td><p> ${patient.phone}</p></td>
                                    </tr>
                                    <tr>
                                        <td><label for="email"><strong>Email:</strong></label></td>
                                        <td><p> ${patient.email}</p></td>
                                    </tr>
                                    <tr>
                                        <td><label for="comment"><strong>Comment:</strong></label></td>
                                        <td><p>${patient.comment}</p></td>
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
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.date_issued}</td>
                                        <td style="border:3px solid #fe4066; padding:10px">${prescription.comments}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <br>
                        <br>
                        <br>
                        <form id="add-prescription-form" action="/add-prescription" method="post" style="display: flex; justify-content: center;">
                        <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                        <legend style="text-align: center;color:#fe4066"><h2>Add New Prescription</h2></legend><br>
                        <table cellspacing="15px" style="margin-left:20%;">
                            <tr>
                                <td><input type="hidden" name="patient_id" value="${patient.id}"></td>
                            </tr>
                            <tr>
                                <td><label for="medication">Medicine Name:</label></td>
                                <td><input type="text" name="medication" required></td>
                            </tr>
                            <tr>
                                <td><label for="timings">Timings:</label></td>
                                <td><input type="text" name="timings" required></td>
                            </tr>
                            <tr>  
                                <td><label for="days">Days:</label></td>
                                <td><input type="number" name="days" required></td>
                            </tr>
                            <tr>
                                <td><label for="comments">Comments:</label></td>
                                <td><textarea name="comments"></textarea></td>
                            </tr>
                        </table>
                        <br>
                        <button style="margin-left:30%;font-weight: bold;;border-radius: 40px;background: #fe4066;color: white;border: none;height:30px;width:200px" type="submit">Add Prescription</button>
                        </fieldset>
                        </form>
                    `;
                    attachAddPrescriptionHandler(); // Attach event listener for the prescription form
                } else {
                    alert('Error fetching patient details: ' + data.message);
                }
            })
            .catch(err => console.error('Error fetching patient details:', err));
    }
});




// Display patients assigned to the doctor
mypatients.addEventListener('click', () => {
    fetchDoctorData(apiRoutes.mypatients)
        .then(data => {
            console.log(data)
            if (data.success && Array.isArray(data['my-patients'])) {
                const patientRows = data['my-patients']//.patients
                    .map(
                        patient => `
                        <tr style="border:3px solid #fe4066">
                            <td style="border:3px solid #fe4066; padding:10px">${patient.id}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${patient.name}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${patient.email}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${patient.phone}</td>
                            <td style="border:3px solid #fe4066; padding:10px">
                                <button class="more-button" data-id="${patient.id}">More</button>
                                <button class="history-button" data-id="${patient.id}">History</button>
                            </td>
                        </tr>
                    `
                    )
                    .join('');

                content.innerHTML = `
                    <h2>Assigned Patients</h2>
                    <table style="border:3px solid #fe4066;border-collapse: collapse;">
                        <thead>
                            <tr style="border:3px solid #fe4066">
                                <th style="border:3px solid #fe4066; padding:10px">ID</th>
                                <th style="border:3px solid #fe4066; padding:10px">Name</th>
                                <th style="border:3px solid #fe4066; padding:10px">Email</th>
                                <th style="border:3px solid #fe4066; padding:10px">Phone</th>
                                <th style="border:3px solid #fe4066; padding:10px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>${patientRows}</tbody>
                    </table>
                `;
            } else {
                content.innerHTML = `
                    <h2>Assigned Patients</h2>
                    <p>No patients found.</p>
                `;
            }
        })
        .catch(err => {
            console.error('Error fetching patients:', err);
            content.innerHTML = `
                <h2>Assigned Patients</h2>
                <p>Error fetching patients. Please try again later.</p>
            `;
        });
});


// Display appointments
myappointments.addEventListener('click', () => {
    fetchDoctorData(apiRoutes.myappointments).then(data => {
        console.log(data); // Debugging
        if (data.success && Array.isArray(data['my-appointments'])) {
            const appointmentRows = data['my-appointments']
                .map(
                    appt => `
                    <tr style="border:3px solid #fe4066">
                        <td style="border:3px solid #fe4066; padding:10px">${appt.id}</td>
                        <td style="border:3px solid #fe4066; padding:10px">${appt.patient_name}</td>
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
                            <th style="border:3px solid #fe4066; padding:10px">Patient Name</th>
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
// function submitForm(formId, route) {
//     const form = document.getElementById(formId);
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();  // Prevent the default form submission
//         const formData = new FormData(form);
        
//         fetch(route, {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Data submitted successfully!');
//             window.location.reload();  // Reload the page to show updated data
//         })
//         .catch(error => console.error('Error:', error));
//     });
// }

// Call the submitForm function for Add Doctor and Add Patient forms
// submitForm('my-profile-form', '/my-profile');
// submitForm('my-patients-form', '/my-patients');
// submitForm('my-appointments-form', '/my-appointments');
// submitForm('logout-form', '/logout');
