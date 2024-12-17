from flask import Flask, render_template, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

# Connect to MySQL Database
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Shruthivinay_75',
        database='medical_records_management'
    )

# Route to display the management dashboard and load departments
@app.route('/')
def index():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute('SELECT id, name FROM departments')  # Get departments from DB
    departments = cursor.fetchall()
    cursor.execute('SELECT id, name FROM doctors')  # Get doctors from DB
    doctors = cursor.fetchall()
    db.close()
    return render_template('mdashboard.html', departments=departments, doctors=doctors)

# Route to handle Add Doctor form submission
@app.route('/add-doctor', methods=['POST'])
def add_doctor():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['Phno']
        password = request.form['pwd']
        department = request.form['department']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO doctors (name, email, phone, password, department_id)
            VALUES (%s, %s, %s, %s, (SELECT id FROM departments WHERE name = %s))
        ''', (name, email, phone, password, department))
        db.commit()
        db.close()
        return redirect(url_for('index'))  # Redirect to dashboard after submission

# Route to handle Add Patient form submission
@app.route('/add-patient', methods=['POST'])
def add_patient():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['Email']
        phone = request.form['Phno']
        password = request.form['pwd']
        department = request.form['department']
        doctor_id = request.form['doctor_id']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO patients (name, email, phone, password, department_id, doctor_id)
            VALUES (%s, %s, %s, %s, (SELECT id FROM departments WHERE name = %s), %s)
        ''', (name, email, phone, password, department, doctor_id))
        db.commit()
        db.close()
        return redirect(url_for('index'))  # Redirect to dashboard after submission

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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
