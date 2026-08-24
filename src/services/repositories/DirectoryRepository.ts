/**
 * Member Directory Repository Layer
 * Interacts with Supabase 'participants' collection
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
      name: item.company_name || item.name || '',
      type: item.type || 'Individual',
      roleOrCategory: item.role_or_category || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      category: item.category || '',
      expertiseTags: item.expertise_tags || [],
      imageUrl: item.image_url || '',
      description: item.description || '',
      description_el: item.description_el || '',
      description_ru: item.description_ru || '',
      description_he: item.description_he || '',
      isVerified: item.is_verified || false,
      logoUrl: item.logo_url || item.image_url || '',
      website: item.website || '',
      linkedin: item.linkedin || '',
      keyContactName: item.key_contact_name || '',
      showDescription: item.show_description ?? true,
      showLocation: item.display_location ?? item.show_location ?? true,
      showWebsite: item.display_website ?? item.show_website ?? true,
      showLinkedin: item.display_linkedin ?? item.show_linkedin ?? true,
      showEmail: item.display_email ?? item.show_email ?? true,
      showPhone: item.display_phone ?? item.show_phone ?? true,
      showKeyContact: item.display_contact_name ?? item.show_key_contact ?? true,
      keyServices: item.key_services || [],
      notableProjects: item.notable_projects || '',
      certifications: item.certifications || '',
      showKeyServices: item.display_services ?? item.show_key_services ?? true,
      showNotableProjects: item.display_projects ?? item.show_notable_projects ?? true,
      showCertifications: item.display_certifications ?? item.show_certifications ?? true
    };
  }

  private static mapMemberToSupabase(member: Partial<DirectoryMember>): any {
    const mapped: any = {};
    if (member.name !== undefined) {
      mapped.company_name = member.name || '';
      mapped.name = member.name || ''; // Fallback for name field
    }
    if (member.type !== undefined) mapped.type = member.type || 'Individual';
    if (member.roleOrCategory !== undefined) mapped.role_or_category = member.roleOrCategory || '';
    if (member.email !== undefined) mapped.email = member.email || '';
    if (member.phone !== undefined) mapped.phone = member.phone || null;
    if (member.location !== undefined) mapped.location = member.location || null;
    if (member.category !== undefined) mapped.category = member.category || '';
    if (member.expertiseTags !== undefined) mapped.expertise_tags = member.expertiseTags || [];
    if (member.imageUrl !== undefined) mapped.image_url = member.imageUrl || null;
    if (member.description !== undefined) mapped.description = member.description || '';
    if (member.description_el !== undefined) mapped.description_el = member.description_el || null;
    if (member.description_ru !== undefined) mapped.description_ru = member.description_ru || null;
    if (member.description_he !== undefined) mapped.description_he = member.description_he || null;
    if (member.isVerified !== undefined) mapped.is_verified = member.isVerified ?? false;

    // Supabase specific fields
    if (member.website !== undefined) mapped.website = member.website || null;
    if (member.linkedin !== undefined) mapped.linkedin = member.linkedin || null;
    if (member.keyContactName !== undefined) mapped.key_contact_name = member.keyContactName || null;

    if (member.keyServices !== undefined) {
      mapped.key_services = Array.isArray(member.keyServices)
        ? member.keyServices
        : typeof member.keyServices === 'string'
          ? (member.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
          : [];
    }
    if (member.notableProjects !== undefined) mapped.notable_projects = member.notableProjects || '';
    if (member.certifications !== undefined) mapped.certifications = member.certifications || '';

    // Visibility Flags
    if (member.showKeyServices !== undefined) mapped.display_services = member.showKeyServices;
    if (member.showNotableProjects !== undefined) mapped.display_projects = member.showNotableProjects;
    if (member.showCertifications !== undefined) mapped.display_certifications = member.showCertifications;
    if (member.showEmail !== undefined) mapped.display_email = member.showEmail;
    if (member.showPhone !== undefined) mapped.display_phone = member.showPhone;
    if (member.showLocation !== undefined) mapped.display_location = member.showLocation;
    if (member.showWebsite !== undefined) mapped.display_website = member.showWebsite;
    if (member.showLinkedin !== undefined) mapped.display_linkedin = member.showLinkedin;
    if (member.showKeyContact !== undefined) mapped.display_contact_name = member.showKeyContact;

    return mapped;
  }

  /**
   * Fetch all participants (unfiltered, for admin dashboard)
   */
  static async getAllParticipants(): Promise<DirectoryMember[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      console.error("Failed to fetch participants from Supabase:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToMember(item));
  }

  /**
   * Fetch members from 'participants' collection with search query and multi-tag filtering support
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
