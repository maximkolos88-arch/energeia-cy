import React from 'react';
import { useTranslation } from 'react-i18next';
import { DirectoryMember } from '../models/types';
import { Building2, User, Leaf } from 'lucide-react';

interface MemberCardProps {
  member: DirectoryMember;
  onClick: () => void;
  onClaimProfile?: (member: DirectoryMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick, onClaimProfile }) => {
  const { i18n } = useTranslation();

  const getLocalizedDescription = (m: DirectoryMember): string => {
    const lang = i18n.language || 'en';
    if (lang === 'el' && m.description_el && m.description_el.trim() !== '') return m.description_el;
    if (lang === 'ru' && m.description_ru && m.description_ru.trim() !== '') return m.description_ru;
    if (lang === 'he' && m.description_he && m.description_he.trim() !== '') return m.description_he;
    return m.description || '';
  };

  const getMemberIcon = () => {
    if (member.type === 'Company') {
      if (member.roleOrCategory?.toLowerCase().includes('esg')) {
        return <Leaf className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />;
      }
      return <Building2 className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />;
    }
    return <User className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />;
  };

  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#333537] rounded-[20px] p-6 hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C] transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Unbordered 48px x 48px rounded logo container */}
        <div className="w-12 h-12 rounded-xl bg-[#F1F3F4] dark:bg-[#282A2C] flex items-center justify-center shrink-0 mb-4 overflow-hidden">
          {(member.logoUrl || member.imageUrl) ? (
            <img
              src={member.logoUrl || member.imageUrl}
              alt={member.name}
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="w-9 h-9 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            getMemberIcon()
          )}
        </div>

        {/* Company/Entity Name in 18px Medium (#1F1F1F) */}
        <h3 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors line-clamp-1 mb-1">
          {member.name}
        </h3>

        {/* Sector tag as plain text (no bubble badge) */}
        <p className="text-[13px] text-[#5F6368] dark:text-[#9AA0A6] font-normal mb-3">
          {member.roleOrCategory || member.category || 'Energy Organization'}
        </p>

        {/* Short corporate bio (2 lines maximum) */}
        {getLocalizedDescription(member) && (
          <p className="text-[14px] text-[#444746] dark:text-[#C4C7C5] leading-relaxed line-clamp-2">
            {getLocalizedDescription(member)}
          </p>
        )}
      </div>

      {/* Card Footer: Location and outward arrow link ↗ */}
      <div className="pt-4 mt-4 border-t border-[#F1F3F4] dark:border-[#333537] flex items-center justify-between text-[12px] text-[#5F6368] dark:text-[#9AA0A6]">
        <span>{member.location || 'Cyprus'}</span>
        <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-medium group-hover:underline inline-flex items-center gap-0.5">
          <span>Portal</span>
          <span aria-hidden="true">&#8599;</span>
        </span>
      </div>
    </article>
  );
};

export default MemberCard;
