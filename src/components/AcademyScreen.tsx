import React, { useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import { CourseCard } from './CourseCard';
import { AcademyCourse } from '../models/types';
import { CourseRepository } from '../services/repositories/CourseRepository';

export const AcademyScreen: React.FC = () => {
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await CourseRepository.getAllCourses();
        // Filter for published courses
        setCourses(data.filter(course => course.isPublished));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader
        title="Professional Courses"
        description="Advance your expertise with specialized professional courses tailored for the energy sector."
        iconName="school"
      />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1CA350]"></div>
          <p className="text-xs text-[#5f6368] dark:text-gray-400 font-medium">Loading academy courses...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-[#1CA350] font-bold hover:underline"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Course Grid Container */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                price={course.price}
                duration={course.duration}
                level={course.level}
                imageUrl={course.imageUrl}
                checkoutUrl={course.checkoutUrl}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 mt-6 bg-slate-50 rounded-3xl border border-gray-100 text-center animate-fade-in">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">school</span>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Courses Available Yet</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Our academy is currently being updated. Check back soon for specialized professional energy courses.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
