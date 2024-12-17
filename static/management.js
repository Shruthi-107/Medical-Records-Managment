// JavaScript to dynamically load content based on sidebar selection

// Get sidebar links
const addDoctor = document.getElementById('add-doctor');
const addPatient = document.getElementById('add-patient');
const removeDoctor = document.getElementById('remove-doctor');
const removePatient = document.getElementById('remove-patient');

// Get content area
const content = document.getElementById('content');

// Add event listeners to update content dynamically
addDoctor.addEventListener('click', () => {
    content.innerHTML = `
        <form id="add-doctor-form" action="{{ url_for('add_doctor') }}" method='post' style=" display:flex; justify-content:center;">
        <fieldset style="width:500px;">
        <legend style="text-align: center;"><h2 id="xyz">Add Doctor</h2></legend>

        <!---- Name ----->
        <table cellspacing="15px">

        <tr>
        <td><label for="Name">Name</label></td>
        <td><input type="text" placeholder="Name" name="name" required></td>
        </tr>

        <!-----Department--->

        <tr>
        <td><label for="cars">Department:</label></td>
        <td>
        <select name="department" id="department">
        {% for department in departments %}
            <option value="{{ department[0] }}">{{ department[0] }}</option>
        {% endfor %}
        </select>
        </td>
        </tr>
        
        <!-----Password----->
        <tr>
        <td><label for="pwd">Password:</label></td>
        <td><input type="password" placeholder="Password" name="pwd" required></td>
        </tr>

        <!---- Phone number ----->
        <tr>
        <td><label for="Phno">Phone number:</label></td>
        <td><input type="tel" placeholder="Phone No" name="Phno" required></td>
        </tr>

        </table>

        <br>
        <input type="submit" value="Submit" style="margin-left:100px;">
        <input type="reset" value="Reset" style="margin-left:190px;">
        </fieldset>
        </form>
    `;
});

// Add Patient form submission
addPatient.addEventListener('click', () => {
    content.innerHTML = `
        <form id="add-patient-form" action='/add-patient' method='post' style=" display:flex; justify-content:center;">
        <fieldset style="width:500px;">
        <legend style="text-align: center;"><h2 id="xyz">Add Patient</h2></legend>

        <!---- Name ----->
        <table cellspacing="15px">

        <tr>
        <td><label for="Name">Name</label></td>
        <td><input type="text" placeholder="Name" name="name" required></td>
        </tr>

        <!-----Department--->

        <tr>
        <td><label for="cars">Department:</label></td>
        <td>
        <select name="department" id="department">
        {% for department in departments %}
            <option value="{{ department[0] }}">{{ department[0] }}</option>
        {% endfor %}
        </select>
        </td>
        </tr>

        <!-----Doctor Assignment-->
        <tr>
        <td><label for="doctor_id">Assign Doctor:</label></td>
        <td>
        <select name="doctor_id" id="doctor_id">
        {% for doctor in doctors %}
            <option value="{{ doctor[0] }}">{{ doctor[1] }}</option>
        {% endfor %}
        </select>
        </td>
        </tr>

        <!-----Password----->
        <tr>
        <td><label for="pwd">Password:</label></td>
        <td><input type="password" placeholder="Password" name="pwd" required></td>
        </tr>

        <!---- Phone number ----->
        <tr>
        <td><label for="Phno">Phone number:</label></td>
        <td><input type="tel" placeholder="Phone No" name="Phno" required></td>
        </tr>

        </table>

        <br>
        <input type="submit" value="Submit" style="margin-left:100px;">
        <input type="reset" value="Reset" style="margin-left:190px;">
        </fieldset>
        </form>
    `;
});

// Remove Doctor form submission
removeDoctor.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Remove Doctor</h2>
        <form id="remove-doctor-form" method="POST" action="/remove-doctor">
            <label for="doctorId">Doctor ID:</label><br>
            <input type="text" id="doctorId" name="doctorId" required><br><br>
            <button type="submit">Remove Doctor</button>
        </form>
    `;
});

// Remove Patient form submission
removePatient.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Remove Patient</h2>
        <form id="remove-patient-form" method="POST" action="/remove-patient">
            <label for="patientId">Patient ID:</label><br>
            <input type="text" id="patientId" name="patientId" required><br><br>
            <button type="submit">Remove Patient</button>
        </form>
    `;
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

// Call the submitForm function for Add Doctor and Add Patient forms
submitForm('add-doctor-form', '/add-doctor');
submitForm('add-patient-form', '/add-patient');
submitForm('remove-doctor-form', '/remove-doctor');
submitForm('remove-patient-form', '/remove-patient');
