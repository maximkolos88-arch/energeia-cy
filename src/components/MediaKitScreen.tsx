import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Eye,
  FileText,
  TrendingUp,
  BarChart3,
  Globe2,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { usePageTracking } from '../hooks/usePageTracking';

interface ChartDataItem {
  date: string;
  label: string;
  views: number;
}

interface AnalyticsStats {
  uniqueVisitors: number;
  totalVisits: number;
  totalNewsArticles: number;
  newsViews: number;
  chartData: ChartDataItem[];
}

export const MediaKitScreen: React.FC = () => {
  // Silent tracking call
  usePageTracking('GENERAL', 'admin-analytics-stats');

  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    // Disable client caching for fresh live numbers
    fetch('/api/stats/media-kit', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setStats({
            uniqueVisitors: data.uniqueVisitors || 0,
            totalVisits: data.totalVisits || data.totalMonthlyViews || 0,
            totalNewsArticles: data.totalNewsArticles || data.totalArticles || 0,
            newsViews: data.newsViews || data.totalArticleReads || 0,
            chartData: data.chartData || [],
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('[Analytics] Failed fetching stats from API:', err);
          setStats({
            uniqueVisitors: 0,
            totalVisits: 0,
            totalNewsArticles: 0,
            newsViews: 0,
            chartData: Array.from({ length: 30 }, (_, i) => {
              const date = new Date(Date.now() - (29 - i) * 86400000);
              return {
                date: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                views: 0,
              };
            }),
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#121315] text-slate-800 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 media-kit-printable">
      {/* Print Specific CSS Rules */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav, .no-print, button, .top-app-header, .admin-sidebar, .admin-topbar {
            display: none !important;
          }
          .media-kit-printable {
            padding: 0 !important;
            background: #ffffff !important;
          }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER BAR (TITLE + PDF EXPORT BUTTON) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1b1c1e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#27AE60]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Platform Traffic Stats
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live essential traffic metrics and 30-day visit timeline
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white font-bold text-xs shadow-sm transition-all cursor-pointer no-print shrink-0"
            title="Export cleanly to A4 PDF via browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Export to PDF</span>
          </button>
        </div>

        {/* 4-CARD ESSENTIAL METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Unique Visitors */}
          <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print-card">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Unique Visitors
                  </span>
                  <div className="p-2 bg-[#27AE60]/10 text-[#27AE60] rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.uniqueVisitors.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Last 30 days distinct users</p>
              </>
            )}
          </div>

          {/* Card 2: Total Visits */}
          <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print-card">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Visits
                  </span>
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.totalVisits.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Last 30 days total page loads</p>
              </>
            )}
          </div>

          {/* Card 3: Published News */}
          <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print-card">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Published News
                  </span>
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.totalNewsArticles.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Total published news articles</p>
              </>
            )}
          </div>

          {/* Card 4: News Views */}
          <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print-card">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    News Views
                  </span>
                  <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.newsViews.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Last 30 days article reads</p>
              </>
            )}
          </div>
        </section>

        {/* 30-DAY TRAFFIC CHART */}
        <section className="bg-white dark:bg-[#1b1c1e] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#27AE60]" /> 30-Day Total Visits Timeline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Daily aggregated page loads across the platform over the last 30 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 no-print">
              <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]" /> Accent Color: #27AE60
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-xs text-slate-400 font-medium">Loading Traffic Timeline...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27AE60" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#27AE60" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    minTickGap={20}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    }}
                    itemStyle={{ color: '#27AE60', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(value: any) => [`${value} Visits`, 'Daily Traffic']}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#27AE60"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MediaKitScreen;
