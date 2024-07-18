import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';

export const sendEmailController = async (req: Request, res: Response) => {
    console.log('Request body:', req.body);  
    try {
      const { to, subject, text } = req.body;
      if (!to) {
        return res.status(400).json({ error: 'Recipient email is required' });
      }
      await sendEmail(to, subject, text);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error in sendEmailController:', error);
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  };