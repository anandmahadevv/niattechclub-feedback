import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const resendKey = process.env.RESEND_API_KEY || process.env.RESEND_API_KEY_SUPPORT || process.env.RESEND_API_KEY_MAIN;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Database configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── 1. Check the email exists in use_auth ───────────────────────────────
    const { data: users, error: lookupError } = await supabase
      .rpc('get_user_by_email', { email_input: cleanEmail });

    if (lookupError) {
      console.error('Database user lookup error:', lookupError);
      return res.status(500).json({ error: 'Failed to lookup user account' });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'No account found with this email address.' });
    }

    // ── 2. Generate a secure 6-digit OTP ─────────────────────────────────────
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ── 3. Store OTP in Supabase ─────────────────────────────────────────────
    const { error: storeError } = await supabase
      .rpc('create_otp', {
        email_input: cleanEmail,
        otp_input: otp,
      });

    if (storeError) {
      console.error('Failed to store OTP:', storeError);
      return res.status(500).json({ error: 'Failed to generate reset code' });
    }

    if (!resendKey) {
      console.error('Missing Resend API key');
      return res.status(500).json({ error: 'Email service configuration missing' });
    }

    const resend = new Resend(resendKey);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">NIAT Tech Club</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Password Reset Request</p>
        </div>
        
        <div style="padding: 40px 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Hello,</p>
          <p style="color: #374151; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
            We received a request to reset your password. Use the 6-digit code below. 
            It is valid for <strong>10 minutes</strong> and can only be used once.
          </p>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 32px; text-align: center; margin: 0 0 32px;">
            <p style="color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Your Reset Code</p>
            <p style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #4f46e5; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
          </div>

          <div style="background: #fef9ec; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 0 0 32px;">
            <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
              ⚠️ If you did not request this, please ignore this email. 
              Your account remains secure and no changes have been made.
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
      to: cleanEmail,
      subject: 'Your Password Reset Code — NIAT Tech Club',
      html,
    });

    return res.status(200).json({ message: 'Reset code sent successfully' });
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}
