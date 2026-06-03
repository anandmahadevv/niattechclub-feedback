-- 1. Create the OTP table
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- 3. We do NOT add public policies. This ensures that only the backend, 
-- using the secure SECURITY DEFINER functions below, can access this table.

-- 4. Create RPC to generate and store a hashed OTP
CREATE OR REPLACE FUNCTION public.create_otp(email_input TEXT, otp_input TEXT)
RETURNS VOID AS $$
BEGIN
    -- Delete any existing OTPs for this user to keep the table clean
    DELETE FROM public.otp_codes WHERE email = email_input;

    -- Insert the new OTP, hashed for security, with a 10-minute expiration
    INSERT INTO public.otp_codes (email, otp_hash, expires_at)
    VALUES (
        email_input,
        crypt(otp_input, gen_salt('bf', 8)),
        NOW() + INTERVAL '10 minutes'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create RPC to verify the OTP
CREATE OR REPLACE FUNCTION public.verify_otp(email_input TEXT, otp_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_valid BOOLEAN := false;
BEGIN
    -- Check if there is a matching, unexpired OTP
    SELECT true INTO is_valid
    FROM public.otp_codes
    WHERE email = email_input
      AND otp_hash = crypt(otp_input, otp_hash)
      AND expires_at > NOW();

    -- If the OTP is valid, delete it so it cannot be reused
    IF COALESCE(is_valid, false) THEN
        DELETE FROM public.otp_codes WHERE email = email_input;
    END IF;

    RETURN COALESCE(is_valid, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
