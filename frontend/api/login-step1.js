import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Verify credentials via login_user RPC
    const { data: users, error: loginError } = await supabase
      .rpc('login_user', {
        email_input: email.toLowerCase().trim(),
        password_input: password,
      });

    if (loginError) {
      console.error('Login verification error:', loginError);
      return res.status(500).json({ error: 'Failed to verify credentials' });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 2. Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in Supabase using create_otp
    const { error: otpError } = await supabase
      .rpc('create_otp', {
        email_input: email.toLowerCase().trim(),
        otp_input: otp,
      });

    if (otpError) {
      console.error('Failed to store login OTP:', otpError);
      return res.status(500).json({ error: 'Failed to generate security code' });
    }

    // 4. Send the OTP email via Resend
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">NIAT Tech Club</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Two-Factor Authentication</p>
        </div>
        
        <div style="padding: 40px 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Hello ${user.name || 'Member'},</p>
          <p style="color: #374151; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
            To complete your sign-in, please use the 6-digit verification code below. 
            It is valid for <strong>10 minutes</strong> and can only be used once.
          </p>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 32px; text-align: center; margin: 0 0 32px;">
            <p style="color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Your Verification Code</p>
            <p style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #4f46e5; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
          </div>

          <div style="background: #fef9ec; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 0 0 32px;">
            <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
              ⚠️ If you did not attempt to sign in to your NIAT Tech Club account, please reset your password immediately as your password might have been compromised.
            </p>
          </div>

          <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.6;">
            — The NIAT Tech Club Team
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'noreply@techclub.niat.me',
      to: email,
      subject: 'Your Login Verification Code — NIAT Tech Club',
      html,
    });

    return res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (err) {
    console.error('Failed to process login step 1:', err);
    return res.status(500).json({ error: 'Failed to process login request' });
  }
}
