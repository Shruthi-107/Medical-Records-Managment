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
        <form name="myForm" action='#' method='post' onsubmit="return validation()" style=" display:flex; justify-content:center;">
        <fieldset style="width:500px;">
        <legend style="text-align: center;"><h2 id="xyz">Add Doctor</h2></legend>

        <!---- Name ----->
        <table cellspacing="15px">

        <tr>
        <td><label for="Name">Name</label></td>
        <td><input type="text" placeholder="Name" name="name" required></td>
        </tr>

        <!--<tr>
        <td><label for="LastName">LastName</label></td>
        <td><input type="text" placeholder="Last Name" name="lname" required></td>
        </tr>-->
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
        <td><input type="password" placeholder="Password" name="pwd"></td>
        </tr>

        <!---- gender----->
        <!----<tr>
        <td><label for="Gender">Gender</label></td>
        <td>
        <label for="male" style="margin-left:19px">Male</label>
        <input type="radio" name="gender">
        <label for="female">Female</label>
        <input type="radio" name="gender">
        <label for="others">Others</label>
        <input type="radio" name="gender">
        </td>
        </tr>-->
        
        <!---- birthday ----->
        <!--<tr>
        <td><label for="birthday">Date Of Birth:</label></td>
            <td><input type="date" name="birthday"></td>
        </tr>-->

        <!---- Email ---->
        <tr>
        <td><label for="email">Email:</label></td>
        <td><input type="email" placeholder="email" id="email" name="Email"></td>
        </tr>

        <!--- Phno ------>
        <tr>
        <td><label for="telNo">Phone number: </label></td>
        <td><input type="tel" placeholder="phone No:" name="Phno"></td>
        </tr>

                            </table>

        <br>
        <input type="submit" value="submit" style="margin-left:100px;">
        <input type="reset" value="reset" style="margin-left:190px;">
        </fieldset>
        </form>
        
    `;
});

addPatient.addEventListener('click', () => {
    content.innerHTML = `
        <form name="myForm" action='#' method='post' onsubmit="return validation()" style=" display:flex; justify-content:center;">
        <fieldset style="width:500px;">
        <legend style="text-align: center;"><h2 id="xyz">Add Patient</h2></legend>

        <!---- Name ----->
        <table cellspacing="15px">

        <tr>
        <td><label for="Name">Name</label></td>
        <td><input type="text" placeholder="Name" name="name" required></td>
        </tr>

        <!--<tr>
        <td><label for="LastName">LastName</label></td>
        <td><input type="text" placeholder="Last Name" name="lname" required></td>
        </tr>-->
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
        <td><input type="password" placeholder="Password" name="pwd"></td>
        </tr>

        <!---- gender----->
        <!---<tr>
        <td><label for="Gender">Gender</label></td>
        <td>
        <label for="male" style="margin-left:19px">Male</label>
        <input type="radio" name="gender">
        <label for="female">Female</label>
        <input type="radio" name="gender">
        <label for="others">Others</label>
        <input type="radio" name="gender">
        </td>
        </tr>--->
        
        <!---- birthday ----->
        <!--<tr>
        <td><label for="birthday">Date Of Birth:</label></td>
            <td><input type="date" name="birthday"></td>
        </tr>-->

        <!---- Email ---->
        <tr>
        <td><label for="email">Email:</label></td>
        <td><input type="email" placeholder="email" id="email" name="Email"></td>
        </tr>

        <!--- Phno ------>
        <tr>
        <td><label for="telNo">Phone number: </label></td>
        <td><input type="tel" placeholder="phone No:" name="Phno"></td>
        </tr>

        <tr>
        <td><label for="doctor_id">Assign Doctor:</label></td>
        <td><select name="doctor_id">
            {% for doctor in doctors %}
                <option value="{{ doctor[0] }}">{{ doctor[1] }}</option>
            {% endfor %}
        </select></td>
        </tr>
        </table>

        <br>
        <input type="submit" value="submit" style="margin-left:100px;">
        <input type="reset" value="reset" style="margin-left:190px;">
        </fieldset>
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
