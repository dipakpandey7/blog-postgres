import { Router } from 'express';
import { createPaymentIntentController, confirmPaymentController, getAllPaymentsController, getPaymentsByUserController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { paymentMiddleware } from '../middlewares/paymentMiddleware';

const router = Router();

router.post('/create-intent', authMiddleware, paymentMiddleware, createPaymentIntentController);
router.post('/confirm', authMiddleware, confirmPaymentController);
router.get('/all', authMiddleware, getAllPaymentsController);
router.get('/user/:userId', authMiddleware, getPaymentsByUserController);

export default router;