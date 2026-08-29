/**
 * Editorial Articles Repository Layer
 * Interacts with Supabase 'articles' and 'article_categories' tables
 */

import { supabase } from '../../lib/supabase';
import { Article, ArticleCategory } from '../../models/types';

export class ArticleRepository {
  private static mapSupabaseToCategory(item: any): ArticleCategory {
    return {
      id: item.id,
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      createdAt: item.created_at || ''
    };
  }

  private static mapSupabaseToArticle(item: any): Article {
    return {
      id: item.id,
      title: item.title || '',
      slug: item.slug || '',
      summary: item.summary || '',
      content: item.content || '',
      coverImage: item.cover_image || '',
      categoryId: item.category_id || undefined,
      category: item.category ? this.mapSupabaseToCategory(item.category) : undefined,
      isPublished: item.is_published ?? false,
      publishedAt: item.published_at || item.created_at || new Date().toISOString(),
      createdAt: item.created_at || '',
      updatedAt: item.updated_at || ''
    };
  }

  private static mapArticleToSupabase(article: Partial<Article>): any {
    const mapped: any = {};
    if (article.title !== undefined) mapped.title = article.title;
    if (article.slug !== undefined) mapped.slug = article.slug;
    if (article.summary !== undefined) mapped.summary = article.summary;
    if (article.content !== undefined) mapped.content = article.content;
    if (article.coverImage !== undefined) mapped.cover_image = article.coverImage || null;
    if (article.categoryId !== undefined) mapped.category_id = article.categoryId || null;
    if (article.isPublished !== undefined) mapped.is_published = article.isPublished;
    if (article.publishedAt !== undefined) mapped.published_at = article.publishedAt;
    mapped.updated_at = new Date().toISOString();
    return mapped;
  }

  /**
   * Helper to generate a clean URL slug from article title
   */
  static slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;
  }

  /**
   * Fetch all article categories
   */
  static async getCategories(): Promise<ArticleCategory[]> {
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Failed to fetch article categories:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToCategory(item));
  }

  /**
   * Fetch all articles (optionally filter by published status for public view)
   */
  static async getAllArticles(onlyPublished = false): Promise<Article[]> {
    let query = supabase
      .from('articles')
      .select('*, category:article_categories(*)')
      .order('published_at', { ascending: false });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch articles:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToArticle(item));
  }

  /**
   * Fetch a single article by slug (Public Article Detail Page)
   */
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:article_categories(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch article with slug "${slug}":`, error.message);
      throw error;
    }
    if (!data) return null;
    return this.mapSupabaseToArticle(data);
  }

  /**
   * Create a new article (Admin Panel)
   */
  static async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const mapped = this.mapArticleToSupabase(article);
    if (!mapped.slug) {
      mapped.slug = this.slugify(article.title);
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([mapped])
      .select('*, category:article_categories(*)')
      .single();

    if (error) {
      console.error("Failed to create article:", error.message);
      throw error;
    }
    return this.mapSupabaseToArticle(data);
  }

  /**
   * Update an existing article (Admin Panel)
   */
  static async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    const mapped = this.mapArticleToSupabase(article);
    const { data, error } = await supabase
      .from('articles')
      .update(mapped)
      .eq('id', id)
      .select('*, category:article_categories(*)')
      .single();

    if (error) {
      console.error("Failed to update article:", error.message);
      throw error;
    }
    return this.mapSupabaseToArticle(data);
  }

  /**
   * Delete an article by ID (Admin Panel)
   */
  static async deleteArticle(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Failed to delete article:", error.message);
      throw error;
    }
    return true;
  }
}
