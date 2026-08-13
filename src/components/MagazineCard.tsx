import React from 'react';
import { useTranslation } from 'react-i18next';

interface MagazineCardProps {
  title: string;
  issueNumber: number;
  publishDate: string;
  coverImageUrl: string;
  pdfUrl?: string;
  description: string;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ title, issueNumber, publishDate, coverImageUrl, pdfUrl, description }) => {
  const { t } = useTranslation();

  return (
    <a
      href={pdfUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-[#1b1c1e] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-200 hover:border-primary/80 cursor-pointer"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="text-[10px] font-bold text-primary mb-1 tracking-wider uppercase">
          {t('magazine.issue')} #{issueNumber}
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-2 leading-snug">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 mb-4">{description}</p>
        <div className="flex items-center text-[11px] text-neutral-400 gap-2 font-medium">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          {publishDate}
        </div>
      </div>
    </a>
  );
};

export default MagazineCard;
