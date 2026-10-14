import React from 'react';
import { BookOpen, Plus, Edit, Trash2, Calendar, FileDown } from 'lucide-react';
import { AdminMagazineIssue } from './adminTypes';

interface AdminMagazineViewProps {
  magazineList: AdminMagazineIssue[];
  onSaveMagazine: (issue: Partial<AdminMagazineIssue>) => Promise<void>;
  onDeleteMagazine: (id: string) => Promise<void>;
  editingMagazine: Partial<AdminMagazineIssue> | null;
  setEditingMagazine: (issue: Partial<AdminMagazineIssue> | null) => void;
  isLoading: boolean;
}

export const AdminMagazineView: React.FC<AdminMagazineViewProps> = ({
  magazineList,
  onSaveMagazine,
  onDeleteMagazine,
  editingMagazine,
  setEditingMagazine,
  isLoading
}) => {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Energeia Digital Magazine Issues
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Publish quarterly print & digital editions, PDF downloads, and executive summaries.
          </p>
        </div>

        <button
          onClick={() => setEditingMagazine({
            title: 'Energeia Issue #12 - BESS & Grid Integration',
            issueNumber: magazineList.length + 1,
            issue_number: `Issue #${magazineList.length + 1}`,
            publishDate: new Date().toISOString().split('T')[0],
            publication_date: new Date().toISOString().split('T')[0],
            description: 'Comprehensive analysis of Cyprus battery energy storage system rules and CERA market implementation.',
            summary: 'Comprehensive analysis of Cyprus battery energy storage system rules and CERA market implementation.',
            coverImageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
            cover_image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
            pdfUrl: '/magazine/energeia_latest.pdf',
            pdf_url: '/magazine/energeia_latest.pdf',
            isPublished: true
          })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Edition Issue
        </button>
      </div>

      {/* Grid of Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazineList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-400 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No magazine issues currently registered.
          </div>
        ) : (
          magazineList.map(issue => (
            <div
              key={issue.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={issue.coverImageUrl || issue.cover_image_url}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/80 text-white backdrop-blur-md">
                    {issue.issueNumber ? `Issue #${issue.issueNumber}` : (issue.issue_number || 'Issue')}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {issue.description || issue.summary}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{issue.publishDate || issue.publication_date}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                {(issue.pdfUrl || issue.pdf_url) ? (
                  <a
                    href={issue.pdfUrl || issue.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5" /> PDF File
                  </a>
                ) : <span />}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMagazine(issue)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMagazine(issue.id)}
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

      {/* Edit Issue Modal */}
      {editingMagazine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingMagazine.id ? 'Edit Magazine Issue' : 'Add Magazine Issue'}
              </h3>
              <button
                onClick={() => setEditingMagazine(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
                <input
                  type="text"
                  value={editingMagazine.title || ''}
                  onChange={(e) => setEditingMagazine({ ...editingMagazine, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Issue Number</label>
                  <input
                    type="text"
                    value={editingMagazine.issue_number || editingMagazine.issueNumber || ''}
                    onChange={(e) => setEditingMagazine({
                      ...editingMagazine,
                      issue_number: e.target.value,
                      issueNumber: parseInt(e.target.value.replace(/\D/g, '')) || 1
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Publication Date</label>
                  <input
                    type="date"
                    value={editingMagazine.publication_date || editingMagazine.publishDate || ''}
                    onChange={(e) => setEditingMagazine({ ...editingMagazine, publication_date: e.target.value, publishDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Cover Image URL</label>
                <input
                  type="text"
                  value={editingMagazine.cover_image_url || editingMagazine.coverImageUrl || ''}
                  onChange={(e) => setEditingMagazine({ ...editingMagazine, cover_image_url: e.target.value, coverImageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Download PDF URL</label>
                <input
                  type="text"
                  value={editingMagazine.pdf_url || editingMagazine.pdfUrl || ''}
                  onChange={(e) => setEditingMagazine({ ...editingMagazine, pdf_url: e.target.value, pdfUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Summary / Description</label>
                <textarea
                  rows={3}
                  value={editingMagazine.description || editingMagazine.summary || ''}
                  onChange={(e) => setEditingMagazine({ ...editingMagazine, description: e.target.value, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setEditingMagazine(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingMagazine) {
                    await onSaveMagazine(editingMagazine);
                    setEditingMagazine(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Save Issue
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
