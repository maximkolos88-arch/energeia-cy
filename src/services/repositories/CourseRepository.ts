/**
 * Academy Course Repository Layer
 * Interacts with backend Express server /api/courses endpoints
 */

import { AcademyCourse } from '../../models/types';

export const SEED_COURSES: AcademyCourse[] = [
  {
    id: 'course-1',
    title: 'Solar Grid Integration Basics',
    description: 'Learn the fundamental electrical and engineering principles to synchronize utility-scale photovoltaics with high-voltage distribution networks.',
    price: 149,
    duration: '8 Weeks',
    level: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600',
    checkoutUrl: 'https://checkout.stripe.com/pay/dummy_solar_basics',
    isPublished: true
  },
  {
    id: 'course-2',
    title: 'Cyprus Energy Market Regulations',
    description: 'A comprehensive legal and commercial deep dive into CERA regulatory frameworks, bilateral contract models, and open market transition protocols.',
    price: 299,
    duration: '12 Weeks',
    level: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    checkoutUrl: 'https://checkout.stripe.com/pay/dummy_cyprus_regs',
    isPublished: true
  },
  {
    id: 'course-3',
    title: 'Industrial Battery Storage & Peak Shaving',
    description: 'Design and deploy large-scale Lithium-iron phosphate battery setups for power quality control, backup systems, and microgrid leveling.',
    price: 249,
    duration: '6 Weeks',
    level: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
    checkoutUrl: 'https://checkout.stripe.com/pay/dummy_battery_storage',
    isPublished: true
  },
  {
    id: 'course-4',
    title: 'ESG Auditing & Reporting Compliance',
    description: 'Prepare your enterprise for CSRD and EU taxonomy compliance. Learn metrics mapping, GHG protocol calculation, and verification drafting.',
    price: 199,
    duration: '4 Weeks',
    level: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    checkoutUrl: 'https://checkout.stripe.com/pay/dummy_esg_compliance',
    isPublished: true
  }
];

export class CourseRepository {
  /**
   * Fetch all academy courses
   */
  static async getAllCourses(): Promise<AcademyCourse[]> {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      console.warn("Express courses fetch error, returning seed list:", err);
      return SEED_COURSES;
    }
  }

  /**
   * Create a course (Admin Panel CRUD)
   */
  static async createCourse(course: Omit<AcademyCourse, 'id'>): Promise<AcademyCourse> {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return await res.json();
  }

  /**
   * Update a course (Admin Panel CRUD)
   */
  static async updateCourse(id: string, course: Partial<AcademyCourse>): Promise<AcademyCourse> {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Failed to update course');
    return await res.json();
  }

  /**
   * Delete a course (Admin Panel CRUD)
   */
  static async deleteCourse(id: string): Promise<AcademyCourse> {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return await res.json();
  }
}
