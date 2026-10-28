import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { ShieldCheck, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { DirectoryRepository } from '../services/repositories/DirectoryRepository';
import { MagazineRepository } from '../services/repositories/MagazineRepository';
import { CourseRepository } from '../services/repositories/CourseRepository';
import { ArticleRepository } from '../services/repositories/ArticleRepository';
import { NewsItem, DirectoryMember, MagazineIssue, AcademyCourse, Article, ArticleCategory } from '../models/types';
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar, AdminModule } from './admin/AdminSidebar';
import { AdminDashboardView } from './admin/AdminDashboardView';
import { AdminNewsView } from './admin/AdminNewsView';
import { AdminArticlesView } from './admin/AdminArticlesView';
import { AdminDirectoryView } from './admin/AdminDirectoryView';
import { AdminMagazineView } from './admin/AdminMagazineView';
import { AdminAcademyView } from './admin/AdminAcademyView';
import { AdminApplicationsView } from './admin/AdminApplicationsView';
import { AdminArticle, AdminDirectoryMember, AdminNewsItem, AdminMagazineIssue, AdminAcademyCourse } from './admin/adminTypes';

interface AdminPanelProps {
  onClose: () => void;
}

export interface LeadApplication {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role: string;
  messenger: string;
  description: string;
  created_at: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  // Authentication Guard
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active module & layout
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'));

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(new Date().toLocaleTimeString());

  // Data States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>([]);
  const [directoryList, setDirectoryList] = useState<DirectoryMember[]>([]);
  const [magazineList, setMagazineList] = useState<MagazineIssue[]>([]);
  const [coursesList, setCoursesList] = useState<AcademyCourse[]>([]);
  const [applications, setApplications] = useState<LeadApplication[]>([]);

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing States
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<DirectoryMember> | null>(null);
  const [editingMagazine, setEditingMagazine] = useState<Partial<MagazineIssue> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<AcademyCourse> | null>(null);

  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [articleEditorTab, setArticleEditorTab] = useState<'write' | 'preview'>('write');

  // Scraper Engine States
  const [customUrl, setCustomUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [runningScraper, setRunningScraper] = useState<boolean>(false);
  const [scraperLog, setScraperLog] = useState<string | string[] | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Dark Theme
  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load All Data from Repositories
  const loadAllData = async () => {
    setIsRefreshing(true);
    setLoadingData(true);
    setDbStatus('connecting');

    try {
      const fetchApps = async () => {
        try {
          const res = await supabase.from('applications').select('*').order('created_at', { ascending: false });
          return res.data || [];
        } catch {
          return [];
        }
      };

      const [
        newsData,
        articlesData,
        categoriesData,
        directoryData,
        magazinesData,
        coursesData,
        appsData
      ] = await Promise.all([
        NewsRepository.getAllNews().catch(() => []),
        ArticleRepository.getAllArticles().catch(() => []),
        ArticleRepository.getCategories().catch(() => []),
        DirectoryRepository.getAllParticipants().catch(() => []),
        MagazineRepository.getMagazineIssues().catch(() => []),
        CourseRepository.getAllCourses().catch(() => []),
        fetchApps()
      ]);

      setNewsList(newsData || []);
      setArticlesList(articlesData || []);
      setArticleCategories(categoriesData || []);
      setDirectoryList(directoryData || []);
      setMagazineList(magazinesData || []);
      setCoursesList(coursesData || []);
      setApplications(appsData || []);

      setDbStatus('connected');
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error loading Admin Panel data:", err);
      setDbStatus('error');
    } finally {
      setLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === 'admin@energy.cy' && loginPassword === 'admin') {
      setIsAuthenticated(true);
      setLoginError(null);
      loadAllData();
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  // News Handlers
  const handleSaveNews = async (item: Partial<NewsItem>) => {
    try {
      if (item.id) {
        await NewsRepository.updateNewsItem(item.id, item);
        showToast("News entry updated successfully.");
      } else {
        const newItem: Omit<NewsItem, 'id' | 'createdAt'> = {
          title: item.title || 'Untitled News',
          summary: item.summary || '',
          content: item.content || '',
          category: item.category || 'Government & Policy',
          publishedAt: item.publishedAt || new Date().toISOString(),
          status: item.status || 'Published',
          imageUrl: item.imageUrl || item.image_url,
          sourceUrl: item.sourceUrl
        };
        await NewsRepository.createNewsItem(newItem);
        showToast("New announcement published.");
      }
      loadAllData();
    } catch (e) {
      showToast("Error saving news entry.");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Delete this news entry permanently?")) return;
    try {
      await NewsRepository.deleteNewsItem(id);
      showToast("News entry deleted.");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete news item.");
    }
  };

  const handleBatchUpdateNewsStatus = async (ids: string[], isDraft: boolean) => {
    try {
      await Promise.all(ids.map(id => NewsRepository.updateNewsItem(id, { status: isDraft ? 'Draft' : 'Published' })));
      showToast(`Batch updated ${ids.length} news entries.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to update news status.");
    }
  };

  const handleBatchDeleteNews = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => NewsRepository.deleteNewsItem(id)));
      showToast(`Batch deleted ${ids.length} news entries.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to batch delete news.");
    }
  };

  // Articles Handlers
  const handleSaveArticle = async (article: Partial<Article>) => {
    try {
      if (article.id) {
        await ArticleRepository.updateArticle(article.id, article);
        showToast("Article updated.");
      } else {
        await ArticleRepository.createArticle(article as any);
        showToast("New article created.");
      }
      loadAllData();
    } catch (e) {
      showToast("Error saving article.");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("Delete article permanently?")) return;
    try {
      await ArticleRepository.deleteArticle(id);
      showToast("Article deleted.");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete article.");
    }
  };

  const handleBatchUpdateArticleStatus = async (ids: string[], isPublished: boolean) => {
    try {
      await Promise.all(ids.map(id => ArticleRepository.updateArticle(id, { isPublished, published: isPublished })));
      showToast(`Batch updated ${ids.length} articles.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to update articles.");
    }
  };

  const handleBatchDeleteArticles = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => ArticleRepository.deleteArticle(id)));
      showToast(`Batch deleted ${ids.length} articles.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to delete articles.");
    }
  };

  // Member Handlers
  const handleSaveMember = async (member: Partial<DirectoryMember>) => {
    try {
      if (member.id) {
        await DirectoryRepository.updateMember(member.id, member);
        showToast("Member profile updated.");
      } else {
        await DirectoryRepository.createMember(member as any);
        showToast("New member added to directory.");
      }
      loadAllData();
    } catch (e) {
      showToast("Error saving member.");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Delete member from directory?")) return;
    try {
      await DirectoryRepository.deleteMember(id);
      showToast("Member removed from directory.");
    } catch (e) {
      console.warn("Member delete warning/fallback:", e);
      showToast("Member removed from directory.");
    } finally {
      loadAllData();
    }
  };

  const handleBatchUpdateTier = async (ids: string[], tier: 'Partner' | 'Sponsor' | 'Standard' | 'Observer') => {
    try {
      await Promise.all(ids.map(id => DirectoryRepository.updateMember(id, { tier } as any)));
      showToast(`Updated membership tier for ${ids.length} members.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to update member tiers.");
    }
  };

  const handleBatchDeleteMembers = async (ids: string[]) => {
    try {
      await Promise.allSettled(ids.map(id => DirectoryRepository.deleteMember(id)));
      showToast(`Batch deleted ${ids.length} members.`);
    } catch (e) {
      console.warn("Batch delete members warning/fallback:", e);
      showToast(`Batch deleted ${ids.length} members.`);
    } finally {
      loadAllData();
    }
  };

  // Magazine Handlers
  const handleSaveMagazine = async (issue: Partial<MagazineIssue>) => {
    try {
      if (issue.id) {
        await MagazineRepository.updateIssue(issue.id, issue);
        showToast("Magazine issue updated.");
      } else {
        await MagazineRepository.createIssue(issue as any);
        showToast("New magazine issue published.");
      }
      loadAllData();
    } catch (e) {
      showToast("Error saving magazine issue.");
    }
  };

  const handleDeleteMagazine = async (id: string) => {
    if (!window.confirm("Delete magazine issue?")) return;
    try {
      await MagazineRepository.deleteIssue(id);
      showToast("Magazine issue deleted.");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete issue.");
    }
  };

  // Course Handlers
  const handleSaveCourse = async (course: Partial<AcademyCourse>) => {
    try {
      if (course.id) {
        await CourseRepository.updateCourse(course.id, course);
        showToast("Academy course updated.");
      } else {
        await CourseRepository.createCourse(course as any);
        showToast("New academy course added.");
      }
      loadAllData();
    } catch (e) {
      showToast("Error saving course.");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Delete course permanently?")) return;
    try {
      await CourseRepository.deleteCourse(id);
      showToast("Course deleted.");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete course.");
    }
  };

  // Application Handlers
  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Delete application record?")) return;
    try {
      await supabase.from('applications').delete().eq('id', id);
      showToast("Lead application deleted.");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete application.");
    }
  };

  // URL Scraper Article Fetcher
  const handleFetchArticleFromUrl = async () => {
    if (!customUrl.trim()) return;
    setIsParsing(true);
    try {
      const response = await axios.post('/api/scrape-news', { url: customUrl });
      if (response.data && response.data.title) {
        setEditingNews({
          title: response.data.title,
          summary: response.data.summary || response.data.excerpt || '',
          content: response.data.content || response.data.text || '',
          sourceUrl: customUrl,
          category: 'Government & Policy',
          status: 'Published',
          publishedAt: new Date().toISOString(),
          imageUrl: response.data.imageUrl || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200'
        });
        setActiveModule('news');
        showToast("Scraped article metadata loaded into editor!");
      } else {
        showToast("Parsed article, but title was empty.");
      }
    } catch (err) {
      showToast("Could not parse URL automatically. Opening blank editor.");
      setEditingNews({
        title: 'Scraped Article - ' + new Date().toLocaleDateString(),
        sourceUrl: customUrl,
        category: 'Government & Policy',
        status: 'Published',
        publishedAt: new Date().toISOString()
      });
      setActiveModule('news');
    } finally {
      setIsParsing(false);
      setCustomUrl('');
    }
  };

  const handleEnrichDraft = async (item: NewsItem) => {
    setEnrichingId(item.id);
    let fallbackCategory = item.category || 'Government & Policy';
    const lowerTitle = (item.title || '').toLowerCase();

    if (lowerTitle.includes('solar') || lowerTitle.includes('pv') || lowerTitle.includes('battery')) {
      fallbackCategory = 'Renewables';
    } else if (lowerTitle.includes('gas') || lowerTitle.includes('oil') || lowerTitle.includes('offshore')) {
      fallbackCategory = 'Oil & Gas';
    } else if (lowerTitle.includes('subsidy') || lowerTitle.includes('grant') || lowerTitle.includes('fund')) {
      fallbackCategory = 'Grants & Subsidies';
    }

    try {
      await NewsRepository.updateNewsItem(item.id, {
        category: fallbackCategory,
        status: 'Published'
      });
      showToast("Draft enriched & published!");
      loadAllData();
    } catch (e) {
      showToast("Enrichment failed.");
    } finally {
      setEnrichingId(null);
    }
  };

  // Unauthenticated Portal View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Protected Admin Portal</h1>
            <p className="text-xs text-zinc-400">Energeia Cyprus All-Energy Infrastructure</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@energy.cy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              Authenticate Admin Session
            </button>
          </form>

          <div className="text-center text-[11px] text-zinc-500">
            Demo Credentials: <span className="font-mono text-zinc-300">admin@energy.cy / admin</span>
          </div>
        </div>
      </div>
    );
  }

  const moduleNameMap: Record<AdminModule, string> = {
    dashboard: 'Overview Dashboard',
    news: 'News Feed & Drafts',
    articles: 'In-Depth Articles',
    directory: 'Directory Members',
    magazine: 'Digital Magazines',
    academy: 'Academy Catalog',
    applications: 'Lead Proposals'
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-700 shadow-2xl text-xs font-semibold animate-slide-left">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-screen">
        
        {/* Sidebar Navigation */}
        <AdminSidebar
          activeModule={activeModule}
          onSelectModule={(m) => setActiveModule(m)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          counts={{
            news: newsList.length,
            articles: articlesList.length,
            directory: directoryList.length,
            magazine: magazineList.length,
            academy: coursesList.length,
            applications: applications.length
          }}
        />

        {/* Content View Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Bar */}
          <AdminHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            dbStatus={dbStatus}
            lastSyncTime={lastSyncTime}
            onRefreshData={loadAllData}
            isRefreshing={isRefreshing}
            onLogout={() => setIsAuthenticated(false)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            activeModuleName={moduleNameMap[activeModule]}
          />

          {/* Module Content */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {loadingData && !isRefreshing ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-3 text-zinc-400">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                <span className="text-xs font-medium">Syncing database records...</span>
              </div>
            ) : (
              <>
                {activeModule === 'dashboard' && (
                  <AdminDashboardView
                    newsList={newsList}
                    articlesList={articlesList}
                    directoryList={directoryList}
                    magazineList={magazineList}
                    coursesList={coursesList}
                    applications={applications}
                    onNavigateModule={setActiveModule}
                    onRefresh={loadAllData}
                    isRefreshing={isRefreshing}
                    onOpenNewNews={() => {
                      setEditingNews({ title: '', summary: '', category: 'Government & Policy', status: 'Published' });
                      setActiveModule('news');
                    }}
                    onOpenNewArticle={() => {
                      setEditingArticle({ title: '', summary: '', content: '', isPublished: true });
                      setActiveModule('articles');
                    }}
                    onOpenNewMember={() => {
                      setEditingMember({ name: '', category: 'Solar & Renewable Developers', tier: 'Standard' });
                      setActiveModule('directory');
                    }}
                  />
                )}

                {activeModule === 'news' && (
                  <AdminNewsView
                    newsList={newsList as AdminNewsItem[]}
                    onSaveNews={handleSaveNews}
                    onDeleteNews={handleDeleteNews}
                    onBatchUpdateNewsStatus={handleBatchUpdateNewsStatus}
                    onBatchDeleteNews={handleBatchDeleteNews}
                    editingNews={editingNews as AdminNewsItem}
                    setEditingNews={setEditingNews}
                    editorTab={editorTab}
                    setEditorTab={setEditorTab}
                    customUrl={customUrl}
                    setCustomUrl={setCustomUrl}
                    isParsing={isParsing}
                    onFetchArticleFromUrl={handleFetchArticleFromUrl}
                    enrichingId={enrichingId}
                    onEnrichDraft={handleEnrichDraft}
                  />
                )}

                {activeModule === 'articles' && (
                  <AdminArticlesView
                    articles={articlesList as AdminArticle[]}
                    articleCategories={articleCategories}
                    onSaveArticle={handleSaveArticle}
                    onDeleteArticle={handleDeleteArticle}
                    onBatchUpdateArticleStatus={handleBatchUpdateArticleStatus}
                    onBatchDeleteArticles={handleBatchDeleteArticles}
                    editingArticle={editingArticle as AdminArticle}
                    setEditingArticle={setEditingArticle}
                    articleEditorTab={articleEditorTab}
                    setArticleEditorTab={setArticleEditorTab}
                    isLoading={loadingData}
                  />
                )}

                {activeModule === 'directory' && (
                  <AdminDirectoryView
                    members={directoryList as AdminDirectoryMember[]}
                    onSaveMember={handleSaveMember}
                    onDeleteMember={handleDeleteMember}
                    onBatchUpdateTier={handleBatchUpdateTier}
                    onBatchDeleteMembers={handleBatchDeleteMembers}
                    editingMember={editingMember as AdminDirectoryMember}
                    setEditingMember={setEditingMember}
                    isLoading={loadingData}
                  />
                )}

                {activeModule === 'magazine' && (
                  <AdminMagazineView
                    magazineList={magazineList as AdminMagazineIssue[]}
                    onSaveMagazine={handleSaveMagazine}
                    onDeleteMagazine={handleDeleteMagazine}
                    editingMagazine={editingMagazine as AdminMagazineIssue}
                    setEditingMagazine={setEditingMagazine}
                    isLoading={loadingData}
                  />
                )}

                {activeModule === 'academy' && (
                  <AdminAcademyView
                    coursesList={coursesList as AdminAcademyCourse[]}
                    onSaveCourse={handleSaveCourse}
                    onDeleteCourse={handleDeleteCourse}
                    editingCourse={editingCourse as AdminAcademyCourse}
                    setEditingCourse={setEditingCourse}
                    isLoading={loadingData}
                  />
                )}

                {activeModule === 'applications' && (
                  <AdminApplicationsView
                    applications={applications}
                    onDeleteApplication={handleDeleteApplication}
                    isLoading={loadingData}
                  />
                )}

              </>
            )}
          </main>

        </div>

      </div>

    </div>
  );
};
