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
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('WARNING: Supabase URL or Key is missing. Database calls will fail.');
}
app.use(cors());
app.use(express.json());

app.post(['/api/send-rsvp-email', '/send-rsvp-email'], async (req, res) => {
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

app.post(['/api/send-reset-email', '/send-reset-email'], async (req, res) => {
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
      from: 'noreply@techclub.niat.me',
      reply_to: 'support@techclub.niat.me',
      to: email,
      subject: 'Password Reset Code - NIAT Tech Club',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center;">
            <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">NIAT Tech Club</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Password Reset</p>
          </div>
          
          <div style="padding: 40px 32px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Hello,</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
              We received a request to reset your password. Please use the 6-digit verification code below to proceed. 
              It is valid for <strong>10 minutes</strong> and can only be used once.
            </p>

            <div style="background: #f3f4f6; border-radius: 12px; padding: 32px; text-align: center; margin: 0 0 32px;">
              <p style="color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Your Reset Code</p>
              <p style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #4f46e5; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
            </div>

            <div style="background: #fef9ec; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 0 0 32px;">
              <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
                ⚠️ If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.6;">
              — The NIAT Tech Club Team
            </p>
          </div>
        </div>
      `
    });

    res.status(200).json({ message: 'Reset email sent successfully', data });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

app.post(['/api/verify-otp', '/verify-otp'], async (req, res) => {
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

app.post(['/api/login-step1', '/login-step1'], async (req, res) => {
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
      from: 'noreply@techclub.niat.me',
      reply_to: 'support@techclub.niat.me',
      to: email,
      subject: 'Your Login Verification Code — NIAT Tech Club',
      html: `
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
      `
    });

    res.status(200).json({ message: 'Verification code sent successfully', data });
  } catch (error) {
    console.error('Error in login step 1:', error);
    res.status(500).json({ error: 'Failed to send login verification code' });
  }
});

app.post(['/api/login-step2', '/login-step2'], async (req, res) => {
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

app.post(['/api/fetch-tickets', '/fetch-tickets'], async (req, res) => {
  const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
  const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

  if (!TESTMAIL_API_KEY || !TESTMAIL_NAMESPACE || TESTMAIL_NAMESPACE === 'put_your_namespace_here') {
    return res.status(500).json({ error: 'Testmail credentials not properly configured in .env' });
  }

  const query = `
    query {
      inbox (
        namespace: "${TESTMAIL_NAMESPACE}",
        limit: 20
      ) {
        result
        message
        emails {
          id
          from
          subject
          text
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.testmail.app/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TESTMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('Testmail API error:', data.errors);
      return res.status(500).json({ error: 'Testmail API returned an error', details: data.errors });
    }

    const emails = data.data.inbox.emails;
    let newTicketsImported = 0;

    for (const email of emails) {
      const sender = email.from || 'unknown@example.com';
      const subject = email.subject || 'No Subject';
      const body = email.text || 'No content provided.';
      const testmail_id = email.id;

      // Safely import into Supabase using the RPC
      const { data: inserted, error: dbError } = await supabase.rpc('import_ticket', {
        sender_input: sender,
        subject_input: subject,
        body_input: body,
        testmail_id_input: testmail_id
      });

      if (dbError) {
        console.error('Error importing ticket to Supabase:', dbError);
      } else if (inserted) {
        newTicketsImported++;
      }
    }

    res.status(200).json({ 
      message: 'Tickets fetched successfully', 
      total_emails_checked: emails.length,
      new_tickets_imported: newTicketsImported 
    });

  } catch (error) {
    console.error('Error fetching tickets from Testmail:', error);
    res.status(500).json({ error: 'Internal server error while fetching tickets' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
