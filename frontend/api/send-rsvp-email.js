import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, status = 'confirmed' } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const isWaitlisted = status === 'waitlisted';
    
    const subject = isWaitlisted 
      ? 'PromptWars 2026 - You are on the waitlist ⏳' 
      : 'PromptWars 2026 - Registration Confirmed! 🎉';
      
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=promptwars:${encodeURIComponent(email)}`;
    
    const html = isWaitlisted ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ca8a04;">Hi ${name},</h2>
          <p>Thank you for your interest in <strong>PromptWars 2026</strong>!</p>
          <p>The event is currently at full capacity, so we have added you to the waitlist.</p>
          <p>If a spot opens up, we will notify you immediately by email!</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Tech Club Team</strong></p>
        </div>
    ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4F46E5;">Congratulations, ${name}!</h2>
          <p>You have successfully registered and secured your entry for <strong>PromptWars 2026</strong>.</p>
          <p>Please present the QR Code below at the check-in desk:</p>
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeUrl}" alt="Check-in QR Code" width="200" height="200" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px;" />
          </div>
          <p>We are excited to see what you build using generative AI!</p>
          <p>Keep an eye on this email address for further updates regarding the schedule and venue details.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Tech Club Team</strong></p>
        </div>
    `;

    const data = await resend.emails.send({
      from: 'event@techclub.niat.me',
      to: email,
      subject: subject,
      html: html
    });

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
