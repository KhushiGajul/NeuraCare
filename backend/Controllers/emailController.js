import { sendOTP, verifyOTP } from '../Services/emailService.js';
import userServices from '../Services/userServices.js';
import doctorServices from '../Services/doctorServices.js';
import db from '../Config/db.js';

const sendOtpController = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({ error: 'Email and role are required' });
        }

        const table = role === 'doctor' ? 'doctors' : 'users';
        const [rows] = await db.promise().query(`SELECT id FROM ${table} WHERE email = ?`, [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No account found with this email' });
        }

        await sendOTP(email);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Pass keepRecord = true so it can be verified again during reset
        verifyOTP(email, otp, true); 
        res.status(200).json({ message: 'OTP is valid' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword, role } = req.body;
        if (!email || !otp || !newPassword || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify OTP and delete the record
        verifyOTP(email, otp, false);

        if (role === 'doctor') {
            await doctorServices.updatePassword(email, newPassword);
        } else {
            await userServices.updatePassword(email, newPassword);
        }

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { sendOtpController, verifyOtpController, resetPasswordController };
