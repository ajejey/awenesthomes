import nodemailer from 'nodemailer';
import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  EMAIL_SERVER_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_SERVER_PORT: z.coerce.number().default(587),
  EMAIL_SERVER_USER: z.string(),
  EMAIL_SERVER_PASSWORD: z.string(),
  EMAIL_FROM: z.string().email(),
});

// Validate environment variables or use defaults for development
const env = {
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  EMAIL_SERVER_PORT: Number(process.env.EMAIL_SERVER_PORT) || 587,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || 'your-email@gmail.com',
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD || 'your-app-password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'AweNestHomes <noreply@aweneshomes.com>',
};

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  secure: env.EMAIL_SERVER_PORT === 465,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

// Email templates
const emailTemplates = {
  otpVerification: (otp: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #3b82f6;
          margin: 20px 0;
          padding: 10px;
          background-color: #f0f7ff;
          border-radius: 6px;
          display: inline-block;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #eaeaea;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 20px;
        }
        .note {
          margin-top: 20px;
          font-size: 14px;
          color: #6b7280;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AweNestHomes</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email</h2>
          <p>Thank you for choosing AweNestHomes. Please use the verification code below to complete your sign-in:</p>
          <div class="otp-code">${otp}</div>
          <p class="note">This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AweNestHomes. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  welcomeEmail: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AweNestHomes</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #eaeaea;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 20px;
        }
        .feature {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 6px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AweNestHomes</h1>
        </div>
        <div class="content">
          <h2>Welcome to AweNestHomes, ${name || 'Traveler'}!</h2>
          <p>Thank you for joining AweNestHomes, your gateway to unique accommodations across India.</p>
          
          <div class="feature">
            <h3>Find Your Perfect Stay</h3>
            <p>Discover thousands of properties across India, from beachfront villas to mountain retreats.</p>
          </div>
          
          <div class="feature">
            <h3>Secure Booking</h3>
            <p>Book with confidence using our secure payment system powered by Razorpay.</p>
          </div>
          
          <div class="feature">
            <h3>24/7 Support</h3>
            <p>Our customer support team is always ready to help you with any questions.</p>
          </div>
          
          <p>Ready to start exploring?</p>
          <a href="https://aweneshomes.com/explore" class="button">Explore Properties</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AweNestHomes. All rights reserved.</p>
          <p>This email was sent to you because you signed up for AweNestHomes.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  bookingConfirmation: (bookingDetails: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .content {
          padding: 30px 20px;
        }
        .booking-details {
          background-color: #f0f7ff;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .booking-details table {
          width: 100%;
          border-collapse: collapse;
        }
        .booking-details table td {
          padding: 8px 0;
        }
        .booking-details table td:first-child {
          font-weight: 600;
          width: 40%;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #eaeaea;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AweNestHomes</h1>
        </div>
        <div class="content">
          <h2>Booking Confirmation</h2>
          <p>Your booking has been confirmed! Here are the details:</p>
          
          <div class="booking-details">
            <table>
              <tr>
                <td>Booking ID:</td>
                <td>${bookingDetails.id}</td>
              </tr>
              <tr>
                <td>Property:</td>
                <td>${bookingDetails.propertyName}</td>
              </tr>
              <tr>
                <td>Check-in:</td>
                <td>${bookingDetails.checkIn}</td>
              </tr>
              <tr>
                <td>Check-out:</td>
                <td>${bookingDetails.checkOut}</td>
              </tr>
              <tr>
                <td>Guests:</td>
                <td>${bookingDetails.guests}</td>
              </tr>
              <tr>
                <td>Total Amount:</td>
                <td>₹${bookingDetails.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>
          
          <p>You can view your booking details and manage your reservation from your account.</p>
          <a href="https://aweneshomes.com/bookings/${bookingDetails.id}" class="button">View Booking</a>
          
          <p style="margin-top: 30px;">Need help? Contact our support team at support@aweneshomes.com</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AweNestHomes. All rights reserved.</p>
          <p>This is a confirmation of your booking with AweNestHomes.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: 'Your Verification Code for AweNestHomes',
    html: emailTemplates.otpVerification(otp),
  });
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name?: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to AweNestHomes!',
    html: emailTemplates.welcomeEmail(name || ''),
  });
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail(email: string, bookingDetails: any) {
  return sendEmail({
    to: email,
    subject: 'Booking Confirmation - AweNestHomes',
    html: emailTemplates.bookingConfirmation(bookingDetails),
  });
}

export { emailTemplates };
