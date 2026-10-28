import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.energeia.cy';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';
const supabase = createClient(supabaseUrl, supabaseKey);

function parseTimestamp(m: any): number {
  if (m.publishedAt || m.published_at) {
    const ts = new Date(m.publishedAt || m.published_at).getTime();
    if (!isNaN(ts) && ts > 0) return ts;
  }
  if (m.createdAt || m.created_at) {
    const ts = new Date(m.createdAt || m.created_at).getTime();
    if (!isNaN(ts) && ts > 0) return ts;
  }
  return 0;
}

function filterAndSortPublishedNews(items: any[]): any[] {
  const published = items.filter(item => {
    const isDraftStatus = item.status && item.status.toString().trim().toLowerCase() === 'draft';
    const hasTitle = Boolean(item.title && item.title.trim() !== '');
    return !isDraftStatus && hasTitle;
  });

  return published.sort((a, b) => parseTimestamp(b) - parseTimestamp(a));
}

async function loadData() {
  let newsItems: any[] = [];
  let directoryMembers: any[] = [];
  let magazines: any[] = [];
  let courses: any[] = [];

  // Try DB file fallback first as baseline or primary source if offline
  const dbPath = path.resolve(__dirname, '../db.json');
  if (fs.existsSync(dbPath)) {
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (dbData.news) newsItems = dbData.news;
      if (dbData.participants) directoryMembers = dbData.participants;
      if (dbData.magazines) magazines = dbData.magazines;
      if (dbData.courses) courses = dbData.courses;
    } catch (e) {
      console.warn('Failed to parse db.json:', e);
    }
  }

  // Try fetching latest remote Supabase news and participants
  try {
    const { data: newsData, error: newsErr } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (!newsErr && newsData && newsData.length > 0) {
      newsItems = newsData.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        slug: item.slug || item.id,
        summary: item.summary || '',
        content: item.content || '',
        category: item.category || 'Renewables',
        imageUrl: item.image_url || item.imageUrl || '',
        sourceUrl: item.source_url || '',
        publishedAt: item.published_at || item.created_at || new Date().toISOString(),
        createdAt: item.created_at || new Date().toISOString(),
        status: item.status || 'Published',
        isEditorial: item.is_editorial ?? false,
        readTimeMinutes: item.read_time_minutes || 3
      }));
    }
  } catch (err) {
    console.warn('Supabase news fetch warning during prerender:', err);
  }

  newsItems = filterAndSortPublishedNews(newsItems);

  try {
    const { data: partData, error: partErr } = await supabase
      .from('participants')
      .select('*');
    if (!partErr && partData && partData.length > 0) {
      directoryMembers = partData.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        type: item.type || 'Company',
        roleOrCategory: item.role_or_category || item.roleOrCategory || '',
        email: item.email || '',
        phone: item.phone || '',
        location: item.location || 'Cyprus',
        category: item.category || 'Renewables',
        expertiseTags: Array.isArray(item.expertise_tags) ? item.expertise_tags : (item.expertiseTags || []),
        description: item.description || '',
        isVerified: item.is_verified ?? item.isVerified ?? true,
        logoUrl: item.logo_url || item.logoUrl || '',
        imageUrl: item.image_url || item.imageUrl || '',
        website: item.website || '',
        linkedin: item.linkedin || '',
        keyContactName: item.key_contact_name || item.keyContactName || '',
        showDescription: true,
        showLocation: true,
        showWebsite: true,
        showLinkedin: true,
        showEmail: true,
        showPhone: true,
        showKeyContact: true,
        showKeyServices: true,
        showNotableProjects: true,
        showCertifications: true,
        keyServices: item.key_services || [],
        notableProjects: item.notable_projects || '',
        certifications: item.certifications || ''
      }));
    }
  } catch (err) {
    console.warn('Supabase participants fetch warning during prerender:', err);
  }

  return { newsItems, directoryMembers, magazines, courses };
}

function getOptimizedImageUrl(rawUrl?: string, width = 320, height = 214): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.includes('offshore-energy.biz')) return '';
  if (trimmed.startsWith('https://wsrv.nl/') || trimmed.startsWith('/') || trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const encoded = encodeURIComponent(trimmed);
    const fallback = encodeURIComponent('https://www.energeia.cy/apple-touch-icon-180x180.png');
    return `https://wsrv.nl/?url=${encoded}&w=${width}&h=${height}&fit=cover&output=webp&q=75&default=${fallback}`;
  }
  return trimmed;
}

function updateHeadSEOTags(
  html: string,
  meta: {
    title: string;
    description: string;
    url: string;
    image?: string;
    ogType?: string;
  },
  preloadImageUrl?: string
): string {
  const imageUrl = meta.image || `${SITE_URL}/apple-touch-icon-180x180.png`;
  const ogType = meta.ogType || 'website';

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);

  // Replace or inject meta title
  if (/<meta name="title" content=".*?" \/>/gi.test(html)) {
    html = html.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${meta.title}" />`);
  }

  // Replace or inject meta description
  if (/<meta name="description" content=".*?" \/>/gi.test(html)) {
    html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${meta.description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${meta.description}" />\n  </head>`);
  }

  // Replace or inject canonical link
  if (/<link rel="canonical" href=".*?" \/>/gi.test(html)) {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${meta.url}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${meta.url}" />\n  </head>`);
  }

  // Replace or inject Open Graph tags
  html = html.replace(/<meta property="og:type" content=".*?" \/>/gi, `<meta property="og:type" content="${ogType}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${meta.url}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${imageUrl}" />`);

  // Replace or inject Twitter Card tags
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/gi, `<meta name="twitter:url" content="${meta.url}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${meta.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${meta.description}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${imageUrl}" />`);

  const structuredData =
    ogType === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: meta.title,
          description: meta.description,
          image: [imageUrl],
          author: { '@type': 'Organization', name: 'Energeia Cyprus', url: SITE_URL },
          publisher: {
            '@type': 'Organization',
            name: 'Energeia Cyprus',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-touch-icon-180x180.png` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Energeia - Cyprus Energy News',
          url: SITE_URL,
          description: meta.description,
          publisher: { '@type': 'Organization', name: 'Energeia Cyprus' },
        };

  let headExtras = `  <script id="schema-structured-data" type="application/ld+json">${JSON.stringify(structuredData)}</script>\n`;
  if (preloadImageUrl) {
    headExtras += `  <link rel="preload" as="image" href="${preloadImageUrl}" fetchpriority="high" />\n`;
  }
  html = html.replace('</head>', `${headExtras}  </head>`);

  return html;
}

async function prerender() {
  console.log('🚀 Starting Static Site Generation (SSG) Pre-rendering...');

  const distPath = path.resolve(__dirname, '../dist');
  const templatePath = path.resolve(distPath, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Error: dist/index.html not found. Run vite build client first.');
    process.exit(1);
  }

  const indexTemplate = fs.readFileSync(templatePath, 'utf8');

  // Import entry-server module dynamically
  const entryServerPath = path.resolve(distPath, 'server/entry-server.js');
  if (!fs.existsSync(entryServerPath)) {
    console.error('❌ Error: dist/server/entry-server.js not found. Run vite build --ssr first.');
    process.exit(1);
  }

  const { render } = await import(pathToFileURL(entryServerPath).href);

  const { newsItems, directoryMembers, magazines, courses } = await loadData();

  console.log(`Loaded ${newsItems.length} news items, ${directoryMembers.length} directory members, ${magazines.length} magazines, ${courses.length} courses.`);

  const coreRoutes = [
    {
      route: '/',
      meta: {
        title: 'Energeia - Cyprus Energy News & Market Intelligence',
        description: 'Cyprus energy news, renewable market intelligence, regulatory policy updates, and clean energy analytics.',
        url: `${SITE_URL}/`
      }
    },
    {
      route: '/news',
      meta: {
        title: 'Cyprus Energy News Updates | Energeia',
        description: 'Real-time Cyprus energy news, regulatory updates, solar photovoltaics market reports, and grid analytics.',
        url: `${SITE_URL}/news`
      }
    },
    {
      route: '/articles',
      meta: {
        title: 'Cyprus Energy Articles & Insights | Energeia',
        description: 'In-depth analysis, CERA regulatory reviews, and energy transition market reports in Cyprus.',
        url: `${SITE_URL}/articles`
      }
    },
    {
      route: '/about',
      meta: {
        title: 'About Energeia - Cyprus All-Energy Network',
        description: 'Energeia is the central information hub and intelligence platform for Cyprus clean energy transition.',
        url: `${SITE_URL}/about`
      }
    },
    {
      route: '/directory',
      meta: {
        title: 'Directory - Cyprus Energy Professionals & Companies | Energeia',
        description: 'Explore verified energy sector members, solar installers, ESG auditors, and clean tech companies in Cyprus.',
        url: `${SITE_URL}/directory`
      }
    },
    {
      route: '/members',
      meta: {
        title: 'Directory - Cyprus Energy Professionals & Companies | Energeia',
        description: 'Explore verified energy sector members, solar installers, ESG auditors, and clean tech companies in Cyprus.',
        url: `${SITE_URL}/members`
      }
    },
    {
      route: '/academy',
      meta: {
        title: 'Academy - Clean Energy Courses & Training | Energeia',
        description: 'Specialized professional courses and educational training for the Cyprus energy transition and renewables market.',
        url: `${SITE_URL}/academy`
      }
    },
    {
      route: '/magazine',
      meta: {
        title: 'Magazine - Print & Digital Energy Issues | Energeia',
        description: 'Access exclusive Cyprus energy market issue digests, regulatory reports, and interview archives.',
        url: `${SITE_URL}/magazine`
      }
    },
    {
      route: '/terms',
      meta: {
        title: 'Terms & Conditions | Energeia Cyprus',
        description: 'Terms of service, platform usage rules, and legal conditions for Energeia Cyprus energy portal.',
        url: `${SITE_URL}/terms`
      }
    },
    {
      route: '/privacy',
      meta: {
        title: 'Privacy Policy | Energeia Cyprus',
        description: 'EU GDPR compliance, personal data protection details, and data subject rights for Energeia Cyprus.',
        url: `${SITE_URL}/privacy`
      }
    },
    {
      route: '/cookies',
      meta: {
        title: 'Cookie Policy | Energeia Cyprus',
        description: 'Information on cookie usage, technical web analytics, and user consent management on Energeia.',
        url: `${SITE_URL}/cookies`
      }
    },
    {
      route: '/disclosures',
      meta: {
        title: 'Statutory Corporate Disclosures | Energeia Cyprus',
        description: 'Official corporate profile, HE 438859 registration details, VAT CY10438859X, address, and legal disclosures.',
        url: `${SITE_URL}/disclosures`
      }
    }
  ];

  // Also include dynamic article routes
  const articleRoutes = newsItems
    .filter((item: any) => item.slug || item.id)
    .map((item: any) => {
      const slug = item.slug || item.id;
      return {
        route: `/news/${slug}`,
        selectedArticle: item,
        meta: {
          title: `${item.title} | Energeia`,
          description: item.summary || item.content?.substring(0, 160) || 'Cyprus energy news update.',
          url: `${SITE_URL}/news/${slug}`,
          image: item.imageUrl || item.image_url,
          ogType: 'article'
        }
      };
    });

  const allRoutesToRender = [...coreRoutes, ...articleRoutes];

  const lightNewsFeedItems = newsItems.slice(0, 12).map((n: any) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    summary: n.summary,
    content: '',
    category: n.category,
    imageUrl: n.imageUrl,
    sourceUrl: n.sourceUrl,
    publishedAt: n.publishedAt,
    createdAt: n.createdAt,
    status: n.status,
    isEditorial: n.isEditorial,
    readTimeMinutes: n.readTimeMinutes,
  }));

  const firstLcpImageUrl = lightNewsFeedItems[0]
    ? getOptimizedImageUrl(lightNewsFeedItems[0].imageUrl, 320, 214)
    : '';

  for (const item of allRoutesToRender) {
    const route = item.route;
    const isDirectoryRoute = route === '/directory' || route === '/members';
    const isMagazineRoute = route === '/magazine';
    const isAcademyRoute = route === '/academy';
    const isStaticLegalOrAbout = ['/about', '/terms', '/privacy', '/cookies', '/disclosures'].includes(route);

    const initialData = {
      newsItems: isDirectoryRoute || isMagazineRoute || isAcademyRoute || isStaticLegalOrAbout ? [] : lightNewsFeedItems,
      directoryMembers: isDirectoryRoute ? directoryMembers : [],
      magazines: isMagazineRoute ? magazines : [],
      courses: isAcademyRoute ? courses : [],
      selectedArticle: 'selectedArticle' in item ? item.selectedArticle : null
    };

    console.log(`Pre-rendering route: ${route}`);

    const { html: appHtml } = render(route, initialData);

    let finalHtml = indexTemplate.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>`
    );

    const preloadImg = (route === '/' || route === '/news' || route === '/articles') ? firstLcpImageUrl : undefined;
    finalHtml = updateHeadSEOTags(finalHtml, item.meta, preloadImg);

    let fileOutputDir: string;
    if (route === '/') {
      fileOutputDir = distPath;
    } else {
      fileOutputDir = path.join(distPath, route.slice(1));
    }

    fs.mkdirSync(fileOutputDir, { recursive: true });
    const targetFile = path.join(fileOutputDir, 'index.html');
    fs.writeFileSync(targetFile, finalHtml, 'utf8');
    console.log(`  ✓ Generated ${targetFile}`);
  }

  console.log('✅ SSG Pre-rendering completed successfully!');
}

prerender().catch(err => {
  console.error('❌ SSG Pre-rendering failed:', err);
  process.exit(1);
});
