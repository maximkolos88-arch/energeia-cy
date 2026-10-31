'use client';

import React, { useState, useMemo } from 'react';
import ClientPortal from './ui/ClientPortal';
import { useTranslation } from 'react-i18next';
import { useWebMCP } from '../hooks/useWebMCP';
import { useDirectoryController } from '../controllers/useDirectoryController';
import { DirectoryMember } from '../models/types';
import { 
  Search, 
  Mail, 
  ArrowRight, 
  Building2, 
  User, 
  Leaf, 
  X, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Globe, 
  Award, 
  Copy, 
  Check,
  ShieldCheck,
  Send
} from 'lucide-react';
import { MemberCard } from './MemberCard';
import PageHeader from './PageHeader';
import { getLocalizedTag } from '../utils/tagLocalization';

const SECTORS = [
  'All Sectors',
  'Solar & Renewables',
  'Grid Operator',
  'Subsea Interconnector',
  'Hydrocarbons',
  'Regulator & Policy',
  'EPC Contractor'
] as const;

export const DirectoryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeSector, setActiveSector] = useState<string>('All Sectors');
  const [claimModalMember, setClaimModalMember] = useState<DirectoryMember | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState<boolean>(false);
  const [claimEmail, setClaimEmail] = useState<string>('');
  const [claimNotes, setClaimNotes] = useState<string>('');

  const {
    searchQuery,
    setSearchQuery,
    members,
    loading,
    selectedMember,
    openMemberContact,
    closeMemberContact
  } = useDirectoryController();

  const getLocalizedDescription = (m: DirectoryMember): string => {
    const lang = i18n.language || 'en';
    if (lang === 'el' && m.description_el && m.description_el.trim() !== '') return m.description_el;
    if (lang === 'ru' && m.description_ru && m.description_ru.trim() !== '') return m.description_ru;
    if (lang === 'he' && m.description_he && m.description_he.trim() !== '') return m.description_he;
    return m.description || '';
  };

  const getLocalizedCategory = (catName: string): string => {
    if (!catName) return '';
    const name = catName.trim().toLowerCase();
    if (name === 'all news') return t('categories.allNews', 'All Sectors');
    if (name.includes('renew') || name.includes('solar')) return t('categories.renewables', 'Solar & Renewables');
    if (name.includes('oil') || name.includes('gas')) return t('categories.oilGas', 'Oil & Gas');
    if (name.includes('govern') || name.includes('policy')) return t('categories.govPolicy', 'Regulator & Policy');
    if (name.includes('trading') || name.includes('electric')) return t('categories.electricityTrading', 'Grid & Electricity');
    if (name.includes('maritime') || name.includes('offshore')) return t('categories.maritimeOffshore', 'Maritime & Offshore');
    if (name.includes('engineering') || name.includes('epc')) return t('categories.engineeringEpc', 'EPC Contractor');
    return catName;
  };

  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Filter members by Sector and Search Query
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Sector filter
      if (activeSector !== 'All Sectors') {
        const cat = (m.category || '').toLowerCase();
        const role = (m.roleOrCategory || '').toLowerCase();
        const sec = activeSector.toLowerCase();
        if (sec.includes('solar') && !(cat.includes('solar') || cat.includes('renew') || role.includes('solar') || role.includes('renew'))) return false;
        if (sec.includes('grid') && !(cat.includes('grid') || role.includes('grid') || role.includes('transmission') || m.name.toLowerCase().includes('tsoc'))) return false;
        if (sec.includes('subsea') && !(cat.includes('subsea') || role.includes('interconnect') || m.name.toLowerCase().includes('gsi') || m.name.toLowerCase().includes('great sea'))) return false;
        if (sec.includes('hydrocarbon') && !(cat.includes('oil') || cat.includes('gas') || role.includes('hydrocarbon') || role.includes('fuel'))) return false;
        if (sec.includes('regulator') && !(cat.includes('govern') || cat.includes('policy') || role.includes('regulat') || m.name.toLowerCase().includes('cera'))) return false;
        if (sec.includes('epc') && !(cat.includes('epc') || role.includes('epc') || role.includes('contractor') || role.includes('installer'))) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesRole = m.roleOrCategory.toLowerCase().includes(q);
        const matchesCat = (m.category || '').toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        return matchesName || matchesRole || matchesCat || matchesDesc;
      }

      return true;
    });
  }, [members, activeSector, searchQuery]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimSubmitted(false);
      setClaimModalMember(null);
      setClaimEmail('');
      setClaimNotes('');
    }, 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-16 animate-fade-in">
      <PageHeader 
        title={t('directory.title', 'Cyprus Energy Ecosystem & Partners')} 
        description={t('directory.description', 'Verified public registry of project developers, grid operators, EPC contractors, and regulatory authorities.')} 
        iconName="users" 
      />

      {/* Instant Search Bar */}
      <div className="w-full mb-6">
        <div className="relative w-full">
          <label htmlFor="directory-search-input" className="sr-only">
            {t('directory.searchPlaceholder', 'Search organizations, licensed EPCs, specialists...')}
          </label>
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-secondary-text,#5F6368)] pointer-events-none" />
          <input
            id="directory-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('directory.searchPlaceholder', 'Search organizations, licensed EPCs, specialists...')}
            className="w-full bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] focus:border-[var(--md-sys-color-primary,#1A73E8)] focus:bg-white dark:focus:bg-[#1E1F20] focus:outline-none rounded-2xl py-3.5 pl-12 pr-12 text-sm text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white placeholder:text-[var(--md-sys-color-secondary-text,#5F6368)] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-secondary-text,#5F6368)] hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 mb-8">
        {SECTORS.map((sector) => {
          const isActive = activeSector === sector;
          return (
            <button
              key={sector}
              type="button"
              onClick={() => setActiveSector(sector)}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[var(--md-sys-color-primary-container,#D3E3FD)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] font-semibold shadow-xs'
                  : 'bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[#282A2C]'
              }`}
            >
              <span>{sector}</span>
            </button>
          );
        })}
      </div>

      {/* Directory Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-[var(--radius-card,24px)] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="w-3/4 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="w-1/2 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-[var(--radius-card,24px)] p-8">
          <p className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-2">No organizations match your filters</p>
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mb-6 max-w-md mx-auto">
            Try adjusting your search query or selecting "All Sectors" to see the complete list of registered companies.
          </p>
          <button
            onClick={() => { setActiveSector('All Sectors'); setSearchQuery(''); }}
            className="px-6 py-2.5 bg-[var(--md-sys-color-primary,#1A73E8)] text-white rounded-full text-xs font-medium hover:bg-[var(--md-sys-color-primary-hover,#1557B0)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => openMemberContact(member)}
              onClaimProfile={(m) => setClaimModalMember(m)}
            />
          ))}
        </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <ClientPortal>
          <div 
            onClick={closeMemberContact}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1E1F20] w-full max-w-3xl max-h-[90vh] rounded-[var(--radius-card,24px)] overflow-hidden flex flex-col shadow-2xl border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] animate-scale-up"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--md-sys-color-outline-variant,#E0E2E0)] p-2 flex items-center justify-center shrink-0">
                    {(selectedMember.logoUrl || selectedMember.imageUrl) ? (
                      <img
                        src={selectedMember.logoUrl || selectedMember.imageUrl}
                        alt={selectedMember.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-[var(--md-sys-color-primary,#1A73E8)]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white flex items-center gap-2">
                      {selectedMember.name}
                      {selectedMember.isVerified && <CheckCircle2 className="w-4 h-4 text-[var(--md-sys-color-primary,#1A73E8)] shrink-0" />}
                    </h2>
                    <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)]">
                      {selectedMember.roleOrCategory}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeMemberContact}
                  aria-label="Close dialog"
                  className="p-2 text-[var(--md-sys-color-secondary-text,#5F6368)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[#282A2C] rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {selectedMember.description && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-secondary-text,#5F6368)] mb-2">
                      About Organization
                    </h3>
                    <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
                      {getLocalizedDescription(selectedMember)}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {selectedMember.location && (
                    <div className="p-4 rounded-2xl bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[var(--md-sys-color-primary,#1A73E8)] shrink-0" />
                      <div>
                        <div className="text-[10px] text-[var(--md-sys-color-secondary-text,#5F6368)] uppercase font-semibold">Location</div>
                        <div className="text-xs font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">{selectedMember.location}</div>
                      </div>
                    </div>
                  )}

                  {selectedMember.website && (
                    <div className="p-4 rounded-2xl bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[var(--md-sys-color-primary,#1A73E8)] shrink-0" />
                      <div className="truncate">
                        <div className="text-[10px] text-[var(--md-sys-color-secondary-text,#5F6368)] uppercase font-semibold">Official Website</div>
                        <a href={selectedMember.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] hover:underline truncate block">
                          {selectedMember.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex justify-between items-center text-xs text-[var(--md-sys-color-secondary-text,#5F6368)]">
                <span>GDPR Article 14 Verified Public Profile</span>
                <button
                  type="button"
                  onClick={() => { closeMemberContact(); setClaimModalMember(selectedMember); }}
                  className="px-4 py-2 rounded-full bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] font-medium cursor-pointer"
                >
                  Claim / Update Profile
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* GDPR Article 14 Claim or Update Profile Dialog */}
      {claimModalMember && (
        <ClientPortal>
          <div 
            onClick={() => setClaimModalMember(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1E1F20] w-full max-w-lg rounded-[var(--radius-card,24px)] p-6 md:p-8 shadow-2xl border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] space-y-4 animate-scale-up"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
                    Claim or Update Profile
                  </h3>
                  <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] mt-1">
                    {claimModalMember.name} (GDPR Art. 14 Right of Rectification)
                  </p>
                </div>
                <button 
                  onClick={() => setClaimModalMember(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {claimSubmitted ? (
                <div className="p-6 text-center space-y-2 bg-[var(--google-green-bg)] text-[var(--google-green-text)] rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <div className="font-semibold text-sm">Request Submitted</div>
                  <div className="text-xs">Our registry compliance team will verify your enterprise domain credentials within 1 business day.</div>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant,#444746)] mb-1">
                      Corporate Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      placeholder="e.g. director@company.com"
                      className="w-full h-10 px-3 text-xs rounded-xl bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:bg-[#282A2C] border border-transparent focus:border-[var(--md-sys-color-primary,#1A73E8)] outline-none text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant,#444746)] mb-1">
                      Requested Profile Update / Correction Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={claimNotes}
                      onChange={(e) => setClaimNotes(e.target.value)}
                      placeholder="Describe updated executive contacts, installed capacity, or CERA licensing records..."
                      className="w-full p-3 text-xs rounded-xl bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:bg-[#282A2C] border border-transparent focus:border-[var(--md-sys-color-primary,#1A73E8)] outline-none text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setClaimModalMember(null)}
                      className="px-4 py-2 text-xs font-medium text-[var(--md-sys-color-secondary-text,#5F6368)] hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[var(--md-sys-color-primary,#1A73E8)] text-white text-xs font-medium hover:bg-[var(--md-sys-color-primary-hover,#1557B0)] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Verification</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </ClientPortal>
      )}
    </div>
  );
};

export default DirectoryScreen;
