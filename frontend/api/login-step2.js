import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({ error: 'Email, password, and OTP are required' });
  }

  try {
    // 1. Verify OTP using verify_otp RPC
    const { data: isValid, error: verifyError } = await supabase
      .rpc('verify_otp', {
        email_input: email.toLowerCase().trim(),
        otp_input: otp.trim(),
      });

    if (verifyError) {
      console.error('OTP verification error:', verifyError);
      return res.status(500).json({ error: 'Verification failed' });
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new one.' });
    }

    // 2. Fetch user profile via login_user RPC to return authenticated user details
    const { data: users, error: loginError } = await supabase
      .rpc('login_user', {
        email_input: email.toLowerCase().trim(),
        password_input: password,
      });

    if (loginError) {
      console.error('Login verification error:', loginError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({ user: users[0] });
  } catch (err) {
    console.error('Failed to process login step 2:', err);
    return res.status(500).json({ error: 'Failed to complete login request' });
  }
}
