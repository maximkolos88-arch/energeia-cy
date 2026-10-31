import React from 'react';

export interface ArticleProps {
  article: {
    id: string;
    title: string;
    slug: string;
    date: string; // e.g. "2026-10-26"
    summary: string;
    imageUrl?: string;
    category: string;
    subCategory?: string;
    sourceName?: string;
    sourceUrl?: string;
  };
  onOpen?: (article: ArticleProps['article']) => void;
  className?: string;
  isHero?: boolean;
}

export const GoogleResearchArticle: React.FC<ArticleProps> = ({
  article,
  onOpen,
  className = '',
  isHero = false,
}) => {
  // Format date to: OCTOBER 26, 2026
  let formattedDate = '';
  try {
    const parsedDate = new Date(article.date);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase();
    } else {
      formattedDate = (article.date || '').toUpperCase();
    }
  } catch {
    formattedDate = (article.date || '').toUpperCase();
  }

  const handleArticleClick = (e: React.MouseEvent) => {
    if (onOpen && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onOpen(article);
    }
  };

  return (
    <article
      onClick={handleArticleClick}
      className={`group flex flex-col w-full py-6 bg-transparent border-b border-[#F1F3F4] dark:border-[#282A2C] last:border-none cursor-pointer ${className}`}
    >
      {/* 1. HERO IMAGE ON TOP */}
      {article.imageUrl && (
        <a 
          href={`/news/${article.slug}`} 
          onClick={handleArticleClick}
          className="relative block w-full aspect-[16/9] overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F1F3F4] dark:bg-[#1E1F20] mb-4"
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.015]"
            loading={isHero ? 'eager' : 'lazy'}
            fetchPriority={isHero ? 'high' : 'auto'}
            decoding="async"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </a>
      )}

      {/* 2. DATE: Small, uppercase, tracked, muted */}
      <time 
        dateTime={article.date}
        className="block text-[11px] sm:text-[12px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-2 font-mono"
      >
        {formattedDate}
      </time>

      {/* 3. HEADLINE: Google Sans, medium weight, title itself is the interactive link */}
      <h2 className={`${isHero ? 'text-[22px] sm:text-[28px]' : 'text-[20px] sm:text-[24px]'} font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug tracking-tight mb-2.5`}>
        <a 
          href={`/news/${article.slug}`}
          onClick={handleArticleClick}
          className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
        >
          {article.title}
        </a>
      </h2>

      {/* 4. SUMMARY TEXT */}
      <p className="text-[14px] sm:text-[15px] text-[#444746] dark:text-[#C4C7C5] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
        {article.summary}
      </p>

      {/* 5. METADATA & CATEGORIES: Clean text separated by middots (NO bubble pills) */}
      <div className="text-[12px] sm:text-[13px] text-[#5F6368] dark:text-[#9AA0A6] flex flex-wrap items-center gap-1.5">
        <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{article.category}</span>
        {article.subCategory && (
          <>
            <span>&middot;</span>
            <span>{article.subCategory}</span>
          </>
        )}
        {article.sourceName && article.sourceUrl && (
          <>
            <span>&middot;</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              Source: {article.sourceName} &#8599;
            </a>
          </>
        )}
      </div>
    </article>
  );
};

export default GoogleResearchArticle;
