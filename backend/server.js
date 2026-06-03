require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 5000;

const resendEvents = new Resend(process.env.RESEND_API_KEY_EVENTS);
const resendMain = new Resend(process.env.RESEND_API_KEY_MAIN);
const resendSupport = new Resend(process.env.RESEND_API_KEY_SUPPORT);

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate a secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the OTP in Supabase
  const { error: dbError } = await supabase.rpc('create_otp', {
    email_input: email,
    otp_input: otp
  });

  if (dbError) {
    console.error('Error storing OTP:', dbError);
    return res.status(500).json({ error: 'Failed to prepare OTP securely' });
  }

  try {
    const data = await resendSupport.emails.send({
      from: 'support@techclub.niat.me',
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

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const { data: isValid, error } = await supabase.rpc('verify_otp', {
      email_input: email,
      otp_input: otp
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ error: 'Failed to verify OTP' });
    }

    if (isValid) {
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login-step1', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Verify credentials
    const { data: users, error: loginError } = await supabase
      .rpc('login_user', {
        email_input: email.toLowerCase().trim(),
        password_input: password
      });

    if (loginError) {
      console.error('Login error:', loginError);
      return res.status(500).json({ error: 'Verification failed' });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 2. Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in Supabase using create_otp
    const { error: dbError } = await supabase.rpc('create_otp', {
      email_input: email.toLowerCase().trim(),
      otp_input: otp
    });

    if (dbError) {
      console.error('Error storing OTP:', dbError);
      return res.status(500).json({ error: 'Failed to prepare OTP securely' });
    }

    // 4. Send email via Resend (using support key)
    const data = await resendSupport.emails.send({
      from: 'support@techclub.niat.me',
      to: email,
      subject: 'Your Login Verification Code — NIAT Tech Club',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4F46E5;">Two-Factor Authentication</h2>
          <p>Hello ${user.name || 'Member'},</p>
          <p>To complete your sign-in, please use the 6-digit verification code below. It is valid for 10 minutes:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otp}</span>
          </div>
          <p>If you did not attempt to sign in to your NIAT Tech Club account, please reset your password immediately.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Tech Club Team</strong></p>
        </div>
      `
    });

    res.status(200).json({ message: 'Verification code sent successfully', data });
  } catch (error) {
    console.error('Error in login step 1:', error);
    res.status(500).json({ error: 'Failed to send login verification code' });
  }
});

app.post('/api/login-step2', async (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({ error: 'Email, password, and OTP are required' });
  }

  try {
    // 1. Verify OTP
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_otp', {
      email_input: email.toLowerCase().trim(),
      otp_input: otp.trim()
    });

    if (verifyError) {
      console.error('OTP verification error:', verifyError);
      return res.status(500).json({ error: 'Failed to verify OTP' });
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // 2. Fetch user profile
    const { data: users, error: loginError } = await supabase
      .rpc('login_user', {
        email_input: email.toLowerCase().trim(),
        password_input: password
      });

    if (loginError) {
      console.error('Fetch profile error:', loginError);
      return res.status(500).json({ error: 'Failed to retrieve profile data' });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Error in login step 2:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
