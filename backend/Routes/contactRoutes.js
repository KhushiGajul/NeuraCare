import { Router } from 'express';
import contactController from '../Controllers/contactController.js';

const router = Router();

router.post('/', contactController.sendMessage);
router.get('/history', contactController.getConversationHistory);
router.get('/doctor/:doctor_id', contactController.getDoctorQueries);

export default router;
