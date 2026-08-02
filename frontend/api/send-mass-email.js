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
    const { audience, subject, html, customEmails } = req.body || {};

    if (!audience || !subject || !html) {
      return res.status(400).json({ error: 'Audience, subject, and html are required' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const resendKey = process.env.RESEND_API_KEY || process.env.RESEND_API_KEY_EVENTS || process.env.RESEND_API_KEY_MAIN;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Database configuration missing' });
    }
    if (!resendKey) {
      return res.status(500).json({ error: 'Email service configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resendEvents = new Resend(resendKey);

    let rsvps = [];
    if (audience === 'custom') {
      if (!customEmails) {
        return res.status(400).json({ error: 'Custom emails are required when audience is custom' });
      }
      const emailsList = customEmails.split(',').map(e => e.trim()).filter(e => e);
      
      const { data } = await supabase.from('rsvps').select('id, email, name').in('email', emailsList);
      if (data && data.length > 0) {
        rsvps = data;
      } else {
        rsvps = emailsList.map(email => ({ email, name: 'Member' }));
      }
    } else {
      let query = supabase.from('rsvps').select('id, email, name');
      
      if (audience !== 'all') {
        query = query.eq('event_slug', audience);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audience from Supabase:', error);
        return res.status(500).json({ error: 'Failed to fetch audience list' });
      }
      rsvps = data || [];
    }

    if (!rsvps || rsvps.length === 0) {
      return res.status(400).json({ error: 'No recipients found for this audience' });
    }

    const uniqueRsvpsMap = new Map();
    for (const rsvp of rsvps) {
      if (!uniqueRsvpsMap.has(rsvp.email)) {
        uniqueRsvpsMap.set(rsvp.email, rsvp);
      }
    }
    const uniqueRsvps = Array.from(uniqueRsvpsMap.values());

    const batchPayloads = uniqueRsvps.map(rsvp => {
      let personalizedHtml = html;
      personalizedHtml = personalizedHtml.replace(/{{NAME}}/g, rsvp.name || 'Member');

      if (personalizedHtml.includes('{{QR_CODE}}')) {
        if (rsvp.id) {
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${rsvp.id}`;
          const qrHtml = `<div style="text-align: center; margin: 30px 0;"><p style="font-size: 14px; color: #666; margin-bottom: 10px;">Scan this QR code at the venue for check-in:</p><img src="${qrCodeUrl}" alt="Your Ticket QR Code" style="border-radius: 8px; border: 1px solid #eaeaea; padding: 10px; background: white;" /></div>`;
          personalizedHtml = personalizedHtml.replace(/{{QR_CODE}}/g, qrHtml);
        } else {
          personalizedHtml = personalizedHtml.replace(/{{QR_CODE}}/g, '');
        }
      }

      return {
        from: 'Tech Club <event@techclub.niat.me>',
        to: rsvp.email,
        subject: subject,
        html: personalizedHtml
      };
    });

    const chunkArray = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
    const chunks = chunkArray(batchPayloads, 50);

    for (const chunk of chunks) {
      await resendEvents.batch.send(chunk);
    }

    return res.status(200).json({ message: `Successfully sent email to ${uniqueRsvps.length} recipients.` });
  } catch (error) {
    console.error('Error sending mass email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send mass emails' });
  }
}
