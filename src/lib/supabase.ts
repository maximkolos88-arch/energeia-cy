import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';

export const supabase = createClient(supabaseUrl, supabaseKey);
