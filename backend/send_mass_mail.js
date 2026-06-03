require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMassMail() {
    console.log("Fetching emails from Supabase...");
    
    // We fetch emails from the 'rsvps' table, which is the only table with emails currently available
    const { data: rsvps, error } = await supabase.from('rsvps').select('email, name');
    
    if (error) {
        console.error("Error fetching RSVPs:", error);
        return;
    }

    if (!rsvps || rsvps.length === 0) {
        console.log("No emails found in the RSVPs table.");
        return;
    }

    const templatePath = path.join(__dirname, 'templates', 'welcome_otp.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    console.log(`Found ${rsvps.length} emails. Starting to send emails...`);

    for (const rsvp of rsvps) {
        // Generating a random 6-digit OTP for testing purposes
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const html = template.replace('{{OTP_CODE}}', otp);

        try {
            const data = await resend.emails.send({
                from: 'event@techclub.niat.me',
                to: rsvp.email,
                subject: 'Welcome to NIAT Tech Club! 🎉',
                html: html
            });
            console.log(`Successfully sent email to ${rsvp.email}`);
        } catch (err) {
            console.error(`Failed to send email to ${rsvp.email}`, err);
        }
    }
    
    console.log("Finished sending mass emails.");
}

sendMassMail();
