/**
 * News Feed State Controller
 * Manages category filtering with URL sync, search filtering, fetching, pagination, and UI state
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsItem, NewsCategory, AsyncState } from '../models/types';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { useInitialData } from '../context/InitialDataContext';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'All Updates',
  'Renewables',
  'Oil & Gas',
  'Government & Policy',
  'Grants & Subsidies'
];

const CATEGORY_TO_PARAM: Record<NewsCategory, string> = {
  'All Updates': 'all',
  'Renewables': 'renewables',
  'Oil & Gas': 'oil-gas',
  'Government & Policy': 'policy',
  'Grants & Subsidies': 'grants',
};

const PARAM_TO_CATEGORY: Record<string, NewsCategory> = {
  'all': 'All Updates',
  'renewables': 'Renewables',
  'oil-gas': 'Oil & Gas',
  'oil_gas': 'Oil & Gas',
  'policy': 'Government & Policy',
  'government': 'Government & Policy',
  'grants': 'Grants & Subsidies',
  'subsidies': 'Grants & Subsidies',
};

function getInitialCategory(): NewsCategory {
  if (typeof window === 'undefined') return 'All Updates';
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category')?.toLowerCase();
  if (catParam && PARAM_TO_CATEGORY[catParam]) {
    return PARAM_TO_CATEGORY[catParam];
  }
  return 'All Updates';
}

function getInitialQuery(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

export function useNewsController() {
  const initialData = useInitialData();
  const hasInitialNews = Boolean(initialData?.newsItems && initialData.newsItems.length > 0);
  
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(getInitialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(getInitialQuery);

  const [state, setState] = useState<AsyncState<NewsItem[]>>(() => {
    if (hasInitialNews) {
      return {
        data: initialData!.newsItems,
        loading: false,
        error: null,
        empty: false
      };
    }
    return {
      data: [],
      loading: true,
      error: null,
      empty: false
    };
  });
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const fetchNews = useCallback(async (category: NewsCategory, background = false) => {
    setState(prev => ({
      ...prev,
      loading: background ? false : prev.data.length === 0,
      error: null
    }));
    try {
      const items = await NewsRepository.getPublishedNews(category);
      setState({
        data: items,
        loading: false,
        error: null,
        empty: items.length === 0
      });
    } catch (err) {
      setState(prev => ({
        data: prev.data,
        loading: false,
        error: prev.data.length > 0 ? null : (err instanceof Error ? err.message : 'Failed to fetch news updates.'),
        empty: prev.data.length === 0
      }));
    }
  }, []);

  useEffect(() => {
    fetchNews(activeCategory, hasInitialNews);
  }, [activeCategory, fetchNews, hasInitialNews]);

  // Sync category changes with URL query state & native View Transitions
  const selectCategory = (category: NewsCategory) => {
    const update = () => {
      setActiveCategory(category);
      setVisibleCount(10);
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(update);
    } else {
      update();
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramVal = CATEGORY_TO_PARAM[category];
      if (paramVal && paramVal !== 'all') {
        params.set('category', paramVal);
      } else {
        params.delete('category');
      }
      const newQuery = params.toString();
      const newPath = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
      window.history.pushState({}, '', newPath);
    }
  };

  // Sync search query changes with URL
  const setQuery = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(10);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) {
        params.set('q', query.trim());
      } else {
        params.delete('q');
      }
      const newQuery = params.toString();
      const newPath = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
      window.history.pushState({}, '', newPath);
    }
  };

  // Listen to popstate (browser back / forward button)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const cat = getInitialCategory();
      const q = getInitialQuery();
      setActiveCategory(cat);
      setSearchQuery(q);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  const refresh = () => {
    fetchNews(activeCategory, false);
  };

  // Filter items by search query if set
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return state.data;
    const q = searchQuery.toLowerCase().trim();
    return state.data.filter(item => 
      item.title.toLowerCase().includes(q) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      ((item.sourcePublisher || item.source) && (item.sourcePublisher || item.source)!.toLowerCase().includes(q))
    );
  }, [state.data, searchQuery]);

  const visibleNews = filteredData.slice(0, visibleCount);
  const hasMore = visibleCount < filteredData.length;

  return {
    category: activeCategory,
    categories: NEWS_CATEGORIES,
    searchQuery,
    setQuery,
    newsItems: visibleNews,
    totalCount: filteredData.length,
    loading: state.loading,
    error: state.error,
    empty: filteredData.length === 0,
    hasMore,
    selectCategory,
    loadMore,
    refresh
  };
}
