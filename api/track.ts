import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Expected POST.' });
  }

  try {
    const { path: pagePath, type, entityId, visitorId } = req.body || {};
    if (!pagePath) {
      return res.status(400).json({ error: 'Missing path parameter in payload' });
    }

    const { error } = await supabase.from('pageviews').insert([{
      visitor_id: visitorId || null,
      path: pagePath,
      type: type || 'GENERAL',
      entity_id: entityId || null,
      created_at: new Date().toISOString()
    }]);

    if (error) {
      console.error('[api/track] Supabase insert error:', error.message);
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('[api/track] Exception:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
