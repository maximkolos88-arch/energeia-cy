import React, { useState } from 'react';
import {
  Newspaper, Plus, Search, Edit, Trash2, CheckSquare, Square, RefreshCw, Sparkles, Globe
} from 'lucide-react';
import { NewsItem } from '../../models/types';
import ReactMarkdown from 'react-markdown';

interface AdminNewsViewProps {
  newsList: NewsItem[];
  onSaveNews: (item: Partial<NewsItem>) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onBatchUpdateNewsStatus: (ids: string[], isDraft: boolean) => Promise<void>;
  onBatchDeleteNews: (ids: string[]) => Promise<void>;
  editingNews: Partial<NewsItem> | null;
  setEditingNews: (item: Partial<NewsItem> | null) => void;
  editorTab: 'write' | 'preview';
  setEditorTab: (tab: 'write' | 'preview') => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  isParsing: boolean;
  onFetchArticleFromUrl: () => Promise<void>;
  enrichingId: string | null;
  onEnrichDraft: (item: NewsItem) => void;
}

export const AdminNewsView: React.FC<AdminNewsViewProps> = ({
  newsList,
  onSaveNews,
  onDeleteNews,
  onBatchUpdateNewsStatus,
  onBatchDeleteNews,
  editingNews,
  setEditingNews,
  editorTab,
  setEditorTab,
  customUrl,
  setCustomUrl,
  isParsing,
  onFetchArticleFromUrl,
  enrichingId,
  onEnrichDraft
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Helper to check if item is draft
  const isDraftItem = (item: NewsItem | Partial<NewsItem>) => item.status === 'Draft' || item.status === 'DRAFT';

  // Filter News
  const filteredNews = newsList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          (item.summary && item.summary.toLowerCase().includes(search.toLowerCase()));
    const isDraft = isDraftItem(item);
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Published' && !isDraft) ||
                          (statusFilter === 'Draft' && isDraft);
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Batch Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredNews.length && filteredNews.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNews.map(n => n.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchPublish = async (isDraft: boolean) => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      await onBatchUpdateNewsStatus(selectedIds, isDraft);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} news items?`)) return;
    setIsProcessingBatch(true);
    try {
      await onBatchDeleteNews(selectedIds);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-500" />
            Energy News Feed & Aggregator Drafts
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Publish real-time Cyprus market news, EAC grid announcements, and regulatory updates.
          </p>
        </div>

        <button
          onClick={() => setEditingNews({
            title: '',
            summary: '',
            content: '',
            category: 'Government & Policy',
            status: 'Published',
            publishedAt: new Date().toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200'
          })}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* URL Ingestion Tool Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-2 text-emerald-400">
            <Globe className="w-4 h-4" /> Quick Scrape & Parse Article URL
          </span>
          <span className="text-[10px] text-zinc-400">Supports InBusinessNews, StockWatch, Philenews</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste news article URL to scrape title, metadata and full text..."
            className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={onFetchArticleFromUrl}
            disabled={isParsing || !customUrl.trim()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isParsing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Scrape & Open Editor
          </button>
        </div>
      </div>

      {/* Filters & Batch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">

        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news feed items..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Renewables">Renewables & PV</option>
            <option value="Oil & Gas">Oil & Gas / Offshore</option>
            <option value="Government & Policy">Government & Policy</option>
            <option value="Grants & Subsidies">Grants & Subsidies</option>
          </select>
        </div>

        {/* Batch Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 animate-fade-in shrink-0">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {selectedIds.length} selected
            </span>
            <div className="h-4 w-px bg-emerald-200 dark:bg-emerald-800 my-auto mx-1" />
            <button
              onClick={() => handleBatchPublish(false)}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBatchPublish(true)}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Mark Draft
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}

      </div>

      {/* News Items Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 uppercase text-[10px] font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredNews.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">
                    No news items found.
                  </td>
                </tr>
              ) : (
                filteredNews.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const isDraft = isDraftItem(item);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                        isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(item.id)}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 max-w-xs">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                          {item.summary}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4">
                        {!isDraft ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-zinc-400">
                        {new Date(item.publishedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isDraft && (
                            <button
                              onClick={() => onEnrichDraft(item)}
                              disabled={enrichingId === item.id}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                              title="Auto Enrich Category & Images"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingNews(item)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit News Item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteNews(item.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete News Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingNews.id ? 'Edit News Entry' : 'Create News Entry'}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 text-xs">
                  <button
                    onClick={() => setEditorTab('write')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      editorTab === 'write' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      editorTab === 'preview' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <button
                  onClick={() => setEditingNews(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {editorTab === 'write' ? (
              <div className="space-y-4 text-xs">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
                    <input
                      type="text"
                      value={editingNews.title || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                    <select
                      value={editingNews.category || 'Government & Policy'}
                      onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Renewables">Renewables & PV</option>
                      <option value="Oil & Gas">Oil & Gas / Offshore</option>
                      <option value="Government & Policy">Government & Policy</option>
                      <option value="Grants & Subsidies">Grants & Subsidies</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Original Link URL (Source)</label>
                  <input
                    type="text"
                    value={editingNews.sourceUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, sourceUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Image URL</label>
                  <input
                    type="text"
                    value={editingNews.imageUrl || editingNews.image_url || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value, image_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Summary / Teaser</label>
                  <textarea
                    rows={2}
                    value={editingNews.summary || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Full Content Markdown</label>
                  <textarea
                    rows={8}
                    value={editingNews.content || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="newsDraftCheck"
                    checked={!isDraftItem(editingNews)}
                    onChange={(e) => setEditingNews({ ...editingNews, status: e.target.checked ? 'Published' : 'Draft' })}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="newsDraftCheck" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                    Publish immediately to Live News Feed
                  </label>
                </div>

              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs">
                <h1>{editingNews.title || 'Untitled News'}</h1>
                <p className="text-zinc-500 font-semibold">{editingNews.summary}</p>
                <hr />
                <ReactMarkdown>{editingNews.content || '*No detailed content provided yet.*'}</ReactMarkdown>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setEditingNews(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingNews) {
                    await onSaveNews(editingNews);
                    setEditingNews(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer"
              >
                Save Entry
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
