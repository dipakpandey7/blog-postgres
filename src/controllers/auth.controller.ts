// import  jwt  from 'jsonwebtoken';
// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { User } from "../models/user.model";
// import {sendOTP} from "../services/emailService";
// import {generateOtp} from"../utils/otp";
// import OTP from '../models/otp.model';

// const JWT_SECRET = process.env.JWT_SECRET || "cbakjcbsafcadc8438dhd7e47r"

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;
//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashPassword,
//     });

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error("Error creating user:", error); // Log the error for debugging
//     return res
//       .status(500)
//       .json({ message: "Server error or something went wrong" });
//   }
// };


// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user: any = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//     console.log("User Login successfully");
    
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };


import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { sendOTP } from "../services/emailService";
import { generateOtp } from "../utils/otp";
import OTP from '../models/otp.model';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || "cbakjcbsafcadc8438dhd7e47r";
const OTP_RATE_LIMIT = 5; // Number of OTP requests allowed per hour
const OTP_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error or something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
    console.log("User Login successfully");
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement rate limiting
    const recentOTPCount = await OTP.count({
      where: {
        userId: user.id,
        createdAt: {
          [Op.gte]: new Date(Date.now() - OTP_RATE_LIMIT_WINDOW)
        }
      }
    });

    if (recentOTPCount >= OTP_RATE_LIMIT) {
      return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Hash OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Store OTP in the database
    await OTP.create({ userId: user.id, otp: hashedOTP, expiresAt });

    await sendOTP(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpRecord = await OTP.findOne({ 
      where: { 
        userId: user.id,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValidOTP) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    await OTP.destroy({ where: { userId: user.id } }); // Delete OTP after verification

    // Proceed with login process (generate JWT token)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Cleanup function to remove expired OTPs
export const cleanupExpiredOTPs = async () => {
  try {
    await OTP.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
    console.log('Expired OTPs cleaned up');
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
};

// Schedule cleanup to run every hour
setInterval(cleanupExpiredOTPs, 60 * 60 * 1000);
