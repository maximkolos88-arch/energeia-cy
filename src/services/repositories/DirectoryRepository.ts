/**
 * Member Directory Repository Layer
 * Interacts with Firestore 'participants' collection
 */

import { supabase } from '../../lib/supabase';
import { DirectoryMember } from '../../models/types';

export const ALL_EXPERTISE_TAGS = [
  "Solar PV", "Wind Power", "Energy Storage", "Hydrogen", "Smart Grids", 
  "Energy Efficiency", "EV Infrastructure", "Microgrids", 
  "E&P (Exploration & Production)", "LNG Infrastructure", "Offshore Support", 
  "Bunkering", "EPC", "O&M", "Project Management", "Energy Trading", 
  "PPA Structuring", "Legal Counsel", "Financial Advisory", 
  "ESG & Environmental", "Policy & Regulatory"
];

export class DirectoryRepository {
  private static mapSupabaseToMember(item: any): DirectoryMember {
    return {
      id: item.id,
      name: item.name || '',
      type: item.type || 'Individual',
      roleOrCategory: item.role_or_category || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      category: item.category || '',
      expertiseTags: item.expertise_tags || [],
      imageUrl: item.image_url || '',
      description: item.description || '',
      isVerified: item.is_verified || false
    };
  }

  private static mapMemberToSupabase(member: Partial<DirectoryMember>): any {
    const mapped: any = {};
    if (member.name !== undefined) mapped.name = member.name;
    if (member.type !== undefined) mapped.type = member.type;
    if (member.roleOrCategory !== undefined) mapped.role_or_category = member.roleOrCategory;
    if (member.email !== undefined) mapped.email = member.email;
    if (member.phone !== undefined) mapped.phone = member.phone;
    if (member.location !== undefined) mapped.location = member.location;
    if (member.category !== undefined) mapped.category = member.category;
    if (member.expertiseTags !== undefined) mapped.expertise_tags = member.expertiseTags;
    if (member.imageUrl !== undefined) mapped.image_url = member.imageUrl;
    if (member.description !== undefined) mapped.description = member.description;
    if (member.isVerified !== undefined) mapped.is_verified = member.isVerified;
    return mapped;
  }

  /**
   * Fetch all participants (unfiltered, for admin dashboard)
   */
  static async getAllParticipants(): Promise<DirectoryMember[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      console.error("Failed to fetch participants from Supabase:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToMember(item));
  }

  /**
   * Fetch members from 'participants' collection with search query and multi-tag filtering support
   * Match criteria:
   * - Search: exact/partial match on name, roleOrCategory, location, description, or email
   * - Multi-tag: if activeTags is non-empty, member must possess ALL selected tags (or ANY if configured)
   */
  static async getMembers(
    searchQuery: string = '', 
    activeTags: string[] = [],
    tagMatchMode: 'ALL' | 'ANY' = 'ANY'
  ): Promise<DirectoryMember[]> {
    let results: DirectoryMember[] = [];
    try {
      results = await this.getAllParticipants();
    } catch (err) {
      console.error("Supabase directory fetch failed, returning empty list:", err);
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();

    return results.filter(member => {
      // Name & text search (exact + partial match)
      const matchesSearch = trimmedQuery === '' || 
        member.name.toLowerCase().includes(trimmedQuery) ||
        member.roleOrCategory.toLowerCase().includes(trimmedQuery) ||
        (member.location && member.location.toLowerCase().includes(trimmedQuery)) ||
        (member.description && member.description.toLowerCase().includes(trimmedQuery)) ||
        member.email.toLowerCase().includes(trimmedQuery) ||
        member.expertiseTags.some(tag => tag.toLowerCase().includes(trimmedQuery));

      // Multi-tag filtering
      let matchesTags = true;
      if (activeTags.length > 0) {
        const memberTagsLower = member.expertiseTags.map(t => t.toLowerCase());
        const memberTypeLower = member.type.toLowerCase();

        if (tagMatchMode === 'ALL') {
          // Member must match ALL selected tags
          matchesTags = activeTags.every(selectedTag => {
            const tagLower = selectedTag.toLowerCase();
            return memberTagsLower.includes(tagLower) || memberTypeLower === tagLower;
          });
        } else {
          // Member must match ANY selected tag
          matchesTags = activeTags.some(selectedTag => {
            const tagLower = selectedTag.toLowerCase();
            return memberTagsLower.includes(tagLower) || memberTypeLower === tagLower;
          });
        }
      }

      return matchesSearch && matchesTags;
    });
  }

  /**
   * Create a member (Admin Panel CRUD)
   */
  static async createMember(member: Omit<DirectoryMember, 'id'>): Promise<DirectoryMember> {
    const mapped = this.mapMemberToSupabase(member);
    const { data, error } = await supabase
      .from('participants')
      .insert([mapped])
      .select();
    if (error) {
      console.error("Failed to create participant in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error('Failed to create member');
    return this.mapSupabaseToMember(data[0]);
  }

  /**
   * Update a member (Admin Panel CRUD)
   */
  static async updateMember(id: string, member: Partial<DirectoryMember>): Promise<DirectoryMember> {
    const mapped = this.mapMemberToSupabase(member);
    const { data, error } = await supabase
      .from('participants')
      .update(mapped)
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to update participant in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error('Failed to update member');
    return this.mapSupabaseToMember(data[0]);
  }

  /**
   * Delete a member (Admin Panel CRUD)
   */
  static async deleteMember(id: string): Promise<DirectoryMember> {
    const { data, error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to delete participant from Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error('Failed to delete member');
    return this.mapSupabaseToMember(data[0]);
  }
}

