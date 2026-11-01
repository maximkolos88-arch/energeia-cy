import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  X, 
  Building2, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Send,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { DirectoryMember } from '../models/types';
import { DirectoryRepository, INITIAL_DIRECTORY_MEMBERS } from '../services/repositories/DirectoryRepository';
import { useInitialData } from '../context/InitialDataContext';
import { MembershipIntakeModal } from '../components/membership/MembershipIntakeModal';

const SECTOR_CHIPS = [
  'All Members',
  'Solar PV & Generation',
  'Battery Storage (BESS)',
  'Grid & Transmission',
  'EPC Contractors',
  'Engineering & Advisory',
  'Legal, Policy & ESG',
] as const;

const DISTRICTS = ['All Districts', 'Nicosia', 'Limassol', 'Larnaca', 'Paphos'] as const;

export const DirectoryLayout: React.FC = () => {
  const { t } = useTranslation();
  const initialData = useInitialData();
  const [members, setMembers] = useState<DirectoryMember[]>(() => {
    if (initialData?.directoryMembers && initialData.directoryMembers.length > 0) {
      return initialData.directoryMembers;
    }
    return INITIAL_DIRECTORY_MEMBERS;
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All Members');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');

  // Modals state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [dossierMember, setDossierMember] = useState<DirectoryMember | null>(null);
  const [claimMember, setClaimMember] = useState<DirectoryMember | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimEmail, setClaimEmail] = useState('');
  const [claimPhone, setClaimPhone] = useState('+357 ');
  const [claimNotes, setClaimNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (initialData?.directoryMembers && initialData.directoryMembers.length > 0) return;

    setLoading(true);
    DirectoryRepository.getMembers()
      .then((data) => {
        if (isMounted) {
          setMembers(data && data.length > 0 ? data : INITIAL_DIRECTORY_MEMBERS);
        }
      })
      .catch(() => {
        if (isMounted) setMembers(INITIAL_DIRECTORY_MEMBERS);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  // Real-time filtering by search, sector, and district
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return members.filter((member) => {
      // 1. District filter
      if (selectedDistrict !== 'All Districts') {
        const loc = (member.location || '').toLowerCase();
        if (!loc.includes(selectedDistrict.toLowerCase())) return false;
      }

      // 2. Sector Filter
      if (selectedSector !== 'All Members') {
        const category = (member.category || '').toLowerCase();
        const role = (member.roleOrCategory || '').toLowerCase();
        const tags = (member.expertiseTags || []).map((t) => t.toLowerCase());

        let matchesSector = false;
        if (selectedSector === 'Solar PV & Generation') {
          matchesSector = category.includes('renewables') || role.includes('solar') || tags.some((t) => t.includes('solar'));
        } else if (selectedSector === 'Battery Storage (BESS)') {
          matchesSector = tags.some((t) => t.includes('storage') || t.includes('microgrids')) || role.includes('storage');
        } else if (selectedSector === 'Grid & Transmission') {
          matchesSector = category.includes('electricity') || role.includes('grid') || role.includes('transmission') || tags.some((t) => t.includes('grid'));
        } else if (selectedSector === 'EPC Contractors') {
          matchesSector = category.includes('engineering') || role.includes('epc') || tags.some((t) => t.includes('epc'));
        } else if (selectedSector === 'Engineering & Advisory') {
          matchesSector = category.includes('services') || role.includes('advisory') || tags.some((t) => t.includes('advisory') || t.includes('project'));
        } else if (selectedSector === 'Legal, Policy & ESG') {
          matchesSector = category.includes('government') || role.includes('regulator') || tags.some((t) => t.includes('policy') || t.includes('legal') || t.includes('esg'));
        }
        if (!matchesSector) return false;
      }

      // 3. Search query filter
      if (q) {
        const nameMatch = member.name.toLowerCase().includes(q);
        const roleMatch = (member.roleOrCategory || '').toLowerCase().includes(q);
        const descMatch = (member.description || '').toLowerCase().includes(q);
        const locMatch = (member.location || '').toLowerCase().includes(q);
        const tagMatch = (member.expertiseTags || []).some((t) => t.toLowerCase().includes(q));
        const servicesMatch = Array.isArray(member.keyServices)
          ? member.keyServices.some((s) => s.toLowerCase().includes(q))
          : (member.keyServices || '').toLowerCase().includes(q);

        return nameMatch || roleMatch || descMatch || locMatch || tagMatch || servicesMatch;
      }

      return true;
    });
  }, [members, searchQuery, selectedSector, selectedDistrict]);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimEmail.trim()) return;

    try {
      const claims = JSON.parse(localStorage.getItem('energeia_profile_claims') || '[]');
      claims.push({
        member_id: claimMember?.id,
        member_name: claimMember?.name,
        email: claimEmail.trim(),
        phone: claimPhone.trim(),
        notes: claimNotes.trim(),
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('energeia_profile_claims', JSON.stringify(claims));
    } catch {}

    setClaimSubmitted(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Members');
    setSelectedDistrict('All Districts');
  };

  const getDistrictFromLocation = (loc?: string): string => {
    if (!loc) return 'Cyprus';
    for (const d of ['Nicosia', 'Limassol', 'Larnaca', 'Paphos']) {
      if (loc.toLowerCase().includes(d.toLowerCase())) return d;
    }
    return 'Cyprus';
  };

  const isStrategicPartner = (m: DirectoryMember) => {
    return (
      m.tier === 'Partner' ||
      m.tier === 'Strategic' ||
      m.name.includes('Authority') ||
      m.name.includes('CERA') ||
      m.name.includes('TSOC') ||
      m.name.includes('Bioland') ||
      m.name.includes('Muskita')
    );
  };

  const getInitials = (name: string): string => {
    return name
      .replace(/[^a-zA-Z\s]/g, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  };

  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors pb-24 sm:pb-32">
      
      {/* 1. DIRECTORY MASTHEAD & ACTIONS */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-8 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EA] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81C995] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Accredited B2B Registry • members.energeia.cy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-[#1F1F1F] dark:text-[#E3E3E3]">
              Accredited Industry Directory
            </h1>
            <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
              Verified registry of solar developers, battery storage operators, transmission engineers, EPC contractors, and ESG advisors across Cyprus.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsIntakeOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Apply for Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-8 relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#80868B] dark:text-[#9AA0A6] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, technology keywords (e.g., Solar, BESS, EPC), or district..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] text-sm text-[#1F1F1F] dark:text-white placeholder-[#80868B] dark:placeholder-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#8AB4F8] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#80868B] hover:text-[#1F1F1F] dark:hover:text-white absolute right-3 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Scrolling Filter Chips (Google Workspace style) */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {SECTOR_CHIPS.map((chip) => {
              const active = selectedSector === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedSector(chip)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#1F1F1F] dark:bg-white text-white dark:text-[#1F1F1F] border-[#1F1F1F] dark:border-white shadow-xs font-semibold'
                      : 'bg-[#F8F9FA] dark:bg-[#1E1F20] text-[#444746] dark:text-[#C4C7C5] border-[#DADCE0] dark:border-[#3C4043] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* District Selector Pill */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-medium hidden sm:inline">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3.5 py-2 rounded-full text-xs font-medium bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8] cursor-pointer"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. RESULTS SUMMARY BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6]">
        <div>
          Showing <span className="font-semibold text-[#1F1F1F] dark:text-white">{filteredMembers.length}</span> accredited {filteredMembers.length === 1 ? 'organization' : 'organizations'}
          {(searchQuery || selectedSector !== 'All Members' || selectedDistrict !== 'All Districts') && (
            <span> matching current criteria</span>
          )}
        </div>
        {(searchQuery || selectedSector !== 'All Members' || selectedDistrict !== 'All Districts') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* 3. ACCREDITED MEMBER CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredMembers.length === 0 ? (
          /* Empty Search State */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] mx-auto">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white">
              No matching organizations found
            </h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
              We couldn't find any accredited partners matching "{searchQuery}". Try searching for broader terms like "Solar", "Storage", or select "All Members".
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs font-medium cursor-pointer shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const isPartner = isStrategicPartner(member);
              const district = getDistrictFromLocation(member.location);

              return (
                <div
                  key={member.id}
                  className="group p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Header: Verified / Strategic Badge + District Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {isPartner ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF7E0] dark:bg-[#D46200]/20 text-[#B85100] dark:text-[#FFA726] border border-[#D46200]/20">
                          <Award className="w-3 h-3" />
                          <span>Strategic Partner</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E6F4EA] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81C995] border border-[#137333]/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Member</span>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6]">
                        <MapPin className="w-3 h-3" />
                        <span>{district}</span>
                      </span>
                    </div>

                    {/* Logo Squircle & Title */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8F9FA] to-[#E8EAED] dark:from-[#282A2C] dark:to-[#18191A] border border-[#DADCE0] dark:border-[#444746] flex items-center justify-center shrink-0 shadow-2xs text-[#1A73E8] dark:text-[#8AB4F8] font-semibold text-base">
                        {member.logoUrl ? (
                          <img
                            src={member.logoUrl}
                            alt={member.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              // Fallback to initials
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white leading-snug line-clamp-1 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-0.5 line-clamp-1">
                          {member.roleOrCategory || member.category}
                        </p>
                      </div>
                    </div>

                    {/* Description or Asset Summary */}
                    <p className="text-xs text-[#444746] dark:text-[#C4C7C5] leading-relaxed line-clamp-2 mt-2">
                      {member.description || 'Accredited clean energy provider operating under the Cyprus Energy Regulatory framework.'}
                    </p>

                    {/* Expertise Tags */}
                    {member.expertiseTags && member.expertiseTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-4">
                        {member.expertiseTags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F3F4] dark:bg-[#282A2C] text-[#444746] dark:text-[#C4C7C5]"
                          >
                            {tag}
                          </span>
                        ))}
                        {member.expertiseTags.length > 3 && (
                          <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-medium">
                            +{member.expertiseTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setDossierMember(member)}
                      className="font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setClaimMember(member);
                        setClaimSubmitted(false);
                      }}
                      className="text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Claim Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. DOSSIER DETAIL MODAL */}
      {dossierMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setDossierMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full sm:max-w-lg bg-white dark:bg-[#1E1F20] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

            <div className="p-6 border-b border-[#F1F3F4] dark:border-[#282A2C] flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F8F9FA] to-[#E8EAED] dark:from-[#282A2C] dark:to-[#18191A] border border-[#DADCE0] dark:border-[#444746] flex items-center justify-center text-xl font-bold text-[#1A73E8] dark:text-[#8AB4F8] shrink-0">
                  {getInitials(dossierMember.name)}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                    {dossierMember.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                      {dossierMember.roleOrCategory}
                    </span>
                    <span className="text-xs text-[#80868B]">•</span>
                    <span className="text-xs text-[#137333] dark:text-[#81C995] font-medium">
                      {dossierMember.location || 'Cyprus'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDossierMember(null)}
                aria-label="Close dossier"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                  Corporate Dossier
                </h4>
                <p className="text-xs sm:text-sm text-[#444746] dark:text-[#C4C7C5] leading-relaxed">
                  {dossierMember.description || 'Active member organization contributing to utility-scale renewable generation and grid modernization in Cyprus.'}
                </p>
              </div>

              {/* Key Services / Projects */}
              {dossierMember.keyServices && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                    Key Capabilities &amp; Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(dossierMember.keyServices) ? dossierMember.keyServices : [dossierMember.keyServices]).map((srv, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F3F4] dark:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notable Projects */}
              {dossierMember.notableProjects && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    Notable Installations &amp; Assets
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
                    {dossierMember.notableProjects}
                  </p>
                </div>
              )}

              {/* Official Contact Strip */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-2.5">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
                  Verified Contact Channels
                </h4>
                <div className="space-y-1.5 text-xs">
                  {dossierMember.email && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#444746] dark:text-[#C4C7C5]">
                        <Mail className="w-3.5 h-3.5 text-[#5F6368]" />
                        <a href={`mailto:${dossierMember.email}`} className="hover:underline">{dossierMember.email}</a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(dossierMember.email, 'email')}
                        className="text-[10px] text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
                      >
                        {copiedField === 'email' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {dossierMember.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#444746] dark:text-[#C4C7C5]">
                        <Phone className="w-3.5 h-3.5 text-[#5F6368]" />
                        <a href={`tel:${dossierMember.phone}`} className="hover:underline">{dossierMember.phone}</a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(dossierMember.phone || '', 'phone')}
                        className="text-[10px] text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
                      >
                        {copiedField === 'phone' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {dossierMember.website && (
                    <div className="flex items-center gap-2 text-[#1A73E8] dark:text-[#8AB4F8] pt-1">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={dossierMember.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <span>{dossierMember.website.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FA] dark:bg-[#18191A] border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setClaimMember(dossierMember);
                  setDossierMember(null);
                  setClaimSubmitted(false);
                }}
                className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-white cursor-pointer"
              >
                Claim or Update Profile
              </button>

              <button
                type="button"
                onClick={() => setDossierMember(null)}
                className="px-5 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs font-medium cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CLAIM PROFILE MODAL */}
      {claimMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setClaimMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full sm:max-w-md bg-white dark:bg-[#1E1F20] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

            <div className="p-6 border-b border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
                  Profile Accreditation
                </span>
                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-0.5">
                  Claim {claimMember.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setClaimMember(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {claimSubmitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-medium text-[#1F1F1F] dark:text-white">
                    Verification Request Transmitted
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-xs mx-auto">
                    The Cluster Secretariat will verify executive credentials against Cyprus HE corporate records within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setClaimMember(null)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#1A73E8] text-white text-xs font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
                    Verify official ownership of this listing to update capabilities, assign personnel, and access cluster working group deliberations.
                  </p>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#5F6368] dark:text-[#9AA0A6] mb-1">
                      Official Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      placeholder="executive@company.cy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#5F6368] dark:text-[#9AA0A6] mb-1">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      value={claimPhone}
                      onChange={(e) => setClaimPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#5F6368] dark:text-[#9AA0A6] mb-1">
                      Proof of Authority / Role Description
                    </label>
                    <textarea
                      rows={2}
                      value={claimNotes}
                      onChange={(e) => setClaimNotes(e.target.value)}
                      placeholder="e.g. Director of Operations, authorized signatory under HE certificate..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] text-white dark:text-[#062E6F] text-xs font-medium cursor-pointer shadow-xs"
                    >
                      Request Profile Verification
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. MEMBERSHIP INTAKE MODAL */}
      <MembershipIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        defaultTier="Corporate Member"
      />

    </div>
  );
};

export default DirectoryLayout;
