import React from 'react';
import {
  Newspaper, FileText, Users, Inbox, ArrowUpRight, Plus, CheckCircle2, Bot
} from 'lucide-react';
import { NewsItem, Article, DirectoryMember, MagazineIssue, AcademyCourse } from '../../models/types';
import { LeadApplication } from '../AdminPanel';

interface AdminDashboardViewProps {
  newsList: NewsItem[];
  articlesList: Article[];
  directoryList: DirectoryMember[];
  magazineList: MagazineIssue[];
  coursesList: AcademyCourse[];
  applications: LeadApplication[];
  onNavigateModule: (module: any) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenNewNews: () => void;
  onOpenNewArticle: () => void;
  onOpenNewMember: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  newsList,
  articlesList,
  directoryList,
  magazineList,
  coursesList,
  applications,
  onNavigateModule,
  onOpenNewNews,
  onOpenNewArticle,
  onOpenNewMember
}) => {
  const draftNewsCount = newsList.filter(n => n.status && n.status.toString().trim().toLowerCase() === 'draft').length;
  const publishedNewsCount = newsList.length - draftNewsCount;
  const publishedArticlesCount = articlesList.filter(a => a.isPublished || a.published).length;
  const partnerMembersCount = directoryList.filter(m => m.tier === 'Partner' || m.tier === 'Sponsor').length;

  const stats = [
    {
      title: 'News Feed Items',
      value: newsList.length,
      subtext: draftNewsCount === 0 ? `${publishedNewsCount} active published articles` : `${publishedNewsCount} published, ${draftNewsCount} pending drafts`,
      icon: <Newspaper className="w-5 h-5 text-emerald-500" />,
      actionModule: 'news',
    },
    {
      title: 'In-Depth Articles',
      value: articlesList.length,
      subtext: `${publishedArticlesCount} published editorial articles`,
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      actionModule: 'articles',
    },
    {
      title: 'Directory Members',
      value: directoryList.length,
      subtext: `${partnerMembersCount} Key Partners & Sponsors`,
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      actionModule: 'directory',
    },
    {
      title: 'Lead Inquiries',
      value: applications.length,
      subtext: applications.length > 0 ? 'Action required on pending inquiries' : 'All inquiries processed',
      icon: <Inbox className="w-5 h-5 text-amber-500" />,
      actionModule: 'applications',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border border-zinc-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cyprus Energy Infrastructure Operating System
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Energeia Control Center
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Real-time directory oversight, market news distribution, regulatory articles, and inbound B2B lead applications for EAC, CERA, and TSOC ecosystem partners.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewNews}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add News
            </button>
            <button
              onClick={onOpenNewArticle}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Article
            </button>
            <button
              onClick={onOpenNewMember}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => onNavigateModule(stat.actionModule)}
            className="group relative p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 transition-colors">
                {stat.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            </div>

            <div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block">{stat.title}</span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                {stat.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Inbound Applications & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 cols): Inbound Lead Inquiries */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-emerald-500" />
                Recent Lead Applications
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Directory onboarding and partnership proposals submitted by companies.
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('applications')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All ({applications.length})
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No lead applications received yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                      {app.full_name} <span className="font-normal text-zinc-500">from {app.company || 'Private'}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      {app.email} • {app.role || 'Partner Request'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 col): Automated Scraper Status & Quick Modules */}
        <div className="space-y-6">

          {/* Scraper Status Box */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">News Aggregator</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Operational
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Automated scraper fetches Cyprus energy news from InBusinessNews, StockWatch, Philenews, and FinancialMirror.
            </p>

            <button
              onClick={() => onNavigateModule('scraper')}
              className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-500" />
              Launch Scraper Engine
            </button>
          </div>

          {/* Quick Ecosystem Metrics */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Content Summary</span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Magazine Digital Issues</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{magazineList.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Academy Courses</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{coursesList.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-400">Database Engine</span>
                <span className="font-mono text-emerald-500 font-semibold">Postgres 17</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
