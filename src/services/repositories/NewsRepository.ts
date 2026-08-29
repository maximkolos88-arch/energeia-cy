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

  static slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `news-${Date.now()}`;
  }

  private static mapSupabaseToNewsItem(item: any): NewsItem {
    return {
      id: item.id,
      title: this.cleanTitle(item.title || ''),
      slug: item.slug || '',
      summary: this.cleanSummary(item.summary || ''),
      content: item.content || '',
      category: item.category || '',
      imageUrl: item.image_url || item.imageUrl || '',
      sourceUrl: item.source_url || '',
      publishedAt: item.published_at || item.created_at || '',
      createdAt: item.created_at || '',
      status: item.status || 'Draft',
      isEditorial: item.is_editorial ?? false,
      readTimeMinutes: item.read_time_minutes || 3,
      title_el: item.title_el || '',
      title_ru: item.title_ru || '',
      title_he: item.title_he || '',
      summary_el: item.summary_el || '',
      summary_ru: item.summary_ru || '',
      summary_he: item.summary_he || '',
      content_el: item.content_el || '',
      content_ru: item.content_ru || '',
      content_he: item.content_he || ''
    };
  }

  private static parseTimestamp(item: NewsItem): number {
    const rawDate = item.createdAt || item.publishedAt;
    if (rawDate) {
      const ts = new Date(rawDate).getTime();
      if (!isNaN(ts) && ts > 0) return ts;
    }
    if (item.publishedAt) {
      const ts = new Date(item.publishedAt).getTime();
      if (!isNaN(ts) && ts > 0) return ts;
    }
    return 0;
  }

  private static sortByDateDescending(items: NewsItem[]): NewsItem[] {
    return items.sort((a, b) => {
      const dateA = this.parseTimestamp(a);
      const dateB = this.parseTimestamp(b);
      return dateB - dateA;
    });
  }

  /**
   * Fetch all news items (for Admin CRUD, both Published and Drafts)
   */
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.warn("Supabase ordering by created_at failed, retrying without ordering:", error.message);
        const fallbackRes = await supabase.from('news').select('*');
        if (fallbackRes.error) throw fallbackRes.error;
        const mapped = (fallbackRes.data || []).map(item => this.mapSupabaseToNewsItem(item));
        return this.sortByDateDescending(mapped);
      }
      
      const mapped = (data || []).map(item => this.mapSupabaseToNewsItem(item));
      return this.sortByDateDescending(mapped);
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
        .select('*')
        .order('created_at', { ascending: false });
      
      const rawData = error ? (await supabase.from('news').select('*')).data || [] : (data || []);
      const mapped = rawData.map(item => this.mapSupabaseToNewsItem(item));
      
      // Filter out drafts: only exclude items explicitly marked as status === 'Draft' (case-insensitive)
      const published = mapped.filter(item => {
        const isDraftStatus = item.status && item.status.toString().trim().toLowerCase() === 'draft';
        const hasTitleAndSummary = Boolean(item.title && item.title.trim() !== '');
        return !isDraftStatus && hasTitleAndSummary;
      });

      const sorted = this.sortByDateDescending(published);
      return this.filterLocalNews(sorted, categoryFilter);
    } catch (err) {
      console.error("getPublishedNews catch block exception:", err);
      throw err;
    }
  }

  /**
   * Fetch a single news item by slug (for Editorial Readers)
   */
  static async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch news item with slug "${slug}":`, error.message);
      throw error;
    }
    if (!data) return null;
    return this.mapSupabaseToNewsItem(data);
  }

  /**
   * Create a news item (Admin Panel)
   */
  static async createNewsItem(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    if (item.sourceUrl) {
      const { data: existing } = await supabase
        .from('news')
        .select('*')
        .eq('source_url', item.sourceUrl)
        .maybeSingle();
      if (existing) {
        console.log(`[NewsRepository] Skip insertion: Article with source_url ${item.sourceUrl} already exists (ID: ${existing.id}).`);
        return this.mapSupabaseToNewsItem(existing);
      }
    }

    const fullPayload: any = {
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category,
      status: item.status,
      image_url: item.imageUrl,
      source_url: item.sourceUrl,
      published_at: item.publishedAt,
      is_editorial: item.isEditorial ?? false,
      slug: item.slug || (item.isEditorial ? this.slugify(item.title) : null)
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
    if (item.isEditorial !== undefined) payload.is_editorial = item.isEditorial;
    if (item.slug !== undefined) payload.slug = item.slug;

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
    if (item.sourceUrl) {
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('source_url', item.sourceUrl)
        .maybeSingle();
      if (existing) {
        console.log(`[NewsRepository] Skip insertion: Article with source_url ${item.sourceUrl} already exists (ID: ${existing.id}).`);
        return existing.id;
      }
    }

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

