import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { Payment } from '../models/payment.model';

export const createPaymentPage = (req: Request, res: Response) => {
  res.render('payments/create', { stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, status, amount } = req.body;
    await Payment.create({
      paymentIntentId,
      status,
      amount: amount / 100,
      userId: (req.user as any).id,
      currency: 'usd',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};