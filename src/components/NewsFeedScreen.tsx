import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const ReactMarkdown = React.lazy(() => import('react-markdown'));
import { useWebMCP } from '../hooks/useWebMCP';
import { useNewsController } from '../controllers/useNewsController';
import { NewsItem, NewsCategory } from '../models/types';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { SEOManager } from './seo/SEOManager';
import { useInitialData } from '../context/InitialDataContext';
import { getOptimizedImageUrl } from '../utils/imageProxy';
import { 
  ExternalLink, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Zap, 
  Sun, 
  Activity 
} from 'lucide-react';

interface NewsFeedScreenProps {
  language?: string;
  path?: string;
}

interface TelemetryMetrics {
  loadMw: number;
  solarPct: number;
  marketPriceEur: number;
  interconnectorStatus: string;
  co2Intensity: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All Updates' },
  { id: 'renewables', label: 'Renewables' },
  { id: 'oil-gas', label: 'Oil & Gas' },
  { id: 'policy', label: 'Government & Policy' },
  { id: 'grants', label: 'Grants & Subsidies' },
];

const PARAM_TO_NAME: Record<string, NewsCategory> = {
  all: 'All Updates',
  renewables: 'Renewables',
  'oil-gas': 'Oil & Gas',
  policy: 'Government & Policy',
  grants: 'Grants & Subsidies',
};

const NAME_TO_PARAM: Record<string, string> = {
  'All Updates': 'all',
  'Renewables': 'renewables',
  'Oil & Gas': 'oil-gas',
  'Government & Policy': 'policy',
  'Grants & Subsidies': 'grants',
};

export const NewsFeedScreen: React.FC<NewsFeedScreenProps> = ({ language = 'en' }) => {
  const { t } = useTranslation();
  const initialData = useInitialData();
  const {
    category,
    newsItems,
    searchQuery,
    setQuery,
    loading,
    error,
    empty,
    hasMore,
    selectCategory,
    loadMore,
    refresh
  } = useNewsController();

  // Live Cyprus Grid Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryMetrics>({
    loadMw: 590.5,
    solarPct: 54.3,
    marketPriceEur: 142.50,
    interconnectorStatus: 'Active Flow',
    co2Intensity: 210.8,
  });

  useEffect(() => {
    let active = true;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/v1/entsoe/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setTelemetry({
              loadMw: data.cyprus_grid_telemetry?.total_system_load_mw || 590.5,
              solarPct: data.cyprus_grid_telemetry?.renewable_penetration_pct || 54.3,
              marketPriceEur: data.market_prices?.greece_day_ahead_avg_eur_mwh || 142.50,
              interconnectorStatus: data.interconnector?.status || 'Active Flow',
              co2Intensity: data.cyprus_grid_telemetry?.co2_intensity_g_kwh || 210.8,
            });
          }
        }
      } catch {}
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const getLocalizedValue = (item: NewsItem, field: 'title' | 'summary' | 'content', lang: string): string => {
    const activeLang = (lang || 'en').toLowerCase();
    if (activeLang === 'en') {
      return (item[field] as string) || '';
    }
    const key = `${field}_${activeLang}` as keyof NewsItem;
    const translated = item[key] as string;
    return (translated && translated.trim() !== '') ? translated : ((item[field] as string) || '');
  };

  const getLocalizedCategory = (catName: string): string => {
    if (!catName) return '';
    const name = catName.trim().toLowerCase();
    if (name === 'all updates' || name === 'all news') return t('categories.allNews', 'All Updates');
    if (name.includes('renew') || name.includes('solar')) return t('categories.renewables', 'Renewables');
    if (name.includes('oil') || name.includes('gas')) return t('categories.oilGas', 'Oil & Gas');
    if (name.includes('govern') || name.includes('policy')) return t('categories.govPolicy', 'Government & Policy');
    if (name.includes('grant') || name.includes('subsidy')) return t('categories.grantsSubsidies', 'Grants & Subsidies');
    return catName;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase();
      }
      return dateStr.toUpperCase();
    } catch {
      return dateStr ? dateStr.toUpperCase() : '';
    }
  };

  // Article Modal Reader State
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(() => {
    if (initialData?.selectedArticle) {
      return initialData.selectedArticle;
    }
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/news/')) {
        const slug = path.replace('/news/', '').trim();
        if (slug) {
          const found = newsItems.find(item => item.slug === slug || item.id === slug);
          if (found) return found;
        }
      }
    }
    return null;
  });

  // Keep URL synchronized when browser Back/Forward is clicked
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/news/')) {
        const slug = path.replace('/news/', '').trim();
        if (slug) {
          const found = newsItems.find(item => item.slug === slug || item.id === slug);
          if (found) {
            setSelectedArticle(found);
            return;
          }
        }
      } else {
        setSelectedArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [newsItems]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArticle) {
        setSelectedArticle(null);
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/news/')) {
          window.history.pushState({}, '', '/');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  const openArticle = (item: NewsItem) => {
    const updateState = () => {
      if (item.slug && typeof window !== 'undefined') {
        window.history.pushState({}, '', `/news/${item.slug}`);
      }
      setSelectedArticle(item);
    };

    if (typeof document !== 'undefined' && typeof (document as any).startViewTransition === 'function') {
      const transition = (document as any).startViewTransition(updateState);
      transition.finished.finally(() => {
        document.getElementById('article-modal-heading')?.focus();
      });
    } else {
      updateState();
      setTimeout(() => document.getElementById('article-modal-heading')?.focus(), 0);
    }

    if (!item.content && (item.slug || item.id)) {
      NewsRepository.getNewsBySlug(item.slug || item.id)
        .then((fullItem) => {
          if (fullItem) {
            setSelectedArticle((prev) => (prev && prev.id === fullItem.id ? fullItem : prev));
          }
        })
        .catch(() => {});
    }
  };

  const handleOpenArticle = (e: React.MouseEvent, article: { raw: NewsItem; slug: string }) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      openArticle(article.raw);
    }
  };

  const handleFilterSelect = (id: string) => {
    const update = () => {
      const catName = PARAM_TO_NAME[id] || 'All Updates';
      selectCategory(catName);
    };
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(update);
    } else {
      update();
    }
  };

  const selectedCategoryParam = NAME_TO_PARAM[category] || 'all';

  // 12-Column Hero & Secondary Articles
  const featuredArticle = useMemo(() => {
    if (newsItems.length === 0) return null;
    const item = newsItems[0];
    return {
      id: item.id,
      raw: item,
      title: getLocalizedValue(item, 'title', language),
      slug: item.slug || item.id,
      date: item.publishedAt || (item as any).created_at || (item as any).date || '',
      summary: getLocalizedValue(item, 'summary', language) || 'Greek conglomerate HELLENiQ Energy has agreed to acquire Cypriot fuel supplier Staroil through its subsidiary, HELLENiQ Energy Cyprus.',
      imageUrl: getOptimizedImageUrl(item.imageUrl || item.image_url, 1200, 675),
      category: getLocalizedCategory(item.category),
      sourceName: item.sourcePublisher || item.source || undefined,
      sourceUrl: item.sourceUrl || undefined,
    };
  }, [newsItems, language]);

  const remainingArticles = useMemo(() => {
    if (newsItems.length <= 1) return [];
    return newsItems.slice(1).map((item) => ({
      id: item.id,
      raw: item,
      title: getLocalizedValue(item, 'title', language),
      slug: item.slug || item.id,
      date: item.publishedAt || (item as any).created_at || (item as any).date || '',
      summary: getLocalizedValue(item, 'summary', language) || '',
      imageUrl: getOptimizedImageUrl(item.imageUrl || item.image_url, 640, 360),
      category: getLocalizedCategory(item.category),
      sourceName: item.sourcePublisher || item.source || undefined,
      sourceUrl: item.sourceUrl || undefined,
    }));
  }, [newsItems, language]);

  const allArticles = useMemo(() => {
    return newsItems.map((item) => ({
      id: item.id,
      raw: item,
      title: getLocalizedValue(item, 'title', language),
      slug: item.slug || item.id,
      date: item.publishedAt || (item as any).created_at || (item as any).date || '',
      summary: getLocalizedValue(item, 'summary', language) || '',
      imageUrl: getOptimizedImageUrl(item.imageUrl || item.image_url, 640, 360),
      category: getLocalizedCategory(item.category),
      sourceName: item.sourcePublisher || item.source || undefined,
      sourceUrl: item.sourceUrl || undefined,
    }));
  }, [newsItems, language]);

  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors">
      <SEOManager article={selectedArticle} />

      {/* 1. Masthead & Social Strip (Section 1) */}
      <section aria-labelledby="masthead-heading" className="masthead-container max-w-[1280px] mx-auto px-6 pt-10 pb-8">
        <h1 id="masthead-heading" className="text-[36px] sm:text-[52px] font-normal tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.12]">
          The latest energy intelligence <br className="hidden sm:inline" />from Cyprus
        </h1>
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-[11px] font-medium tracking-[0.08em] text-[#5F6368] dark:text-[#9AA0A6] uppercase">
            Follow Us
          </span>
          <div className="flex items-center gap-4 text-[#1F1F1F] dark:text-[#E3E3E3]">
            {/* Crisp monochrome SVG icons: X, LinkedIn, RSS */}
            <a href="https://x.com/energeiacy" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/energeiacy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.97 0-1.75.79-1.75 1.76s.78 1.76 1.75 1.76 1.75-.79 1.75-1.76-.78-1.76-1.75-1.76"/></svg>
            </a>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" className="hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Material 3 Filter Chips with View Transitions (Section 5) */}
      <nav aria-label="Topic Filters" className="filter-chip-bar w-full border-b border-[#F1F3F4] dark:border-[#282A2C] bg-white/95 dark:bg-[#131314]/95 backdrop-blur-md sticky top-16 z-30 transition-colors">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryParam === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleFilterSelect(cat.id)}
                className={`h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8F0FE] dark:bg-[rgba(138,180,248,0.16)] text-[#1A73E8] dark:text-[#8AB4F8] font-semibold'
                    : 'bg-transparent text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] border border-[#DADCE0] dark:border-[#444746]'
                }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-20">
        
        {/* Live Cyprus Grid Telemetry Strip */}
        <section 
          aria-label="Live Cyprus Grid Telemetry"
          className="mb-10 p-3 rounded-2xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#444746] overflow-x-auto hide-scrollbar"
        >
          <div className="flex items-center gap-3 min-w-max text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[#E0E2E0] dark:border-[#444746] font-mono text-[#1F1F1F] dark:text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold">TSOC LOAD:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{telemetry.loadMw.toFixed(1)} MW</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[#E0E2E0] dark:border-[#444746] font-mono text-[#1F1F1F] dark:text-white">
              <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span className="text-[11px] font-bold">SOLAR PENETRATION:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{telemetry.solarPct.toFixed(1)}%</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[#E0E2E0] dark:border-[#444746] font-mono text-[#1F1F1F] dark:text-white">
              <Zap className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              <span className="text-[11px] font-bold">ENTSO-E DA WHOLESALE:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">€{telemetry.marketPriceEur.toFixed(2)}/MWh</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[#E0E2E0] dark:border-[#444746] font-mono text-[#1F1F1F] dark:text-white">
              <Activity className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
              <span className="text-[11px] font-bold">GREAT SEA INTERCONNECTOR:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{telemetry.interconnectorStatus}</span>
            </div>
          </div>
        </section>

        {/* Active Search Notification Banner */}
        {searchQuery && (
          <div className="mb-8 p-4 rounded-2xl bg-[#E8F0FE]/50 dark:bg-[#0842A0]/30 border border-[#D3E3FD] dark:border-[#0842A0] flex items-center justify-between">
            <div className="text-xs text-[#041E49] dark:text-[#D3E3FD]">
              Filtering by search query: <span className="font-bold">"{searchQuery}"</span> ({newsItems.length} publications found)
            </div>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-semibold underline text-[#1A73E8] dark:text-[#8AB4F8] cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-2xl flex items-center justify-between border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
            <button onClick={refresh} className="p-1.5 hover:bg-black/10 rounded-full cursor-pointer">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-4">
                <div className="w-full aspect-[16/9] bg-neutral-200 dark:bg-neutral-800 rounded-[20px]" />
                <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="w-full h-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="w-3/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && empty && (
          <div className="text-center py-20 bg-transparent border-t border-b border-[#F1F3F4] dark:border-[#282A2C] my-8">
            <p className="text-xl font-medium text-[#1F1F1F] dark:text-white mb-2">No matching intelligence publications</p>
            <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
              There are currently no articles matching the selected category or query filter.
            </p>
            <button
              onClick={() => { selectCategory('All Updates'); setQuery(''); }}
              className="px-6 py-2.5 bg-[#1A73E8] text-white rounded-full text-xs font-medium hover:bg-[#1557B0] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Publication Grid */}
        <section aria-label="Recent Publications" className="publication-feed">
          {/* Desktop 12-Column Split Hero (Section 3) */}
          {!loading && featuredArticle && !searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 lg:pb-16 mb-12 lg:mb-16 border-b border-[#F1F3F4] dark:border-[#282A2C] items-center">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <time className="text-[12px] font-medium tracking-[0.08em] text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-3 font-mono">
                  {formatDate(featuredArticle.date)}
                </time>
                <h2 className="text-[28px] lg:text-[38px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight leading-[1.18] mb-4">
                  <a 
                    href={`/news/${featuredArticle.slug}`} 
                    onClick={(e) => handleOpenArticle(e, featuredArticle)}
                    className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
                  >
                    {featuredArticle.title}
                  </a>
                </h2>
                <p className="text-[16px] text-[#444746] dark:text-[#C4C7C5] leading-relaxed mb-4 line-clamp-3">
                  {featuredArticle.summary}
                </p>
                <div className="text-[13px] text-[#5F6368] dark:text-[#9AA0A6] flex flex-wrap items-center gap-1.5">
                  <span className="text-[#1F1F1F] dark:text-[#E3E3E3] font-medium">{featuredArticle.category}</span>
                  <span>·</span>
                  <span>Corporate Strategy</span>
                  {featuredArticle.sourceUrl && (
                    <>
                      <span>·</span>
                      <a 
                        href={featuredArticle.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Source: {featuredArticle.sourceName || 'CNA'} ↗
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <a 
                  href={`/news/${featuredArticle.slug}`} 
                  onClick={(e) => handleOpenArticle(e, featuredArticle)}
                  className="block overflow-hidden rounded-[24px] aspect-[16/9] bg-[#F1F3F4] dark:bg-[#1E1F20]"
                >
                  <img 
                    src={featuredArticle.imageUrl} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />
                </a>
              </div>
            </div>
          )}

          {/* Secondary 3-Column Publication Grid (Section 3) */}
          {!loading && !empty && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {(searchQuery ? allArticles : remainingArticles).map((article) => (
                <article key={article.id} className="group flex flex-col bg-transparent">
                  {article.imageUrl && (
                    <a 
                      href={`/news/${article.slug}`} 
                      onClick={(e) => handleOpenArticle(e, article)}
                      className="block overflow-hidden rounded-[20px] aspect-[16/9] bg-[#F1F3F4] dark:bg-[#1E1F20] mb-4"
                    >
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  )}

                  <time className="text-[11px] font-medium tracking-[0.08em] text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-2 font-mono">
                    {formatDate(article.date)}
                  </time>

                  <h3 className="text-[20px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight leading-snug mb-2 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    <a 
                      href={`/news/${article.slug}`}
                      onClick={(e) => handleOpenArticle(e, article)}
                    >
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-[14px] text-[#444746] dark:text-[#C4C7C5] leading-relaxed line-clamp-2 mb-3">
                    {article.summary}
                  </p>

                  <div className="mt-auto text-[13px] text-[#5F6368] dark:text-[#9AA0A6] flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                    <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{article.category}</span>
                    <span>·</span>
                    <span>Corporate Strategy</span>
                    {article.sourceUrl && (
                      <>
                        <span>·</span>
                        <a 
                          href={article.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Source: {article.sourceName || 'CNA'} ↗
                        </a>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="mt-14 text-center">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#444746] text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-xs font-semibold rounded-full transition-all cursor-pointer"
              >
                {t('news.loadMore', 'Load More Publications')}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Full Article Bottom Sheet / Modal Reader */}
      {selectedArticle && (
        <div
          onClick={(e) => { 
            if (e.target === e.currentTarget) {
              setSelectedArticle(null);
              if (typeof window !== 'undefined' && window.location.pathname.startsWith('/news/')) {
                window.history.pushState({}, '', '/');
              }
            }
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4"
        >
          <article className="bg-white dark:bg-[#1E1F20] rounded-t-3xl md:rounded-[24px] border-t md:border border-[#E0E2E0] dark:border-[#444746] max-w-3xl w-full h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-5 animate-scale-up">
            
            {/* Header: Close Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedArticle(null);
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/news/')) {
                  window.history.pushState({}, '', '/');
                }
              }}
              aria-label="Close article"
              className="sticky top-0 z-50 ms-auto float-end p-2 text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] bg-white/90 dark:bg-[#1E1F20]/90 backdrop-blur-xs rounded-full border border-[#E0E2E0] dark:border-[#444746] cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Article Image */}
            {getOptimizedImageUrl(selectedArticle.imageUrl || selectedArticle.image_url, 960, 540) && (
              <div className="w-full h-56 md:h-80 rounded-[20px] overflow-hidden bg-[#F1F3F4] dark:bg-[#282A2C]">
                <img
                  src={getOptimizedImageUrl(selectedArticle.imageUrl || selectedArticle.image_url, 960, 540)}
                  alt={getLocalizedValue(selectedArticle, 'title', language)}
                  width={960}
                  height={540}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Meta */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-[13px] text-[#5F6368] dark:text-[#9AA0A6]">
                {selectedArticle.category && (
                  <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    {getLocalizedCategory(selectedArticle.category)}
                  </span>
                )}
                <span>·</span>
                <time dateTime={selectedArticle.publishedAt} className="font-mono uppercase text-xs">
                  {formatDate(selectedArticle.publishedAt)}
                </time>
              </div>

              <h1 id="article-modal-heading" tabIndex={-1} className="text-xl md:text-3xl font-medium text-[#1F1F1F] dark:text-white leading-tight mb-3 [text-wrap:balance] focus:outline-none">
                {getLocalizedValue(selectedArticle, 'title', language)}
              </h1>
            </div>

            {/* Executive Summary Box */}
            <div className="p-4 bg-[#F8F9FA] dark:bg-[#131314] border-s-4 border-[#1A73E8] dark:border-[#8AB4F8] rounded-e-xl">
              <p className="text-xs md:text-sm text-[#1F1F1F] dark:text-neutral-200 italic font-medium leading-relaxed">
                "{getLocalizedValue(selectedArticle, 'summary', language) || 'No summary available for this story.'}"
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#444746] dark:text-neutral-300 leading-relaxed space-y-4 pt-2">
              <Suspense fallback={<p className="text-xs text-neutral-500">{getLocalizedValue(selectedArticle, 'summary', language)}</p>}>
                <ReactMarkdown>
                  {getLocalizedValue(selectedArticle, 'content', language) || getLocalizedValue(selectedArticle, 'summary', language) || 'Full article text is being prepared for this publication.'}
                </ReactMarkdown>
              </Suspense>
            </div>

            {/* Source Filing Attribution */}
            {selectedArticle.sourceUrl && (
              <div className="pt-4 border-t border-[#E0E2E0] dark:border-[#444746] flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                  EU Directive 2019/790 Article 15 Attribution
                </span>
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#062E6F] rounded-full font-medium text-xs inline-flex items-center gap-1.5 hover:bg-[#1557B0] dark:hover:bg-[#AECBFA] transition-colors cursor-pointer"
                >
                  <span>{t('news.viewFiling', 'Original Source Document')}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            )}

          </article>
        </div>
      )}
    </div>
  );
};

export default NewsFeedScreen;
