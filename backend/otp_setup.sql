-- OTP Storage Table for Password Reset
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.password_reset_otps (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.password_reset_otps(email);

-- Enable RLS
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- No public access — only accessible via SECURITY DEFINER RPCs
-- CREATE POLICY ... (intentionally left empty — all access via RPCs below)

-- ============================================================
-- RPC 1: Create / replace OTP for an email
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_reset_otp(
    email_input TEXT,
    otp_input TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Delete any existing OTPs for this email first (clean slate)
    DELETE FROM public.password_reset_otps WHERE email = email_input;
    
    -- Insert fresh OTP, expires in 10 minutes
    INSERT INTO public.password_reset_otps (email, otp, expires_at)
    VALUES (email_input, otp_input, NOW() + INTERVAL '10 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC 2: Verify OTP — returns TRUE if valid, FALSE if not
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_reset_otp(
    email_input TEXT,
    otp_input TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    otp_record RECORD;
BEGIN
    SELECT * INTO otp_record
    FROM public.password_reset_otps
    WHERE email = email_input
      AND otp = otp_input
      AND used = FALSE
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF otp_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Mark as used so it can't be replayed
    UPDATE public.password_reset_otps
    SET used = TRUE
    WHERE id = otp_record.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Cleanup: Auto-delete expired OTPs (run periodically or manually)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.password_reset_otps WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
