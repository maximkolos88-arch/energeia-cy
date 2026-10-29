import './index.css';
import type { InitialData } from './context/InitialDataContext';

const NAV_SECTIONS = ['news', 'terminal', 'members', 'magazine', 'academy', 'about', 'register', 'terms', 'privacy', 'cookies', 'disclosures'] as const;
const NEWS_CATEGORY_VALUES = [
  'All News',
  'Renewables & Solar',
  'Oil & Gas',
  'Government & Policy',
  'Grants & Subsidies',
  'Electricity & Trading',
  'Maritime & Offshore',
] as const;

// Trusted Types baseline tinyfill & default policy for DOM XSS protection
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.trustedTypes) {
    win.trustedTypes = {
      createPolicy: (_name: string, rules: Record<string, unknown>) => rules,
    };
  } else if (win.trustedTypes.createPolicy && !win.trustedTypes.defaultPolicy) {
    try {
      win.trustedTypes.createPolicy('default', {
        createHTML: (input: string) => input,
        createScriptURL: (input: string) => input,
        createScript: (input: string) => input,
      });
    } catch {
      // Policy already exists or restricted by CSP
    }
  }

  // Ensure document.modelContext is available on Chromium 146-149 where navigator.modelContext was used
  if (typeof document !== 'undefined' && !('modelContext' in document) && 'modelContext' in navigator) {
    (document as any).modelContext = (navigator as any).modelContext;
  }
}

const rootElement = document.getElementById('root')!;
const initialData: InitialData | undefined = typeof window !== 'undefined' ? (window as any).__INITIAL_DATA__ : undefined;
const currentPathname = typeof window !== 'undefined' ? window.location.pathname : '/';
const isClientOnlyRoute = currentPathname.startsWith('/admin') || currentPathname === '/register';
if (isClientOnlyRoute && rootElement) {
  rootElement.innerHTML = '';
}
const hasPrerenderedDOM = Boolean(!isClientOnlyRoute && rootElement && rootElement.hasChildNodes() && rootElement.children.length > 0);

const preHydrationWebMCPController = new AbortController();
let mountPromise: Promise<void> | null = null;
let isMounted = false;
let pendingClickTarget: HTMLElement | null = null;

function registerPreHydrationWebMCP() {
  if (typeof document === 'undefined') return;
  const modelCtx = (document as any).modelContext || (typeof navigator !== 'undefined' ? (navigator as any).modelContext : undefined);
  if (!modelCtx || typeof modelCtx.registerTool !== 'function') return;

  const signal = preHydrationWebMCPController.signal;
  const newsItems = initialData?.newsItems || [];

  try {
    modelCtx.registerTool(
      {
        name: 'navigate_energeia_section',
        description: 'Navigates the Energeia Cyprus energy portal to a target section.',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              enum: NAV_SECTIONS,
              default: 'news',
              description: 'Portal section to navigate to.',
            },
          },
          required: ['section'],
        },
        annotations: { readOnlyHint: true },
        async execute({ section = 'news' }: { section?: string }) {
          await mountApp();
          if (typeof section !== 'string' || !NAV_SECTIONS.includes(section as any)) {
            return { content: [{ type: 'text', text: JSON.stringify({ error: 'Unsupported section name.', supportedSections: NAV_SECTIONS }) }] };
          }
          const path = section === 'news' ? '/' : section === 'members' ? '/directory' : `/${section}`;
          window.history.pushState({}, '', path);
          window.dispatchEvent(new Event('popstate'));
          return { content: [{ type: 'text', text: JSON.stringify({ navigatedTo: section }) }] };
        },
      },
      { signal }
    );

    modelCtx.registerTool(
      {
        name: 'filter_energy_news',
        description: 'Filters the Cyprus energy news feed by market sector category. Use when the user wants to view news for a specific Cyprus energy pillar.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: NEWS_CATEGORY_VALUES,
              default: 'All News',
              description: 'Cyprus energy market category to display in the news stream.',
            },
          },
          required: ['category'],
        },
        annotations: { readOnlyHint: true },
        async execute({ category: targetCategory = 'All News' }: { category?: string }) {
          await mountApp();
          const filtered = targetCategory === 'All News'
            ? newsItems
            : newsItems.filter(item => item.category === targetCategory);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                activeCategory: targetCategory,
                count: filtered.length,
                articles: filtered.slice(0, 10).map(item => ({
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  publishedAt: item.publishedAt,
                  summary: item.summary,
                })),
              }),
            }],
          };
        },
      },
      { signal }
    );

    modelCtx.registerTool(
      {
        name: 'search_energy_news',
        description: 'Searches Cyprus energy news articles by keyword and returns matching headlines, summaries, and publication dates.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search keywords to match against Cyprus energy news titles and summaries.',
            },
          },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
        async execute({ query }: { query?: string }) {
          await mountApp();
          if (typeof query !== 'string' || !query.trim()) {
            return { content: [{ type: 'text', text: JSON.stringify({ error: 'Pass a non-empty search query string.' }) }] };
          }
          const q = query.trim().toLowerCase();
          const matches = newsItems.filter(
            item =>
              item.title.toLowerCase().includes(q) ||
              (item.summary && item.summary.toLowerCase().includes(q)) ||
              (item.category && item.category.toLowerCase().includes(q))
          );
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                query: query.trim(),
                count: matches.length,
                articles: matches.slice(0, 10).map(item => ({
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  publishedAt: item.publishedAt,
                  summary: item.summary,
                  url: item.slug ? `/news/${item.slug}` : '/',
                })),
              }),
            }],
          };
        },
      },
      { signal }
    );
  } catch {
    // Ignore duplicate registration errors
  }
}

function mountApp(): Promise<void> {
  if (mountPromise) return mountPromise;
  mountPromise = Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./App.tsx'),
    import('./lib/i18n'),
  ]).then(([React, ReactDOMClient, AppModule]) => {
    preHydrationWebMCPController.abort();
    const App = AppModule.default;
    const appElement = React.createElement(App, { initialData });
    const onRecoverableError = (error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('419') || msg.includes('Suspense boundary') || msg.includes('server could not finish')) {
        return;
      }
      console.warn('[Hydration]', error);
    };

    if (hasPrerenderedDOM) {
      try {
        ReactDOMClient.hydrateRoot(rootElement, appElement, { onRecoverableError });
      } catch {
        ReactDOMClient.createRoot(rootElement).render(appElement);
      }
    } else {
      ReactDOMClient.createRoot(rootElement).render(appElement);
    }
    isMounted = true;
    if (pendingClickTarget) {
      const target = pendingClickTarget;
      pendingClickTarget = null;
      setTimeout(() => target.click(), 0);
    }
  });
  return mountPromise;
}

if (hasPrerenderedDOM) {
  registerPreHydrationWebMCP();

  const interactionEvents = ['pointerdown', 'touchstart', 'mouseover', 'keydown', 'focusin', 'wheel'] as const;
  const triggerHydration = () => {
    interactionEvents.forEach(evt => window.removeEventListener(evt, triggerHydration));
    mountApp();
  };
  interactionEvents.forEach(evt => window.addEventListener(evt, triggerHydration, { once: true, passive: true }));

  window.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (!isMounted && e.target instanceof HTMLElement) {
        pendingClickTarget = e.target;
        e.stopPropagation();
        e.preventDefault();
        triggerHydration();
      }
    },
    { capture: true, once: true }
  );
} else {
  mountApp();
}

// Clear app badge when application opens
if (typeof navigator !== 'undefined' && 'clearAppBadge' in navigator) {
  navigator.clearAppBadge().catch((e) => console.warn('Failed to clear app badge:', e));
}

// Register service worker with update checking (only reload when replacing an existing controller)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          reg.update();
        })
        .catch(err => {
          console.warn('SW registration failed:', err);
        });
    }, 4500);
  });
}
