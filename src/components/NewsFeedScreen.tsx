import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

const ReactMarkdown = React.lazy(() => import('react-markdown'));
import { useWebMCP } from 'use-webmcp-tool';
import { useNewsController } from '../controllers/useNewsController';
import { NewsItem, NewsCategory } from '../models/types';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { SEOManager } from './seo/SEOManager';
import { useInitialData } from '../context/InitialDataContext';
import { getOptimizedImageUrl } from '../utils/imageProxy';

const NEWS_CATEGORY_VALUES: readonly NewsCategory[] = [
  'All News',
  'Renewables & Solar',
  'Oil & Gas',
  'Government & Policy',
  'Grants & Subsidies',
  'Electricity & Trading',
  'Maritime & Offshore',
];

const FILTER_NEWS_SCHEMA = {
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
};

const SEARCH_NEWS_SCHEMA = {
  type: 'object',
  properties: {
    query: {
      type: 'string',
      description: 'Search keywords to match against Cyprus energy news titles and summaries.',
    },
  },
  required: ['query'],
};
import { 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ChevronRight,
  Globe,
  Zap,
  Megaphone,
  Pin,
  Bell,
  ChevronDown,
  ChevronUp,
  Info,
  Sun,
  Flame,
  Landmark,
  ShieldCheck,
  Gift,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';

interface NewsFeedScreenProps {
  language?: string;
  path?: string;
}

export const NewsFeedScreen: React.FC<NewsFeedScreenProps> = ({ language = 'en', path: propPath }) => {
  const { t } = useTranslation();
  const initialData = useInitialData();
  const {
    category,
    categories,
    newsItems,
    loading,
    error,
    empty,
    hasMore,
    selectCategory,
    loadMore,
    refresh
  } = useNewsController();

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const checkScrollable = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const canScrollRight = el.scrollWidth > el.clientWidth && (el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
      setShowScrollBtn(canScrollRight);
    }
  };

  useEffect(() => {
    checkScrollable();
    // Add small delay to ensure rendering completes
    const timer = setTimeout(checkScrollable, 200);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScrollable);
    }
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScrollable);
      }
    };
  }, [categories, newsItems]);

  const handleScroll = () => {
    checkScrollable();
  };

  const handleScrollRight = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: 160, behavior: 'smooth' });
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
    if (name === 'all news') return t('categories.allNews');
    if (name.includes('renew') || name.includes('solar')) return t('categories.renewables');
    if (name.includes('oil') || name.includes('gas')) return t('categories.oilGas');
    if (name.includes('govern') || name.includes('policy')) return t('categories.govPolicy');
    if (name.includes('grant') || name.includes('subsidy')) return t('categories.grantsSubsidies');
    if (name.includes('trading') || name.includes('electric')) return t('categories.electricityTrading');
    if (name.includes('maritime') || name.includes('offshore')) return t('categories.maritimeOffshore');
    if (name.includes('engineering') || name.includes('epc')) return t('categories.engineeringEpc');
    if (name.includes('professional') || name.includes('service')) return t('categories.professionalServices');
    if (name.includes('association')) return t('categories.govAssociations');
    return catName;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const day = d.getDate();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      }
    } catch (e) {}

    const gmtMatch = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (gmtMatch) {
      const day = gmtMatch[1];
      const shortMonth = gmtMatch[2];
      const year = gmtMatch[3];
      const monthMap: Record<string, string> = {
        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
      };
      const fullMonth = monthMap[shortMonth] || shortMonth;
      return `${day} ${fullMonth} ${year}`;
    }

    return dateStr;
  };

  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(() => {
    if (initialData?.selectedArticle) return initialData.selectedArticle;
    return null;
  });

  useWebMCP<{ category?: NewsCategory }, unknown>({
    name: 'filter_energy_news',
    description: 'Filters the Cyprus energy news feed by market sector category. Use when the user wants to view news for a specific Cyprus energy pillar.',
    inputSchema: FILTER_NEWS_SCHEMA,
    annotations: { readOnlyHint: true },
    execute({ category: targetCategory = 'All News' }) {
      if (typeof targetCategory !== 'string' || !NEWS_CATEGORY_VALUES.includes(targetCategory as NewsCategory)) {
        return {
          error: 'Unsupported category value.',
          supportedCategories: NEWS_CATEGORY_VALUES,
        };
      }
      selectCategory(targetCategory as NewsCategory);
      const filtered = targetCategory === 'All News'
        ? newsItems
        : newsItems.filter(item => item.category === targetCategory);
      return {
        activeCategory: targetCategory,
        count: filtered.length,
        articles: filtered.slice(0, 10).map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          publishedAt: item.publishedAt,
          summary: item.summary,
        })),
      };
    },
  });

  useWebMCP<{ query?: string }, unknown>({
    name: 'search_energy_news',
    description: 'Searches Cyprus energy news articles by keyword and returns matching headlines, summaries, and publication dates.',
    inputSchema: SEARCH_NEWS_SCHEMA,
    annotations: { readOnlyHint: true },
    execute({ query }) {
      if (typeof query !== 'string' || !query.trim()) {
        return { error: 'Pass a non-empty search query string.' };
      }
      const q = query.trim().toLowerCase();
      const matches = newsItems.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          (item.summary && item.summary.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
      return {
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
      };
    },
  });

  // Check URL pathname for direct /news/[slug] deep-linking on client side
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
  }, []);

  // Keyboard Accessibility: Close article modal on Escape key press
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

  const getBadgeStyle = (categoryOrBadge?: string) => {
    const c = categoryOrBadge?.toLowerCase() || '';
    if (c.includes('renew') || c.includes('solar') || c.includes('wind')) {
      return 'bg-[#e8f5e9] text-[#1CA350] font-semibold dark:bg-[#1b4332] dark:text-[#8fdfab]';
    }
    if (c.includes('oil') || c.includes('gas') || c.includes('fossil')) {
      return 'bg-[#fffbeb] text-[#d97706] font-semibold dark:bg-[#451a03] dark:text-[#fcd34d]';
    }
    if (c.includes('policy') || c.includes('govern') || c.includes('cera') || c.includes('regula')) {
      return 'bg-[#eff6ff] text-[#2563eb] font-semibold dark:bg-[#172554] dark:text-[#93c5fd]';
    }
    if (c.includes('grant') || c.includes('subsidy')) {
      return 'bg-[#faf5ff] text-[#9333ea] font-semibold dark:bg-[#3b0764] dark:text-[#d8b4fe]';
    }
    if (c === 'urgent') {
      return 'bg-[#fce8e6] text-[#c5221f] font-semibold dark:bg-[#7f1d1d] dark:text-[#fca5a5]';
    }
    return 'bg-[#f1f3f4] text-[#5f6368] font-medium dark:bg-[#3c4043] dark:text-gray-300';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
      <SEOManager article={selectedArticle} />
      {!selectedArticle && (
        <h1 className="sr-only">Energeia - Cyprus Energy News</h1>
      )}
      {/* Major Energy Pillar Filter Chips Wrapper */}
      <div className="relative w-full mb-6 categories-wrapper">
        {/* Fade Mask & Scroll Button */}
        {showScrollBtn && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#fafafa] via-[#fafafa]/80 to-transparent dark:from-[#1b1c1e] dark:via-[#1b1c1e]/80 dark:to-transparent z-10 pointer-events-none rounded-r-xl" />
            <button
              onClick={handleScrollRight}
              aria-label="Scroll categories right"
              className="absolute right-1 top-0 bottom-2 my-auto z-20 w-8 h-8 rounded-full bg-white dark:bg-[#2d2e30] border border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all cursor-pointer category-scroll-btn"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar categories-list pr-12 scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = category === cat;
            const getPillarIcon = (catName: string) => {
              const name = catName.toLowerCase();
              if (name.includes('renew') || name.includes('solar')) return <Sun className="w-3.5 h-3.5" />;
              if (name.includes('oil') || name.includes('gas')) return <Flame className="w-3.5 h-3.5" />;
              if (name.includes('govern') || name.includes('policy')) return <Landmark className="w-3.5 h-3.5" />;
              if (name.includes('grid') || name.includes('infrastr')) return <Zap className="w-3.5 h-3.5" />;
              if (name.includes('cera') || name.includes('regula')) return <ShieldCheck className="w-3.5 h-3.5" />;
              if (name.includes('grant') || name.includes('subsidy')) return <Gift className="w-3.5 h-3.5" />;
              if (name.includes('market')) return <TrendingUp className="w-3.5 h-3.5" />;
              return <Layers className="w-3.5 h-3.5" />;
            };

            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`px-4 py-2 md:px-3.5 md:py-1.5 min-h-[40px] md:min-h-[32px] rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1CA350] text-white shadow-xs'
                    : 'bg-white dark:bg-[#2d2e30] text-[#5f6368] dark:text-gray-300 border border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043]'
                }`}
              >
                {getPillarIcon(cat)}
                <span>{getLocalizedCategory(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[#fce8e6] text-[#c5221f] rounded-2xl flex items-center justify-between border border-[#f5c2c0]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
          <button onClick={refresh} className="p-1.5 hover:bg-black/10 rounded-full">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Layout: Stream */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* News Items Column */}
        <div className="space-y-4">
          {/* Loading Skeletal Cards */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl animate-pulse space-y-3">
                  <div className="flex gap-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                  <div className="w-full h-10 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && empty && (
            <div className="text-center py-12 bg-white dark:bg-[#2d2e30] border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
              <p className="text-lg font-medium text-neutral-900 dark:text-white mb-2">{t('news.noCoverage')}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                {t('news.noItems')}
              </p>
              <button
                onClick={() => selectCategory('All News')}
                className="px-5 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-hover transition-colors cursor-pointer"
              >
                {t('news.backToAll')}
              </button>
            </div>
          )}

          {/* News Cards Feed */}
          {!loading && !empty && (
            <div className="space-y-3.5 md:space-y-4">
              {newsItems.map((item, idx) => {
                const titleText = getLocalizedValue(item, 'title', language);
                const isHeroImage = Boolean(item.isEditorial);
                const optimizedThumbUrl = getOptimizedImageUrl(item.image_url || item.imageUrl, 320, 214);
                const openArticle = () => {
                  const updateState = () => {
                    if (item.isEditorial && item.slug && typeof window !== 'undefined') {
                      window.history.pushState({}, '', `/news/${item.slug}`);
                    }
                    setSelectedArticle(item);
                  };

                  if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
                    const transition = document.startViewTransition(updateState);
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

                  if (typeof window !== 'undefined') {
                    (window as any).trackCustomEvent?.('post_read', item.id);
                  }
                };
                return (
                  <article
                    key={item.id}
                    onClick={openArticle}
                    className={`bg-white dark:bg-[#1b1c1e] border rounded-xl p-4 md:p-6 transition-all duration-200 ease-in-out group cursor-pointer relative flex ${
                      isHeroImage ? 'flex-col md:flex-row' : 'flex-row items-center md:items-stretch'
                    } gap-4 md:gap-6 justify-between active:scale-[0.98] touch-manipulation ${
                      idx >= 4 ? 'feed-card-deferred ' : ''
                    }${
                      item.isEditorial 
                        ? 'border-emerald-500/50 dark:border-emerald-500/40 shadow-xs hover:shadow-sm' 
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-primary/80'
                    }`}
                  >
                    <div className="flex-1 flex flex-col justify-between order-1">
                      <div>
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-2 md:mb-3 text-xs">
                          <time dateTime={item.publishedAt} className="text-neutral-500 dark:text-neutral-400 font-medium tabular-nums text-[11px] md:text-xs">
                            {formatDate(item.publishedAt)}
                          </time>

                          <div className="flex items-center gap-1.5 md:gap-2">
                            {item.isEditorial && (
                              <span className="px-2 py-0.5 md:px-2.5 rounded-md text-[10px] md:text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Energeia Insight
                              </span>
                            )}
                            {getLocalizedCategory(item.category) ? (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-medium ${getBadgeStyle(item.category)}`}>
                                {getLocalizedCategory(item.category)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Headline */}
                        <h2 className="text-sm md:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug md:leading-snug group-hover:text-primary transition-colors mb-1 md:mb-2 tracking-tight [text-wrap:balance]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openArticle();
                            }}
                            className="text-left bg-transparent border-0 p-0 font-inherit text-inherit cursor-pointer focus-visible:outline-2 focus-visible:outline-primary rounded after:absolute after:inset-0"
                          >
                            {titleText}
                          </button>
                        </h2>
                      </div>

                      {/* Article Summary Snippet */}
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-normal line-clamp-2 md:line-clamp-3 leading-relaxed mt-1 md:mt-2">
                        {getLocalizedValue(item, 'summary', language) || 'No summary available for this story.'}
                      </p>
                    </div>

                    {optimizedThumbUrl ? (
                      <div className={`${
                        isHeroImage 
                          ? 'w-full md:w-32 h-44 md:h-24 order-1 md:order-2' 
                          : 'w-20 h-20 md:w-32 md:h-24 order-2 aspect-square'
                      } rounded-xl overflow-hidden shrink-0 border border-neutral-200/60 dark:border-neutral-800/60`}>
                        <img
                          src={optimizedThumbUrl}
                          alt={titleText}
                          width={128}
                          height={96}
                          loading={idx < 2 ? 'eager' : 'lazy'}
                          decoding={idx < 2 ? 'sync' : 'async'}
                          fetchPriority={idx === 0 ? 'high' : undefined}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="mt-6 md:mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-primary hover:bg-neutral-50 dark:hover:bg-neutral-750 text-xs font-bold rounded-full transition-all shadow-2xs active:scale-[0.96] touch-manipulation cursor-pointer"
              >
                {t('news.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Article Bottom Sheet / Modal Reader (Mobile Bottom Sheet & Desktop Dialog) */}
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
          <article className="bg-white dark:bg-neutral-900 rounded-t-3xl md:rounded-3xl border-t md:border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto p-5 md:p-6 relative shadow-2xl space-y-4 md:space-y-6 animate-scale-up">
            {/* Mobile Sheet Drag Handle Bar */}
            <div className="md:hidden w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto shrink-0 opacity-80" />

            <button
              onClick={() => {
                setSelectedArticle(null);
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/news/')) {
                  window.history.pushState({}, '', '/');
                }
              }}
              aria-label="Close article"
              className="sticky top-0 z-50 ms-auto float-end p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer touch-manipulation"
              style={{ position: 'sticky', top: '0px', zIndex: 50 }}
            >
              <X className="w-5 h-5" />
            </button>

            {getOptimizedImageUrl(selectedArticle.image_url || selectedArticle.imageUrl, 800, 450) ? (
              <div className="w-full h-48 md:h-64 rounded-xl md:rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={getOptimizedImageUrl(selectedArticle.image_url || selectedArticle.imageUrl, 800, 450)}
                  alt={getLocalizedValue(selectedArticle, 'title', language)}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : null}

            {/* Article Meta */}
            <div className="mt-2 md:mt-4">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                {getLocalizedCategory(selectedArticle.category) ? (
                  <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeStyle(selectedArticle.category)}`}>
                    {getLocalizedCategory(selectedArticle.category)}
                  </span>
                ) : null}
                <time dateTime={selectedArticle.publishedAt || selectedArticle.createdAt || new Date().toISOString()} className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums font-mono">
                  {formatDate(selectedArticle.publishedAt)}
                </time>
              </div>

              <h1 id="article-modal-heading" tabIndex={-1} className="text-lg md:text-2xl font-bold text-neutral-900 dark:text-white leading-snug mb-3 [text-wrap:balance] focus:outline-none">
                {getLocalizedValue(selectedArticle, 'title', language)}
              </h1>
            </div>

            {/* Executive Summary Box - Logical Directional Border border-s-4 for RTL support */}
            <div className="p-3.5 md:p-4 bg-neutral-50 dark:bg-neutral-800/60 border-s-4 border-primary rounded-e-xl">
              <p className="text-xs md:text-sm text-neutral-900 dark:text-neutral-200 italic font-medium leading-relaxed">
                "{getLocalizedValue(selectedArticle, 'summary', language) || 'No summary available for this story.'}"
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-3 pt-2">
              <Suspense fallback={<p className="text-xs text-neutral-500">{getLocalizedValue(selectedArticle, 'summary', language)}</p>}>
                <ReactMarkdown>
                  {getLocalizedValue(selectedArticle, 'content', language) || getLocalizedValue(selectedArticle, 'summary', language) || 'Full article text is being prepared for this publication.'}
                </ReactMarkdown>
              </Suspense>
            </div>

            {selectedArticle.sourceUrl && (
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end items-center">
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded-full font-medium text-xs inline-flex items-center gap-1.5 hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  {t('news.viewFiling')} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </article>
        </div>
      )}
    </div>
  );
};
