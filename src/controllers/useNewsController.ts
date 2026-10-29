/**
 * News Feed State Controller
 * Manages category filtering, fetching, pagination, and UI state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
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

export function useNewsController() {
  const initialData = useInitialData();
  const hasInitialNews = Boolean(initialData?.newsItems && initialData.newsItems.length > 0);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All Updates');
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
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const isInitialMountRef = useRef<boolean>(true);

  const fetchNews = useCallback(async (category: NewsCategory, background = false) => {
    setState(prev => ({
      ...prev,
      loading: background ? false : prev.data.length === 0,
      error: null
    }));
    try {
      const items = await NewsRepository.getPublishedNews(category);
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem('energeia_news_dirty');
        }
      } catch {}
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

  const selectCategory = (category: NewsCategory) => {
    setActiveCategory(category);
    setVisibleCount(10);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const refresh = () => {
    fetchNews(activeCategory, false);
  };

  const visibleNews = state.data.slice(0, visibleCount);
  const hasMore = visibleCount < state.data.length;

  return {
    category: activeCategory,
    categories: NEWS_CATEGORIES,
    newsItems: visibleNews,
    totalCount: state.data.length,
    loading: state.loading,
    error: state.error,
    empty: state.empty,
    hasMore,
    selectCategory,
    loadMore,
    refresh
  };
}
