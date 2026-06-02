-- 1. Create Custom Auth Table
CREATE TABLE public.users_auth (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    department TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.users_auth ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Allow SignUp (Insert) but block Read/Select
CREATE POLICY "Allow Public SignUp" ON public.users_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Update" ON public.users_auth FOR UPDATE USING (true) WITH CHECK (true);
-- Note: No SELECT policy is created, meaning public queries cannot read passwords/emails.

-- 4. Secure RPC Function for Login Validation
CREATE OR REPLACE FUNCTION login_user(email_input TEXT, password_input TEXT)
RETURNS TABLE (id INT, email TEXT, name TEXT, roll_number TEXT, department TEXT, bio TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.name, u.roll_number, u.department, u.bio
    FROM public.users_auth u
    WHERE LOWER(u.email) = LOWER(email_input) AND u.password = password_input;
END;
$$;

-- 5. Secure RPC Function for Profile Updates
CREATE OR REPLACE FUNCTION update_user_profile(
    user_id INT,
    name_input TEXT,
    roll_number_input TEXT,
    department_input TEXT,
    bio_input TEXT
)
RETURNS TABLE (id INT, email TEXT, name TEXT, roll_number TEXT, department TEXT, bio TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.users_auth u
    SET name = name_input,
        roll_number = roll_number_input,
        department = department_input,
        bio = bio_input
    WHERE u.id = user_id;
    
    RETURN QUERY
    SELECT u.id, u.email, u.name, u.roll_number, u.department, u.bio
    FROM public.users_auth u
    WHERE u.id = user_id;
END;
$$;
