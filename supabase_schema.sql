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
  description_el TEXT,
  description_ru TEXT,
  description_he TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add localized description columns if table already exists
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS description_el TEXT;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS description_he TEXT;

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

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'post_read', 'member_view', 'contact_click', 'pwa_install'
  path TEXT NOT NULL,
  referrer TEXT,
  target_id TEXT, -- ID новости или профиля участника
  country TEXT DEFAULT 'CY',
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  is_pwa BOOLEAN DEFAULT false,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Индексы для быстрой работы графиков в админке
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON public.analytics_events(path);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Enable INSERT policy for anonymous public access
CREATE POLICY "Allow public insert on analytics_events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Enable SELECT policy for authenticated users (admin panel updates)
CREATE POLICY "Allow authenticated select on analytics_events" ON public.analytics_events FOR SELECT USING (auth.role() = 'authenticated');

-- Create Pageviews table for Analytics Tracking
CREATE TABLE IF NOT EXISTS public.pageviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT,
  path TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'GENERAL', -- 'ARTICLE', 'COMPANY', 'GENERAL'
  entity_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add column if table already exists
ALTER TABLE public.pageviews ADD COLUMN IF NOT EXISTS visitor_id TEXT;

CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON public.pageviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_type ON public.pageviews(type);
CREATE INDEX IF NOT EXISTS idx_pageviews_entity_id ON public.pageviews(entity_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON public.pageviews(visitor_id);

ALTER TABLE public.pageviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on pageviews" ON public.pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on pageviews" ON public.pageviews FOR SELECT USING (true);

-- 1. Article Categories Table
CREATE TABLE IF NOT EXISTS public.article_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id UUID REFERENCES public.article_categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);

-- 4. Default English Categories
INSERT INTO public.article_categories (name, slug, description)
VALUES 
  ('Analytics & Insights', 'analytics-insights', 'Deep analysis of the Cyprus energy market'),
  ('Editorial Longreads', 'editorial-longreads', 'Exclusive in-depth editorial reports'),
  ('Announcements & Events', 'announcements', 'Official statements and key events')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 5. RLS Policies
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on article_categories" ON public.article_categories FOR SELECT USING (true);
CREATE POLICY "Allow public select on articles" ON public.articles FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated changes on article_categories" ON public.article_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated changes on articles" ON public.articles FOR ALL USING (auth.role() = 'authenticated');


