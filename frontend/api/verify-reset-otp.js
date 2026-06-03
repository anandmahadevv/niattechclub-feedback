import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY   // Anon key is fine — all DB calls go through SECURITY DEFINER RPCs
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // ── 1. Verify OTP server-side ────────────────────────────────────────────
  const { data: isValid, error: verifyError } = await supabase
    .rpc('verify_otp', {
      email_input: email.toLowerCase(),
      otp_input: otp,
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
      user_email: email.toLowerCase(),
      new_password: newPassword,
    });

  if (resetError) {
    console.error('Password reset error:', resetError);
    return res.status(500).json({ error: 'Failed to reset password' });
  }

  return res.status(200).json({ message: 'Password reset successfully' });
}
