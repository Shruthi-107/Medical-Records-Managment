import traceback
from flask import Flask, json, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from functools import wraps
from Crypto.Cipher import AES, PKCS1_OAEP
from cryptography.fernet import Fernet
from Crypto.PublicKey import RSA
import smtplib
from email.mime.text import MIMEText
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64
import os
from hashlib import sha256
import datetime

# from Cryptodome.Cipher import AES
import base64
import os
import mysql.connector

# AES key size and padding function
BLOCK_SIZE = 16  # AES block size
SECRET_KEY = Fernet.generate_key()
cipher = Fernet(SECRET_KEY)

def generate_key(password: str):
    """Generate a 256-bit AES key from the password"""
    return sha256(password.encode()).digest()

def encrypt_data(data: str, key: bytes):
    """Encrypt data using AES"""
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(data.encode(), BLOCK_SIZE))
    iv = base64.b64encode(cipher.iv).decode('utf-8')
    ct = base64.b64encode(ct_bytes).decode('utf-8')
    return iv + ct  # Return IV + Ciphertext

def decrypt_data(enc_data: str, key: bytes):
    
    """Decrypt data using AES"""
    iv = base64.b64decode(enc_data[:24])  # Extract IV (first 16 bytes)
    ct = base64.b64decode(enc_data[24:])  # Extract ciphertext
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = unpad(cipher.decrypt(ct), BLOCK_SIZE)
    return decrypted_data.decode('utf-8')

def rencrypt_data(data, public_key):
    key = RSA.import_key(public_key)
    cipher = PKCS1_OAEP.new(key)
    
    encrypted = cipher.encrypt(data.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")  # Convert to Base64 before storing
def rdecrypt_data(encrypted_data, private_key):
    key = RSA.import_key(private_key)
    cipher = PKCS1_OAEP.new(key)
    
    try:
        decoded_encrypted_data = base64.b64decode(encrypted_data)  # Ensure correct decoding
        decrypted = cipher.decrypt(decoded_encrypted_data).decode("utf-8").strip()
        return decrypted
    except Exception as e:
        print(f"Decryption failed: {e}")
        return "[Decryption Failed]"
    
def generate_keys(user_address, email):
    key = RSA.generate(2048)
    
    public_key = key.publickey().export_key().decode()
    private_key = key.export_key().decode()

    # Send private key via email
    send_private_key_email(email, private_key)

    # Store public key in smart contract
    tx_hash = contract.functions.setPublicKey(user_address,public_key).transact({"from": web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    print(f"Public key stored on blockchain for {user_address}")
    return public_key

def send_private_key_email(email, private_key):
    msg = MIMEText(f"Your private key:\n\n{private_key}\n\nKeep this secure and do not share it!")
    msg["Subject"] = "Your Private Key for Secure Access"
    msg["From"] = "shruthichintakayala@gmail.com"
    msg["To"] = email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("shruthichintakayala@gmail.com", "mdic jeom grgf ovae")
            server.sendmail("shruthichintakayala@gmail.com", email, msg.as_string())

        print(f"Private key sent to {email}")
    except Exception as e:
        print(f"Error sending email: {str(e)}")

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

        # Fetch patients
        cursor.execute("SELECT id, name,department_id FROM patients")
        patients = [{"id": row[0], "name": row[1], "department_id" : row[2]} for row in cursor.fetchall()]

        #fetch record managers
        cursor.execute("SELECT id, name FROM record_manager")
        record_managers = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
        db.close()
        return {
            "success": True,
            "departments": departments,
            "doctors": doctors,
            "patients": patients,
            "record_managers": record_managers
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

##################################################### blockchain part ########################################################
from web3 import Web3

# Connect to Ganache
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

if web3.is_connected():
    print("✅ Connected to Ganache!")

# Load contract ABI and address
with open("build/contracts/MedicalRecords.json", "r") as file:
    contract_data = json.load(file)

contract_abi = contract_data["abi"]
contract_address = "0xD4216fA67e590046B9F717d50C0b99a2e1c2355E"  # Replace with the deployed contract address

# Create contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def add_prescription(doctor_address, patient_address, encrypted_prescription, timings, days, comments):
    try:
        print("in bc add_pre")
        doctor_address = Web3.to_checksum_address(doctor_address)
        print("after 1 bc add_pre")
        patient_address = Web3.to_checksum_address(patient_address)
        print("after 2 bc add_pre")
    except ValueError:
        return "Invalid Ethereum address!"

    tx_hash = contract.functions.addPrescription(patient_address, encrypted_prescription, timings, days, comments).transact({'from': doctor_address})
    web3.eth.wait_for_transaction_receipt(tx_hash)
    return "✅ Prescription added to blockchain!"


def verify_prescription(prescription_id):
    return contract.functions.verifyPrescription(prescription_id).call()

def log_action(user_address, role, action):
    """Log an action on the blockchain."""
    
    tx_hash = contract.functions.logAction(user_address, role, action).transact({'from': web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)
    print("in log action")
    return "✅ Action logged on blockchain!"

################################################################################################################
### for doctor login page
@app.route('/doctor.html')
def doctor():
    return render_template('doctor.html')

@app.route('/management.html')
def management():
    return render_template('management.html')

@app.route('/patient.html')
def patient():
    return render_template('patient.html')
@app.route('/record_manager.html')
def record_manager():
    return render_template('record_manager.html')


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
        elif role == 'record_manager':
            cursor.execute("SELECT * FROM record_manager WHERE email = %s", (email,))
        else:
            return "Invalid role", 400
        print(role)
        user = cursor.fetchone()
        db.close()
        # print(email,user['pwd'],password)
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['role'] = role
            session.permanent = True  # Session will persist for the defined duration
    
            # Redirect to role-specific dashboards
            if role == 'management':
                return redirect(url_for('admin_dashboard'))
            elif role == 'doctor':
                # pass
                return redirect(url_for('doctor_dashboard'))
            elif role == 'patient':
                # pass
                return redirect(url_for('patient_dashboard'))
            elif role == 'record_manager':
                return redirect(url_for('record_manager_dashboard'))
            
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
            if role:
                if isinstance(role, list) and session.get('role') not in role:
                    return "Unauthorized", 403
                elif session.get('role') != role:
                    return "Unauthorized", 403
            return func(*args, **kwargs)
        return wrapper
    return decorator


# def login_required(role=None):
#     def decorator(func):
#         @wraps(func)
#         def wrapper(*args, **kwargs):
#             if 'user_id' not in session:
#                 return redirect(url_for('login'))
#             if role and session.get('role') != role:
#                 return "Unauthorized", 403
#             return func(*args, **kwargs)
#         return wrapper
#     return decorator

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

@app.route('/record_manager-dashboard')
@login_required(role='record_manager')
def record_manager_dashboard():
    return render_template('record_manager_dashboard.html')




############################################### Admin Dashboard ##########################################


###  view-logs
@app.route('/admin/view-logs', methods=['GET'])
# @login_required(role='admin')
def view_logs():
    try:
        logs = contract.functions.getLogs().call()
        # Decryption key (same key used in encryption)
        password = 'MySecurePassword123!'
        key = generate_key(password)
        formatted_logs = []
        for log in logs:
            formatted_logs.append({
                "id": log[0],
                "user": decrypt_data(log[1]),
                "role": log[2],
                "action": log[3],
                "timestamp": log[4]
            })

        return jsonify({"success": True, "logs": formatted_logs}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/record_manager/manager-profile', methods=['GET'])
@login_required(role='record_manager')
def manager_profile():
    """Fetch and display the logged-in doctor's profile."""
    record_manager_id = session.get('user_id')  # Retrieve logged-in doctor ID from session
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT d.name, d.email, d.phone
        FROM record_manager d
        WHERE d.id = %s
    ''', (record_manager_id,))
    record_manager = cursor.fetchone()
    # print(doctor)
    db.commit()
    db.close()

    if record_manager:
        return {"success": True, "my-profile": record_manager}, 200
    else:
        return {"success": False, "message": "Doctor not found!"}, 404
    
# Route to handle Add Doctor form submission
@app.route('/add-record', methods=['POST'])
@login_required(role='record_manager')
def add_record():
    try:
        print("NO")
        admin_id=session.get('user_id')
        patient_id = request.form['patient_id']
        uploaded_by = session.get('role')  # Either "record_manager" or "patient"
        details=request.form['details']
        # doctor_id = request.form.get('doctor_id')  # Optional
        file = request.files['file']
        print("YES")
        # Read and encrypt file
        file_data = file.read()
        encrypted_data = cipher.encrypt(file_data)

        # Store encrypted file in MySQL
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO medical_files (patient_id, details,uploaded_by, file_name, file_type, file_data)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (patient_id, details,uploaded_by, file.filename, file.content_type, encrypted_data))
        db.commit()
        db.close()
        print("OK")

        return jsonify({"success": True, "message": "File uploaded and encrypted successfully!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route to handle Add Doctor form submission
@app.route('/add-doctor', methods=['POST'])
def add_doctor():
    try:
        admin_id=session.get('user_id')
        name = request.form['name']
        email = request.form['email']
        phone = request.form['Phno']
        password = request.form['pwd']
        hashed_password = generate_password_hash(password)
        department_id = request.form['department']

        db = get_db_connection()
        cursor = db.cursor()

        # Generate Ethereum account
        account = web3.eth.account.create()
        eth_address = account.address
        private_key = account.key.hex()

        cursor.execute('''
            INSERT INTO doctors (name, email, phone, password,eth_address,department_id)
            VALUES (%s, %s, %s, %s,%s, %s)
        ''', (name, email, phone, hashed_password,eth_address,department_id))
    
         # **Log action on blockchain (with admin's Ethereum address)**
        cursor.execute("SELECT eth_address FROM management WHERE id = %s", (admin_id,))
        admin_eth_address = cursor.fetchone()[0]
        

        log_action(admin_eth_address, "admin", f"Added doctor {name}")
        db.commit()
        db.close()
        
        return {"success": True, "message": "Doctor added successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 400

### Add Patient
@app.route('/add-patient', methods=['POST'])
def add_patient():
    try:
        admin_id=session.get('user_id')
        print("Admin id",admin_id,type(admin_id))
        name = request.form['name']
        email = request.form['email']
        phone = request.form['Phno']
        password = request.form['pwd']
        hashed_password = generate_password_hash(password)
        department_id = int(request.form['department'])
        doctor_id = request.form['doctor_id']

        # Generate Ethereum account
        account = web3.eth.account.create()
        eth_address = account.address
        private_key = account.key.hex()

        # Generate RSA Key Pair for the Patient
        public_key = generate_keys(eth_address, email)  # Sends private key via email
        print("Public key",public_key)
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO patients (name, email, phone, password, eth_address, department_id, doctor_id, public_key)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (name, email, phone, hashed_password, eth_address, department_id, doctor_id, public_key))
        db.commit()
        print("in to blockchain")
        

         # **Log action on blockchain (with admin's Ethereum address)**
        cursor.execute("SELECT eth_address FROM management WHERE id = %s", (admin_id,))
        admin_eth_address = cursor.fetchone()[0]
        print("again in to blockchain")

        log_action(admin_eth_address, "admin", f"Added patient {name}")
        db.commit()
        db.close()
        return {"success": True, "message": "Patient added successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 400


# Route to handle Remove Doctor form submission
@app.route('/remove-doctor', methods=['POST'])
def remove_doctor():
    try:
        if request.method == 'POST':
            admin_id=session.get('user_id')
            doctor_id = request.form['doctorId']
            db = get_db_connection()
            cursor = db.cursor()
            cursor.execute('select name FROM doctors WHERE id = %s', (doctor_id,))
            doctor=cursor.fetchone()
            doctor_name=doctor[0]

            cursor = db.cursor()
            cursor.execute('DELETE FROM doctors WHERE id = %s', (doctor_id,))

            # **Log action on blockchain (with admin's Ethereum address)**
            cursor.execute("SELECT eth_address FROM management WHERE id = %s", (admin_id,))
            admin_eth_address = cursor.fetchone()[0]
            log_action(admin_eth_address, "admin", f"Removed doctor {doctor_name}")
            db.commit()
            db.close()
            return {"success": True, "message": "Doctor removed successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 400
        # return redirect(url_for('admin_dashboard'))  # Redirect to dashboard after deletion
        # return {"success": True, "message": "Doctor removed successfully!"}, 200
        # return redirect(url_for('index'))  # Redirect to dashboard after deletion


# Route to Book appointemnt form submission
@app.route('/book-appointment', methods=['POST'])
@login_required(role='management')
def book_appointment():
    """Handle booking an appointment."""
    try:
        patient_id = request.form['patient_id']
        department_id=request.form['department_id']
        doctor_id = request.form['doctor_id']
        date = request.form['date']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO appointments (patient_id,doctor_id,department_id, date, status)
            VALUES (%s, %s, %s, %s, %s)
        ''', (patient_id, doctor_id, department_id, date, 'Pending'))
        db.commit()
        db.close()
        print("in app")
        return {"success": True, "message": "Appointment booked successfully!"}, 200
        # return redirect(url_for('admin_dashboard'))
    except Exception as e:
        return {"success": False, "message": str(e)}, 400

# Route to check logs
@app.route('/admin/check-logs', methods=['GET'])
@login_required(role='management')
def check_logs():
    try:
        # Fetch all logs from blockchain
        logs_raw = contract.functions.getAllLogs().call()
        
        # Decryption key (same key used in encryption)
        password = 'MySecurePassword123!'
        key = generate_key(password)
        
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Format logs for display
        logs = []
        for log in logs_raw:
            eth_address = log[1]
            role = log[2]

            # Execute the query to get the user name based on role
            if role == 'doctor':
                cursor.execute("SELECT name FROM doctors WHERE eth_address = %s;", (eth_address,))
            elif role == 'patient':
                cursor.execute("SELECT name FROM patients WHERE eth_address = %s;", (eth_address,))
            elif role == 'admin':
                cursor.execute("SELECT name FROM management WHERE eth_address = %s;", (eth_address,))
            else:
                user_name = 'Unknown User'
                continue

            user_row = cursor.fetchone()
            user_name = user_row['name'] if user_row else 'Unknown User'

            logs.append({
                "id": log[0],
                "user": user_name,
                "role": role,
                "action": log[3],
                "timestamp": log[4]
            })
            # print(logs)

        # Close the database connection
        db.commit()
        db.close()
        
        return jsonify({"success": True, "logs": logs}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500



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
        SELECT DISTINCT p.id, p.name AS patient_name, p.email, p.phone
            FROM patients p
            JOIN appointments a ON a.patient_id = p.id
            WHERE a.doctor_id = %s
        ''', (doctor_id,))
    patients = cursor.fetchall()
    print(patients)
    db.close()

    return {"success": True, "my-patients": patients}, 200

from flask import jsonify
import base64

@app.route('/doctor/patient-details/<int:patient_id>', methods=['GET'])
@login_required(role='doctor')
def get_patient_details(patient_id):
    try:
        doctor_id=session.get('user_id')
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        print("OK before")
        # Fetch patient details
        cursor.execute('SELECT id, name, email, phone, comment FROM patients WHERE id = %s', (patient_id,))
        patient = cursor.fetchone()
        print("ok 1")
        # Fetch prescriptions
        cursor.execute('SELECT medication, timings, days, date_issued, comments FROM prescriptions WHERE patient_id = %s', (patient_id,))
        prescriptions = cursor.fetchall()
        print("ok 3")
        # Log action on blockchain (with doctor's Ethereum address)
        cursor.execute("SELECT eth_address FROM doctors WHERE id = %s", (doctor_id,))
        doctor_row = cursor.fetchone()
        if doctor_row:
            doctor_eth_address = doctor_row['eth_address']
            print(doctor_eth_address)
        else:
            raise Exception("Doctor's Ethereum address not found")
        
        print("ok 4")
        db.commit()
        db.close()

        log_action(doctor_eth_address, "doctor", f"Accessed patient {patient['name']}")

        return jsonify({"success": True, "patient": patient, "prescriptions": prescriptions}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/doctor/add-prescription', methods=['POST'])
@login_required(role='doctor')
def add_prescription_doc():
    try:
        doctor_id = session.get('user_id')
        patient_id = request.form['patient_id']
        medication = request.form['medication']
        timings = request.form['timings']
        days = int(request.form['days'])
        comments = request.form['comments']

        # password = 'MySecurePassword123!'
        # key = generate_key(password)
        # encrypted_prescription = encrypt_data(medication, key)

        # Get Ethereum addresses from the database
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT eth_address FROM doctors WHERE id = %s", (doctor_id,))
        doctor_address = cursor.fetchone()[0]

        cursor.execute("SELECT eth_address FROM patients WHERE id = %s", (patient_id,))
        patient_address = cursor.fetchone()[0]
        db.close()

        # Fetch patient's RSA public key from blockchain
        patient_public_key = contract.functions.publicKeys(patient_address).call()
        if not patient_public_key:
            return {"success": False, "message": "Patient's public key not found"}, 400
        
        # # Convert public key to RSA format and encrypt prescription
        # rsa_key = RSA.import_key(patient_public_key)
        # cipher = PKCS1_OAEP.new(rsa_key)
        encrypted_prescription = rencrypt_data(medication, patient_public_key)


        # Add prescription to blockchain
        add_prescription(doctor_address, patient_address, encrypted_prescription, timings, days, comments)

        # Add prescription to the database
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO prescriptions (doctor_id, patient_id, medication, timings, days, comments)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (doctor_id, patient_id, encrypted_prescription, timings, days, comments))
        

        # **Log action on blockchain (with doctors's Ethereum address)**
        cursor.execute("SELECT eth_address FROM doctors WHERE id = %s", (doctor_id,))
        doctor_eth_address = cursor.fetchone()[0]
        db.commit()
        db.close()

        log_action(doctor_eth_address, "doctor", f"Added prescription for patient {patient_id}")

        return {"success": True, "message": "Prescription added successfully!"}, 200
    except Exception as e:
        return {"success": False, "message": str(e)}, 500

    
@app.route('/doctor/verify-prescription/<int:prescription_id>', methods=['GET'])
def verify_prescription_route(prescription_id):
    try:
        is_valid = verify_prescription(prescription_id)
        return jsonify({"success": True, "is_valid": is_valid}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

### get all prescriptions
@app.route('/doctor/get-history/<int:patient_id>', methods=['GET'])
@login_required(role='doctor')
def get_prescription_history(patient_id):
    try:
        doctor_id = session.get('user_id')

        # Fetch Ethereum address from the database
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT name, email, phone, comment, eth_address FROM patients WHERE id = %s", (patient_id,))
        patient_row = cursor.fetchone()
        db.close()

        if not patient_row:
            return jsonify({"success": False, "message": "Patient not found"}), 404

        patient_address = patient_row["eth_address"]
        print("Fetching prescriptions from blockchain for:", patient_address)

        # Fetch all prescriptions from blockchain
        prescriptions_raw = contract.functions.getAllPrescriptions(patient_address).call()
        if not prescriptions_raw:
            return jsonify({"success": False, "message": "No prescriptions found on blockchain"}), 404

        # Decryption key (same key used in encryption)
        password = 'MySecurePassword123!'
        key = generate_key(password)
        print("OK  in getting history")

        # Format the prescription history
        prescriptions = []
        for pres in prescriptions_raw:
            print("in process")
            # print("medicine",pres[3])
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)

            cursor.execute("SELECT name FROM doctors WHERE eth_address = %s;", (pres[1],))
            doctor_row = cursor.fetchone()
            doctor_name = doctor_row['name'] if doctor_row else 'Unknown Doctor'

            
            prescriptions.append({
                "id": pres[0],
                "doctor": doctor_name,
                "patient": pres[2],
                "medication": pres[3], ###.
                "timings": pres[4],
                "days": pres[5],
                "comments": pres[6],
                "timestamp": pres[7]
            })
            db.close()
        # print("done process")

        return jsonify({"success": True,"patient": patient_row, "prescriptions": prescriptions}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

    
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
    print(appointments)  # Debugging

    return {"success": True, "my-appointments": appointments}, 200


############################################ Patient Dashboard #####################################

# from flask import request, jsonify
# from flask_login import login_required
# from Crypto.PublicKey import RSA
# from Crypto.Cipher import PKCS1_OAEP
# import base64

@app.route('/patient/patient-profile', methods=['POST'])
@login_required(role='patient')
def patient_profile():
    try:
        patient_id = session.get('user_id')  # Retrieve logged-in patient ID from session
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute('''
            SELECT p.name, p.email, p.phone, dep.name AS department
            FROM patients p
            LEFT JOIN departments dep ON p.department_id = dep.id
            WHERE p.id = %s
        ''', (patient_id,))
        patient = cursor.fetchone()
        db.commit()
        cursor.execute("SELECT eth_address FROM patients WHERE id = %s", (patient_id,))
        patient_row = cursor.fetchone()
        patient_address = patient_row["eth_address"]
        db.close()

        if not patient:
            return jsonify({"success": False, "message": "Patient not found!"}), 404

        # Parse JSON data from request
        data = request.get_json()
        private_key = data.get('private_key')
        print(private_key)
        if not private_key:
            return jsonify({"success": False, "message": "Private key is missing"}), 400

        # Load patient's RSA private key
        # rsa_key = RSA.import_key(private_key)
        # cipher = PKCS1_OAEP.new(rsa_key)

        # Fetch prescriptions
        prescriptions_raw = contract.functions.getAllPrescriptions(patient_address).call()
        if not prescriptions_raw:
            return jsonify({"success": False, "message": "No prescriptions found on blockchain"}), 404

        # Decrypt prescriptions
        prescriptions = []
        for pres in prescriptions_raw:
            decrypted_medication = rdecrypt_data(pres[3], private_key)

            prescriptions.append({
                "id": pres[0],
                "doctor": pres[1],
                "patient": pres[2],
                "medication": decrypted_medication,
                "timings": pres[4],
                "days": pres[5],
                "comments": pres[6],
                "timestamp": datetime.datetime.fromtimestamp(pres[7])
            })

        return jsonify({"success": True, "patient-profile": patient, "prescriptions": prescriptions}), 200
    except ValueError as e:
        return jsonify({"success": False, "message": "RSA key format is not supported: " + str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/request-appointment', methods=['POST'])
@login_required(role='patient')
def request_appointment():
    """Handle appointment request by patient."""
    try:
        print("Request received!")
        patient_id = session.get('user_id')  # Automatically get the logged-in patient ID
        department_id = request.form['department_id']
        doctor_id = request.form['doctor_id']
        date = request.form['date']

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO appointments (doctor_id, patient_id,department_id, date, status)
            VALUES (%s, %s, %s, %s, %s)
        ''', (doctor_id, patient_id, department_id,date, 'Pending'))
        db.commit()
        db.close()

        return redirect(url_for('patient_dashboard'))
    except Exception as e:
        return {"success": False, "message": str(e)}, 400

@app.route('/get-available-doctors', methods=['POST'])
@login_required(role='patient')  # Ensure this is accessible only by logged-in patients
def get_available_doctors():
    """Fetch doctors available for the selected department and time."""
    try:
        print("Request received in get!")
        # Extract the department ID and selected time from the request
        data = request.get_json()
        department_id = data['department_id']
        selected_time = data['selected_time']

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Query to fetch doctors in the selected department who are free at the given time
        cursor.execute('''
            SELECT d.id, d.name
            FROM doctors d
            WHERE d.department_id = %s
            AND NOT EXISTS (
                SELECT *
                FROM appointments a
                WHERE a.doctor_id = d.id AND a.date = %s
            )

        ''', (department_id, selected_time))

        available_doctors = cursor.fetchall()
        db.close()

        # Return the list of available doctors
        if available_doctors:
            return {"success": True, "available_doctors": available_doctors}, 200
        else:
            return {"success": True, "available_doctors": []}, 200

    except Exception as e:
        return {"success": False, "message": str(e)}, 500


@app.route('/patient/patient-appointments', methods=['GET'])
@login_required(role='patient')
def patient_appointments():
    """Fetch appointments for the logged-in doctor."""
    patient_id = session.get('user_id')  # Retrieve logged-in doctor ID from session
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT a.id, d.name AS doctor_name, a.date, a.status
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = %s
    ''', (patient_id,))
    appointments = cursor.fetchall()
    db.close()
    print(appointments)  # Debugging

    return {"success": True, "patient-appointments": appointments}, 200

############################################ Logout Route #########################################

@app.route('/logout', methods=['POST'])
def logout():
    """Logout and clear the session."""
    session.clear()
    return redirect(url_for('index'))

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
