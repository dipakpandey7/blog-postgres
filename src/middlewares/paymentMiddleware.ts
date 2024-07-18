import { Request, Response, NextFunction } from 'express';

export const paymentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (typeof currency !== 'string' || currency.length !== 3) {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  next();
};