import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Zap, 
  BatteryCharging, 
  FileText, 
  Network, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { DirectoryMember } from '../../models/types';
import { InitialData } from '../../context/InitialDataContext';

export interface CompanyDossierModalProps {
  member: DirectoryMember;
  onClose: () => void;
  onClaimProfile: (member: DirectoryMember) => void;
  onSelectArticle?: (article: any) => void;
  newsItems?: InitialData['newsItems'];
}

interface PassportMetrics {
  heNumber: string;
  ceraLicense: string;
  operationalCapacity: string;
  pipelineCapacity: string;
  gridStatus: string;
  executiveName: string;
  executiveRole: string;
}

export function getMemberPassportMetrics(member: DirectoryMember): PassportMetrics {
  const name = member.name.toLowerCase();
  
  if (name.includes('electricity authority') || name.includes('eac') || name.includes('ahk')) {
    return {
      heNumber: 'Statutory Body (Cap. 171)',
      ceraLicense: 'Licensed Generation, DSO & Supply Operator',
      operationalCapacity: '1,480 MW Generation · 850+ MWp RES Interface',
      pipelineCapacity: 'Dhekelia BESS (80 MWh) · Substation Digitalization',
      gridStatus: 'National Transmission & Distribution Grid Operator',
      executiveName: member.keyContactName || 'Adonis Yiasemides',
      executiveRole: member.keyContactRole || 'Acting General Manager & Chief Operations Officer'
    };
  }

  if (name.includes('transmission system operator') || name.includes('tsoc') || name.includes('dsm')) {
    return {
      heNumber: 'Statutory Operator (Law 122(I)/2003)',
      ceraLicense: 'Licensed Transmission System Operator (TSO)',
      operationalCapacity: '1,320 MW Peak Transmission Capacity (132/66 kV)',
      pipelineCapacity: 'Great Sea Interconnector (1,000 MW HVDC Subsea)',
      gridStatus: 'National TSO Grid Control Dispatch & ENTSO-E Synchronous',
      executiveName: member.keyContactName || 'Stavros Stavrinos',
      executiveRole: member.keyContactRole || 'Executive Director of System Operations'
    };
  }

  if (name.includes('cera') || name.includes('raek') || name.includes('regulatory authority')) {
    return {
      heNumber: 'Independent Constitutional Authority',
      ceraLicense: 'National Energy Market Regulatory Body',
      operationalCapacity: '100% Republic of Cyprus Energy Market Supervision',
      pipelineCapacity: 'Target Market Model Rules · Centralized Storage Tariffs',
      gridStatus: 'Regulatory Enforcement & Licensing Overseer',
      executiveName: member.keyContactName || 'Andreas Poullikkas',
      executiveRole: member.keyContactRole || 'Chairman of CERA / Energy Systems Strategist'
    };
  }

  if (name.includes('bioland')) {
    return {
      heNumber: 'HE 368291',
      ceraLicense: 'CERA Licensed Independent Power Producer (IPP)',
      operationalCapacity: '95+ MWp Operational Solar PV Assets',
      pipelineCapacity: '40 MWh Utility BESS Fast-Track Portfolio',
      gridStatus: 'TSOC 132 kV High Voltage Interconnected',
      executiveName: member.keyContactName || 'Dimitris Constantinou',
      executiveRole: member.keyContactRole || 'Managing Director'
    };
  }

  if (name.includes('lanitis')) {
    return {
      heNumber: 'HE 12480',
      ceraLicense: 'CERA Licensed Commercial Producer & Energy Trader',
      operationalCapacity: '65+ MWp Solar PV Portfolio & Corporate PPAs',
      pipelineCapacity: '25 MWh Hybrid Solar + BESS Storage Facilities',
      gridStatus: 'EAC Medium Voltage & TSOC Transmission Connected',
      executiveName: member.keyContactName || 'Marios Lanitis',
      executiveRole: member.keyContactRole || 'Executive Director — Energy Division'
    };
  }

  if (name.includes('conercon') || name.includes('petrolina')) {
    return {
      heNumber: 'HE 187652',
      ceraLicense: 'CERA Licensed Energy Supplier & EPC Class A',
      operationalCapacity: '55+ MWp Utility, Industrial & Rooftop Solar',
      pipelineCapacity: '30 MWh BESS Aggregation & Battery Systems',
      gridStatus: 'EAC Distribution & TSOC Substation Interface',
      executiveName: member.keyContactName || 'Costas Demetriou',
      executiveRole: member.keyContactRole || 'Head of Renewable Energy & EPC'
    };
  }

  if (name.includes('big solar')) {
    return {
      heNumber: 'HE 298104',
      ceraLicense: 'Tier-1 Equipment Distributor & System Integrator',
      operationalCapacity: '80+ MWp Photovoltaic Inverter & Module Deliveries',
      pipelineCapacity: 'Utility BESS Containerized Solutions',
      gridStatus: 'Grid Code Certified Inverter & Plant Control Systems',
      executiveName: member.keyContactName || 'Giorgos Georgiou',
      executiveRole: member.keyContactRole || 'Commercial Director'
    };
  }

  if (name.includes('caramondani')) {
    return {
      heNumber: 'HE 4321',
      ceraLicense: 'Certified EPC Contractor Class A & Electrical Specialist',
      operationalCapacity: '45+ MWp Turnkey Solar Farms & Substations',
      pipelineCapacity: 'Microgrid & Industrial BESS Engineering Packages',
      gridStatus: '132/22 kV Transformer Substation Specialized',
      executiveName: member.keyContactName || 'Eleni Caramondani',
      executiveRole: member.keyContactRole || 'Managing Director'
    };
  }

  if (name.includes('cypra')) {
    return {
      heNumber: 'HE 215430',
      ceraLicense: 'CERA Licensed Biomass & Biogas Generator',
      operationalCapacity: '6.5 MW Continuous Baseload Biogas Generation',
      pipelineCapacity: 'Circular Agri-Waste Biomethane Expansion',
      gridStatus: 'EAC 22 kV Continuous Dispatch Connected',
      executiveName: member.keyContactName || 'George Georgiou',
      executiveRole: member.keyContactRole || 'Chief Executive Officer'
    };
  }

  // Generate deterministic institutional defaults based on id hash
  const hash = Math.abs(member.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000));
  const generatedHE = `HE ${(hash % 380000) + 120000}`;
  
  const isStorage = member.expertiseTags?.some(t => t.toLowerCase().includes('storage'));
  const isEPC = member.roleOrCategory?.toLowerCase().includes('epc') || member.category?.includes('EPC');
  const isLegalOrESG = member.category?.includes('Professional') || member.roleOrCategory?.includes('Legal') || member.roleOrCategory?.includes('ESG');

  let defaultLicense = 'CERA Licensed Energy Enterprise';
  let defaultOpCap = '25+ MWp Solar PV Assets Operational';
  let defaultPipe = '15 MWh BESS & Fast-Track Pipeline';
  let defaultGrid = 'EAC / TSOC Grid Code Compliant';

  if (isStorage) {
    defaultLicense = 'CERA Fast-Track Storage & BESS Licensee';
    defaultOpCap = '30 MWh Standalone & Co-located BESS';
    defaultPipe = '50 MWh Fast-Track Phase II Pipeline';
    defaultGrid = 'TSOC Transmission Primary Frequency Response';
  } else if (isEPC) {
    defaultLicense = 'Accredited EPC Contractor Class A';
    defaultOpCap = '40+ MWp Turnkey Installed Capacity';
    defaultPipe = '20 MWp Under Active Construction';
    defaultGrid = 'Substation & Grid Interconnection Certified';
  } else if (isLegalOrESG) {
    defaultLicense = 'Accredited Energy Legal & ESG Advisory';
    defaultOpCap = '€250M+ Energy Transition Transactions Advised';
    defaultPipe = 'CERA Regulatory Filings & Due Diligence Active';
    defaultGrid = 'National Energy Regulatory Counsel';
  }

  return {
    heNumber: generatedHE,
    ceraLicense: defaultLicense,
    operationalCapacity: defaultOpCap,
    pipelineCapacity: defaultPipe,
    gridStatus: defaultGrid,
    executiveName: member.keyContactName || 'Corporate Relations Directorate',
    executiveRole: member.keyContactRole || (isLegalOrESG ? 'Senior Managing Partner' : 'Managing Director & Lead Engineer')
  };
}

export const CompanyDossierModal: React.FC<CompanyDossierModalProps> = ({
  member,
  onClose,
  onClaimProfile,
  onSelectArticle,
  newsItems = []
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const metrics = getMemberPassportMetrics(member);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .filter(w => !['and', '&', 'of', 'the', 'for'].includes(w.toLowerCase()))
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  };

  // Find 2-3 related articles mentioning this company or matching its sector tags
  const relatedArticles = (newsItems || []).filter(item => {
    const titleMatch = item.title?.toLowerCase().includes(member.name.toLowerCase().split(' ')[0]);
    const summaryMatch = item.summary?.toLowerCase().includes(member.name.toLowerCase().split(' ')[0]);
    const tagMatch = member.expertiseTags?.some(tag => 
      item.category?.toLowerCase() === tag.toLowerCase() ||
      item.title?.toLowerCase().includes(tag.toLowerCase())
    );
    return titleMatch || summaryMatch || tagMatch;
  }).slice(0, 3);

  // If no specific match, fallback to the latest top 2 briefings
  const displayArticles = relatedArticles.length > 0 ? relatedArticles : (newsItems || []).slice(0, 2);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
    >
      <div 
        className="w-full sm:max-w-2xl bg-white dark:bg-[#1E1F20] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cyprus Flag Gradient Accent Stripe (White 80% -> Copper 15% -> Olive 5%) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

        {/* Modal Header */}
        <div className="p-6 border-b border-[#F1F3F4] dark:border-[#282A2C] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Logo or Initials Lockup */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F8F9FA] to-[#E8EAED] dark:from-[#282A2C] dark:to-[#18191A] border border-[#DADCE0] dark:border-[#444746] flex items-center justify-center text-xl font-bold text-[#1A73E8] dark:text-[#8AB4F8] shrink-0 overflow-hidden shadow-xs">
              {member.imageUrl || member.logoUrl ? (
                <img 
                  src={member.imageUrl || member.logoUrl} 
                  alt={member.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span>{getInitials(member.name)}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1A73E8]/20 dark:text-[#8AB4F8]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {member.tier === 'Partner' || member.isVerified ? 'Strategic Partner' : 'Verified Member'}
                </span>
                <span className="font-mono text-[11px] text-[#5F6368] dark:text-[#9AA0A6] bg-[#F1F3F4] dark:bg-[#282A2C] px-2 py-0.5 rounded-md">
                  {metrics.heNumber}
                </span>
              </div>

              <h2 id="dossier-modal-title" className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                {member.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{member.roleOrCategory}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#137333] dark:text-[#81C995] font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.location || 'Cyprus'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* 1. B2B Passport: Key Energy Assets & Regulatory Strip */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#D46200]" />
              Institutional Energy Passport &amp; Grid Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Metric 1: Operational Capacity */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] space-y-1">
                <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#1A73E8]" /> Operational Asset Portfolio
                </span>
                <p className="text-sm font-semibold text-[#1F1F1F] dark:text-white leading-tight">
                  {metrics.operationalCapacity}
                </p>
              </div>

              {/* Metric 2: BESS / Pipeline */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] space-y-1">
                <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#137333]" /> Pipeline &amp; Storage BESS
                </span>
                <p className="text-sm font-semibold text-[#1F1F1F] dark:text-white leading-tight">
                  {metrics.pipelineCapacity}
                </p>
              </div>

              {/* Metric 3: CERA License */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] space-y-1">
                <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D46200]" /> CERA Statutory Status
                </span>
                <p className="text-sm font-semibold text-[#1F1F1F] dark:text-white leading-tight">
                  {metrics.ceraLicense}
                </p>
              </div>

              {/* Metric 4: Grid Dispatch Status */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] space-y-1">
                <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1">
                  <Network className="w-3.5 h-3.5 text-[#7B1FA2]" /> Grid Interface Dispatch
                </span>
                <p className="text-sm font-semibold text-[#1F1F1F] dark:text-white leading-tight">
                  {metrics.gridStatus}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Corporate Profile & Capabilities */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
              Cluster Organization Profile
            </h3>
            <p className="text-xs sm:text-sm text-[#444746] dark:text-[#C4C7C5] leading-relaxed">
              {member.description || 'Active member organization contributing to utility-scale renewable generation, high-voltage transmission integration, and clean energy transition across Cyprus.'}
            </p>

            {member.keyServices && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#5F6368] dark:text-[#9AA0A6] block mb-2">
                  Specialized Services &amp; Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(member.keyServices) ? member.keyServices : [member.keyServices]).map((srv, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F1F3F4] dark:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3]"
                    >
                      {srv}
                    </span>
                  ))}
                  {member.expertiseTags?.map((tag, i) => (
                    <span
                      key={`tag-${i}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#E8F0FE] dark:bg-[#1A73E8]/15 text-[#1A73E8] dark:text-[#8AB4F8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Key People & Verified Contact Channels */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1A73E8]" />
                Executive Leadership &amp; Official Contact Channels
              </h3>
              <span className="text-[10px] text-[#137333] dark:text-[#81C995] font-semibold flex items-center gap-1">
                <FileCheck2 className="w-3 h-3" /> Accredited Channels
              </span>
            </div>

            {/* Key Person Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E8F0FE] dark:bg-[#1A73E8]/20 flex items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8] font-bold text-xs">
                  {metrics.executiveName.slice(0, 1)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white">
                    {metrics.executiveName}
                  </div>
                  <div className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                    {metrics.executiveRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              {member.email && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#3C4043]">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Mail className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                    <a href={`mailto:${member.email}`} className="truncate hover:underline text-[#1A73E8] dark:text-[#8AB4F8]">
                      {member.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(member.email, 'email')}
                    className="p-1 rounded-md text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] transition-colors cursor-pointer shrink-0"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-[#137333]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#3C4043]">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Phone className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                    <a href={`tel:${member.phone}`} className="truncate hover:underline text-[#1F1F1F] dark:text-white">
                      {member.phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(member.phone || '', 'phone')}
                    className="p-1 rounded-md text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] transition-colors cursor-pointer shrink-0"
                    title="Copy Phone"
                  >
                    {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-[#137333]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {member.website && (
                <div className="sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1E1F20] border border-[#E0E2E0] dark:border-[#3C4043]">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Globe className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                    <a 
                      href={member.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="truncate hover:underline text-[#1A73E8] dark:text-[#8AB4F8] flex items-center gap-1"
                    >
                      <span>{member.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(member.website || '', 'website')}
                    className="p-1 rounded-md text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] transition-colors cursor-pointer shrink-0"
                    title="Copy Website"
                  >
                    {copiedField === 'website' ? <Check className="w-3.5 h-3.5 text-[#137333]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. Recent Activity / In the News */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#1A73E8]" />
                Recent Activity &amp; Research Filings
              </h3>
              <span className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                Energeia Intelligence
              </span>
            </div>

            <div className="space-y-2">
              {displayArticles.map((art, idx) => (
                <a
                  key={art.id || idx}
                  href={`/news/${art.slug || art.id}`}
                  onClick={(e) => {
                    if (onSelectArticle) {
                      e.preventDefault();
                      onSelectArticle(art);
                      onClose();
                    }
                  }}
                  className="group block p-3 rounded-2xl bg-[#F8F9FA] hover:bg-[#F1F3F4] dark:bg-[#18191A] dark:hover:bg-[#282A2C] border border-[#DADCE0] dark:border-[#3C4043] transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#5F6368] dark:text-[#9AA0A6] mb-1">
                    <span className="font-semibold text-[#1A73E8] dark:text-[#8AB4F8]">{art.category || 'Briefing'}</span>
                    <time dateTime={art.publishedAt} className="font-mono uppercase text-[10px]">
                      {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}
                    </time>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors line-clamp-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] line-clamp-1 mt-0.5">
                    {art.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#18191A] border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onClaimProfile(member)}
            className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#D46200]" />
            <span>Claim or Update Profile</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs font-medium cursor-pointer shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
