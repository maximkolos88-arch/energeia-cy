'use client';

import React from 'react';
import ClientPortal from './ui/ClientPortal';
import { useTranslation } from 'react-i18next';
import { useDirectoryController } from '../controllers/useDirectoryController';
import { DirectoryMember } from '../models/types';
import { Search, Mail, ArrowRight, Building2, User, Leaf, X, Phone, MapPin, CheckCircle2, Globe, Award, Copy, Check } from 'lucide-react';
import { MemberCard } from './MemberCard';
import PageHeader from './PageHeader';
import { getLocalizedTag } from '../utils/tagLocalization';
export const DirectoryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();

  const getLocalizedDescription = (m: DirectoryMember): string => {
    const lang = i18n.language || 'en';
    if (lang === 'el' && m.description_el && m.description_el.trim() !== '') return m.description_el;
    if (lang === 'ru' && m.description_ru && m.description_ru.trim() !== '') return m.description_ru;
    if (lang === 'he' && m.description_he && m.description_he.trim() !== '') return m.description_he;
    return m.description || '';
  };
  const {
    searchQuery,
    setSearchQuery,
    members,
    loading,
    selectedMember,
    openMemberContact,
    closeMemberContact
  } = useDirectoryController();

  const [copiedEmail, setCopiedEmail] = React.useState<boolean>(false);

  // Background scroll lock effect
  React.useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getMemberIcon = (member: DirectoryMember) => {
    if (member.type === 'Company') {
      if (member.roleOrCategory.toLowerCase().includes('esg')) {
        return <Leaf className="w-6 h-6 text-primary" />;
      }
      return <Building2 className="w-6 h-6 text-primary" />;
    }
    return <User className="w-6 h-6 text-primary" />;
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

  const getHasContactInfo = (m: DirectoryMember) => {
    return (
      (m.showKeyContact === true && m.keyContactName) ||
      (m.showEmail === true && m.email) ||
      (m.showPhone === true && m.phone) ||
      (m.showLocation === true && m.location) ||
      (m.showWebsite === true && m.website) ||
      (m.showLinkedin === true && m.linkedin)
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader 
        title={t('directory.title')} 
        description={t('directory.description')} 
        iconName="group" 
      />

      {/* Clean Full-Width Search Bar */}
      <div className="relative w-full mb-6 mt-4">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('directory.searchPlaceholder')}
          className="w-full bg-[#f5f5f5] dark:bg-[#1b1c1e] border border-neutral-200 dark:border-neutral-800 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 focus:outline-none rounded-xl py-3 pl-12 pr-12 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-500 transition-all shadow-3xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Directory Grid View */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-white dark:bg-[#1b1c1e] animate-pulse h-28"></div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-white dark:bg-[#1b1c1e] p-8">
          <p className="text-base font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">{t('directory.noResults')}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            {t('directory.broadenSearch')}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {t('directory.resetSearch')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => {
                openMemberContact(member);
                (window as any).trackCustomEvent?.('member_view', member.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <ClientPortal>
          {(() => {
          // Collect and merge tags (expertiseTags + keyServices)
          const services = (selectedMember.showKeyServices === true && selectedMember.keyServices)
            ? (Array.isArray(selectedMember.keyServices)
              ? selectedMember.keyServices
              : typeof selectedMember.keyServices === 'string'
                ? (selectedMember.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
                : [])
            : [];
          const expertiseTags = selectedMember.expertiseTags || [];
          const allTags = [...new Set([...expertiseTags, ...services])];
          const hasContactInfo = getHasContactInfo(selectedMember);

          return (
            <div 
              className="profile-modal-backdrop fixed inset-0 z-[99999] bg-[#0f172a]/65 backdrop-blur-[8px] flex items-center justify-center p-4 md:p-6 box-border animate-fade-in"
              style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
            >
              <div 
                className="bg-white dark:bg-[#1b1c1e] w-full max-w-[840px] max-h-[min(88vh,760px)] relative animate-scale-up overflow-hidden flex flex-col profile-modal-card shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border border-neutral-200 dark:border-neutral-800"
                style={{ position: 'relative', width: '100%', maxWidth: '840px', maxHeight: 'min(88vh, 760px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '20px' }}
              >
                
                {/* FIXED HEADER */}
                <div className="flex items-center justify-between gap-4 p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0 pr-14 relative bg-white dark:bg-[#1b1c1e]">
                  <div className="flex items-center gap-4">
                    {(selectedMember.logoUrl || selectedMember.imageUrl) ? (
                      <img
                        src={selectedMember.logoUrl || selectedMember.imageUrl}
                        alt={selectedMember.name}
                        className="w-14 h-14 rounded-xl object-contain bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shrink-0">
                        {getMemberIcon(selectedMember)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 tracking-tight leading-tight">
                        {selectedMember.name}
                        {selectedMember.isVerified && <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />}
                      </h2>
                      <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {selectedMember.roleOrCategory}
                      </p>
                      {selectedMember.category && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-md uppercase">
                            {getLocalizedCategory(selectedMember.category)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Close button (✕) */}
                  <button
                    onClick={closeMemberContact}
                    className="absolute top-4 right-4 p-2 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="overflow-y-auto p-6 modal-body flex-1 bg-white dark:bg-[#1b1c1e]">
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Column: About & Expertise */}
                    <div className="flex-1 space-y-6 min-w-0">
                      
                      {/* About Section */}
                      {selectedMember.showDescription === true && getLocalizedDescription(selectedMember) && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-1.5 uppercase tracking-wider">
                            {t('directory.about')}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed whitespace-pre-wrap">
                            {getLocalizedDescription(selectedMember)}
                          </p>
                        </div>
                      )}

                      {/* Expertise & Services Chips */}
                      {allTags.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-1.5 uppercase tracking-wider">
                            {t('directory.expertise')}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {allTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20"
                              >
                                {getLocalizedTag(tag, t)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notable Projects */}
                      {selectedMember.showNotableProjects === true && selectedMember.notableProjects && (
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-850 space-y-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-primary shrink-0" /> {t('directory.notableProjects')}
                          </span>
                          <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed whitespace-pre-wrap">
                            {selectedMember.notableProjects}
                          </p>
                        </div>
                      )}

                      {/* Certifications */}
                      {selectedMember.showCertifications === true && selectedMember.certifications && (
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-850 space-y-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-primary shrink-0" /> {t('directory.certifications')}
                          </span>
                          <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed whitespace-pre-wrap">
                            {selectedMember.certifications}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Contact Details */}
                    {hasContactInfo && (
                      <div className="w-full md:w-72 shrink-0 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 self-start space-y-4 shadow-3xs">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
                          {t('directory.contact')}
                        </h3>
                        
                        <div className="space-y-4 text-xs text-neutral-900 dark:text-white">
                          
                          {/* Key Contact Name */}
                          {selectedMember.showKeyContact === true && selectedMember.keyContactName && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.keyContact')}</span>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedMember.keyContactName}</span>
                              </div>
                            </div>
                          )}

                          {/* Location */}
                          {selectedMember.showLocation === true && selectedMember.location && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.location')}</span>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{selectedMember.location}, Cyprus</span>
                              </div>
                            </div>
                          )}

                          {/* Email */}
                          {selectedMember.showEmail === true && selectedMember.email && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.email')}</span>
                              <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#1b1c1e] p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Mail className="w-4 h-4 text-primary shrink-0" />
                                  <a 
                                    href={`mailto:${selectedMember.email}`} 
                                    onClick={() => (window as any).trackCustomEvent?.('contact_click', selectedMember.id)}
                                    className="hover:underline text-primary font-bold truncate block max-w-full"
                                  >
                                    {selectedMember.email}
                                  </a>
                                </div>
                                <button
                                  onClick={() => {
                                    handleCopyEmail(selectedMember.email);
                                    (window as any).trackCustomEvent?.('contact_click', selectedMember.id);
                                  }}
                                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer text-neutral-450 shrink-0"
                                  title="Copy email"
                                >
                                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-650" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Phone */}
                          {selectedMember.showPhone === true && selectedMember.phone && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.phone')}</span>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <a 
                                  href={`tel:${selectedMember.phone}`} 
                                  onClick={() => (window as any).trackCustomEvent?.('contact_click', selectedMember.id)}
                                  className="hover:underline text-neutral-700 dark:text-neutral-300 font-medium"
                                >
                                  {selectedMember.phone}
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Website */}
                          {selectedMember.showWebsite === true && selectedMember.website && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.website')}</span>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary shrink-0" />
                                <a 
                                  href={selectedMember.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={() => (window as any).trackCustomEvent?.('contact_click', selectedMember.id)}
                                  className="hover:underline text-primary font-bold truncate block max-w-full"
                                >
                                  {selectedMember.website}
                                </a>
                              </div>
                            </div>
                          )}

                          {/* LinkedIn */}
                          {selectedMember.showLinkedin === true && selectedMember.linkedin && (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-450 block">{t('directory.linkedin')}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary text-center w-4 shrink-0">in</span>
                                <a 
                                  href={selectedMember.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={() => (window as any).trackCustomEvent?.('contact_click', selectedMember.id)}
                                  className="hover:underline text-primary font-bold truncate block max-w-full"
                                >
                                  {selectedMember.linkedin}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Mail button */}
                        {selectedMember.showEmail === true && selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}?subject=Energeia%20Network%20Inquiry`}
                            onClick={() => (window as any).trackCustomEvent?.('contact_click', selectedMember.id)}
                            className="w-full bg-primary text-white py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors mt-2 cursor-pointer"
                          >
                            <Mail className="w-4 h-4" /> {t('directory.sendEmail')}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
        </ClientPortal>
      )}
    </div>
  );
};
