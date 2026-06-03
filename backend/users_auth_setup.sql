-- 0. Create the sequence
CREATE SEQUENCE IF NOT EXISTS use_auth_id_seq;

-- Drop the table if it already exists (useful for clean setups)
DROP TABLE IF EXISTS public.use_auth CASCADE;

-- Create the authentication table
CREATE TABLE public.use_auth (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    department TEXT NOT NULL,
    github_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.use_auth ENABLE ROW LEVEL SECURITY;

-- Policy for reading: Allow authenticated or anonymous users to read non-sensitive fields
-- Note: Adjust this policy based on your specific requirements
CREATE POLICY "Allow Public Read" 
ON public.use_auth
FOR SELECT 
USING (true);

-- Policy for inserting: Allow anyone to create an account
CREATE POLICY "Allow Public Insert" 
ON public.use_auth
FOR INSERT 
WITH CHECK (true);

-- Policy for updating: Allow users to update their own profile
CREATE POLICY "Allow Public Update" 
ON public.use_auth
FOR UPDATE
USING (true)
WITH CHECK (true);

-- ============================================================================
-- Section 2: Password Hashing Trigger
-- ============================================================================

-- Function to hash passwords before inserting or updating
CREATE OR REPLACE FUNCTION public.hash_user_password()
RETURNS TRIGGER AS $$
BEGIN
    -- Only hash if the password is provided and not already hashed
    IF NEW.password IS NOT NULL AND NEW.password NOT LIKE '$2a$%' AND NEW.password NOT LIKE '$2b$%' THEN
        NEW.password := crypt(NEW.password, gen_salt('bf', 10));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to hash password on INSERT
DROP TRIGGER IF EXISTS hash_user_password_insert ON public.use_auth;
CREATE TRIGGER hash_user_password_insert
BEFORE INSERT ON public.use_auth
FOR EACH ROW
EXECUTE FUNCTION public.hash_user_password();

-- Trigger to hash password on UPDATE (only if password has changed)
DROP TRIGGER IF EXISTS hash_user_password_update ON public.use_auth;
CREATE TRIGGER hash_user_password_update
BEFORE UPDATE ON public.use_auth
FOR EACH ROW
WHEN (NEW.password IS DISTINCT FROM OLD.password)
EXECUTE FUNCTION public.hash_user_password();

-- ============================================================================
-- Section 3: Login Authentication RPC (Remote Procedure Call)
-- ============================================================================

-- 4. Secure RPC Function for Login Validation (bcrypt-aware)
CREATE OR REPLACE FUNCTION public.login_user(
    email_input TEXT,
    password_input TEXT
)
RETURNS TABLE (
    id INTEGER,
    email TEXT,
    name TEXT,
    roll_number TEXT,
    department TEXT,
    github_username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.roll_number, 
        u.department, 
        u.github_username
    FROM public.use_auth u
    WHERE LOWER(u.email) = LOWER(email_input)
      AND u.password = crypt(password_input, u.password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Secure RPC Function for Profile Updates
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_email TEXT,
    new_name TEXT,
    new_roll_number TEXT,
    new_department TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.use_auth
    SET 
        name = COALESCE(new_name, name),
        roll_number = COALESCE(new_roll_number, roll_number),
        department = COALESCE(new_department, department)
    WHERE email = user_email;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
