/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://spbszwdlcedeanvpsmpa.supabase.co';
const defaultKey = 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';

let supabaseUrl = '';
let supabaseKey = '';

try {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
} catch (e) {
  console.warn("Failed to access import.meta.env:", e);
}

// Diagnostics
if (!supabaseUrl || supabaseUrl.trim() === '' || supabaseUrl === 'undefined' || supabaseUrl === 'null') {
  console.warn("Warning: VITE_SUPABASE_URL is undefined or empty. Fallback will be used.");
}
if (!supabaseKey || supabaseKey.trim() === '' || supabaseKey === 'undefined' || supabaseKey === 'null') {
  console.warn("Warning: VITE_SUPABASE_ANON_KEY is undefined or empty. Fallback will be used.");
}

// Fallback to defaults if variables are missing, empty, or evaluate to "undefined"/"null" string literals
if (
  !supabaseUrl || 
  supabaseUrl.trim() === '' || 
  supabaseUrl === 'undefined' || 
  supabaseUrl === 'null' || 
  !supabaseUrl.startsWith('http')
) {
  supabaseUrl = defaultUrl;
}

if (
  !supabaseKey || 
  supabaseKey.trim() === '' || 
  supabaseKey === 'undefined' || 
  supabaseKey === 'null'
) {
  supabaseKey = defaultKey;
}

console.log("Supabase Client initialized with Base URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);
