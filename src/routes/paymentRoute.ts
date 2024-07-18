import { Router } from 'express';
import { createPaymentPage, createPaymentIntent, updatePaymentStatus } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/create', authMiddleware, createPaymentPage);
router.post('/create-intent', authMiddleware, createPaymentIntent);
router.post('/update-status', authMiddleware, updatePaymentStatus);

export default router;