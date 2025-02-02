// JavaScript to dynamically load content based on sidebar selection

// // Get content area
// const content = document.getElementById('content');
const addDoctor = document.getElementById('add-doctor');
const addPatient = document.getElementById('add-patient');
const removeDoctor = document.getElementById('remove-doctor');
const removePatient = document.getElementById('remove-patient');
const content = document.getElementById('content');
const bookAppointment = document.getElementById('book-appointment');
const logout = document.getElementById('logout');

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

// add doctor form submission
addDoctor.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ departments }) => {
        content.innerHTML = `
            <form id="add-doctor-form" action="${apiRoutes.addDoctor}" method="post" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                    <legend style="text-align: center;color:#fe4066"><h1>Add Doctor</h1></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="name">Name:</label></td>
                            <td><input type="text" name="name" placeholder="Enter Doctor's Name" required></td>
                        </tr>
                        <tr>
                            <td><label for="email">Email:</label></td>
                            <td><input type="email" name="email" placeholder="Enter Email" value="" required></td>
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
                            <td><input type="tel" name="Phno" placeholder="Enter Phone Number" required></td>
                        </tr>
                        <tr>
                            <td><label for="pwd">Password:</label></td>
                            <td><input type="password" name="pwd" placeholder="Enter Password" required></td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;
    });
});

//add patient form submission
addPatient.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ departments, doctors }) => {
        content.innerHTML = `
            <form id="add-patient-form" action="${apiRoutes.addPatient}" method="post" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                    <legend style="text-align: center;color:#fe4066"><h1>Add Patient</h1></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="name">Name:</label></td>
                            <td><input type="text" name="name" placeholder="Enter Patient's Name" required></td>
                        </tr>
                        <tr>
                            <td><label for="email">Email:</label></td>
                            <td><input type="email" name="email" placeholder="Enter Email" required></td>
                        </tr>
                        <tr>
                            <td><label for="department">Department:</label></td>
                            <td>
                                <select name="department" id="department" required>
                                    <option value="" disabled selected>Select Department</option>
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
                            <td><input type="tel" name="Phno" placeholder="Enter Phone Number" required></td>
                        </tr>
                        <tr>
                            <td><label for="pwd">Password:</label></td>
                            <td><input type="password" name="pwd" placeholder="Enter Password" required></td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;

        // Add event listener to department dropdown
        const departmentDropdown = document.getElementById('department');
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
    });
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
});

// Remove Patient form submission
removePatient.addEventListener('click', () => {
    content.innerHTML = `
        <form id="remove-patient-form" method="POST" action="/remove-patient">
            <fieldset style="width: 500px;border: 5px solid #fe4066;border-radius:25px">
                <legend style="text-align: center;color:#fe4066"><h2>Remove Patient</h2></legend>
                <table cellspacing="15px">
                        <tr>
                            <td><label for="patientId">Patient ID:</label></td>
                            <td><input type="text" id="patientId" name="patientId" required></td>
                </table>
                <br>
                <button type="submit" style="margin-left: 30%;">Remove Patient</button>
            </fieldset>
        </form>
    `;
});

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
    });
});

// Function to handle form submission using fetch
function submitForm(formId, route) {
    const form = document.getElementById(formId);
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

//function to logout
logout.addEventListener('click', () => {
    fetch(apiRoutes.logout, { method: 'POST' })
        .then(() => {
            alert('Logged out successfully!');
            window.location.href = '/';
        })
        .catch(err => console.error('Error during logout:', err));
});


// Call the submitForm function for Add Doctor and Add Patient forms
submitForm('add-doctor-form', '/add-doctor');
submitForm('add-patient-form', '/add-patient');
submitForm('remove-doctor-form', '/remove-doctor');
submitForm('remove-patient-form', '/remove-patient');
submitForm('book-appointment-form', '/book-appointment');