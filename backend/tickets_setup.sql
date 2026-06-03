-- 1. Create the Support Tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id SERIAL PRIMARY KEY,
    sender_email TEXT NOT NULL,
    subject TEXT,
    message_body TEXT,
    status TEXT DEFAULT 'Open',
    testmail_id TEXT UNIQUE NOT NULL, -- To prevent duplicate imports
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 3. We do NOT add public policies. This ensures that only the backend, 
-- using the secure SECURITY DEFINER functions below, can access this table.

-- 4. Create an RPC to safely insert new tickets
CREATE OR REPLACE FUNCTION public.import_ticket(
    sender_input TEXT,
    subject_input TEXT,
    body_input TEXT,
    testmail_id_input TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    inserted BOOLEAN := false;
BEGIN
    -- Insert only if the testmail_id doesn't already exist (Conflict resolution)
    INSERT INTO public.support_tickets (sender_email, subject, message_body, testmail_id)
    VALUES (sender_input, subject_input, body_input, testmail_id_input)
    ON CONFLICT (testmail_id) DO NOTHING;
    
    -- Check if a row was actually inserted
    IF FOUND THEN
        inserted := true;
    END IF;

    RETURN inserted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
