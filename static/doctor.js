
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
