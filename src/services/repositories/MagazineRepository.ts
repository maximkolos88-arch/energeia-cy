/**
 * Digital Library / Magazine Repository Layer
 * Interacts with backend Express server /api/magazines endpoints
 */

import { supabase } from '../../lib/supabase';
import { MagazineIssue } from '../../models/types';

export class MagazineRepository {
  private static mapSupabaseToMagazine(item: any): MagazineIssue {
    return {
      id: item.id,
      title: item.title || '',
      issueNumber: item.issue_number || 1,
      publishDate: item.publish_date || '',
      coverImageUrl: item.cover_image_url || '',
      pdfUrl: item.pdf_url || '',
      description: item.description || '',
      isPublished: item.is_published || false
    };
  }

  private static mapMagazineToSupabase(issue: Partial<MagazineIssue>): any {
    const mapped: any = {};
    if (issue.title !== undefined) mapped.title = issue.title;
    if (issue.issueNumber !== undefined) mapped.issue_number = issue.issueNumber;
    if (issue.publishDate !== undefined) mapped.publish_date = issue.publishDate;
    if (issue.coverImageUrl !== undefined) mapped.cover_image_url = issue.coverImageUrl;
    if (issue.pdfUrl !== undefined) mapped.pdf_url = issue.pdfUrl;
    if (issue.description !== undefined) mapped.description = issue.description;
    if (issue.isPublished !== undefined) mapped.is_published = issue.isPublished;
    return mapped;
  }

  /**
   * Fetch all magazine issues
   */
  static async getMagazineIssues(): Promise<MagazineIssue[]> {
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('issue_number', { ascending: false });
    if (error) {
      console.error("Failed to fetch magazines from Supabase:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToMagazine(item));
  }

  /**
   * Create a magazine issue (Admin Panel CRUD)
   */
  static async createIssue(issue: Omit<MagazineIssue, 'id'>): Promise<MagazineIssue> {
    const mapped = this.mapMagazineToSupabase(issue);
    const { data, error } = await supabase
      .from('magazines')
      .insert([mapped])
      .select();
    if (error) {
      console.error("Failed to create magazine in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from creation");
    return this.mapSupabaseToMagazine(data[0]);
  }

  /**
   * Update a magazine issue (Admin Panel CRUD)
   */
  static async updateIssue(id: string, issue: Partial<MagazineIssue>): Promise<MagazineIssue> {
    const mapped = this.mapMagazineToSupabase(issue);
    const { data, error } = await supabase
      .from('magazines')
      .update(mapped)
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to update magazine in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from update");
    return this.mapSupabaseToMagazine(data[0]);
  }

  /**
   * Delete a magazine issue (Admin Panel CRUD)
   */
  static async deleteIssue(id: string): Promise<MagazineIssue> {
    const { data, error } = await supabase
      .from('magazines')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to delete magazine from Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from delete");
    return this.mapSupabaseToMagazine(data[0]);
  }
}
