-- 1. Update Members Table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS github_username TEXT;

-- 2. Create Tracked Repositories Table
CREATE TABLE IF NOT EXISTS public.tracked_repos (
    id SERIAL PRIMARY KEY,
    owner TEXT NOT NULL,
    repo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Leaderboard Table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES public.members(id) ON DELETE CASCADE,
    github_username TEXT NOT NULL,
    merged_prs INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.tracked_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- 5. Tracked Repos Policies
-- Public read, but admin only insert/update/delete. Since we don't have strict auth here yet, we'll allow public select.
CREATE POLICY "Public Read Tracked Repos" ON public.tracked_repos FOR SELECT USING (true);
CREATE POLICY "Public Insert Tracked Repos" ON public.tracked_repos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tracked Repos" ON public.tracked_repos FOR UPDATE USING (true);
CREATE POLICY "Public Delete Tracked Repos" ON public.tracked_repos FOR DELETE USING (true);

-- 6. Leaderboard Policies
CREATE POLICY "Public Read Leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "Public Insert Leaderboard" ON public.leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Leaderboard" ON public.leaderboard FOR UPDATE USING (true);
CREATE POLICY "Public Delete Leaderboard" ON public.leaderboard FOR DELETE USING (true);

-- 7. Insert some sample repos (Optional, for testing)
-- INSERT INTO public.tracked_repos (owner, repo) VALUES ('facebook', 'react');
