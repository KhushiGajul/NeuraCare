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

export default { allDoctors, getDoctorByID, loginDoctor };