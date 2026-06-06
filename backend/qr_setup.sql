-- 1. Add 'attended' column to RSVPs table
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS attended BOOLEAN DEFAULT FALSE;

-- The default value is FALSE. When an admin scans the ticket, the backend or frontend will set this to TRUE.
