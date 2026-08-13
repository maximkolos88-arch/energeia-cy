import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  price: string | number;
  duration: string;
  level: string;
  imageUrl: string;
  checkoutUrl: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  price,
  duration,
  level,
  imageUrl,
  checkoutUrl
}) => {
  const { t } = useTranslation();

  return (
    <a
      href={checkoutUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-[#1b1c1e] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/80 cursor-pointer flex flex-col h-full animate-fade-in"
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
            <BookOpen className="w-12 h-12 mb-2 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Level Badge */}
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
              {level}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col space-y-3">
          {/* Price & Duration Row */}
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">{duration}</span>
            </div>
            <span className="text-base font-extrabold text-neutral-900 dark:text-white">
              {typeof price === 'number' ? `€${price}` : price}
            </span>
          </div>

          {/* Action Button */}
          <div className="w-full bg-primary text-white py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-hover transition-colors shadow-2xs group-hover:bg-primary-hover">
            {t('academy.register')}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </a>
  );
};
