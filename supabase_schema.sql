-- Create participants table for Member Directory
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Individual', 'Company')),
  role_or_category TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  location TEXT,
  category TEXT,
  expertise_tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create magazines table for Digital Library
CREATE TABLE IF NOT EXISTS public.magazines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issue_number INTEGER NOT NULL,
  publish_date TEXT NOT NULL,
  cover_image_url TEXT,
  pdf_url TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table for Academy
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL,
  image_url TEXT,
  checkout_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Enable SELECT policies for anonymous public access
CREATE POLICY "Allow public select on participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Allow public select on magazines" ON public.magazines FOR SELECT USING (true);
CREATE POLICY "Allow public select on courses" ON public.courses FOR SELECT USING (true);

-- Enable ALL operations for authenticated users (admin panel updates)
CREATE POLICY "Allow authenticated changes on participants" ON public.participants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated changes on magazines" ON public.magazines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated changes on courses" ON public.courses FOR ALL USING (auth.role() = 'authenticated');
