import React from 'react';
import { useTranslation } from 'react-i18next';
import { DirectoryMember } from '../models/types';
import { 
  MapPin, ArrowRight, CheckCircle2, Building2, User, Leaf, 
  Globe, Linkedin, ShieldCheck
} from 'lucide-react';
import { getLocalizedTag } from '../utils/tagLocalization';

interface MemberCardProps {
  member: DirectoryMember;
  onClick: () => void;
  onClaimProfile?: (member: DirectoryMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick, onClaimProfile }) => {
  const { t, i18n } = useTranslation();

  const getLocalizedDescription = (m: DirectoryMember): string => {
    const lang = i18n.language || 'en';
    if (lang === 'el' && m.description_el && m.description_el.trim() !== '') return m.description_el;
    if (lang === 'ru' && m.description_ru && m.description_ru.trim() !== '') return m.description_ru;
    if (lang === 'he' && m.description_he && m.description_he.trim() !== '') return m.description_he;
    return m.description || '';
  };

  const getMemberIcon = () => {
    if (member.type === 'Company') {
      if (member.roleOrCategory.toLowerCase().includes('esg')) {
        return <Leaf className="w-6 h-6 text-[var(--md-sys-color-primary,#1A73E8)]" />;
      }
      return <Building2 className="w-6 h-6 text-[var(--md-sys-color-primary,#1A73E8)]" />;
    }
    return <User className="w-6 h-6 text-[var(--md-sys-color-primary,#1A73E8)]" />;
  };

  const getLocalizedCategory = (catName: string): string => {
    if (!catName) return '';
    const name = catName.trim().toLowerCase();
    if (name === 'all news') return t('categories.allNews', 'All Sectors');
    if (name.includes('renew') || name.includes('solar')) return t('categories.renewables', 'Solar & Renewables');
    if (name.includes('oil') || name.includes('gas')) return t('categories.oilGas', 'Oil & Gas');
    if (name.includes('govern') || name.includes('policy')) return t('categories.govPolicy', 'Regulator & Policy');
    if (name.includes('grant') || name.includes('subsidy')) return t('categories.grantsSubsidies', 'Grants & Subsidies');
    if (name.includes('trading') || name.includes('electric')) return t('categories.electricityTrading', 'Grid & Electricity');
    if (name.includes('maritime') || name.includes('offshore')) return t('categories.maritimeOffshore', 'Maritime & Offshore');
    if (name.includes('engineering') || name.includes('epc')) return t('categories.engineeringEpc', 'EPC Contractor');
    return catName;
  };

  return (
    <div
      onClick={onClick}
      className="google-publication-card p-6 flex flex-col justify-between group cursor-pointer"
    >
      <div className="space-y-4">
        {/* Top Section: 56px x 56px Crisp Vector Logo Container */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#FFFFFF] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] p-2 flex items-center justify-center shrink-0 shadow-2xs">
            {(member.logoUrl || member.imageUrl) ? (
              <img
                src={member.logoUrl || member.imageUrl}
                alt={member.name}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              getMemberIcon()
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-[var(--md-sys-color-on-surface,#E3E3E3)] group-hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:group-hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors truncate tracking-tight">
                {member.name}
              </h3>
              {member.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] shrink-0" aria-label="Verified Organization" />
              )}
            </div>
            
            <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] truncate mt-0.5">
              {member.roleOrCategory}
            </p>
          </div>
        </div>

        {/* Category Pill Badge */}
        {member.category && (
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)]">
              {getLocalizedCategory(member.category)}
            </span>
          </div>
        )}

        {/* Expertise Tags */}
        {member.expertiseTags && member.expertiseTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {member.expertiseTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-[#131314] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] text-[10px] font-medium border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]"
              >
                {getLocalizedTag(tag, t)}
              </span>
            ))}
          </div>
        )}

        {/* Clamped Description */}
        {member.showDescription === true && getLocalizedDescription(member) && (
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] line-clamp-3 leading-relaxed">
            {getLocalizedDescription(member)}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {member.location ? (
            <div className="flex items-center gap-1.5 text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] truncate">
              <MapPin className="w-3.5 h-3.5 text-[var(--md-sys-color-primary,#1A73E8)] shrink-0" aria-hidden="true" />
              <span className="truncate">{member.location}</span>
            </div>
          ) : <span />}

          <span className="text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] text-xs font-medium flex items-center gap-1 group-hover:underline">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 directional-icon transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>

        {/* GDPR Article 14: Claim or Update Profile Notice */}
        <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)]">
          <span>GDPR Art. 14 Public Directory</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClaimProfile ? onClaimProfile(member) : onClick();
            }}
            className="hover:underline text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] bg-transparent border-0 p-0 cursor-pointer"
          >
            Claim / Update Profile ↗
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
