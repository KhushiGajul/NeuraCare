import { Router } from 'express';
import doctorController from '../Controllers/doctorController.js';

const router = Router();

router.get('/', doctorController.allDoctors);
router.get('/:id', doctorController.getDoctorByID);
router.post('/login', doctorController.loginDoctor);

export default router;
