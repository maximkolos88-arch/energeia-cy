import React from 'react';
import { Bot, Play, RefreshCw, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Terminal, Layers } from 'lucide-react';

interface AdminScraperViewProps {
  runningScraper: boolean;
  onRunScraper: () => Promise<void>;
  scraperLog: string | string[] | null;
  scrapedDraftsCount: number;
  lastRunTimestamp: string | null;
}

export const AdminScraperView: React.FC<AdminScraperViewProps> = ({
  runningScraper,
  onRunScraper,
  scraperLog,
  scrapedDraftsCount,
  lastRunTimestamp
}) => {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-500" />
            Automated Cyprus Energy News Aggregator
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Scrapes RSS & HTML feeds from InBusinessNews, StockWatch Cyprus, Philenews, and FinancialMirror into admin draft state.
          </p>
        </div>

        <button
          onClick={onRunScraper}
          disabled={runningScraper}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {runningScraper ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scraping Live Feeds...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Aggregator Pipeline Now
            </>
          )}
        </button>
      </div>

      {/* Target Sources Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'InBusinessNews', domain: 'inbusinessnews.reporter.com.cy', category: 'Renewables & Business', status: 'Active' },
          { name: 'StockWatch CY', domain: 'stockwatch.com.cy', category: 'Macro Economy & CERA', status: 'Active' },
          { name: 'Philenews', domain: 'philenews.com', category: 'Government & Grants', status: 'Active' },
          { name: 'FinancialMirror', domain: 'financialmirror.com', category: 'Energy Investments', status: 'Active' },
        ].map((source, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{source.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block truncate">{source.domain}</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">
              {source.category}
            </span>
          </div>
        ))}
      </div>

      {/* Console Log Output */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-3 font-mono shadow-xl text-xs text-zinc-300">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="text-zinc-400 font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Aggregator Engine Console Output
          </span>
          {lastRunTimestamp && (
            <span className="text-[10px] text-zinc-500">
              Last Execution: {lastRunTimestamp}
            </span>
          )}
        </div>

        <div className="min-h-[200px] max-h-[350px] overflow-y-auto space-y-1.5 custom-scrollbar text-[11px] leading-relaxed p-2">
          {runningScraper ? (
            <div className="text-emerald-400 animate-pulse flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Initiating Puppeteer & Cheerio scraping workers across target Cyprus publishers...</span>
            </div>
          ) : scraperLog ? (
            Array.isArray(scraperLog) ? (
              scraperLog.map((line, i) => (
                <div key={i} className="text-zinc-300">
                  <span className="text-emerald-500 font-bold mr-2">&gt;</span>{line}
                </div>
              ))
            ) : (
              <div className="text-zinc-300">
                <span className="text-emerald-500 font-bold mr-2">&gt;</span>{scraperLog}
              </div>
            )
          ) : (
            <div className="text-zinc-500 italic">
              Aggregator engine ready. Click "Run Aggregator Pipeline Now" above to initiate feed scraping.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
