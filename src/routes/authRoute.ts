import { Router } from 'express';
import { login, register, requestOTP, verifyOTP } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

export default router;