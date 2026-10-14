import React from 'react';
import { GraduationCap, Plus, Edit, Trash2, Clock, User } from 'lucide-react';
import { AdminAcademyCourse } from './adminTypes';

interface AdminAcademyViewProps {
  coursesList: AdminAcademyCourse[];
  onSaveCourse: (course: Partial<AdminAcademyCourse>) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  editingCourse: Partial<AdminAcademyCourse> | null;
  setEditingCourse: (course: Partial<AdminAcademyCourse> | null) => void;
  isLoading: boolean;
}

export const AdminAcademyView: React.FC<AdminAcademyViewProps> = ({
  coursesList,
  onSaveCourse,
  onDeleteCourse,
  editingCourse,
  setEditingCourse,
  isLoading
}) => {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-500" />
            Energeia Energy Academy Courses
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage professional training courses, executive certifications, and regulatory seminars.
          </p>
        </div>

        <button
          onClick={() => setEditingCourse({
            title: 'Cyprus Wholesale Electricity Market Regulations',
            category: 'Regulations & Compliance',
            description: 'In-depth breakdown of CERA trading rules, TSOC scheduling protocols, and imbalance settlement.',
            duration: '12 Hours',
            instructor: 'Dr. Andreas Constantinou',
            level: 'Advanced',
            price: 'Free / Partner',
            checkoutUrl: 'https://energeia.cy/academy',
            isPublished: true,
            imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
          })}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-400 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No courses available in the Academy catalog.
          </div>
        ) : (
          coursesList.map(course => (
            <div
              key={course.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-zinc-950 shadow-sm">
                    {course.level || 'Professional'}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {course.category || 'General Energy'}
                  </span>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3.5 h-3.5 text-zinc-400" /> {course.instructor || 'Academy Faculty'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {course.modulesCount || 6} Modules
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingCourse.id ? 'Edit Academy Course' : 'Create Academy Course'}
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                  <input
                    type="text"
                    value={editingCourse.category || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Level</label>
                  <select
                    value={editingCourse.level || 'Professional'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Instructor Name</label>
                  <input
                    type="text"
                    value={editingCourse.instructor || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Duration (e.g. 8 Hours)</label>
                  <input
                    type="text"
                    value={editingCourse.duration || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Image Cover URL</label>
                <input
                  type="text"
                  value={editingCourse.imageUrl || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingCourse) {
                    await onSaveCourse(editingCourse);
                    setEditingCourse(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer"
              >
                Save Course
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
