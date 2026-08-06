/**
 * Academy Course Repository Layer
 * Interacts with backend Express server /api/courses endpoints
 */

import { supabase } from '../../lib/supabase';
import { AcademyCourse } from '../../models/types';

export class CourseRepository {
  private static mapSupabaseToCourse(item: any): AcademyCourse {
    return {
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
      duration: item.duration || '',
      level: item.level || '',
      imageUrl: item.image_url || '',
      checkoutUrl: item.checkout_url || '',
      isPublished: item.is_published || false
    };
  }

  private static mapCourseToSupabase(course: Partial<AcademyCourse>): any {
    const mapped: any = {};
    if (course.title !== undefined) mapped.title = course.title;
    if (course.description !== undefined) mapped.description = course.description;
    if (course.price !== undefined) mapped.price = course.price;
    if (course.duration !== undefined) mapped.duration = course.duration;
    if (course.level !== undefined) mapped.level = course.level;
    if (course.imageUrl !== undefined) mapped.image_url = course.imageUrl;
    if (course.checkoutUrl !== undefined) mapped.checkout_url = course.checkoutUrl;
    if (course.isPublished !== undefined) mapped.is_published = course.isPublished;
    return mapped;
  }

  /**
   * Fetch all academy courses
   */
  static async getAllCourses(): Promise<AcademyCourse[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('title', { ascending: true });
    if (error) {
      console.error("Failed to fetch courses from Supabase:", error.message);
      throw error;
    }
    return (data || []).map(item => this.mapSupabaseToCourse(item));
  }

  /**
   * Create a course (Admin Panel CRUD)
   */
  static async createCourse(course: Omit<AcademyCourse, 'id'>): Promise<AcademyCourse> {
    const mapped = this.mapCourseToSupabase(course);
    const { data, error } = await supabase
      .from('courses')
      .insert([mapped])
      .select();
    if (error) {
      console.error("Failed to create course in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from creation");
    return this.mapSupabaseToCourse(data[0]);
  }

  /**
   * Update a course (Admin Panel CRUD)
   */
  static async updateCourse(id: string, course: Partial<AcademyCourse>): Promise<AcademyCourse> {
    const mapped = this.mapCourseToSupabase(course);
    const { data, error } = await supabase
      .from('courses')
      .update(mapped)
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to update course in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from update");
    return this.mapSupabaseToCourse(data[0]);
  }

  /**
   * Delete a course (Admin Panel CRUD)
   */
  static async deleteCourse(id: string): Promise<AcademyCourse> {
    const { data, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to delete course from Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error("No data returned from delete");
    return this.mapSupabaseToCourse(data[0]);
  }
}
