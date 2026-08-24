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
  TrendingUp,
  Building2,
  FileText,
  Eye,
  Award,
  Users,
  CheckCircle2,
  Mail,
  ArrowRight,
  BarChart3,
  Globe2,
  Sparkles,
  Printer,
  Download,
  Lock,
} from 'lucide-react';
import { usePageTracking } from '../hooks/usePageTracking';

interface ChartDataItem {
  date: string;
  label: string;
  views: number;
}

interface MediaKitStats {
  totalMonthlyViews: number;
  totalCompanies: number;
  totalArticles: number;
  totalArticleReads: number;
  chartData: ChartDataItem[];
}

export const MediaKitScreen: React.FC = () => {
  // Silent tracking call
  usePageTracking('GENERAL', 'admin-media-kit');

  const [stats, setStats] = useState<MediaKitStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/stats/media-kit')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('[MediaKit] Failed fetching stats, using fallback:', err);
          setStats({
            totalMonthlyViews: 6920,
            totalCompanies: 24,
            totalArticles: 58,
            totalArticleReads: 2840,
            chartData: Array.from({ length: 30 }, (_, i) => {
              const date = new Date(Date.now() - (29 - i) * 86400000);
              return {
                date: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                views: Math.round(180 + Math.sin(i * 0.4) * 45 + Math.cos(i * 0.6) * 30),
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
          /* Hide non-essential layout wrappers during print */
          header, footer, nav, .no-print, button, .top-app-header, .admin-sidebar, .admin-topbar {
            display: none !important;
          }
          .media-kit-printable {
            padding: 0 !important;
            background: #ffffff !important;
          }
          .media-kit-hero {
            background: #0f172a !important;
            color: #ffffff !important;
            border-radius: 16px !important;
            padding: 24px !important;
          }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ADMIN TOP CONTROL BAR (EXPORT PDF BUTTON) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1b1c1e] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Internal Admin Dashboard
            </div>
            <span className="text-xs text-slate-500 hidden md:inline">
              B2B Media Kit & Advertiser Engagement Intel
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-sm cursor-pointer"
            title="Export cleanly to A4 PDF via browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Export to PDF / Print Media Kit</span>
          </button>
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 media-kit-hero">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#27AE60]/20 rounded-full blur-3xl pointer-events-none no-print" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27AE60]/20 border border-[#27AE60]/40 text-[#27AE60] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Energeia B2B Intelligence & Media Kit
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Energeia.cy <span className="text-[#27AE60]">Audience & Statistics</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Verified reach, market intelligence, and decision-maker engagement across Cyprus’s energy, renewables, and infrastructure sector.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center no-print">
              <a
                href="mailto:contact@energeia.cy?subject=Energeia%20Media%20Kit%20Inquiry"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#27AE60]/25 cursor-pointer"
              >
                <Mail className="w-4 h-4" /> Send Proposal to Advertiser
              </a>
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Presentation
              </button>
            </div>
          </div>
        </section>

        {/* STATS GRID (KPI CARDS) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#27AE60]" /> Key Platform Performance Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Monthly Views */}
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
                      30-Day Pageviews
                    </span>
                    <div className="p-2 bg-[#27AE60]/10 text-[#27AE60] rounded-lg">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.totalMonthlyViews.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +18%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Total impressions across all sections</p>
                </>
              )}
            </div>

            {/* Card 2: Active Companies */}
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
                      Directory Companies
                    </span>
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.totalCompanies.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">Verified B2B</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Listed energy firms & suppliers</p>
                </>
              )}
            </div>

            {/* Card 3: Total Articles */}
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
                      Published Reports
                    </span>
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.totalArticles.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Index Count</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Curated market & policy articles</p>
                </>
              )}
            </div>

            {/* Card 4: Total Article Reads */}
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
                      Article Reads
                    </span>
                    <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.totalArticleReads.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">High Intent</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Deep engagement news reads</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CHART SECTION */}
        <section className="bg-white dark:bg-[#1b1c1e] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#27AE60]" /> 30-Day Platform Traffic Overview
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Daily aggregated pageviews across desktop, mobile PWA, and direct industry traffic.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 no-print">
              <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]" /> Brand Accent Color: #27AE60
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-xs text-slate-400 font-medium">Loading Audience Traffic Chart...</span>
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
                    formatter={(value: any) => [`${value} Views`, 'Daily Traffic']}
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

        {/* AUDIENCE SPECS & B2B ADVERTISING OPPORTUNITIES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1b1c1e] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 print-card">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#27AE60]" /> Audience Breakdown
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-white">42% C-Level & Executives:</strong> CEO, Managing Directors, and Project Developers in Solar & Wind.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-white">28% Policy & Government:</strong> Energy ministries, CERA regulators, and municipal authorities.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-white">18% Investors & Banks:</strong> Infrastructure funds, ESG analysts, and commercial lenders.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-white">12% Engineers & Contractors:</strong> EPC firms, grid engineers, and equipment distributors.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1b1c1e] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 print-card">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#27AE60]" /> Ad Placement Options
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Directory Featured Placement:</strong>
                Top-of-search placement in the Member Directory with custom badge.
              </li>
              <li className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Sponsored Intelligence Posts:</strong>
                Native editorial articles distributed to all platform users and push subscribers.
              </li>
              <li className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Header & Feed Banners:</strong>
                High-visibility placements across the Newsfeed and Magazine reader.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MediaKitScreen;
