require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 5000;

const resendEvents = new Resend(process.env.RESEND_API_KEY_EVENTS);
const resendGeneral = new Resend(process.env.RESEND_API_KEY_GENERAL);

app.use(cors());
app.use(express.json());

app.post('/api/send-rsvp-email', async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const data = await resendEvents.emails.send({
      from: 'event@techclub.niat.me',
      to: email,
      subject: 'PromptWars 2026 - Registration Confirmed! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4F46E5;">Congratulations, ${name}!</h2>
          <p>You have successfully registered and secured your entry for <strong>PromptWars 2026</strong>.</p>
          <p>We are excited to see what you build using generative AI!</p>
          <p>Keep an eye on this email address for further updates regarding the schedule and venue details.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Tech Club Team</strong></p>
        </div>
      `
    });

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/send-reset-email', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const data = await resendGeneral.emails.send({
      from: 'techclub@niat.me',
      to: email,
      subject: 'Password Reset Code - NIAT Tech Club',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4F46E5;">Password Reset</h2>
          <p>We received a request to reset your password. Use the code below to reset it:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otp}</span>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Tech Club Team</strong></p>
        </div>
      `
    });

    res.status(200).json({ message: 'Reset email sent successfully', data });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
