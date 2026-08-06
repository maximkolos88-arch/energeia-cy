import React, { useEffect, useState } from 'react';
import { MagazineIssue } from '../models/types';
import { MagazineRepository } from '../services/repositories/MagazineRepository';
import { BookOpen, Calendar, ArrowUpRight, HelpCircle } from 'lucide-react';
import PageHeader from './PageHeader';
import MagazineCard from './MagazineCard';

export const MagazineScreen: React.FC = () => {
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await MagazineRepository.getMagazineIssues();
        // Filter for published magazines
        setIssues(data.filter(issue => issue.isPublished));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load digital archive.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader title="Digital Archive" description="Access past issues of our regional energy digest. We map the critical milestones shaping the Cyprus energy landscape — across renewable integration, policy changes, and market innovations." iconName="book_2" />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1CA350]"></div>
          <p className="text-xs text-[#5f6368] dark:text-gray-400 font-medium">Loading magazine issues...</p>
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

      {/* Visual CSS Grid */}
      {!loading && !error && (
        <>
          {issues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {issues.map(issue => (
                <MagazineCard
                  key={issue.id}
                  title={issue.title}
                  issueNumber={issue.issueNumber}
                  publishDate={issue.publishDate}
                  coverImageUrl={issue.coverImageUrl}
                  pdfUrl={issue.pdfUrl || ''}
                  description={issue.description}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 mt-6 bg-slate-50 rounded-3xl border border-gray-100 text-center animate-fade-in">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">menu_book</span>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Issues Published Yet</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Our digital archive is currently being updated. Check back soon for the latest regional energy digests.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
