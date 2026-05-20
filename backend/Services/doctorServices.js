import db from '../Config/db.js';
import bcrypt from 'bcrypt';

const allDoctors = async () => {
    const [doctors] = await db.promise().query('SELECT * FROM doctors');
    return doctors;
};

const getDoctorByID = async (doctorID) => {
    const [doctors] = await db.promise().query('SELECT * FROM doctors WHERE id = ?', [doctorID]);
    return doctors;
};

const loginDoctor = async (email, password) => {
    const [doctors] = await db.promise().query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (doctors.length === 0) {
        throw new Error('Invalid credentials');
    }

    const doctor = doctors[0];
    let isMatch = false;
    try {
        isMatch = await bcrypt.compare(password, doctor.password);
    } catch (e) {
        isMatch = (password === doctor.password);
    }
    if (!isMatch) {
        isMatch = (password === doctor.password);
    }

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const { password: _, ...doctorWithoutPassword } = doctor;
    return doctorWithoutPassword;
};

const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.promise().query(
        'UPDATE doctors SET password = ? WHERE email = ?',
        [hashedPassword, email]
    );
    if (result.affectedRows === 0) {
        throw new Error('Doctor not found');
    }
    return true;
};

const signupDoctor = async (doctorData) => {
    const { name, email, password } = doctorData;
    
    // Check if doctor exists
    const [existing] = await db.promise().query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (existing.length > 0) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.promise().query(
        'INSERT INTO doctors (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return result.insertId;
}

export default { allDoctors, getDoctorByID, loginDoctor, updatePassword, signupDoctor };