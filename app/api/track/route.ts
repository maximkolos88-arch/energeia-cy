import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return Response.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
        console.error('[POST /api/track] Supabase insert error:', error.message);
      }
    }

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('[POST /api/track] Exception:', error);
    return Response.json({ error: 'Internal Server Error: ' + (error.message || error) }, { status: 500, headers: corsHeaders });
  }
}
