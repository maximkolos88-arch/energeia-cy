import React from 'react';
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
  return (
    <a
      href={checkoutUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#f1f3f4] dark:bg-[#202124] text-gray-400">
            <BookOpen className="w-12 h-12 mb-2 text-[#1CA350]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Level Badge */}
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-[#e8f5e9] dark:bg-[#1CA350]/15 text-[#1CA350] text-[10px] font-bold rounded-full uppercase tracking-wider">
              {level}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-[#202124] dark:text-white group-hover:text-[#1CA350] transition-colors leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-[#5f6368] dark:text-gray-300 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#f1f3f4] dark:border-[#3c4043] flex flex-col space-y-3">
          {/* Price & Duration Row */}
          <div className="flex items-center justify-between text-xs text-[#5f6368] dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1CA350]" />
              <span className="font-semibold">{duration}</span>
            </div>
            <span className="text-base font-extrabold text-[#202124] dark:text-white">
              {typeof price === 'number' ? `€${price}` : price}
            </span>
          </div>

          {/* Action Button */}
          <div className="w-full bg-[#1CA350] text-white py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#15823f] transition-colors shadow-2xs group-hover:bg-[#15823f]">
            Enroll Now
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </a>
  );
};
