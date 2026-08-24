import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const thirtyDaysAgoDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const thirtyDaysAgoIso = thirtyDaysAgoDate.toISOString();

    // 1. Fetch total monthly pageviews from Supabase pageviews table (last 30 days)
    const { data: pageviewRows, error: pvError } = await supabase
      .from('pageviews')
      .select('id, visitor_id, type, created_at')
      .gte('created_at', thirtyDaysAgoIso);

    if (pvError) {
      console.error('[api/stats/media-kit] Supabase pageviews error:', pvError.message);
    }

    // 2. Fetch total news count from Supabase news table
    const { count: newsCount, error: newsError } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    if (newsError) {
      console.error('[api/stats/media-kit] Supabase news count error:', newsError.message);
    }

    const allPageviews = (pageviewRows && Array.isArray(pageviewRows)) ? pageviewRows : [];

    // a) uniqueVisitors: Count of DISTINCT visitor_id in pageviews (last 30 days)
    const uniqueVisitorSet = new Set<string>();
    allPageviews.forEach((pv: any) => {
      const vid = pv.visitor_id || pv.visitorId;
      if (vid && typeof vid === 'string' && vid.trim().length > 0) {
        uniqueVisitorSet.add(vid.trim());
      }
    });
    const uniqueVisitors = uniqueVisitorSet.size;

    // b) totalVisits: Total row count in pageviews table (last 30 days)
    const totalVisits = allPageviews.length;

    // c) totalNewsArticles: Total row count of news table (overall published news)
    const totalNewsArticles = (typeof newsCount === 'number' && newsCount >= 0) ? newsCount : 0;

    // d) newsViews: Total row count in pageviews where type = 'ARTICLE' (last 30 days)
    const newsViews = allPageviews.filter((pv: any) => (pv.type || '').toUpperCase() === 'ARTICLE').length;

    // 3. Generate consecutive 30-day timeline chart array (totalVisits per day)
    const dailyViewMap: Record<string, number> = {};
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateKey = d.toISOString().split('T')[0];
      dailyViewMap[dateKey] = 0;
    }

    allPageviews.forEach((pv: any) => {
      const pvDate = new Date(pv.created_at || pv.createdAt);
      if (!isNaN(pvDate.getTime())) {
        const dateKey = pvDate.toISOString().split('T')[0];
        if (dailyViewMap[dateKey] !== undefined) {
          dailyViewMap[dateKey]++;
        }
      }
    });

    const chartData = Object.keys(dailyViewMap).map((dateKey) => {
      const dateObj = new Date(dateKey);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date: dateKey,
        label: formattedDate,
        views: dailyViewMap[dateKey]
      };
    });

    return res.status(200).json({
      uniqueVisitors,
      totalVisits,
      totalNewsArticles,
      newsViews,
      totalMonthlyViews: totalVisits,
      totalCompanies: totalNewsArticles,
      totalArticles: totalNewsArticles,
      totalArticleReads: newsViews,
      chartData
    });
  } catch (err: any) {
    console.error('[api/stats/media-kit] Exception:', err);
    return res.status(500).json({ error: 'Database query failed: ' + (err.message || 'Unknown error') });
  }
}
