export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const emailPayload = req.body;
    
    // Log the incoming email to Vercel Logs so the admin can read it
    console.log("INCOMING EMAIL RECEIVED!");
    console.log("From:", emailPayload.from);
    console.log("Subject:", emailPayload.subject);
    console.log("Text Body:", emailPayload.text);
    
    // In the future, we can insert this into Supabase here

    // Resend requires a 200 OK response to know the webhook was received successfully
    res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
