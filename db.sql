use medical_records_management;

CREATE TABLE management (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    doctor_id INT,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Add phone number to the doctor table
ALTER TABLE doctors
ADD COLUMN phone VARCHAR(15) NOT NULL;

-- Add phone number to the patient table
ALTER TABLE patients
ADD COLUMN phone VARCHAR(15) NOT NULL;

INSERT INTO departments (name, description) 
VALUES 
    ('Cardiology', 'Heart and blood vessel specialists'), 
    ('Neurology', 'Brain and nervous system specialists'),
    ('Orthopedics', 'Bone and musculoskeletal specialists'),
    ('Pediatrics', 'Child healthcare specialists'),
    ('Dermatology', 'Skin care and treatment specialists'),
    ('Gynecology', 'Women’s reproductive health specialists'),
    ('Gastroenterology', 'Digestive system specialists');
    
INSERT INTO doctors (name, email, phone, password, department_id) 
VALUES ('Dr. Shruthi', 'shruthichintakayala@gmail.com', '6300000000', '123', 1);

INSERT INTO doctors (name, email, phone, password, department_id) 
VALUES ('Dr. vinay', '21eg105b33@gmail.com', '6300000000', '123',2);

INSERT INTO patients (name, email, phone, password, department_id) 
VALUES ('Ravi', '21eg105b33@anurag.edu.in', '6300000001', '123',1);

UPDATE patients
SET doctor_id = 1
WHERE patients.id = 1;
