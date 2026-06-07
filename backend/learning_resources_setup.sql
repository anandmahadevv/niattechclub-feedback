-- 1. Extend tracked_repos table with additional fields for the Open Source page
ALTER TABLE public.tracked_repos ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.tracked_repos ADD COLUMN IF NOT EXISTS motive TEXT;
ALTER TABLE public.tracked_repos ADD COLUMN IF NOT EXISTS languages TEXT; -- Store as comma-separated or JSON
ALTER TABLE public.tracked_repos ADD COLUMN IF NOT EXISTS tags TEXT;      -- Store as comma-separated or JSON
ALTER TABLE public.tracked_repos ADD COLUMN IF NOT EXISTS link TEXT;

-- 2. Create learning_resources table
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- 'video' | 'playlist' | 'docs' | 'course' | 'article'
    duration TEXT,
    author TEXT,
    level TEXT NOT NULL, -- 'Beginner' | 'Intermediate' | 'Advanced'
    free BOOLEAN DEFAULT true,
    category TEXT NOT NULL, -- 'web' | 'programming' | 'ai' | 'git' | 'other'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) on learning_resources
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive policies for learning_resources
CREATE POLICY "Public Read Learning Resources" ON public.learning_resources FOR SELECT USING (true);
CREATE POLICY "Public Insert Learning Resources" ON public.learning_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Learning Resources" ON public.learning_resources FOR UPDATE USING (true);
CREATE POLICY "Public Delete Learning Resources" ON public.learning_resources FOR DELETE USING (true);
