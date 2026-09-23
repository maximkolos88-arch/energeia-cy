import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://energeia.cy';

async function generateSitemap() {
  console.log('Generating dynamic XML sitemap for Energeia...');

  try {
    const { data: articles, error } = await supabase
      .from('news')
      .select('id, slug, published_at, created_at')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles from Supabase:', error);
    }

    const staticRoutes = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.6', changefreq: 'monthly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

    // Static Pages
    const now = new Date().toISOString();
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Article Pages
    if (articles && articles.length > 0) {
      for (const item of articles) {
        const articleSlug = item.slug || item.id;
        const lastMod = item.published_at || item.created_at || now;
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/news/${articleSlug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastMod).toISOString()}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>\n`;

    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
    const distPath = path.resolve(__dirname, '../dist/sitemap.xml');

    fs.writeFileSync(publicPath, xml, 'utf8');
    console.log(`Successfully written sitemap.xml to ${publicPath}`);

    if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
      fs.writeFileSync(distPath, xml, 'utf8');
      console.log(`Successfully written sitemap.xml to ${distPath}`);
    }
  } catch (err) {
    console.error('Failed generating sitemap:', err);
  }
}

generateSitemap();
