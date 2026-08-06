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

  /**
   * Fetch all news items (for Admin CRUD, both Published and Drafts)
   */
  static async getAllNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Failed fetching all news from Supabase:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToNewsItem(item));
  }

  /**
   * Fetch published news items from local API
   * Ordered by publishedAt descending, with category filtering support
   */
  static async getPublishedNews(categoryFilter?: NewsCategory | string): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .or('status.eq.Published,status.eq.PUBLISHED')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Failed fetching published news from Supabase:", error.message);
      throw error;
    }
    const published = (data || []).map(item => this.mapSupabaseToNewsItem(item));
    return this.filterLocalNews(published, categoryFilter);
  }

  /**
   * Create a news item (Admin Panel)
   */
  static async createNewsItem(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          status: item.status,
          image_url: item.imageUrl,
          source_url: item.sourceUrl,
          published_at: item.publishedAt
        }
      ])
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
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

    const { data, error } = await supabase
      .from('news')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
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
    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          status: 'Draft',
          image_url: item.imageUrl,
          source_url: item.sourceUrl,
          published_at: item.publishedAt
        }
      ])
      .select();
    if (error) {
      console.error("Failed creating draft in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from creation");
    return data[0].id;
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

