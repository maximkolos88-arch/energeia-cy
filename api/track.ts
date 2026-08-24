import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function OPTIONS() {
  return Response.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function POST(req: any) {
  try {
    const body = typeof req.json === 'function' ? await req.json() : (req.body || {});
    const { path: pagePath, type, entityId, visitorId } = body || {};

    if (pagePath) {
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
    }

    return Response.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (err: any) {
    console.error('[api/track] Exception:', err);
    return Response.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Expected POST.' });
  }
  try {
    const { path: pagePath, type, entityId, visitorId } = req.body || {};
    if (pagePath) {
      await supabase.from('pageviews').insert([{
        visitor_id: visitorId || null,
        path: pagePath,
        type: type || 'GENERAL',
        entity_id: entityId || null,
        created_at: new Date().toISOString()
      }]);
    }
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
