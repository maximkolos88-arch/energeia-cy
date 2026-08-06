import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
  'https://spbszwdlcedeanvpsmpa.supabase.co';

const supabaseKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
  'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';

export const supabase = createClient(supabaseUrl, supabaseKey);
