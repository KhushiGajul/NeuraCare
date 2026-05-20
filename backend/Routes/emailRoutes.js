import express from 'express';
import emailController from '../Controllers/emailController.js';

const router = express.Router();

router.post('/send-otp', emailController.sendOtpController);
router.post('/verify-otp', emailController.verifyOtpController);
router.post('/reset-password', emailController.resetPasswordController);

export default router;
