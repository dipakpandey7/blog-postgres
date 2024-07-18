import { stripe } from '../config/stripe';
import { Payment } from '../models/payment.model';

export const createPaymentIntent = async (amount: number, currency: string, userId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects amount in cents
    currency,
    metadata: { userId },
  });

  await Payment.create({
    userId,
    amount,
    currency,
    paymentIntentId: paymentIntent.id,
    status: 'pending',
  });

  return paymentIntent;
};

export const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

  await Payment.update(
    { status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed' },
    { where: { paymentIntentId } }
  );

  return paymentIntent;
};

export const getAllPayments = async () => {
  return Payment.findAll();
};

export const getPaymentsByUser = async (userId: string) => {
  return Payment.findAll({ where: { userId } });
};