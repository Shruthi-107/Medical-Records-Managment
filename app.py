from flask import Flask, render_template, request, redirect, url_for
from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from functools import wraps

import mysql.connector


app = Flask(__name__)
app.secret_key = 'aP9s8d7f6g5h4j3k2l1m0n9b8v7c6x5z4'  # Replace with a secure key
app.permanent_session_lifetime = timedelta(minutes=30)

# Connect to MySQL Database
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Shruthivinay_75',
        database='medical_records_management'
    )
@app.route('/test-db')
def test_db():
    try:
        db = get_db_connection()
        cursor = db.cursor()

        # Fetch departments
        cursor.execute("SELECT id, name FROM departments")
        departments = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]

        # Fetch doctors
        cursor.execute("SELECT id, name,department_id FROM doctors")
        doctors = [{"id": row[0], "name": row[1], "department_id" : row[2]} for row in cursor.fetchall()]

        db.close()
        return {
            "success": True,
            "departments": departments,
            "doctors": doctors
        }, 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500

@app.route('/')
def index():
    return render_template('index.html')

    # db = get_db_connection()
    # cursor = db.cursor()
    # cursor.execute('SELECT id, name FROM departments')  # Fetch departments from the database
    # departments = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
    # cursor.execute('SELECT id, name FROM doctors')  # Fetch doctors from the database
    # doctors = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
    # db.close()

    # # Pass data to the frontend template
    # return render_template('admin_dashboard.html', departments=departments, doctors=doctors)


### for doctor login page
@app.route('/doctor.html')
def doctor():
    return render_template('doctor.html')

@app.route('/management.html')
def management():
    return render_template('management.html')



@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.form['email']
        password = request.form['pwd']
        role = request.referrer.split('/')[-1].replace('.html', '')  # Extract the role from the referring page

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Select the correct table based on the role
        if role == 'management':
            cursor.execute("SELECT * FROM management WHERE email = %s", (email,))
        elif role == 'doctor':
            cursor.execute("SELECT * FROM doctors WHERE email = %s", (email,))
        elif role == 'patient':
            cursor.execute("SELECT * FROM patients WHERE email = %s", (email,))
        else:
            return "Invalid role", 400

        user = cursor.fetchone()
        db.close()
        # print(email,user['pwd'],password)
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['role'] = role
            session.permanent = True  # Session will persist for the defined duration
            print(email,role=='doctor',user['id'],user['password'])
            # Redirect to role-specific dashboards
            if role == 'management':
                return redirect(url_for('admin_dashboard'))
            elif role == 'doctor':
                # pass
                return redirect(url_for('doctor_dashboard'))
            elif role == 'patient':
                pass
                # return redirect(url_for('patient_dashboard'))
            
        else:
            return "Invalid credentials", 401

    except Exception as e:
        print(email,role=='doctor',password,user['password'],check_password_hash(user['password'], password))
        return {"success": False, "message": str(e)}, 500
    


def login_required(role=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if 'user_id' not in session:
                return redirect(url_for('login'))
            if role and session.get('role') != role:
                return "Unauthorized", 403
            return func(*args, **kwargs)
        return wrapper
    return decorator

### decorators
@app.route('/admin-dashboard')
@login_required(role='management')
def admin_dashboard():
    return render_template('admin_dashboard.html')

@app.route('/doctor-dashboard')
@login_required(role='doctor')
def doctor_dashboard():
    return render_template('doctor_dashboard.html')

@app.route('/patient-dashboard')
@login_required(role='patient')
def patient_dashboard():
    return render_template('patient_dashboard.html')




# Route to handle Add Doctor form submission

@app.route('/add-doctor', methods=['POST'])
def add_doctor():
    try:
        name = request.form['name']
        email = request.form['email']
        phone = request.form['Phno']
        password = request.form['pwd']
        hashed_password = generate_password_hash(password)
        department_id = request.form['department']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO doctors (name, email, phone, password, department_id)
            VALUES (%s, %s, %s, %s, %s)
        ''', (name, email, phone, hashed_password, department_id))
        db.commit()
        db.close()
        return {"success": True, "message": "Doctor added successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 400

### Add Patient
@app.route('/add-patient', methods=['POST'])
def add_patient():
    try:
        name = request.form['name']
        email = request.form['email']
        phone = request.form['Phno']
        password = request.form['pwd']
        department_id = request.form['department']
        doctor_id = request.form['doctor_id']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO patients (name, email, phone, password, department_id, doctor_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (name, email, phone, password, department_id, doctor_id))
        db.commit()
        db.close()
        return {"success": True, "message": "Patient added successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 400


# Route to handle Remove Doctor form submission
@app.route('/remove-doctor', methods=['POST'])
def remove_doctor():
    if request.method == 'POST':
        doctor_id = request.form['doctorId']
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('DELETE FROM doctors WHERE id = %s', (doctor_id,))
        db.commit()
        db.close()
        return redirect(url_for('index'))  # Redirect to dashboard after deletion

# Route to handle Remove Patient form submission
@app.route('/remove-patient', methods=['POST'])
def remove_patient():
    if request.method == 'POST':
        patient_id = request.form['patientId']
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('DELETE FROM patients WHERE id = %s', (patient_id,))
        db.commit()
        db.close()
        return redirect(url_for('index'))  # Redirect to dashboard after deletion

############################################ Doctor Dashboard #####################################

@app.route('/doctor/my-profile', methods=['GET'])
@login_required(role='doctor')
def my_profile():
    """Fetch and display the logged-in doctor's profile."""
    doctor_id = session.get('user_id')  # Retrieve logged-in doctor ID from session
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT d.name, d.email, d.phone, dep.name AS department
        FROM doctors d
        LEFT JOIN departments dep ON d.department_id = dep.id
        WHERE d.id = %s
    ''', (doctor_id,))
    doctor = cursor.fetchone()
    # print(doctor)
    db.close()

    if doctor:
        return {"success": True, "my-profile": doctor}, 200
    else:
        return {"success": False, "message": "Doctor not found!"}, 404


@app.route('/doctor/my-patients', methods=['GET'])
@login_required(role='doctor')
def my_patients():
    """Fetch the list of patients assigned to the logged-in doctor."""
    doctor_id = session.get('user_id')  # Retrieve logged-in doctor ID from session
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT id, name, email, phone, department_id
        FROM patients
        WHERE doctor_id = %s
    ''', (doctor_id,))
    patients = cursor.fetchall()
    print(patients)
    db.close()

    return {"success": True, "my-patients": patients}, 200


@app.route('/doctor/my-appointments', methods=['GET'])
@login_required(role='doctor')
def my_appointments():
    """Fetch appointments for the logged-in doctor."""
    doctor_id = session.get('user_id')  # Retrieve logged-in doctor ID from session
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT a.id, p.name AS patient_name, a.date, a.status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.doctor_id = %s
    ''', (doctor_id,))
    appointments = cursor.fetchall()
    db.close()

    return {"success": True, "my-appointments": appointments}, 200


# @app.route('/doctor-dashboard')
# @login_required(role='doctor')
# def doctor_dashboard():
#     """Render the doctor dashboard."""
#     return render_template('doctor_dashboard.html')


############################################ Logout Route #########################################

@app.route('/doctor/logout', methods=['POST'])
def logout():
    """Logout the doctor and clear the session."""
    session.clear()
    return redirect(url_for('doctor'))









# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
