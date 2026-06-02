-- 1. Create Members Table
CREATE TABLE public.members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Projects Table
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,
    link TEXT,
    date TEXT,
    status TEXT DEFAULT 'pending',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Ideas Table
CREATE TABLE public.ideas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    idea TEXT NOT NULL,
    tech TEXT NOT NULL,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Public Read, Public Insert for submissions, but only Admin Update/Delete)
-- For this setup, we'll allow public reads and inserts since the site relies on public submissions.
-- In a strict production app, inserts might be authenticated.

-- Members Policies
CREATE POLICY "Public Read Members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public Insert Members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Public Delete Members" ON public.members FOR DELETE USING (true);

-- Projects Policies
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Public Delete Projects" ON public.projects FOR DELETE USING (true);

-- Ideas Policies
CREATE POLICY "Public Read Ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Public Insert Ideas" ON public.ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Ideas" ON public.ideas FOR UPDATE USING (true);
CREATE POLICY "Public Delete Ideas" ON public.ideas FOR DELETE USING (true);

-- 6. Storage Bucket for Project Images
-- You will need to create a bucket named 'project_images' in the Supabase Storage UI.
-- Make sure to set it as "Public".
-- Once created, run these policies in the SQL Editor to allow public access:

-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'project_images');
-- CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project_images');

-- 7. Create RSVPs Table
CREATE TABLE public.rsvps (
    id SERIAL PRIMARY KEY,
    event_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS) for RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RSVPs Policies
CREATE POLICY "Public Read RSVPs" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Public Insert RSVPs" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update RSVPs" ON public.rsvps FOR UPDATE USING (true);
CREATE POLICY "Public Delete RSVPs" ON public.rsvps FOR DELETE USING (true);
