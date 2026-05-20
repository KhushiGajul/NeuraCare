import transporter from '../Config/mail.js';

// Simple in-memory store for OTPs (email -> { otp, expiresAt })
const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const sendWelcomeMail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to NeuraCare!",
        text: `Hello ${name},\n\nWelcome to NeuraCare! We are glad to have you on board.\n\nBest Regards,\nNeuraCare Team`
    };
    await transporter.sendMail(mailOptions);
}

const sendOTP = async (email) => {
    const otp = generateOTP();
    // expire in 10 minutes
    const expiresAt = Date.now() + 10 * 60 * 1000;
    
    otpStore.set(email, { otp, expiresAt });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`
    };
    
    await transporter.sendMail(mailOptions);
    return true;
}

const verifyOTP = (email, otpToVerify, keepRecord = false) => {
    const record = otpStore.get(email);
    if (!record) {
        throw new Error("No OTP requested for this email.");
    }
    
    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        throw new Error("OTP has expired. Please request a new one.");
    }
    
    if (record.otp !== otpToVerify) {
        throw new Error("Invalid OTP.");
    }
    
    // OTP verified successfully, remove it from store unless keeping record
    if (!keepRecord) {
        otpStore.delete(email);
    }
    return true;
}

export { sendWelcomeMail, sendOTP, verifyOTP };