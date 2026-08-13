import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from './PageHeader';
import { CourseCard } from './CourseCard';
import { AcademyCourse } from '../models/types';
import { CourseRepository } from '../services/repositories/CourseRepository';

export const AcademyScreen: React.FC = () => {
  const { t } = useTranslation();
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
        title={t('academy.title')}
        description={t('academy.subtitle')}
        iconName="school"
      />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Loading academy courses...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-primary font-bold hover:underline"
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
            <div className="col-span-full flex flex-col items-center justify-center py-20 mt-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 text-center animate-fade-in">
              <span className="material-symbols-outlined text-5xl text-neutral-300 mb-4">school</span>
              <h3 className="text-xl font-bold text-slate-700 dark:text-neutral-300 mb-2">{t('academy.noCourses')}</h3>
              <p className="text-sm text-neutral-500 max-w-md">
                Our academy is currently being updated. Check back soon for specialized professional energy courses.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
