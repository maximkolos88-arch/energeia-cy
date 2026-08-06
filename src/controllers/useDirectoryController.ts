/**
 * Directory State Controller
 * Manages search filter queries, expertise tags, and member list state
 */

import { useState, useEffect, useCallback } from 'react';
import { DirectoryMember, AsyncState } from '../models/types';
import { DirectoryRepository, ALL_EXPERTISE_TAGS } from '../services/repositories/DirectoryRepository';

export function useDirectoryController() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagMatchMode, setTagMatchMode] = useState<'ALL' | 'ANY'>('ANY');
  const [selectedMember, setSelectedMember] = useState<DirectoryMember | null>(null);

  const [state, setState] = useState<AsyncState<DirectoryMember[]>>({
    data: [],
    loading: true,
    error: null,
    empty: false
  });

  const fetchDirectory = useCallback(async (queryStr: string, tags: string[], matchMode: 'ALL' | 'ANY') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const members = await DirectoryRepository.getMembers(queryStr, tags, matchMode);
      setState({
        data: members,
        loading: false,
        error: null,
        empty: members.length === 0
      });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to search directory.',
        empty: true
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDirectory(searchQuery, selectedTags, tagMatchMode);
    }, 200); // Debounce search input

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags, tagMatchMode, fetchDirectory]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const openMemberContact = (member: DirectoryMember) => {
    setSelectedMember(member);
  };

  const closeMemberContact = () => {
    setSelectedMember(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTag,
    clearTags,
    tagMatchMode,
    setTagMatchMode,
    availableFilterTags: ALL_EXPERTISE_TAGS,
    members: state.data,
    loading: state.loading,
    error: state.error,
    empty: state.empty,
    selectedMember,
    openMemberContact,
    closeMemberContact,
    refresh: () => fetchDirectory(searchQuery, selectedTags, tagMatchMode)
  };
}

