/**
 * Digital Library / Magazine Repository Layer
 * Interacts with backend Express server /api/magazines endpoints
 */

import { MagazineIssue } from '../../models/types';

const SEED_MAGAZINES: MagazineIssue[] = [
  {
    id: 'issue-1',
    title: 'Summer 2026',
    issueNumber: 1,
    publishDate: '2026-07-01',
    coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Exclusive interview with the Minister of Energy, special focus on East Med gas exploration, and solar battery storage incentives.',
    isPublished: true
  }
];

export class MagazineRepository {
  /**
   * Fetch all magazine issues
   */
  static async getMagazineIssues(): Promise<MagazineIssue[]> {
    try {
      const res = await fetch('/api/magazines');
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      console.warn("Express magazines fetch error, returning seed list:", err);
      return SEED_MAGAZINES;
    }
  }

  /**
   * Create a magazine issue (Admin Panel CRUD)
   */
  static async createIssue(issue: Omit<MagazineIssue, 'id'>): Promise<MagazineIssue> {
    const res = await fetch('/api/magazines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issue)
    });
    if (!res.ok) throw new Error('Failed to create magazine issue');
    return await res.json();
  }

  /**
   * Update a magazine issue (Admin Panel CRUD)
   */
  static async updateIssue(id: string, issue: Partial<MagazineIssue>): Promise<MagazineIssue> {
    const res = await fetch(`/api/magazines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issue)
    });
    if (!res.ok) throw new Error('Failed to update magazine issue');
    return await res.json();
  }

  /**
   * Delete a magazine issue (Admin Panel CRUD)
   */
  static async deleteIssue(id: string): Promise<MagazineIssue> {
    const res = await fetch(`/api/magazines/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete magazine issue');
    return await res.json();
  }
}
