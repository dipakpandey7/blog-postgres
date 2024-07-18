import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: "noobgaming2907@gmail.com",  
    pass: "xicdyhklbrwlaood",
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    console.log('Sending email to:', to);  
    try {
      await transporter.sendMail({
        from: 'noobgaming2907@gmail.com',
        to,
        subject,
        text
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };