import { Request, Response } from 'express';
import { createPaymentIntent, confirmPayment, getAllPayments, getPaymentsByUser } from '../services/paymentService';
import { Payment } from '../models/payment.model';

export const createPaymentIntentController = async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body;
      const userId = (req.user as any).userId; 
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const paymentIntent = await createPaymentIntent(amount, currency, userId);
      res.status(200).json(paymentIntent);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  };

export const confirmPaymentController = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const confirmedPayment = await confirmPayment(paymentIntentId);
    res.status(200).json(confirmedPayment);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const getAllPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getPaymentsByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payments = await getPaymentsByUser(userId);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ error: 'Failed to fetch user payments' });
  }
};