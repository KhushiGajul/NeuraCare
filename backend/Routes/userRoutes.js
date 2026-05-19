import { Router } from 'express';
import userController from '../Controllers/userController.js';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/profile', userController.updateProfile);
router.get('/:id', userController.getUserByID);

export default router;
