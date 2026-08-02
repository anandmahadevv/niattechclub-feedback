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
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Database configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const cleanEmail = email.toLowerCase().trim();

    // ── 1. Verify OTP server-side ────────────────────────────────────────────
    const { data: isValid, error: verifyError } = await supabase
      .rpc('verify_otp', {
        email_input: cleanEmail,
        otp_input: otp.trim(),
      });

    if (verifyError) {
      console.error('OTP verification error:', verifyError);
      return res.status(500).json({ error: 'Verification failed' });
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired reset code. Please request a new one.' });
    }

    // ── 2. Reset the password via the secure RPC ─────────────────────────────
    const { error: resetError } = await supabase
      .rpc('reset_user_password', {
        user_email: cleanEmail,
        new_password: newPassword,
      });

    if (resetError) {
      console.error('Password reset error:', resetError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Unhandled error in verify-reset-otp:', err);
    return res.status(500).json({ error: err.message || 'Failed to process request' });
  }
}
