/**
 * Member Directory Repository Layer
 * Interacts with Firestore 'participants' collection
 */

import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DirectoryMember } from '../../models/types';

export const ALL_EXPERTISE_TAGS = [
  "Solar PV", "Wind Power", "Energy Storage", "Hydrogen", "Smart Grids", 
  "Energy Efficiency", "EV Infrastructure", "Microgrids", 
  "E&P (Exploration & Production)", "LNG Infrastructure", "Offshore Support", 
  "Bunkering", "EPC", "O&M", "Project Management", "Energy Trading", 
  "PPA Structuring", "Legal Counsel", "Financial Advisory", 
  "ESG & Environmental", "Policy & Regulatory"
];

let IN_MEMORY_DIRECTORY: DirectoryMember[] = [
  {
    id: 'member-1',
    name: 'Elena Vasiliou',
    type: 'Individual',
    roleOrCategory: 'Independent Energy & ESG Auditor',
    email: 'elena.vasiliou@energeia.cy',
    phone: '+357 99 123456',
    location: 'Nicosia',
    expertiseTags: ['ESG & Environmental', 'Policy & Regulatory', 'Energy Efficiency'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtdU_pDIVMIMs3jGXRG5Xd4kzByVAdYcOYt40VlE9dJFiQk_cDtChYsTcqBGNdpBnUjMq5FCQ8_EXTqaupV74Jo0MkITWRvqthgS7bosXHk4HnB0IGPqfueUayRglXCWJ5WahqohB2YmlcElxg1jP1QCMw8xnZ_vJ27gpo8ByKlOTLt82aPlrF7Cg7QqZ2TzXT77eVx8KPZ59Y2LzIO_CDaMgQguK4REiFJ9FSXox-QbEmaNthEvKEuA',
    description: 'Certified European Energy Manager & Senior ESG Consultant for commercial PV and policy compliance.',
    isVerified: true
  },
  {
    id: 'member-2',
    name: 'Helios Dynamics Ltd',
    type: 'Company',
    roleOrCategory: 'Solar & Battery Storage Contractor',
    email: 'contact@heliosdynamics.com.cy',
    phone: '+357 25 876543',
    location: 'Limassol',
    expertiseTags: ['Solar PV', 'Energy Storage', 'Wind Power'],
    imageUrl: '',
    description: 'Premier turnkey solar photovoltaics installation, wind energy integration, and industrial storage contractor in Cyprus.',
    isVerified: true
  },
  {
    id: 'member-3',
    name: 'Andreas Kyriakou',
    type: 'Individual',
    roleOrCategory: 'Grid & Microgrid Specialist',
    email: 'andreas.k@energeia.cy',
    phone: '+357 99 334455',
    location: 'Larnaca',
    expertiseTags: ['Smart Grids', 'Energy Storage', 'EV Infrastructure', 'Microgrids'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2TyQev0dIPG45d2E4DOVj3skqHeOnipirzYXfH7wejZJ1dvLCtzU2-R1CtB8TaFVw4fDCPj6xkGEfZRtoqTBHBrSIZVdqJCspiXheu16m2S3Pkmp0cmlZeXJFRY2mjwz1uVYcWeNTP7lCqaic8BZoZbH1T4c3qSIeYyS4DBkew16Xl9sk0_R8SrIZcAnPVw_CFWTqoSOBcJO5Brf5z_ltLF5p51kPNR2hXQ783kouFLGvdegrEy_Pew',
    description: 'Electrical engineer specializing in transmission grid connection protocols, storage synchronization, and EV hubs.',
    isVerified: true
  },
  {
    id: 'member-4',
    name: 'EcoAudit Partners',
    type: 'Company',
    roleOrCategory: 'ESG Advisory & Sustainability Agency',
    email: 'info@ecoauditpartners.cy',
    phone: '+357 22 554433',
    location: 'Nicosia',
    expertiseTags: ['ESG & Environmental', 'Policy & Regulatory', 'Energy Efficiency'],
    imageUrl: '',
    description: 'Institutional ESG reporting, GHG emissions auditing, EU taxonomy advisory, and CSRD compliance advisory firm.',
    isVerified: true
  },
  {
    id: 'member-5',
    name: 'Kypros Wind Power Ltd',
    type: 'Company',
    roleOrCategory: 'Wind Farm Operator',
    email: 'operations@kypros-wind.cy',
    phone: '+357 26 910200',
    location: 'Paphos',
    expertiseTags: ['Wind Power', 'Energy Storage', 'Policy & Regulatory'],
    imageUrl: '',
    description: 'Commercial onshore wind turbine array developer and grid balancing market provider.',
    isVerified: true
  }
];

export class DirectoryRepository {
  /**
   * Fetch all participants (unfiltered, for admin dashboard)
   */
  static async getAllParticipants(): Promise<DirectoryMember[]> {
    try {
      const res = await fetch('/api/participants');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      IN_MEMORY_DIRECTORY = data;
      return data;
    } catch (err) {
      console.warn("Failed to fetch all participants from Express server:", err);
      return IN_MEMORY_DIRECTORY;
    }
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
    let results = IN_MEMORY_DIRECTORY;

    try {
      const res = await fetch('/api/participants');
      if (res.ok) {
        results = await res.json();
        IN_MEMORY_DIRECTORY = results;
      }
    } catch (err) {
      console.warn("Express directory fetch failed, using local seed members:", err);
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
    const res = await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to create member');
    return await res.json();
  }

  /**
   * Update a member (Admin Panel CRUD)
   */
  static async updateMember(id: string, member: Partial<DirectoryMember>): Promise<DirectoryMember> {
    const res = await fetch(`/api/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to update member');
    return await res.json();
  }

  /**
   * Delete a member (Admin Panel CRUD)
   */
  static async deleteMember(id: string): Promise<DirectoryMember> {
    const res = await fetch(`/api/participants/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete member');
    return await res.json();
  }
}

