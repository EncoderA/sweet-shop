import { Router } from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateLogin, validateRegister } from '../middleware/validationMiddleware';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);

router.get('/profile', authenticateToken, getProfile);

export default router;