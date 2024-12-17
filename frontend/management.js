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
        <h2>Add Doctor</h2><br>
        <form>
            <label for="doctorName">Doctor Name:</label><br>
            <input type="text" id="doctorName" name="doctorName" required><br><br>
            
            <label for="doctorEmail">Email:</label><br>
            <input type="email" id="doctorEmail" name="doctorEmail" required><br><br>

            <label for="doctorSpecialty">Specialty:</label><br>
            <input type="text" id="doctorSpecialty" name="doctorSpecialty" required><br><br>

            <button type="submit">Add Doctor</button>
        </form>
    `;
});

addPatient.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Add Patient</h2>
        <form>
            <label for="patientName">Patient Name:</label><br>
            <input type="text" id="patientName" name="patientName" required><br><br>
            
            <label for="patientEmail">Email:</label><br>
            <input type="email" id="patientEmail" name="patientEmail" required><br><br>

            <label for="patientCondition">Condition:</label><br>
            <input type="text" id="patientCondition" name="patientCondition" required><br><br>

            <button type="submit">Add Patient</button>
        </form>
    `;
});

removeDoctor.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Remove Doctor</h2>
        <form>
            <label for="doctorId">Doctor ID:</label><br>
            <input type="text" id="doctorId" name="doctorId" required><br><br>
            
            <button type="submit">Remove Doctor</button>
        </form>
    `;
});

removePatient.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Remove Patient</h2>
        <form>
            <label for="patientId">Patient ID:</label><br>
            <input type="text" id="patientId" name="patientId" required><br><br>
            
            <button type="submit">Remove Patient</button>
        </form>
    `;
});
