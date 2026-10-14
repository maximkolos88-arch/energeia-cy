import React, { useState } from 'react';
import {
  FileText, Plus, Search, Edit, Trash2, CheckSquare, Square
} from 'lucide-react';
import { ArticleCategory } from '../../models/types';
import { AdminArticle } from './adminTypes';
import ReactMarkdown from 'react-markdown';

interface AdminArticlesViewProps {
  articles: AdminArticle[];
  articleCategories: ArticleCategory[];
  onSaveArticle: (article: Partial<AdminArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onBatchUpdateArticleStatus: (ids: string[], isPublished: boolean) => Promise<void>;
  onBatchDeleteArticles: (ids: string[]) => Promise<void>;
  editingArticle: Partial<AdminArticle> | null;
  setEditingArticle: (a: Partial<AdminArticle> | null) => void;
  articleEditorTab: 'write' | 'preview';
  setArticleEditorTab: (tab: 'write' | 'preview') => void;
  isLoading: boolean;
}

export const AdminArticlesView: React.FC<AdminArticlesViewProps> = ({
  articles,
  articleCategories,
  onSaveArticle,
  onDeleteArticle,
  onBatchUpdateArticleStatus,
  onBatchDeleteArticles,
  editingArticle,
  setEditingArticle,
  articleEditorTab,
  setArticleEditorTab,
  isLoading
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Filter Articles
  const filteredArticles = articles.filter(item => {
    const categoryName = typeof item.category === 'object' ? item.category?.name : (item.category || '');
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          (item.summary && item.summary.toLowerCase().includes(search.toLowerCase())) ||
                          (item.excerpt && item.excerpt.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || categoryName === categoryFilter;
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Published' && (item.isPublished || item.published)) ||
                          (statusFilter === 'Draft' && !item.isPublished && !item.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Batch Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length && filteredArticles.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map(a => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchPublish = async (isPublished: boolean) => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      await onBatchUpdateArticleStatus(selectedIds, isPublished);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) return;
    setIsProcessingBatch(true);
    try {
      await onBatchDeleteArticles(selectedIds);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Editorial Articles & Analysis
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage long-form analytical articles, market regulatory perspectives, and thought leadership.
          </p>
        </div>

        <button
          onClick={() => setEditingArticle({
            title: '',
            slug: '',
            summary: '',
            excerpt: '',
            content: '',
            categoryId: articleCategories[0]?.id || '',
            isPublished: true,
            published: true,
            publishedAt: new Date().toISOString(),
            coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200'
          })}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Filters & Batch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">

        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title or summary..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {articleCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

        </div>

        {/* Batch Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 animate-fade-in shrink-0">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
              {selectedIds.length} selected
            </span>
            <div className="h-4 w-px bg-blue-200 dark:bg-blue-800 my-auto mx-1" />
            <button
              onClick={() => handleBatchPublish(true)}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBatchPublish(false)}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Draft
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}

      </div>

      {/* Articles Table */}
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
                    {selectedIds.length > 0 && selectedIds.length === filteredArticles.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(article => {
                  const isSelected = selectedIds.includes(article.id);
                  const categoryName = typeof article.category === 'object' ? article.category?.name : (article.category || 'General');
                  const isPub = article.isPublished || article.published;
                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(article.id)}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {(article.coverImage || article.image_url) && (
                            <img
                              src={article.coverImage || article.image_url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                              {article.title}
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              {article.excerpt || article.summary || article.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {categoryName}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
                          {article.author_name || 'Energeia Staff'}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">
                          {article.author_role || 'Analyst'}
                        </span>
                      </td>
                      <td className="p-4">
                        {isPub ? (
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
                        {new Date(article.publishedAt || article.createdAt || article.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingArticle(article)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteArticle(article.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete Article"
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

      {/* Editor Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingArticle.id ? 'Edit Article' : 'Create New Article'}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 text-xs">
                  <button
                    onClick={() => setArticleEditorTab('write')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      articleEditorTab === 'write' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    onClick={() => setArticleEditorTab('preview')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      articleEditorTab === 'preview' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <button
                  onClick={() => setEditingArticle(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {articleEditorTab === 'write' ? (
              <div className="space-y-4 text-xs">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Article Title</label>
                    <input
                      type="text"
                      value={editingArticle.title || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      placeholder="e.g., CERA Unveils Phase 2 Electricity Market Rules"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                    <select
                      value={editingArticle.categoryId || articleCategories[0]?.id || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      {articleCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Author Name</label>
                    <input
                      type="text"
                      value={editingArticle.author_name || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Author Role</label>
                    <input
                      type="text"
                      value={editingArticle.author_role || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author_role: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Read Time (min)</label>
                    <input
                      type="number"
                      value={editingArticle.read_time_minutes || 5}
                      onChange={(e) => setEditingArticle({ ...editingArticle, read_time_minutes: parseInt(e.target.value) || 5 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Header Cover Image URL</label>
                  <input
                    type="text"
                    value={editingArticle.coverImage || editingArticle.image_url || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value, image_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt || editingArticle.summary || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value, summary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Article Markdown Body</label>
                  <textarea
                    rows={10}
                    value={editingArticle.content || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="articlePublishedCheck"
                    checked={editingArticle.isPublished ?? editingArticle.published ?? true}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isPublished: e.target.checked, published: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="articlePublishedCheck" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                    Publish Article Immediately
                  </label>
                </div>

              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs">
                <h1>{editingArticle.title || 'Untitled Article'}</h1>
                <p className="text-zinc-500 font-semibold">{editingArticle.excerpt || editingArticle.summary}</p>
                <hr />
                <ReactMarkdown>{editingArticle.content || '*No content provided yet.*'}</ReactMarkdown>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingArticle) {
                    await onSaveArticle(editingArticle);
                    setEditingArticle(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Save Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
