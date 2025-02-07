// JavaScript to dynamically load content based on sidebar selection

// // Get content area
// const content = document.getElementById('content');
// JavaScript to dynamically load content based on sidebar selection

const addDoctor = document.getElementById('add-doctor');
const addPatient = document.getElementById('add-patient');
const removeDoctor = document.getElementById('remove-doctor');
const removePatient = document.getElementById('remove-patient');
const bookAppointment = document.getElementById('book-appointment');
const checkLogs = document.getElementById('check-logs');
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

// Add Doctor Form
addDoctor.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ departments }) => {
        content.innerHTML = `
            <form id="add-doctor-form" method="post" action="${apiRoutes.addDoctor}" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px; border: 5px solid #fe4066; border-radius: 25px;">
                    <legend style="text-align: center; color: #fe4066;"><h1>Add Doctor</h1></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="name">Name:</label></td>
                            <td><input type="text" name="name" required></td>
                        </tr>
                        <tr>
                            <td><label for="email">Email:</label></td>
                            <td><input type="email" name="email" required></td>
                        </tr>
                        <tr>
                            <td><label for="department">Department:</label></td>
                            <td>
                                <select name="department" id="department" required>
                                    ${departments.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="Phno">Phone:</label></td>
                            <td><input type="tel" name="Phno" required></td>
                        </tr>
                        <tr>
                            <td><label for="pwd">Password:</label></td>
                            <td><input type="password" name="pwd" required></td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;
        submitForm('add-doctor-form', apiRoutes.addDoctor);
    });
});

// Add Patient Form
addPatient.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ departments, doctors }) => {
        content.innerHTML = `
            <form id="add-patient-form" method="post" action="${apiRoutes.addPatient}" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px; border: 5px solid #fe4066; border-radius: 25px;">
                    <legend style="text-align: center; color: #fe4066;"><h1>Add Patient</h1></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="name">Name:</label></td>
                            <td><input type="text" name="name" required></td>
                        </tr>
                        <tr>
                            <td><label for="email">Email:</label></td>
                            <td><input type="email" name="email" required></td>
                        </tr>
                        <tr>
                            <td><label for="department">Department:</label></td>
                            <td>
                                <select name="department" id="department" required>
                                    ${departments.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="doctor_id">Assign Doctor:</label></td>
                            <td>
                                <select name="doctor_id" id="doctor_id" required>
                                    <option value="" disabled selected>Select Doctor</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="Phno">Phone:</label></td>
                            <td><input type="tel" name="Phno" required></td>
                        </tr>
                        <tr>
                            <td><label for="pwd">Password:</label></td>
                            <td><input type="password" name="pwd" required></td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;

        // Update Doctor dropdown when department is selected
        const departmentDropdown = document.getElementById('department');
        const doctorDropdown = document.getElementById('doctor_id');

        departmentDropdown.addEventListener('change', function () {
            const selectedDepartmentId = this.value;
            const filteredDoctors = doctors.filter(doc => doc.department_id == selectedDepartmentId);
            doctorDropdown.innerHTML = `<option value="" disabled selected>Select Doctor</option>
                ${filteredDoctors.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('')}
            `;
        });

        submitForm('add-patient-form', apiRoutes.addPatient);
    });
});

// Check Logs Page
checkLogs.addEventListener('click', () => {
    fetch(apiRoutes.checkLogs)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let logsTable = `
                    <h2>System Logs</h2>
                    <table style="border:3px solid #fe4066; border-collapse: collapse;">
                        <thead>
                            <tr style="border:3px solid #fe4066;">
                                <th style="border:3px solid #fe4066; padding:10px">ID</th>
                                <th style="border:3px solid #fe4066; padding:10px">User</th>
                                <th style="border:3px solid #fe4066; padding:10px">Role</th>
                                <th style="border:3px solid #fe4066; padding:10px">Action</th>
                                <th style="border:3px solid #fe4066; padding:10px">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.logs.forEach(log => {
                    logsTable += `
                        <tr style="border:3px solid #fe4066;">
                            <td style="border:3px solid #fe4066; padding:10px">${log.id}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${log.user}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${log.role}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${log.action}</td>
                            <td style="border:3px solid #fe4066; padding:10px">${new Date(log.timestamp * 1000).toLocaleString()}</td>
                        </tr>
                    `;
                });

                logsTable += `</tbody></table>`;
                content.innerHTML = logsTable;
            } else {
                alert("Error fetching logs: " + data.message);
            }
        })
        .catch(err => console.error('Error fetching logs:', err));
});


// Remove Doctor form submission
removeDoctor.addEventListener('click', () => {
    content.innerHTML = `
        <form id="remove-doctor-form" method="POST" action="/remove-doctor">
             <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                    <legend style="text-align: center;color:#fe4066"><h2>Remove Doctor</h2></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="doctorId">Doctor ID:</label></td>
                            <td><input type="text" id="doctorId" name="doctorId" required></td>
                        </tr>
                    </table>
                    <br>
                    <button type="submit" style="margin-left: 30%;">Remove Doctor</button>
             </fieldset>
        </form>
    `;
    submitForm('remove-doctor-form', apiRoutes.removeDoctor);
});

// Remove Patient form submission
// removePatient.addEventListener('click', () => {
//     content.innerHTML = `
//         <form id="remove-patient-form" method="POST" action="/remove-patient">
//             <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
//                 <legend style="text-align: center;color:#fe4066"><h2>Remove Patient</h2></legend>
//                 <table cellspacing="15px">
//                         <tr>
//                             <td><label for="patientId">Patient ID:</label></td>
//                             <td><input type="text" id="patientId" name="patientId" required></td>
//                 </table>
//                 <br>
//                 <button type="submit" style="margin-left: 30%;">Remove Patient</button>
//             </fieldset>
//         </form>
//     `;
// });

// Book appointment
bookAppointment.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ doctors, patients,departments }) => {
        content.innerHTML = `
             <form id="book-appointment-form" action="${apiRoutes.bookAppointment}" method="post" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                    <legend style="text-align: center;color:#fe4066"><h2>Book Appointment</h2></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="patient_id"><strong>Patient:</strong></label></td>
                            <td><select name="patient_id" id="patient_id" required>
                                <option value="" disabled selected>--</option>
                                ${patients.map(pat => `<option value="${pat.id}">${pat.name}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
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
                            <td><label for="doctor_id"><strong>Doctor:</strong></label></td>
                            <td><select name="doctor_id" id="doctor_id" required>
                                <option value="" disabled selected>---------</option>
                                <!--${doctors.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('')}-->
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="date"><strong>Date and Time:</strong></label></td>
                            <td><input type="datetime-local" name="date" id="date" required></td>
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

            // Filter doctors based on selected department
            const filteredDoctors = doctors.filter(doc => doc.department_id == selectedDepartmentId);

            // Update the doctor dropdown
            doctorDropdown.innerHTML = `
                <option value="" disabled selected>Select Doctor</option>
                ${filteredDoctors.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('')}
            `;
        });
        submitForm('book-appointment-form', apiRoutes.bookAppointment);
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

// Function to handle form submission
function submitForm(formId, route) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
        console.log(`Form ${formId} is being submitted to ${route}`);
        const formData = new FormData(form);
        console.log(`Form data: ${[...formData.entries()]}`);
        fetch(route, {
            method: 'POST',
            body: formData
        })
        .then(
            response => {
                console.log(`Response status: ${response.status}`);
                return response.json();
            })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                showPopup("✅ Success", data.message, "success");
                form.reset(); // Reset form after successful submission
            } else {
                showPopup("⚠️ Error", data.message, "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showPopup("❌ Error", "Something went wrong!", "error");
        });
    });
}

// Function to display popup messages
function showPopup(title, message, type) {
    let bgColor;
    if (type === "success") bgColor = "green";
    else if (type === "error") bgColor = "red";
    else bgColor = "blue";

    const popup = document.createElement("div");
    popup.innerHTML = `<strong>${title}:</strong> ${message}`;
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = bgColor;
    popup.style.color = "white";
    popup.style.padding = "15px";
    popup.style.borderRadius = "5px";
    popup.style.zIndex = "1000";
    popup.style.fontSize = "16px";
    popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
    popup.style.maxWidth = "80%";
    popup.style.textAlign = "center";

    document.body.appendChild(popup);

    setTimeout(() => { popup.remove(); }, 10000);  // Auto-remove after 3 seconds
}

// Add event listeners for forms
document.addEventListener("DOMContentLoaded", () => {
    submitForm('add-doctor-form', apiRoutes.addDoctor);
    submitForm('add-patient-form', apiRoutes.addPatient);
    submitForm('remove-doctor-form', apiRoutes.removeDoctor);
    submitForm('book-appointment-form', apiRoutes.bookAppointment);
    
});