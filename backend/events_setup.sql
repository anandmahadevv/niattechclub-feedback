-- 1. Create Events Table
CREATE TABLE public.events (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Upcoming',
    date TEXT NOT NULL,
    location TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Insert Events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Public Delete Events" ON public.events FOR DELETE USING (true);

-- 4. Seed Initial Events
INSERT INTO public.events (slug, title, type, status, date, location, description, image_url) VALUES 
('promptwars', 'PromptWars', 'Hackathon', 'Upcoming', 'August (TBD)', 'Main Auditorium', 'PromptWars is a generative AI hackathon by Google for Developers and Hack2skill. Participants use vibe coding—building apps entirely via prompts to AI agents instead of manual coding—leveraging Google Antigravity and AI Studio to rapidly build and deploy projects.', 'https://bwnveqipiqlnjjukicah.supabase.co/storage/v1/object/sign/project_images/promptwar.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZjRiZDA4ZC0wZjZkLTRhMDQtOGMzYy03MzZhNzYwMzMxNzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9qZWN0X2ltYWdlcy9wcm9tcHR3YXIuanBnIiwiaWF0IjoxNzgwMzkzODE2LCJleHAiOjE4MTE5Mjk4MTZ9.qPoe0GNLwj2xo2YMpxN7hTAg8rru1RPU_7dA8pUIxmk'),
('ai-workshop', 'AI Tools & Innovation Workshop', 'Workshop', 'Completed', 'April 30, 2026', 'LH 18, C Block', 'A hands-on session introducing industry-leading AI tools (Google AI Studio, Claude Code, and Google Stitch). Students explored prompt engineering, workflow automation, and rapid prototyping, gaining immediate practical insights into modern development cycles.', '');
