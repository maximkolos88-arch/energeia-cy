import React, { useState, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Award, 
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { NewsItem } from '../../models/types';
import { getOptimizedImageUrl } from '../../utils/imageProxy';

export interface ArticleDetailViewProps {
  article: NewsItem;
  onBack: () => void;
  language?: string;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);

  const getLocalizedValue = (item: any, field: string, lang: string) => {
    if (!item) return '';
    if (lang !== 'en') {
      const localizedKey = `${field}_${lang}`;
      if (item[localizedKey] && item[localizedKey].trim() !== '') {
        return item[localizedKey];
      }
    }
    return item[field] || '';
  };

  const title = getLocalizedValue(article, 'title', language);
  const summary = getLocalizedValue(article, 'summary', language);
  const content = getLocalizedValue(article, 'content', language) || summary;

  // Format date: OCTOBER 26, 2026
  let formattedDate = '';
  try {
    const rawDate = article.publishedAt || article.createdAt || '';
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      formattedDate = parsed.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase();
    } else {
      formattedDate = rawDate.toUpperCase();
    }
  } catch {
    formattedDate = (article.publishedAt || '').toUpperCase();
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url,
        });
        return;
      } catch {}
    }
    
    // Fallback to clipboard
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine regulatory source authority
  const isRegulatory = 
    article.category?.toLowerCase().includes('regulatory') ||
    article.category?.toLowerCase().includes('policy') ||
    article.category?.toLowerCase().includes('oil & gas') ||
    title.toLowerCase().includes('cera') ||
    title.toLowerCase().includes('tsoc') ||
    title.toLowerCase().includes('decision') ||
    title.toLowerCase().includes('interconnector') ||
    Boolean(article.sourceUrl);

  const regulatoryBadgeText = 
    title.toLowerCase().includes('cera') || article.category?.toLowerCase().includes('regulatory')
      ? 'CERA Statutory Regulatory Decision & Market Notification'
      : title.toLowerCase().includes('tsoc')
      ? 'TSOC Grid Dispatch & Transmission Telemetry Briefing'
      : 'Republic of Cyprus Energy Ministry & Market Filing';

  return (
    <article className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors py-6 sm:py-10 animate-fade-in">
      
      {/* Top Floating Action & Breadcrumb Navigation Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between border-b border-[#F1F3F4] dark:border-[#282A2C] pb-4">
          
          {/* Back link */}
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>All Briefings</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print or Save as PDF"
              title="Print / Save PDF"
              className="p-2 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share Briefing"
              title="Share or Copy Link"
              className="p-2 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer relative"
            >
              {copied ? <Check className="w-4 h-4 text-[#137333]" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-[#1F1F1F] text-white px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Reading Canvas */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Metadata Strip */}
        <header className="space-y-4 mb-8">
          
          {/* Taxonomy & Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
            {article.isPartnerBriefing ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D46200] text-white flex items-center gap-1 shadow-2xs">
                <span>Partner Briefing</span>
                {article.sponsorName && (
                  <span>· {article.sponsorName}</span>
                )}
              </span>
            ) : article.category ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1A73E8]/20 dark:text-[#8AB4F8]">
                {article.category}
              </span>
            ) : null}
            <span>•</span>
            <time dateTime={article.publishedAt || article.createdAt} className="font-mono uppercase text-[11px] tracking-wider">
              {formattedDate}
            </time>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes || 3} min read</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-[#1F1F1F] dark:text-white leading-[1.25] [text-wrap:balance]">
            {title}
          </h1>

          {/* Analyst & Authority Credential */}
          <div className="flex items-center gap-3 pt-2 text-xs text-[#5F6368] dark:text-[#9AA0A6] border-t border-[#F1F3F4] dark:border-[#282A2C]">
            {article.isPartnerBriefing && article.sponsorLogoUrl ? (
              <div className="w-8 h-8 rounded-full bg-[#F1F3F4] dark:bg-[#282A2C] border border-[#DADCE0] dark:border-[#444746] p-1 flex items-center justify-center shrink-0">
                <img src={article.sponsorLogoUrl} alt={article.sponsorName || 'Sponsor'} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFA726] to-[#D46200] flex items-center justify-center text-white font-bold text-xs shrink-0">
                Ε
              </div>
            )}
            <div>
              <div className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                {article.isPartnerBriefing 
                  ? (article.sponsorName || 'Corporate Partner')
                  : 'Energeia Market Intelligence Desk'}
              </div>
              <div className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                {article.isPartnerBriefing 
                  ? 'Commercial Partner Dispatch · Verified Cyprus Energy Network'
                  : 'National Energy Intelligence Briefing · Cyprus'}
              </div>
            </div>
          </div>
        </header>

        {/* 16:9 Hero Image */}
        {(article.imageUrl || article.image_url) && (
          <figure className="mb-8 space-y-2">
            <div className="w-full aspect-[16/9] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#F1F3F4] dark:bg-[#1E1F20] shadow-xs">
              <img
                src={getOptimizedImageUrl(article.imageUrl || article.image_url, 1200, 675)}
                alt={title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <figcaption className="text-[11px] sm:text-xs text-[#5F6368] dark:text-[#9AA0A6] italic text-end">
              Archive Photo: Cyprus Transmission System Operator / CERA Regulatory Archive · Energeia Intelligence.
            </figcaption>
          </figure>
        )}

        {/* Executive Summary / Pull-Quote with Cyprus Copper Border */}
        {summary && (
          <div className="p-5 sm:p-6 rounded-r-2xl bg-[#FFF8EE]/80 dark:bg-[#201A15] border-s-4 border-[#D46200] my-8 shadow-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D46200] dark:text-[#FFA726] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Executive Regulatory Summary
            </div>
            <p className="text-sm sm:text-base text-[#1F1F1F] dark:text-[#E3E3E3] font-medium leading-relaxed italic">
              "{summary}"
            </p>
          </div>
        )}

        {/* Official Statutory / Regulatory Source Box */}
        {isRegulatory && (
          <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-[#1A73E8] dark:text-[#8AB4F8] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {regulatoryBadgeText}
              </span>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                EU Directive 2019/790 Article 15 Attribution • Verified Energy Document
              </p>
            </div>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>View Original Filing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Markdown Body Text */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-[#1F1F1F] dark:text-[#E3E3E3] text-sm sm:text-base leading-relaxed space-y-5 my-8">
          <Suspense fallback={<p className="text-sm text-neutral-500">{summary}</p>}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Suspense>
        </div>

        {/* Statutory Cluster Attribution Footer */}
        <footer className="mt-12 pt-8 border-t border-[#F1F3F4] dark:border-[#282A2C] space-y-6">
          
          {/* Institutional Signature Box */}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] relative overflow-hidden space-y-3">
            <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white">
                Energeia National Energy Intelligence
              </h4>
              <span className="text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                HE 438859
              </span>
            </div>
            <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
              Published and cataloged by the Energeia Market Intelligence Unit (M3J2 LTD) in accordance with the regulatory framework of the Cyprus Energy Regulatory Authority (CERA) and the Transmission System Operator of Cyprus (TSOC).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <a href="/research" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium">
                ← Return to Research Stream
              </a>
              <span className="text-[#DADCE0]">•</span>
              <a href="/members" className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium">
                Browse Cluster Partners
              </a>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#DADCE0] dark:border-[#444746] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-xs font-medium text-[#1F1F1F] dark:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all research briefings</span>
            </button>
          </div>

        </footer>

      </div>
    </article>
  );
};
