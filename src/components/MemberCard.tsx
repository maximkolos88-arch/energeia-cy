import React from 'react';
import { DirectoryMember } from '../models/types';
import { 
  MapPin, ArrowRight, CheckCircle2, Building2, User, Leaf, 
  Globe, Linkedin, Mail, Phone, Briefcase, Award 
} from 'lucide-react';

interface MemberCardProps {
  member: DirectoryMember;
  onClick: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const getMemberIcon = () => {
    if (member.type === 'Company') {
      if (member.roleOrCategory.toLowerCase().includes('esg')) {
        return <Leaf className="w-5 h-5 text-[#1CA350]" />;
      }
      return <Building2 className="w-5 h-5 text-[#1CA350]" />;
    }
    return <User className="w-5 h-5 text-[#1CA350]" />;
  };

  const getCategoryBadgeStyle = (cat?: string) => {
    switch (cat) {
      case 'Oil & Gas':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Renewables':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Electricity & Trading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Maritime & Offshore':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'Engineering & EPC':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Professional Services':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'Government & Associations':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const services = Array.isArray(member.keyServices)
    ? member.keyServices
    : typeof member.keyServices === 'string'
      ? (member.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
      : [];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer space-y-4 group"
    >
      <div className="space-y-3">
        {/* Top section: Logo/Avatar next to Name */}
        <div className="flex items-center gap-3">
          {(member.logoUrl || member.imageUrl) ? (
            <img
              src={member.logoUrl || member.imageUrl}
              alt={member.name}
              className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-[#202124] shrink-0 border border-[#dadce0]/50 dark:border-[#3c4043]/50 p-1"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] dark:bg-[#1CA350]/15 text-[#1CA350] flex items-center justify-center shrink-0 border border-[#dadce0]/50 dark:border-[#3c4043]/50">
              {getMemberIcon()}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#202124] dark:text-white group-hover:text-[#1CA350] transition-colors truncate">
                {member.name}
              </h3>
              {member.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[#1CA350] shrink-0" />
              )}
            </div>
            
            <p className="text-xs font-semibold text-[#5f6368] dark:text-gray-300 truncate">
              {member.roleOrCategory}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        {member.category && (
          <div className="flex">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getCategoryBadgeStyle(member.category)}`}>
              {member.category}
            </span>
          </div>
        )}

        {/* Services Tags */}
        {member.showKeyServices === true && services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {services.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#f1f3f4] dark:bg-[#202124] text-[#5f6368] dark:text-gray-300 text-[9px] font-bold border border-[#dadce0]/60 dark:border-[#3c4043]/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description: clamped to 3 lines */}
        {member.showDescription === true && member.description && (
          <p className="text-xs text-[#5f6368] dark:text-gray-300 line-clamp-3 leading-relaxed">
            {member.description}
          </p>
        )}

      </div>

      {/* Footer/Meta */}
      <div className="pt-3 border-t border-[#f1f3f4] dark:border-[#3c4043] space-y-2">
        {/* Contact Icons Row */}
        {(member.showWebsite === true || member.showLinkedin === true) && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider mr-1.5">Links:</span>
            {member.showWebsite === true && member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-[#f1f3f4] dark:hover:bg-[#202124]/50 rounded-full text-[#5f6368] dark:text-gray-300 hover:text-[#1CA350] dark:hover:text-[#1CA350] transition-colors"
                title="Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {member.showLinkedin === true && member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-[#f1f3f4] dark:hover:bg-[#202124]/50 rounded-full text-[#5f6368] dark:text-gray-300 hover:text-[#1CA350] dark:hover:text-[#1CA350] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {member.showLocation === true && member.location ? (
            <div className="flex items-center gap-1 text-[#5f6368] dark:text-gray-400 text-xs min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#1CA350] shrink-0" />
              <span className="truncate">{member.location}, Cyprus</span>
            </div>
          ) : (
            <div></div>
          )}
          
          <button className="text-[#1CA350] font-bold text-xs flex items-center gap-1 hover:underline whitespace-nowrap bg-transparent border-0 cursor-pointer p-0 shrink-0">
            View Profile <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
