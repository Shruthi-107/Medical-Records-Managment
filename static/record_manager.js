const managerprofile = document.getElementById('manager-profile');
const addRecord = document.getElementById('add-record');
const logout = document.getElementById('logout');


// Fetch data and dynamically populate forms
function fetchDepartmentsAndDoctors() {
    return fetch('/test-db')
        .then(response => response.json())
        .then(data => ({
            departments: data.departments || [],
            doctors: data.doctors || [],
            patients: data.patients || [],
            record_managers: data.record_managers || [],
        }))
        .catch(err => console.error('Error fetching data:', err));
}

// Fetch data and dynamically populate forms
function fetchManagerProfile() {
    return fetch('/record_manager/manager-profile')
        .then(response => response.json())
        .catch(err => console.error('Error fetching profile data:', err));
}

// my profile
managerprofile.addEventListener('click', () => {
    fetchManagerProfile(apiRoutes.managerprofile).then(data => {
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

// Add Record Form
addRecord.addEventListener('click', () => {
    fetchDepartmentsAndDoctors().then(({ patients }) => {
        content.innerHTML = `
            <form id="add-record-form" method="post" action="${apiRoutes.addRecord}" enctype="multipart/form-data" style="display: flex; justify-content: center;">
                <fieldset style="width: 500px; border: 5px solid #fe4066; border-radius: 25px;">
                    <legend style="text-align: center; color: #fe4066;"><h1>Add Record</h1></legend>
                    <table cellspacing="15px">
                        <tr>
                            <td><label for="patient_id">Patient:</label></td>
                            <td>
                                <select name="patient_id" id="patient_id" required>
                                    ${patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label for="file">Upload File:</label></td>
                            <td><input type="file" name="file" id="file" accept=".jpg,.jpeg,.png,.pdf" required></td>
                        </tr>
                        <tr>
                            <td><label for="details">Details:</label></td>
                            <td><textarea name="details" id="details"></textarea></td>
                        </tr>
                    </table>
                    <br>
                    <input type="submit" value="Submit" style="margin-left: 100px;">
                    <input type="reset" value="Reset" style="margin-left: 190px;">
                </fieldset>
            </form>
        `;

        // Handle file form submission
        const form = document.getElementById('add-record-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();  // Prevent the default form submission

            const formData = new FormData(form);  // Use FormData for file upload

            fetch(apiRoutes.addRecord, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) { 
                    return response.text().then(text => { throw new Error(text); });  // Read error response as text
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showPopup("✅ Success", data.message, "success");
                    form.reset();  // Reset form after successful upload
                } else {
                    showPopup("⚠️ Error", data.message, "error");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showPopup("❌ Error", error.message || "Something went wrong!", "error");
            });
            
        });
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

    setTimeout(() => { popup.remove(); }, 3000);  // Auto-remove after 3 seconds
}

// // Add Doctor Form
// addRecord.addEventListener('click', () => {
//     fetchDepartmentsAndDoctors().then(({ patients }) => {
//         content.innerHTML = `
//             <form id="add-record-form" method="post" action="${apiRoutes.addRecord}" style="display: flex; justify-content: center;">
//                 <fieldset style="width: 500px; border: 5px solid #fe4066; border-radius: 25px;">
//                     <legend style="text-align: center; color: #fe4066;"><h1>Add Record</h1></legend>
//                     <table cellspacing="15px">
//                         <tr>
//                             <td><label for="name">Name:</label></td>
//                             <td>
//                                 <select name="name" id="name" required>
//                                     ${patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td><label for="record_file">Upload File:</label></td>
//                             <td><input type="file" name="record_file" id="record_file" accept=".jpg,.jpeg,.png,.pdf" required></td>
//                         </tr>
//                         <tr>
//                                 <td><label for="details">Details:</label></td>
//                                 <td><textarea name="details"></textarea></td>
//                         </tr>
//                     </table>
//                     <br>
//                     <input type="submit" value="Submit" style="margin-left: 100px;">
//                     <input type="reset" value="Reset" style="margin-left: 190px;">
//                 </fieldset>
//             </form>
//         `;
//         submitForm('add-record-form', apiRoutes.addRecord);
//     });
// });

// // Add event listeners for forms
// document.addEventListener("DOMContentLoaded", () => {

//     submitForm('add-record-form', apiRoutes.addRecord); 
// });