import React from 'react';
import { useTranslation } from 'react-i18next';
import { DirectoryMember } from '../models/types';
import { 
  MapPin, ArrowRight, CheckCircle2, Building2, User, Leaf, 
  Globe, Linkedin 
} from 'lucide-react';

interface MemberCardProps {
  member: DirectoryMember;
  onClick: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const { t } = useTranslation();

  const getMemberIcon = () => {
    if (member.type === 'Company') {
      if (member.roleOrCategory.toLowerCase().includes('esg')) {
        return <Leaf className="w-5 h-5 text-primary" />;
      }
      return <Building2 className="w-5 h-5 text-primary" />;
    }
    return <User className="w-5 h-5 text-primary" />;
  };

  const getLocalizedCategory = (catName: string): string => {
    if (!catName) return '';
    const name = catName.trim().toLowerCase();
    if (name === 'all news') return t('categories.allNews');
    if (name.includes('renew') || name.includes('solar')) return t('categories.renewables');
    if (name.includes('oil') || name.includes('gas')) return t('categories.oilGas');
    if (name.includes('govern') || name.includes('policy')) return t('categories.govPolicy');
    if (name.includes('grant') || name.includes('subsidy')) return t('categories.grantsSubsidies');
    if (name.includes('trading') || name.includes('electric')) return t('categories.electricityTrading');
    if (name.includes('maritime') || name.includes('offshore')) return t('categories.maritimeOffshore');
    if (name.includes('engineering') || name.includes('epc')) return t('categories.engineeringEpc');
    if (name.includes('professional') || name.includes('service')) return t('categories.professionalServices');
    if (name.includes('association')) return t('categories.govAssociations');
    return catName;
  };

  const getCategoryBadgeStyle = (cat?: string) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('renew') || c.includes('solar')) {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-350';
    }
    if (c.includes('oil') || c.includes('gas')) {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-350';
    }
    if (c.includes('trading') || c.includes('electric')) {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-350';
    }
    if (c.includes('maritime') || c.includes('offshore')) {
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-350';
    }
    if (c.includes('engineering') || c.includes('epc')) {
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-350';
    }
    if (c.includes('professional') || c.includes('service')) {
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-350';
    }
    if (c.includes('govern') || c.includes('policy') || c.includes('association')) {
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-350';
    }
    return 'bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-450';
  };

  const services = Array.isArray(member.keyServices)
    ? member.keyServices
    : typeof member.keyServices === 'string'
      ? (member.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
      : [];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1b1c1e] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-primary/80 cursor-pointer space-y-4 group animate-fade-in"
    >
      <div className="space-y-3">
        {/* Top section: Logo/Avatar next to Name */}
        <div className="flex items-center gap-3">
          {(member.logoUrl || member.imageUrl) ? (
            <img
              src={member.logoUrl || member.imageUrl}
              alt={member.name}
              className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-[#1b1c1e] shrink-0 border border-neutral-200 dark:border-neutral-800 p-1"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
              {getMemberIcon()}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors truncate tracking-tight">
                {member.name}
              </h3>
              {member.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate">
              {member.roleOrCategory}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        {member.category && (
          <div className="flex">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getCategoryBadgeStyle(member.category)}`}>
              {getLocalizedCategory(member.category)}
            </span>
          </div>
        )}

        {/* Expertise Tags (First 2-3 tags) */}
        {member.expertiseTags && member.expertiseTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.expertiseTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 text-[9px] font-bold border border-neutral-200 dark:border-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description: clamped to 3 lines */}
        {member.showDescription === true && member.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
            {member.description}
          </p>
        )}

      </div>

      {/* Footer/Meta */}
      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        {/* Contact Icons Row */}
        {(member.showWebsite === true || member.showLinkedin === true) && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-wider mr-1.5">Links:</span>
            {member.showWebsite === true && member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors"
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
                className="p-1 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {member.showLocation === true && member.location && (
              <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-xs min-w-0">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{member.location}</span>
              </div>
            )}
          </div>
          
          <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline whitespace-nowrap bg-transparent border-0 cursor-pointer p-0 shrink-0">
            {t('directory.viewProfile')} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
