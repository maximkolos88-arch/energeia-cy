import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNewsController } from '../controllers/useNewsController';
import { NewsItem, NewsCategory } from '../models/types';
import { 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ChevronRight,
  Globe,
  Zap,
  Megaphone,
  Pin,
  Bell,
  ChevronDown,
  ChevronUp,
  Info,
  Sun,
  Flame,
  Landmark,
  ShieldCheck,
  Gift,
  TrendingUp,
  Layers
} from 'lucide-react';

export const NewsFeedScreen: React.FC = () => {
  const {
    category,
    categories,
    newsItems,
    loading,
    error,
    empty,
    hasMore,
    selectCategory,
    loadMore,
    refresh
  } = useNewsController();

  const getProxyImageUrl = (url: string) => {
    return url || '';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const day = d.getDate();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      }
    } catch (e) {}

    const gmtMatch = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (gmtMatch) {
      const day = gmtMatch[1];
      const shortMonth = gmtMatch[2];
      const year = gmtMatch[3];
      const monthMap: Record<string, string> = {
        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
      };
      const fullMonth = monthMap[shortMonth] || shortMonth;
      return `${day} ${fullMonth} ${year}`;
    }

    return dateStr;
  };

  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Important Network Bulletins State
  const [isNetworkWindowCollapsed, setIsNetworkWindowCollapsed] = useState<boolean>(false);
  const [activeBulletinModal, setActiveBulletinModal] = useState<any | null>(null);
  const [networkBulletins] = useState([
    {
      id: 'nb-1',
      title: 'Mandatory Technical Directive 04/2026: Renewable Grid Synchronization & Telemetry',
      priority: 'URGENT DIRECTIVE',
      date: 'Today',
      badgeStyle: 'bg-[#fce8e6] text-[#c5221f]',
      summary: 'All certified energy engineers and solar contractors must update telemetry hardware protocols for PV installations exceeding 150 kW by Q3 2026 as mandated by CERA & EAC.',
      details: 'In accordance with CERA Regulatory Decision No. 18/2026, all grid-tied solar photovoltaic systems and commercial battery storage installations operating within Cyprus must incorporate standardized telemetry nodes. Registered directory partners can review compliance standards and download verification tools directly.'
    },
    {
      id: 'nb-2',
      title: 'Ministry of Energy (MECI) Opens €30M Solar Battery Storage Subsidy Scheme',
      priority: 'GOVERNMENT GRANT',
      date: 'Yesterday',
      badgeStyle: 'bg-[#e6f4ea] text-[#137333]',
      summary: 'Fast-track application portal launched for residential and commercial energy storage retrofits with subsidies up to €1,000 / kWh.',
      details: 'The Cyprus Ministry of Energy, Commerce and Industry (MECI) has officially inaugurated the 2026 Energy Independence Subsidy Pool. Registered ESG auditors and solar contractors in the Energeia Directory are authorized to process fast-track applicant certifications.'
    },
    {
      id: 'nb-3',
      title: 'Cyprus All-Energy Network 2026 Member Synchronization & Annual Assembly',
      priority: 'NETWORK BULLETIN',
      date: '2 days ago',
      badgeStyle: 'bg-[#e8f5e9] text-[#1CA350]',
      summary: 'Registration open for all verified engineers, suppliers, and energy market participants across Cyprus.',
      details: 'Join the annual summit in Nicosia featuring keynotes from CERA commissioners, EAC grid operators, and international clean energy delegates. Verified network members receive complimentary technical workshop passes.'
    }
  ]);


  const getBadgeStyle = (categoryOrBadge?: string) => {
    switch (categoryOrBadge?.toLowerCase()) {
      case 'urgent':
        return 'bg-[#fce8e6] text-[#c5221f] font-semibold';
      case 'cera':
        return 'bg-[#fef7e0] text-[#b06000] font-semibold';
      case 'grants':
        return 'bg-[#e6f4ea] text-[#137333] font-semibold';
      case 'eac':
        return 'bg-[#e8f5e9] text-[#1CA350] font-semibold';
      default:
        return 'bg-[#f1f3f4] text-[#5f6368] font-medium';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
      {/* Major Energy Pillar Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {categories.map((cat) => {
          const isActive = category === cat;
          const getPillarIcon = (catName: string) => {
            const name = catName.toLowerCase();
            if (name.includes('renew') || name.includes('solar')) return <Sun className="w-3.5 h-3.5" />;
            if (name.includes('oil') || name.includes('gas')) return <Flame className="w-3.5 h-3.5" />;
            if (name.includes('govern') || name.includes('policy')) return <Landmark className="w-3.5 h-3.5" />;
            if (name.includes('grid') || name.includes('infrastr')) return <Zap className="w-3.5 h-3.5" />;
            if (name.includes('cera') || name.includes('regula')) return <ShieldCheck className="w-3.5 h-3.5" />;
            if (name.includes('grant') || name.includes('subsidy')) return <Gift className="w-3.5 h-3.5" />;
            if (name.includes('market')) return <TrendingUp className="w-3.5 h-3.5" />;
            return <Layers className="w-3.5 h-3.5" />;
          };

          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1CA350] text-white shadow-xs'
                  : 'bg-white dark:bg-[#2d2e30] text-[#5f6368] dark:text-gray-300 border border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043]'
              }`}
            >
              {getPillarIcon(cat)}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[#fce8e6] text-[#c5221f] rounded-2xl flex items-center justify-between border border-[#f5c2c0]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
          <button onClick={refresh} className="p-1.5 hover:bg-black/10 rounded-full">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Layout: Stream */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* News Items Column */}
        <div className="space-y-4">
          {/* Loading Skeletal Cards */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl animate-pulse space-y-3">
                  <div className="flex gap-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                  <div className="w-full h-10 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && empty && (
            <div className="text-center py-12 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-8">
              <p className="text-lg font-medium text-[#202124] dark:text-white mb-2">No coverage available in this section</p>
              <p className="text-xs text-[#5f6368] dark:text-gray-400 mb-4">
                There are currently no published items for "{category}".
              </p>
              <button
                onClick={() => selectCategory('All News')}
                className="px-5 py-2 bg-[#1CA350] text-white rounded-full text-xs font-medium hover:bg-[#15823f] transition-colors"
              >
                Back to All Updates
              </button>
            </div>
          )}

          {/* News Cards Feed */}
          {!loading && !empty && (
            <div className="space-y-4">
              {newsItems.map((item) => {
                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 hover:border-[#1CA350]/35 transition-all duration-300 ease-in-out group cursor-pointer relative flex flex-col md:flex-row gap-5"
                  >
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-[#5f6368] dark:text-gray-400 font-normal">
                          {formatDate(item.publishedAt)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeStyle(item.category)}`}>
                            {item.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h2 className="text-base md:text-lg font-medium text-[#202124] dark:text-white leading-snug group-hover:text-[#1CA350] transition-colors mb-2">
                        {item.title}
                      </h2>

                      {/* Article Summary Snippet */}
                      <p className="text-xs md:text-sm text-[#5f6368] dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {item.summary || 'No summary generated yet'}
                      </p>
                    </div>

                    {(() => {
                      const imgUrl = item.imageUrl || item.image_url;
                      return imgUrl ? (
                        <div className="w-full md:w-32 h-24 md:h-auto rounded-xl overflow-hidden shrink-0 border border-[#dadce0]/50 dark:border-[#3c4043]/50">
                          <img
                            src={getProxyImageUrl(imgUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : null;
                    })()}
                  </article>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] text-[#1CA350] dark:text-[#8ab4f8] hover:bg-[#f8f9fa] text-xs font-bold rounded-full transition-colors shadow-2xs cursor-pointer"
              >
                Load More News
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Article Modal Reader (Google News Reader Style) */}
      {selectedArticle && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#202124] rounded-3xl border border-[#dadce0] dark:border-[#3c4043] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="sticky top-0 z-50 float-right p-2 text-[#5f6368] hover:bg-[#f1f3f4]/90 dark:hover:bg-[#3c4043]/90 bg-white/90 dark:bg-[#202124]/90 backdrop-blur-xs rounded-full border border-[#dadce0]/50 dark:border-[#3c4043]/50 shadow-xs"
              style={{ position: 'sticky', top: '0px', float: 'right', zIndex: 50 }}
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const imgUrl = selectedArticle.imageUrl || selectedArticle.image_url;
              return imgUrl ? (
                <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-[#dadce0]/50 dark:border-[#3c4043]/50">
                  <img
                    src={getProxyImageUrl(imgUrl)}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : null;
            })()}

            {/* Article Meta */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeStyle(selectedArticle.category)}`}>
                  {selectedArticle.category || 'Uncategorized'}
                </span>
                <span className="text-xs text-[#5f6368]">
                  {formatDate(selectedArticle.publishedAt)}
                </span>
              </div>

              <h2 className="text-2xl font-medium text-[#202124] dark:text-white leading-snug mb-3">
                {selectedArticle.title}
              </h2>
            </div>

            {/* Executive Summary Box */}
            <div className="p-4 bg-[#f8f9fa] dark:bg-[#2d2e30] border-l-4 border-[#1CA350] rounded-r-xl">
              <p className="text-sm text-[#202124] dark:text-gray-200 italic font-medium">
                "{selectedArticle.summary || 'No summary generated yet'}"
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#202124] dark:text-gray-200 leading-relaxed space-y-3 pt-2">
              <ReactMarkdown>
                {selectedArticle.content || selectedArticle.summary || 'No content or summary available.'}
              </ReactMarkdown>
            </div>

            {selectedArticle.sourceUrl && (
              <div className="pt-3 border-t border-[#dadce0] dark:border-[#3c4043] flex justify-end items-center">
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1CA350] text-white rounded-full font-medium text-xs inline-flex items-center gap-1.5 hover:bg-[#15823f]"
                >
                  View Official Filing <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        </div>
      )}
      {/* Network Bulletin Detail Modal */}
      {activeBulletinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#202124] rounded-3xl border border-[#dadce0] dark:border-[#3c4043] max-w-lg w-full p-6 relative shadow-2xl space-y-5">
            <button
              onClick={() => setActiveBulletinModal(null)}
              className="absolute top-4 right-4 p-2 text-[#5f6368] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${activeBulletinModal.badgeStyle}`}>
                {activeBulletinModal.priority}
              </span>
              <span className="text-xs text-[#5f6368]">
                {activeBulletinModal.date}
              </span>
            </div>

            <h2 className="text-xl font-medium text-[#202124] dark:text-white leading-snug">
              {activeBulletinModal.title}
            </h2>

            <div className="p-4 bg-[#f8f9fa] dark:bg-[#2d2e30] border-l-4 border-[#1CA350] rounded-r-xl">
              <p className="text-xs text-[#202124] dark:text-gray-200 leading-relaxed font-medium">
                "{activeBulletinModal.summary}"
              </p>
            </div>

            <p className="text-xs text-[#5f6368] dark:text-gray-300 leading-relaxed">
              {activeBulletinModal.details}
            </p>

            <div className="pt-4 border-t border-[#dadce0] dark:border-[#3c4043] flex justify-end">
              <button
                onClick={() => setActiveBulletinModal(null)}
                className="px-5 py-2 bg-[#1CA350] text-white rounded-full text-xs font-medium hover:bg-[#15823f]"
              >
                Acknowledge Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


