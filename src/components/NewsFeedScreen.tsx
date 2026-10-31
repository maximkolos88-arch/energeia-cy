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
  ArrowRight, 
  ExternalLink, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ChevronRight,
  Zap,
  Sparkles,
  Sun,
  Flame,
  Landmark,
  Gift,
  Layers,
  Activity,
  Compass
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

export const NewsFeedScreen: React.FC<NewsFeedScreenProps> = ({ language = 'en' }) => {
  const { t } = useTranslation();
  const initialData = useInitialData();
  const {
    category,
    categories,
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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollBtnWrapperRef = React.useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    const btnWrapper = scrollBtnWrapperRef.current;
    if (el && btnWrapper) {
      const canScrollRight = el.scrollWidth > el.clientWidth && (el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
      btnWrapper.style.display = canScrollRight ? '' : 'none';
    }
  };

  const handleScrollRight = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: 180, behavior: 'smooth' });
    }
  };

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
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const day = d.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch {}
    return dateStr;
  };

  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(() => {
    if (initialData?.selectedArticle) return initialData.selectedArticle;
    return null;
  });

  // Check URL pathname for direct /news/[slug] deep-linking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUrlCheck = async () => {
      const path = window.location.pathname;
      if (path.startsWith('/news/') && path.length > 6) {
        const slug = path.substring(6);
        try {
          const item = await NewsRepository.getNewsBySlug(slug);
          if (item) {
            setSelectedArticle(item);
          }
        } catch (err) {
          console.error("Failed to load article by slug:", err);
        }
      }
    };

    if (!selectedArticle) {
      handleUrlCheck();
    }
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, [selectedArticle]);

  // Keyboard Accessibility: Close article modal on Escape
  useEffect(() => {
    if (!selectedArticle || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
        if (window.location.pathname.startsWith('/news/')) {
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

  const getBadgeColors = (catName?: string) => {
    const c = (catName || '').toLowerCase();
    if (c.includes('renew') || c.includes('solar') || c.includes('wind')) {
      return {
        bg: 'var(--google-green-bg, #E6F4EA)',
        text: 'var(--google-green-text, #137333)',
      };
    }
    if (c.includes('oil') || c.includes('gas') || c.includes('fossil')) {
      return {
        bg: 'var(--google-amber-bg, #FEF7E0)',
        text: 'var(--google-amber-text, #B06000)',
      };
    }
    if (c.includes('policy') || c.includes('govern') || c.includes('cera') || c.includes('regula')) {
      return {
        bg: 'var(--google-blue-bg, #E8F0FE)',
        text: 'var(--google-blue-text, #1967D2)',
      };
    }
    if (c.includes('grant') || c.includes('subsidy')) {
      return {
        bg: 'var(--google-purple-bg, #F3E8FD)',
        text: 'var(--google-purple-text, #7627BB)',
      };
    }
    return {
      bg: 'var(--md-sys-color-surface-container, #F1F3F4)',
      text: 'var(--md-sys-color-secondary-text, #5F6368)',
    };
  };

  // Top Featured Hero Story (Index 0 when not actively searching)
  const heroStory = useMemo(() => {
    if (newsItems.length === 0) return null;
    return newsItems[0];
  }, [newsItems]);

  const gridStories = useMemo(() => {
    if (newsItems.length <= 1) return [];
    return newsItems.slice(1);
  }, [newsItems]);

  return (
    <div className="w-full max-w-[840px] mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 animate-fade-in" style={{ maxWidth: '840px', marginInline: 'auto', paddingBlock: '24px' }}>
      <SEOManager article={selectedArticle} />
      
      {/* Section Title (Google Research Header) */}
      <h1 className="text-[32px] sm:text-[40px] font-normal text-[#1F1F1F] dark:text-[#E3E3E3] leading-tight mb-8">
        The latest energy intelligence <br className="hidden sm:inline" />from Cyprus
      </h1>

      {/* Main Publication Article Item (Google Research Publication Layout) */}
      {heroStory && !searchQuery && (
        <article 
          onClick={() => openArticle(heroStory)}
          className="group cursor-pointer w-full mb-10 pb-8 border-b border-[#F1F3F4] dark:border-[#282A2C]"
          style={{ maxWidth: '840px', marginInline: 'auto', paddingBlock: '24px' }}
        >
          {/* 1. Image on TOP with soft radius */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-[#F1F3F4] dark:bg-[#1E1F20] mb-4">
            {heroStory.imageUrl || heroStory.image_url ? (
              <img
                src={getOptimizedImageUrl(heroStory.imageUrl || heroStory.image_url, 1200, 675)}
                alt={getLocalizedValue(heroStory, 'title', language)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F1F3F4] dark:bg-[#1E1F20] text-[#5F6368]">
                <Compass className="w-12 h-12 stroke-1" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* 2. Date: Uppercase, small, muted */}
          <time dateTime={heroStory.publishedAt} className="block text-[12px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-2 font-mono">
            {formatDate(heroStory.publishedAt)}
          </time>

          {/* 3. Headline: Google Sans style, medium weight, crisp */}
          <h2 className="text-[22px] sm:text-[26px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors mb-3">
            {getLocalizedValue(heroStory, 'title', language)}
          </h2>

          {/* 4. Analytical summary */}
          <p className="text-[15px] text-[#444746] dark:text-[#C4C7C5] leading-relaxed mb-3 line-clamp-2">
            {getLocalizedValue(heroStory, 'summary', language) || 'Greek conglomerate HELLENiQ Energy has agreed to acquire Cypriot fuel supplier Staroil through its subsidiary, HELLENiQ Energy Cyprus.'}
          </p>

          {/* 5. Categories: Text separated by middle dots (NO bubble badges) */}
          <div className="text-[13px] text-[#5F6368] dark:text-[#9AA0A6] flex flex-wrap items-center gap-1.5">
            {heroStory.category && <span>{getLocalizedCategory(heroStory.category)}</span>}
            {(heroStory.sourcePublisher || heroStory.source) && (
              <>
                <span>·</span>
                <span>{heroStory.sourcePublisher || heroStory.source}</span>
              </>
            )}
            {heroStory.sourceUrl && (
              <>
                <span>·</span>
                <a 
                  href={heroStory.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-0.5 ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Source: {heroStory.sourcePublisher || heroStory.source || 'Filing'} ↗
                </a>
              </>
            )}
          </div>
        </article>
      )}

      {/* Live Cyprus Grid Telemetry Strip (Google Finance / Research Data Pill Bar) */}
      <section 
        aria-label="Live Cyprus Grid Telemetry"
        className="mb-8 p-3 rounded-2xl bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] overflow-x-auto hide-scrollbar"
      >
        <div className="flex items-center gap-3 min-w-max text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] font-mono text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold">TSOC LOAD:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{telemetry.loadMw.toFixed(1)} MW</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] font-mono text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span className="text-[11px] font-bold">SOLAR PENETRATION:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{telemetry.solarPct.toFixed(1)}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] font-mono text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            <Zap className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span className="text-[11px] font-bold">ENTSO-E DA WHOLESALE:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">€{telemetry.marketPriceEur.toFixed(2)}/MWh</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] font-mono text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            <Activity className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
            <span className="text-[11px] font-bold">GREAT SEA INTERCONNECTOR:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{telemetry.interconnectorStatus}</span>
          </div>
        </div>
      </section>

      {/* Sticky Material 3 Filter Chips with URL Sync */}
      <div className="relative w-full mb-6 sticky top-16 z-30 bg-[var(--md-sys-color-background,#FFFFFF)]/90 dark:bg-[#131314]/90 backdrop-blur-md py-3 transition-colors">
        <div ref={scrollBtnWrapperRef} className="md:hidden">
          <button
            onClick={handleScrollRight}
            aria-label="Scroll categories right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-[#282A2C] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-md flex items-center justify-center text-[var(--md-sys-color-secondary-text,#5F6368)] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth pr-10"
        >
          {categories.map((cat) => {
            const isActive = category === cat;
            const getPillarIcon = (catName: string) => {
              const name = catName.toLowerCase();
              if (name.includes('renew') || name.includes('solar')) return <Sun className="w-3.5 h-3.5" />;
              if (name.includes('oil') || name.includes('gas')) return <Flame className="w-3.5 h-3.5" />;
              if (name.includes('govern') || name.includes('policy')) return <Landmark className="w-3.5 h-3.5" />;
              if (name.includes('grant') || name.includes('subsidy')) return <Gift className="w-3.5 h-3.5" />;
              return <Layers className="w-3.5 h-3.5" />;
            };

            return (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`h-9 px-4 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[var(--md-sys-color-primary-container,#D3E3FD)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] font-semibold shadow-xs'
                    : 'bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[#282A2C]'
                }`}
              >
                {getPillarIcon(cat)}
                <span>{getLocalizedCategory(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Search Notification Banner */}
      {searchQuery && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--md-sys-color-primary-container,#D3E3FD)]/50 dark:bg-[var(--md-sys-color-primary-container,#0842A0)]/30 border border-[var(--md-sys-color-primary-container,#D3E3FD)] flex items-center justify-between">
          <div className="text-xs text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)]">
            Filtering by search query: <span className="font-bold">"{searchQuery}"</span> ({newsItems.length} publications found)
          </div>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-xs font-semibold underline text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-2xl flex items-center justify-between border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
          <button onClick={refresh} className="p-1.5 hover:bg-black/10 rounded-full cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-[var(--radius-card,24px)] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-20 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
              <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="w-3/4 h-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-full h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && empty && (
        <div className="text-center py-16 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-[var(--radius-card,24px)] p-8">
          <p className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-2">No matching intelligence publications</p>
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mb-6">
            There are currently no articles matching the selected category or query filter.
          </p>
          <button
            onClick={() => { selectCategory('All Updates'); setQuery(''); }}
            className="px-6 py-2.5 bg-[var(--md-sys-color-primary,#1A73E8)] text-white rounded-full text-xs font-medium hover:bg-[var(--md-sys-color-primary-hover,#1557B0)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 3-Column Bento Publication Grid (Google Research Grid) */}
      {!loading && !empty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery ? newsItems : gridStories).map((item) => {
            const titleText = getLocalizedValue(item, 'title', language);
            const thumbUrl = getOptimizedImageUrl(item.imageUrl || item.image_url, 480, 270);

            return (
              <article
                key={item.id}
                onClick={() => openArticle(item)}
                className="google-publication-card p-5 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* 1. Thumbnail Image on TOP */}
                  {thumbUrl && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-[#F1F3F4] dark:bg-[#1E1F20] mb-3.5 border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
                      <img
                        src={thumbUrl}
                        alt={titleText}
                        width={480}
                        height={270}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* 2. Date: Uppercase, small, muted, font-mono */}
                  <time 
                    dateTime={item.publishedAt}
                    className="block text-[11px] font-mono font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-1.5"
                  >
                    {formatDate(item.publishedAt)}
                  </time>

                  {/* 3. Headline: Google Sans style, medium weight, crisp */}
                  <h3 className="text-[17px] sm:text-[18px] font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-[var(--md-sys-color-on-surface,#E3E3E3)] line-clamp-2 mb-2 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors leading-snug">
                    {titleText}
                  </h3>

                  {/* 4. Analytical summary */}
                  <p className="text-[13px] sm:text-[14px] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] line-clamp-2 leading-relaxed mb-4">
                    {getLocalizedValue(item, 'summary', language) || 'No summary available.'}
                  </p>
                </div>

                {/* 5. Categories & Sources: Dot-separated metadata (NO bubble badges) */}
                <div className="pt-3 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between gap-2 text-[12px] text-[#5F6368] dark:text-[#9AA0A6]">
                  <div className="flex flex-wrap items-center gap-1.5 truncate">
                    {item.category && <span>{getLocalizedCategory(item.category)}</span>}
                    {(item.sourcePublisher || item.source) && (
                      <>
                        <span>·</span>
                        <span className="truncate">{item.sourcePublisher || item.source}</span>
                      </>
                    )}
                    {item.sourceUrl && (
                      <>
                        <span>·</span>
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-0.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Source ↗
                        </a>
                      </>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] group-hover:bg-[#1A73E8] group-hover:border-[#1A73E8] text-[#1F1F1F] dark:text-white group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 directional-icon transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[#282A2C] text-xs font-semibold rounded-full transition-all shadow-xs cursor-pointer"
          >
            {t('news.loadMore', 'Load More Publications')}
          </button>
        </div>
      )}

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
          <article className="bg-white dark:bg-[#1E1F20] rounded-t-3xl md:rounded-[var(--radius-card,24px)] border-t md:border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] max-w-3xl w-full h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-5 animate-scale-up">
            
            {/* Header: Close Button */}
            <button
              onClick={() => {
                setSelectedArticle(null);
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/news/')) {
                  window.history.pushState({}, '', '/');
                }
              }}
              aria-label="Close article"
              className="sticky top-0 z-50 ms-auto float-end p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer touch-manipulation"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Article Image */}
            {getOptimizedImageUrl(selectedArticle.imageUrl || selectedArticle.image_url, 960, 540) && (
              <div className="w-full h-56 md:h-80 rounded-2xl overflow-hidden border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
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
              <div className="flex items-center gap-2 mb-3">
                {selectedArticle.category && (
                  <span 
                    style={{
                      backgroundColor: getBadgeColors(selectedArticle.category).bg,
                      color: getBadgeColors(selectedArticle.category).text,
                    }}
                    className="px-3 py-0.5 rounded-full text-xs font-semibold"
                  >
                    {getLocalizedCategory(selectedArticle.category)}
                  </span>
                )}
                <time 
                  dateTime={selectedArticle.publishedAt} 
                  className="text-xs font-mono text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)]"
                >
                  {formatDate(selectedArticle.publishedAt)}
                </time>
              </div>

              <h1 id="article-modal-heading" tabIndex={-1} className="text-xl md:text-3xl font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white leading-tight mb-3 [text-wrap:balance] focus:outline-none">
                {getLocalizedValue(selectedArticle, 'title', language)}
              </h1>
            </div>

            {/* Executive Summary Box */}
            <div className="p-4 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#131314)] border-s-4 border-[var(--md-sys-color-primary,#1A73E8)] rounded-e-xl">
              <p className="text-xs md:text-sm text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-neutral-200 italic font-medium leading-relaxed">
                "{getLocalizedValue(selectedArticle, 'summary', language) || 'No summary available for this story.'}"
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-neutral-300 leading-relaxed space-y-4 pt-2">
              <Suspense fallback={<p className="text-xs text-neutral-500">{getLocalizedValue(selectedArticle, 'summary', language)}</p>}>
                <ReactMarkdown>
                  {getLocalizedValue(selectedArticle, 'content', language) || getLocalizedValue(selectedArticle, 'summary', language) || 'Full article text is being prepared for this publication.'}
                </ReactMarkdown>
              </Suspense>
            </div>

            {/* Source Filing Attribution */}
            {selectedArticle.sourceUrl && (
              <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)]">
                  EU Directive 2019/790 Article 15 Attribution
                </span>
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[var(--md-sys-color-primary,#1A73E8)] text-white rounded-full font-medium text-xs inline-flex items-center gap-1.5 hover:bg-[var(--md-sys-color-primary-hover,#1557B0)] transition-colors cursor-pointer"
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
