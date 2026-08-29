import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Newspaper, Calendar, Tag, ArrowLeft, Share2, 
  Check, Clock, Search, BookOpen, ChevronRight, User
} from 'lucide-react';
import { ArticleRepository } from '../services/repositories/ArticleRepository';
import { Article, ArticleCategory } from '../models/types';
import PageHeader from './PageHeader';
import { useTranslation } from 'react-i18next';

export const ArticlesScreen: React.FC = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Single article view state based on URL slug (/articles/[slug])
  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/articles/') && path.length > 10) {
      return path.substring(10);
    }
    return null;
  });

  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [loadingSingle, setLoadingSingle] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Monitor location changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/articles/') && path.length > 10) {
        setActiveSlug(path.substring(10));
      } else {
        setActiveSlug(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load articles list and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [arts, cats] = await Promise.all([
          ArticleRepository.getAllArticles(true), // only published
          ArticleRepository.getCategories()
        ]);
        setArticles(arts);
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load public articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch single article when activeSlug changes
  useEffect(() => {
    if (!activeSlug) {
      setCurrentArticle(null);
      return;
    }
    const fetchArticle = async () => {
      setLoadingSingle(true);
      try {
        const art = await ArticleRepository.getArticleBySlug(activeSlug);
        setCurrentArticle(art);
      } catch (err) {
        console.error(`Failed to load article slug "${activeSlug}":`, err);
      } finally {
        setLoadingSingle(false);
      }
    };
    fetchArticle();
  }, [activeSlug]);

  const handleArticleClick = (slug: string) => {
    setActiveSlug(slug);
    window.history.pushState({}, '', `/articles/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setActiveSlug(null);
    window.history.pushState({}, '', '/articles');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle?.title || 'Energeia Cyprus Article',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesCategory = selectedCategory === 'all' || a.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.summary && a.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate estimated reading time
  const getReadingTime = (content: string): number => {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // ==================== SINGLE ARTICLE DETAIL VIEW ====================
  if (activeSlug) {
    if (loadingSingle) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Loading article...</p>
        </div>
      );
    }

    if (!currentArticle) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <Newspaper className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Article Not Found</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            The article you are looking for may have been removed or the URL slug is invalid.
          </p>
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </button>
        </div>
      );
    }

    return (
      <article className="min-h-screen bg-background pb-16">
        {/* Sticky Back Header Bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Editorial Articles
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <header className="max-w-4xl mx-auto px-4 pt-8 pb-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {currentArticle.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {currentArticle.category.name}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(currentArticle.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              {getReadingTime(currentArticle.content)} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight tracking-tight">
            {currentArticle.title}
          </h1>

          {currentArticle.summary && (
            <p className="text-lg md:text-xl font-medium text-neutral-600 dark:text-neutral-300 border-l-4 border-primary pl-4 py-1 leading-relaxed">
              {currentArticle.summary}
            </p>
          )}

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white">Energeia Editorial Desk</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Authoritative Cyprus Energy Insights</div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {currentArticle.coverImage && (
          <div className="max-w-4xl mx-auto px-4 mb-10">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
              <img
                src={currentArticle.coverImage}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <main className="max-w-3xl mx-auto px-4">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:shadow-md">
            <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
          </div>
        </main>
      </article>
    );
  }

  // ==================== ARTICLES LISTING VIEW ====================
  return (
    <div className="min-h-screen bg-background pb-16 space-y-8">
      {/* Hero Header */}
      <PageHeader
        title="Editorial & Insights"
        description="Exclusive energy market analysis, longreads, and editorial commentary on Cyprus clean transition."
        iconName="newspaper"
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              All Articles
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-neutral-100 dark:bg-neutral-850 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Articles Found</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              No published editorial articles match your current category or search criteria.
            </p>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article.slug)}
                className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <Newspaper className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                  {article.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {article.category.name}
                    </span>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {getReadingTime(article.content)} min
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>

                    {article.summary && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Read Full Article</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
