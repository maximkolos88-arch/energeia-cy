import React from 'react';
import { useDirectoryController } from '../controllers/useDirectoryController';
import { DirectoryMember } from '../models/types';
import { Search, Mail, ArrowRight, Building2, User, Leaf, X, Phone, MapPin, Filter, Tag, CheckCircle2, Globe, Award } from 'lucide-react';
import { MemberCard } from './MemberCard';
import PageHeader from './PageHeader';

export const DirectoryScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    members,
    loading,
    selectedMember,
    openMemberContact,
    closeMemberContact
  } = useDirectoryController();

  const getMemberIcon = (member: DirectoryMember) => {
    if (member.type === 'Company') {
      if (member.roleOrCategory.toLowerCase().includes('esg')) {
        return <Leaf className="w-6 h-6 text-[#1CA350]" />;
      }
      return <Building2 className="w-6 h-6 text-[#1CA350]" />;
    }
    return <User className="w-6 h-6 text-[#1CA350]" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader title="Professional Directory" description="Connect with certified energy engineers, ESG auditors, solar contractors, and suppliers across Cyprus." iconName="group" />

      {/* Clean Full-Width Search Bar */}
      <div className="relative w-full mb-6">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, role, location, or specialty..."
          className="w-full bg-[#f1f3f4] dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] focus:border-[#1CA350] focus:bg-white dark:focus:bg-[#202124] focus:outline-none rounded-full py-3 pl-12 pr-12 text-sm font-medium text-[#202124] dark:text-white placeholder:text-[#5f6368] transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Directory Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border border-[#dadce0] dark:border-[#3c4043] rounded-2xl bg-white dark:bg-[#2d2e30] animate-pulse h-28"></div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border border-[#dadce0] dark:border-[#3c4043] rounded-2xl bg-white dark:bg-[#2d2e30] p-6">
          <p className="text-base font-medium text-[#202124] dark:text-white mb-2">No matching energy partners found</p>
          <p className="text-xs text-[#5f6368] dark:text-gray-400 mb-4 max-w-md mx-auto">
            Try broadening your search term or resetting the query.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-5 py-2 bg-[#1CA350] text-white rounded-full text-xs font-medium hover:bg-[#15823f]"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => openMemberContact(member)}
            />
          ))}
        </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#202124] rounded-3xl border border-[#dadce0] dark:border-[#3c4043] max-w-3xl w-full p-6 relative shadow-2xl my-8">
            <button
              onClick={closeMemberContact}
              className="absolute top-4 right-4 p-2 text-[#5f6368] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2e30] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section */}
            <div className="flex items-center gap-4 pb-4 border-b border-[#dadce0] dark:border-[#3c4043] mb-4">
              {(selectedMember.logoUrl || selectedMember.imageUrl) ? (
                <img
                  src={selectedMember.logoUrl || selectedMember.imageUrl}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-2xl object-contain bg-white dark:bg-[#2d2e30] border border-[#dadce0]/50 p-1.5"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] text-[#1CA350] flex items-center justify-center border border-[#dadce0]/50">
                  {getMemberIcon(selectedMember)}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-[#202124] dark:text-white flex items-center gap-1.5">
                  {selectedMember.name}
                  {selectedMember.isVerified && <CheckCircle2 className="w-5 h-5 text-[#1CA350]" />}
                </h2>
                <p className="text-xs font-semibold text-[#5f6368] dark:text-gray-300">
                  {selectedMember.roleOrCategory}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="px-2.5 py-0.5 bg-[#e8f5e9] dark:bg-[#1CA350]/15 text-[#1CA350] text-[10px] font-bold rounded-full">
                    {selectedMember.category || 'Renewables'}
                  </span>
                  {selectedMember.expertiseTags && selectedMember.expertiseTags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 bg-gray-100 dark:bg-[#2d2e30] text-gray-700 dark:text-gray-300 text-[10px] rounded-full font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Two-Column spacious B2B layout */}
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {/* Left Column: About & Expertise */}
              <div className="flex-1 space-y-6 min-w-0">
                {selectedMember.showDescription === true && selectedMember.description && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#202124] dark:text-white border-b border-[#dadce0] dark:border-[#3c4043] pb-1.5 uppercase tracking-wider">About Company</h3>
                    <p className="text-xs text-[#5f6368] dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMember.description}
                    </p>
                  </div>
                )}

                {/* Predefined Key Services and Industry Details */}
                {((selectedMember.showKeyServices === true && selectedMember.keyServices) ||
                  (selectedMember.showNotableProjects === true && selectedMember.notableProjects) ||
                  (selectedMember.showCertifications === true && selectedMember.certifications)) && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#202124] dark:text-white border-b border-[#dadce0] dark:border-[#3c4043] pb-1.5 uppercase tracking-wider">Industry Expertise</h3>
                    
                    {selectedMember.showKeyServices === true && selectedMember.keyServices && (
                      <div className="space-y-1">
                        <span className="font-semibold text-[11px] text-[#5f6368] dark:text-gray-300 block">Key Services</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(selectedMember.keyServices)
                            ? selectedMember.keyServices
                            : typeof selectedMember.keyServices === 'string'
                              ? (selectedMember.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
                              : []
                          ).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded bg-[#e8f5e9] dark:bg-[#1CA350]/15 text-[#1CA350] text-[10px] font-bold border border-[#1CA350]/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.showNotableProjects === true && selectedMember.notableProjects && (
                      <div className="bg-[#f1f3f4]/50 dark:bg-[#2d2e30]/40 rounded-xl p-3 border border-outline-variant/30 space-y-1">
                        <span className="font-bold text-xs text-[#202124] dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#1CA350]" /> Notable Projects
                        </span>
                        <p className="text-xs text-[#5f6368] dark:text-gray-300 leading-relaxed">{selectedMember.notableProjects}</p>
                      </div>
                    )}

                    {selectedMember.showCertifications === true && selectedMember.certifications && (
                      <div className="bg-[#f1f3f4]/50 dark:bg-[#2d2e30]/40 rounded-xl p-3 border border-outline-variant/30 space-y-1">
                        <span className="font-bold text-xs text-[#202124] dark:text-white flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#1CA350]" /> Certifications
                        </span>
                        <p className="text-xs text-[#5f6368] dark:text-gray-300 leading-relaxed">{selectedMember.certifications}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Contact Details (Gated Info) */}
              <div className="w-full md:w-64 shrink-0 bg-[#f8f9fa] dark:bg-[#2d2e30]/60 border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 self-start space-y-4">
                <h3 className="text-xs font-bold text-[#202124] dark:text-white uppercase tracking-wider border-b border-[#dadce0] dark:border-[#3c4043] pb-1.5">Contact Details</h3>
                
                <div className="space-y-3.5 text-xs text-[#202124] dark:text-white">
                  {selectedMember.showKeyContact === true && selectedMember.keyContactName && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">Key Contact</span>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#1CA350] shrink-0" />
                        <span className="font-bold">{selectedMember.keyContactName}</span>
                      </div>
                    </div>
                  )}

                  {selectedMember.showEmail === true && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">Email Address</span>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#1CA350] shrink-0" />
                        <a href={`mailto:${selectedMember.email}`} className="hover:underline text-[#1CA350] font-bold truncate block max-w-full">
                          {selectedMember.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedMember.showPhone === true && selectedMember.phone && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">Phone Number</span>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#1CA350] shrink-0" />
                        <span className="font-medium">{selectedMember.phone}</span>
                      </div>
                    </div>
                  )}

                  {selectedMember.showLocation === true && selectedMember.location && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">Corporate Office</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1CA350] shrink-0" />
                        <span>{selectedMember.location}, Cyprus</span>
                      </div>
                    </div>
                  )}

                  {selectedMember.showWebsite === true && selectedMember.website && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">Official Website</span>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#1CA350] shrink-0" />
                        <a href={selectedMember.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1CA350] font-bold truncate block max-w-full">
                          {selectedMember.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedMember.showLinkedin === true && selectedMember.linkedin && (
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5f6368] dark:text-gray-400 block">LinkedIn Profile</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1CA350] text-center w-4 shrink-0">in</span>
                        <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1CA350] font-bold truncate block max-w-full">
                          {selectedMember.linkedin}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {selectedMember.showEmail === true && (
                  <a
                    href={`mailto:${selectedMember.email}?subject=Energeia%20Network%20Inquiry`}
                    className="w-full bg-[#1CA350] text-white py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#15823f] transition-colors mt-2"
                  >
                    <Mail className="w-4 h-4" /> Send Email
                  </a>
                )}
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};


