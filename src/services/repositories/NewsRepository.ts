/**
 * News Feed Repository Layer
 * Interacts with Firestore 'news' collection
 */

import { NewsItem, NewsCategory } from '../../models/types';
import { supabase } from '../../lib/supabase';

export class NewsRepository {
  private static cleanTitle(title: string): string {
    if (!title) return '';
    let cleaned = title.replace(/\s+-\s+[^-]+$/, '').trim();
    return cleaned.replace(/[.\s]+$/, '').trim();
  }

  private static cleanSummary(summary: string): string {
    if (!summary) return '';
    let cleaned = summary.trim();
    cleaned = cleaned.replace(/[.\s]+$/, '').trim();
    if (cleaned && !/[?!]$/.test(cleaned)) {
      cleaned += '.';
    }
    return cleaned;
  }

  private static mapSupabaseToNewsItem(item: any): NewsItem {
    return {
      id: item.id,
      title: this.cleanTitle(item.title || ''),
      summary: this.cleanSummary(item.summary || ''),
      content: item.content || '',
      category: item.category || 'Uncategorized',
      imageUrl: item.image_url || item.imageUrl || '',
      sourceUrl: item.source_url || '',
      publishedAt: item.published_at || item.created_at || '',
      createdAt: item.created_at || '',
      status: item.status || 'Draft',
      readTimeMinutes: item.read_time_minutes || 3
    };
  }

  private static sortByIdDescending(items: NewsItem[]): NewsItem[] {
    return items.sort((a, b) => {
      const idA = String(a.id || '');
      const idB = String(b.id || '');
      const numA = Number(idA);
      const numB = Number(idB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }
      return idB.localeCompare(idA);
    });
  }

  /**
   * Fetch all news items (for Admin CRUD, both Published and Drafts)
   */
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*');
      if (error) {
        console.error("Supabase getAllNews query error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      const mapped = (data || []).map(item => this.mapSupabaseToNewsItem(item));
      return this.sortByIdDescending(mapped);
    } catch (err) {
      console.error("getallNews catch block exception:", err);
      throw err;
    }
  }

  /**
   * Fetch published news items from local API
   * Ordered by publishedAt descending, with category filtering support
   */
  static async getPublishedNews(categoryFilter?: NewsCategory | string): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*');
      if (error) {
        console.error("Supabase getPublishedNews query error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      const mapped = (data || []).map(item => this.mapSupabaseToNewsItem(item));
      
      // Filter out drafts: must have status !== 'Draft' and must have non-empty core fields
      const published = mapped.filter(item => {
        const isDraftStatus = item.status && item.status.toLowerCase() === 'draft';
        const hasCoreFields = item.title && item.title.trim() !== '' &&
                             item.summary && item.summary.trim() !== '' &&
                             item.content && item.content.trim() !== '';
        return !isDraftStatus && hasCoreFields;
      });

      const sorted = this.sortByIdDescending(published);
      return this.filterLocalNews(sorted, categoryFilter);
    } catch (err) {
      console.error("getPublishedNews catch block exception:", err);
      throw err;
    }
  }

  /**
   * Create a news item (Admin Panel)
   */
  static async createNewsItem(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    const fullPayload = {
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category,
      status: item.status,
      image_url: item.imageUrl,
      source_url: item.sourceUrl,
      published_at: item.publishedAt
    };

    try {
      const { data, error } = await supabase
        .from('news')
        .insert([fullPayload])
        .select();
      if (error) throw error;
      return this.mapSupabaseToNewsItem(data[0]);
    } catch (err: any) {
      console.warn("createNewsItem failed with full payload, retrying with core columns only:", err.message);
      const corePayload = {
        title: item.title,
        summary: item.summary,
        content: item.content,
        category: item.category
      };
      const { data, error } = await supabase
        .from('news')
        .insert([corePayload])
        .select();
      if (error) throw error;
      return this.mapSupabaseToNewsItem(data[0]);
    }
  }

  /**
   * Update a news item (Admin Panel)
   */
  static async updateNewsItem(id: string, item: Partial<NewsItem>): Promise<NewsItem> {
    const payload: any = {};
    if (item.title !== undefined) payload.title = item.title;
    if (item.summary !== undefined) payload.summary = item.summary;
    if (item.content !== undefined) payload.content = item.content;
    if (item.category !== undefined) payload.category = item.category;
    if (item.status !== undefined) payload.status = item.status;
    if (item.imageUrl !== undefined) payload.image_url = item.imageUrl;
    if (item.sourceUrl !== undefined) payload.source_url = item.sourceUrl;
    if (item.publishedAt !== undefined) payload.published_at = item.publishedAt;

    try {
      const { data, error } = await supabase
        .from('news')
        .update(payload)
        .eq('id', id)
        .select();
      if (error) throw error;
      return this.mapSupabaseToNewsItem(data[0]);
    } catch (err: any) {
      console.warn("updateNewsItem failed with full payload, retrying with core columns only:", err.message);
      const corePayload: any = {};
      if (item.title !== undefined) corePayload.title = item.title;
      if (item.summary !== undefined) corePayload.summary = item.summary;
      if (item.content !== undefined) corePayload.content = item.content;
      if (item.category !== undefined) corePayload.category = item.category;

      const { data, error } = await supabase
        .from('news')
        .update(corePayload)
        .eq('id', id)
        .select();
      if (error) throw error;
      return this.mapSupabaseToNewsItem(data[0]);
    }
  }

  /**
   * Delete a news item (Admin Panel)
   */
  static async deleteNewsItem(id: string): Promise<NewsItem> {
    const { data, error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
  }

  /**
   * Create a draft news item (used by news aggregator or admin panel)
   */
  static async createDraftNews(item: Omit<NewsItem, 'id'>): Promise<string> {
    const fullPayload = {
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category,
      status: 'Draft',
      image_url: item.imageUrl,
      source_url: item.sourceUrl,
      published_at: item.publishedAt
    };

    try {
      const { data, error } = await supabase
        .from('news')
        .insert([fullPayload])
        .select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No data returned from creation");
      return data[0].id;
    } catch (err: any) {
      console.warn("createDraftNews failed with full payload, retrying with core columns only:", err.message);
      const corePayload = {
        title: item.title,
        summary: item.summary,
        content: item.content,
        category: item.category
      };
      const { data, error } = await supabase
        .from('news')
        .insert([corePayload])
        .select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No data returned from creation");
      return data[0].id;
    }
  }

  private static filterLocalNews(items: NewsItem[], categoryFilter?: string): NewsItem[] {
    if (!categoryFilter || categoryFilter === 'All Updates' || categoryFilter === 'All News') {
      return items;
    }
    const filterLower = categoryFilter.toLowerCase();
    return items.filter(item => {
      const catLower = item.category.toLowerCase();

      if (catLower === filterLower) return true;
      if (catLower.includes(filterLower) || filterLower.includes(catLower)) return true;
      
      // Keyword matching
      if (filterLower.includes('renew') || filterLower.includes('solar')) {
        return catLower.includes('renew') || catLower.includes('solar');
      }
      if (filterLower.includes('oil') || filterLower.includes('gas')) {
        return catLower.includes('oil') || catLower.includes('gas');
      }
      if (filterLower.includes('govern') || filterLower.includes('policy')) {
        return catLower.includes('govern') || catLower.includes('policy');
      }
      if (filterLower.includes('grid') || filterLower.includes('eac')) {
        return catLower.includes('grid') || catLower.includes('eac');
      }
      if (filterLower.includes('cera') || filterLower.includes('regula')) {
        return catLower.includes('cera') || catLower.includes('regula');
      }
      if (filterLower.includes('grant') || filterLower.includes('subsidy')) {
        return catLower.includes('grant') || catLower.includes('subsid');
      }
      if (filterLower.includes('market')) {
        return catLower.includes('market');
      }

      return false;
    });
  }
}

