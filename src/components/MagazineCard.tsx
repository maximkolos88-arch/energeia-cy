import React from 'react';

interface MagazineCardProps {
  title: string;
  issueNumber: number;
  publishDate: string;
  coverImageUrl: string;
  pdfUrl?: string;
  description: string;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ title, issueNumber, publishDate, coverImageUrl, pdfUrl, description }) => {
  return (
    <a
      href={pdfUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="text-xs font-bold text-[#1CA350] mb-1 tracking-wider uppercase">
          ISSUE #{issueNumber}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">{description}</p>
        <div className="flex items-center text-sm text-slate-400 gap-2 font-medium">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          {publishDate}
        </div>
      </div>
    </a>
  );
};

export default MagazineCard;
