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
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All Updates');
  const [state, setState] = useState<AsyncState<NewsItem[]>>(() => {
    if (initialData?.newsItems && initialData.newsItems.length > 0) {
      return {
        data: initialData.newsItems,
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
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const initialDataUsed = useRef(Boolean(initialData?.newsItems && initialData.newsItems.length > 0));

  const fetchNews = useCallback(async (category: NewsCategory) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const items = await NewsRepository.getPublishedNews(category);
      setState({
        data: items,
        loading: false,
        error: null,
        empty: items.length === 0
      });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch news updates.',
        empty: true
      });
    }
  }, []);

  useEffect(() => {
    // If we initialized with SSG initial data and haven't switched categories yet, skip initial client refetch
    if (initialDataUsed.current && activeCategory === 'All Updates') {
      initialDataUsed.current = false;
      return;
    }
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  const selectCategory = (category: NewsCategory) => {
    setActiveCategory(category);
    setVisibleCount(5);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const refresh = () => {
    fetchNews(activeCategory);
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
