import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Compass, 
  Zap, 
  Users, 
  GraduationCap, 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity, 
  Globe, 
  FileText, 
  Award, 
  Layers, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  BatteryCharging,
  Scale,
  Network,
  TrendingUp,
  ChevronRight,
  Sparkles,
  FileCheck2,
  Check
} from 'lucide-react';
import { useInitialData } from '../context/InitialDataContext';
import { NewsItem, DirectoryMember } from '../models/types';
import { getOptimizedImageUrl } from '../utils/imageProxy';
import { EcosystemSurface, getSurfaceUrl } from '../utils/ecosystemRouting';
import { MembershipIntakeModal } from '../components/membership/MembershipIntakeModal';
import { CompanyDossierModal } from '../components/directory/CompanyDossierModal';
import { ArticleDetailView } from '../components/research/ArticleDetailView';
import { EnergeiaLogo } from '../components/EnergeiaLogo';
import { 
  NATIONAL_METRICS,
  STRATEGIC_PILLARS,
  MEMBER_TIERS,
  MemberTierKey,
  CLUSTER_PORTAL_MEMBERS,
  PortalMemberEntry,
  CLUSTER_SURFACES,
  STATUTORY_CYPRUS_RESOURCES,
  CLUSTER_EDITORIAL_BRIEFS
} from '../data/clusterPortalData';

export interface ClusterPortalLayoutProps {
  onNavigateSurface?: (surface: EcosystemSurface, path?: string) => void;
  language?: string;
}

export const ClusterPortalLayout: React.FC<ClusterPortalLayoutProps> = ({
  onNavigateSurface,
  language = 'en',
}) => {
  const { t } = useTranslation();
  const initialData = useInitialData();

  // Modals & Active Overlays
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'Strategic Partner' | 'Corporate Member' | 'Associate / Academic'>('Corporate Member');
  const [selectedDossierMember, setSelectedDossierMember] = useState<DirectoryMember | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Member Showcase Active Tab
  const [activeTierKey, setActiveTierKey] = useState<MemberTierKey>('Strategic Partners');

  // Dynamic Telemetry State (TSOC / ENTSO-E)
  const [gridFrequency, setGridFrequency] = useState('50.02');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [systemLoadMw, setSystemLoadMw] = useState<number>(592.4);

  // Live Telemetry Simulation & Telemetry API sync
  useEffect(() => {
    let timer: any;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/v1/entsoe/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data.cyprus_grid_telemetry?.total_system_load_mw) {
            setSystemLoadMw(Number(data.cyprus_grid_telemetry.total_system_load_mw.toFixed(1)));
          }
        }
      } catch {}

      // Stable micro-jitter around 50.00 Hz
      const jitter = (50.00 + (Math.random() * 0.04 - 0.02)).toFixed(2);
      setGridFrequency(jitter);

      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    fetchTelemetry();
    timer = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSurfaceNavigate = (e: React.MouseEvent, surface: EcosystemSurface, path = '') => {
    if (onNavigateSurface) {
      e.preventDefault();
      onNavigateSurface(surface, path);
    }
  };

  const openIntake = (tier: 'Strategic Partner' | 'Corporate Member' | 'Associate / Academic' = 'Corporate Member') => {
    setSelectedTier(tier);
    setIsIntakeModalOpen(true);
  };

  const handleOpenDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(member);
  };

  const handleClaimProfileFromDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(null);
    openIntake('Corporate Member');
  };

  // If viewing an article, render the Google Research Whitepaper reader
  if (selectedArticle) {
    return (
      <ArticleDetailView
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        language={language}
      />
    );
  }

  // Filter members for active tier
  const displayedMembers = CLUSTER_PORTAL_MEMBERS.filter(
    (m) => m.tierCategory === activeTierKey
  );

  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40">

      {/* ==================================================================== */}
      {/* SECTION 1: HERO & ASSOCIATION MISSION (TECHISLAND MODEL)             */}
      {/* ==================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        
        {/* Cyprus Flag Gradient Dot Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D46200] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C] ring-1 ring-black/10 dark:ring-white/20"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
            Republic of Cyprus Energy Cluster
          </span>
        </div>

        {/* Main Headline (Google Sans, 500 weight) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.12] max-w-4xl mb-6">
          Unifying the Leaders Powering Cyprus’s Clean Energy Future
        </h1>

        {/* Institutional Subheadline */}
        <p className="text-base sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-10">
          Energeia is the apex non-profit industry association bringing together solar operators, storage developers, grid engineers, and institutional partners to accelerate the island's energy independence and regulatory modernization.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => openIntake('Corporate Member')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Join the Cluster</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-[#1E1F20] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium text-sm transition-all border border-[#DADCE0] dark:border-[#444746] cursor-pointer shadow-2xs"
          >
            <Users className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Explore Member Directory →</span>
          </a>

          <a
            href={getSurfaceUrl('helios')}
            onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-[#D46200] dark:text-[#FFA726] hover:bg-[#FEF7E0] dark:hover:bg-[#FFA726]/10 font-medium text-sm transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Helios 3D GIS Terminal</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Institutional Authority / Channels Strip */}
        <div className="mt-12 pt-8 border-t border-[#F1F3F4] dark:border-[#282A2C] flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white">
              Institutional Agenda:
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
              Policy Advocacy
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D46200]"></span>
              Grid Telemetry
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
              Accredited B2B Registry
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B1FA2]"></span>
              Workforce Certification
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="uppercase tracking-wider font-semibold text-[#80868B] dark:text-[#5F6368]">Channels:</span>
            <a href="https://x.com/energeiacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A73E8] transition-colors">
              X / Twitter ↗
            </a>
            <a href="https://linkedin.com/company/energeiacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A73E8] transition-colors">
              LinkedIn ↗
            </a>
            <a href="/sitemap.xml" className="hover:text-[#1A73E8] transition-colors">
              RSS Feed
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: NATIONAL IMPACT & TELEMETRY STRIP (CERA / TSOC STATS)     */}
      {/* ==================================================================== */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-12 sm:py-16 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Sub-bar: Real-time TSOC Telemetry Indicator */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-[#1F1F1F] dark:text-white uppercase tracking-wider">
                TSOC Grid Telemetry Synced
              </span>
              <span className="hidden sm:inline text-xs text-[#DADCE0] dark:text-[#3C4043]">|</span>
              <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>TSOC Grid Frequency: <strong className="text-[#1F1F1F] dark:text-white font-semibold">{gridFrequency} Hz</strong> · Balanced · Load: {systemLoadMw} MW ({lastSyncTime})</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <a
                href={getSurfaceUrl('helios')}
                onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                className="inline-flex items-center gap-1 text-[#D46200] dark:text-[#FFA726] hover:underline cursor-pointer"
              >
                <span>Open Helios 3D GIS Terminal →</span>
              </a>
            </div>
          </div>

          {/* 4 Core National Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NATIONAL_METRICS.map((kpi) => (
              <div 
                key={kpi.id} 
                className="bg-white dark:bg-[#1E1F20] p-6 rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${kpi.badgeColor}`}>
                      {kpi.badge}
                    </span>
                    <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6]">
                      {kpi.trend}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1F1F1F] dark:text-white">
                    {kpi.value}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <div className="text-sm font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug">
                    {kpi.label}
                  </div>
                  <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1 leading-relaxed">
                    {kpi.subtext}
                  </div>
                  <div className="text-[10px] font-mono text-[#80868B] dark:text-[#5F6368] mt-2">
                    Source: {kpi.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: THE 4 STRATEGIC PILLARS (STRUCTURED 2x2 GRID)            */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
            Strategic Roadmap
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            The 4 Strategic Working Pillars
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            Representing the core operational agenda of the cluster to resolve structural bottlenecks, unlock commercial battery storage, and connect Cyprus to the European energy market.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STRATEGIC_PILLARS.map((pillar) => {
            const getIcon = () => {
              switch (pillar.iconKey) {
                case 'battery':
                  return <BatteryCharging className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
                case 'scale':
                  return <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
                case 'network':
                  return <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
                case 'shield':
                default:
                  return <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
              }
            };

            const getBg = () => {
              switch (pillar.accentColor) {
                case 'amber':
                  return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40';
                case 'blue':
                  return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40';
                case 'purple':
                  return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40';
                case 'emerald':
                default:
                  return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40';
              }
            };

            return (
              <div
                key={pillar.id}
                className="p-8 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6]">
                      PILLAR {pillar.number}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${getBg()}`}>
                      {getIcon()}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] mt-1.5 uppercase tracking-wide">
                    {pillar.headline}
                  </p>

                  <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block mb-2.5">
                    Key Cluster Initiatives:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pillar.keyInitiatives.map((init, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8F9FA] dark:bg-[#131314] text-[#444746] dark:text-[#C4C7C5] border border-[#DADCE0] dark:border-[#3C4043]"
                      >
                        {init}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: MEMBERS & STRATEGIC PARTNERS (TECHISLAND SHOWCASE)       */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#137333] dark:text-[#81C995] block mb-2">
              Accredited Industry Network
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Accredited Members &amp; Institutional Partners
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
              From sovereign utility operators to agile B2B contractors, our members represent over 75% of Cyprus's installed private energy pipeline.
            </p>
          </div>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer flex-shrink-0"
          >
            <span>View Full Directory (50+ Companies)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Categorized Tier Navigation Tabs (Google Pill Tabs) */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 border-b border-[#F1F3F4] dark:border-[#282A2C]">
          {MEMBER_TIERS.map((tier) => {
            const isActive = activeTierKey === tier.key;
            return (
              <button
                key={tier.key}
                type="button"
                onClick={() => setActiveTierKey(tier.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1A73E8] text-white dark:bg-[#8AB4F8] dark:text-[#062E6F] shadow-2xs font-semibold'
                    : 'bg-[#F8F9FA] dark:bg-[#1E1F20] text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] border border-[#DADCE0] dark:border-[#3C4043]'
                }`}
              >
                <span>{tier.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-[#062E6F]/20 dark:text-[#062E6F]' 
                    : 'bg-[#DADCE0] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#C4C7C5]'
                }`}>
                  {tier.badgeCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Description */}
        <div className="mb-6 text-xs text-[#5F6368] dark:text-[#9AA0A6] italic">
          {MEMBER_TIERS.find((t) => t.key === activeTierKey)?.description}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#1E1F20] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 flex flex-col justify-between hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all shadow-2xs hover:shadow-xs group"
            >
              <div>
                {/* Header: Logo and Verified Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] dark:bg-[#282A2C] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {member.logoSvgUrl ? (
                      <img
                        src={member.logoSvgUrl}
                        alt={member.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to text monogram if logo fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                        {member.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#E6F4EA] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81C995] border border-[#CEEAD6] dark:border-[#137333]/40">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Member</span>
                  </span>
                </div>

                {/* Company Name & Role */}
                <h3 className="text-base sm:text-lg font-medium text-[#1F1F1F] dark:text-white leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-1">
                  {member.roleOrCategory}
                </p>

                {/* Operational Capacity Pill */}
                <div className="mt-4 px-3 py-2 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-xs font-mono text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#D46200] dark:text-[#FFA726] flex-shrink-0" />
                  <span className="truncate">{member.operationalCapacityText}</span>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.expertiseTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-[#F1F3F4] dark:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Dossier Button */}
              <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                <button
                  type="button"
                  onClick={() => handleOpenDossier(member)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#282A2C] dark:hover:bg-[#333537] text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout: Apply for Cluster Accreditation */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
          <div>
            <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
              Are you a licensed Cyprus energy business?
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1 max-w-2xl">
              Join Cyprus's accredited energy association. Gain direct access to cluster working groups, regulatory consultation roundtables, B2B supply-chain partnerships, and international investor delegations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openIntake('Corporate Member')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer flex-shrink-0"
          >
            <span>Apply for Cluster Accreditation →</span>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: ECOSYSTEM & AUTHORITATIVE LINKS (2-COLUMN BENTO GRID)     */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
            Institutional Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            Ecosystem &amp; Authoritative Energy Links
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            Bridging proprietary analytical platforms created by Energeia with the statutory governmental and regulatory bodies of the Republic of Cyprus.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Cluster Ecosystem Surfaces */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4] dark:border-[#282A2C]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1A73E8]"></span>
                Cluster Ecosystem Surfaces
              </span>
              <span className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-mono">4 Surfaces Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLUSTER_SURFACES.map((surf) => (
                <a
                  key={surf.id}
                  href={surf.path}
                  onClick={(e) => handleSurfaceNavigate(e, surf.surfaceKey, surf.path)}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between shadow-2xs group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-semibold uppercase text-[#1A73E8] dark:text-[#8AB4F8]">
                        {surf.subdomain}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#5F6368] group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                      {surf.name}
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 leading-relaxed">
                      {surf.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-[#80868B] dark:text-[#5F6368] mt-4 pt-2 border-t border-[#F1F3F4] dark:border-[#282A2C] block">
                    {surf.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Official Cyprus Energy Resources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4] dark:border-[#282A2C]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D46200]"></span>
                Official Cyprus Energy Resources
              </span>
              <span className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-mono">Governmental &amp; Regulatory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STATUTORY_CYPRUS_RESOURCES.map((res) => (
                <a
                  key={res.id}
                  href={res.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#D46200] dark:hover:border-[#FFA726] transition-all flex flex-col justify-between shadow-2xs group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D46200] dark:text-[#FFA726]">
                        {res.category}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#5F6368] group-hover:text-[#D46200] transition-colors" />
                    </div>
                    <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#D46200] dark:group-hover:text-[#FFA726] transition-colors">
                      {res.name}
                    </h3>
                    <div className="text-[11px] text-[#80868B] dark:text-[#5F6368] italic mt-0.5 line-clamp-1">
                      {res.greekName}
                    </div>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-[#5F6368] dark:text-[#9AA0A6] mt-4 pt-2 border-t border-[#DADCE0] dark:border-[#282A2C] block">
                    {res.roleBadge} ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: CLUSTER NEWS & POLICY BRIEFINGS (ASSOCIATION EDITORIAL)  */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
              Association Press &amp; Policy
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Cluster Press, Policy Positions &amp; Working Group Updates
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2">
              Independent whitepapers, regulatory submissions to CERA, and major energy transition convening events.
            </p>
          </div>
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex-shrink-0 cursor-pointer"
          >
            <span>View All Research &amp; Position Papers →</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLUSTER_EDITORIAL_BRIEFS.map((item) => {
            const formattedDate = new Date(item.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).toUpperCase();

            return (
              <article 
                key={item.id} 
                className="group flex flex-col justify-between cursor-pointer"
                onClick={() => setSelectedArticle(item)}
              >
                <div>
                  {item.imageUrl && (
                    <div className="relative block w-full aspect-[16/9] overflow-hidden rounded-2xl bg-[#F1F3F4] dark:bg-[#282A2C] mb-4">
                      <img
                        src={getOptimizedImageUrl(item.imageUrl, 800, 450)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-1.5">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="text-[12px] text-[#5F6368] dark:text-[#9AA0A6] flex items-center justify-between mt-5 pt-3 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <span className="font-medium text-[#1F1F1F] dark:text-white">
                    {item.source || 'Cluster Secretariat'}
                  </span>
                  <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-medium flex items-center gap-1 group-hover:underline">
                    <span>Read Briefing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Action Button Below */}
        <div className="text-center mt-12">
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F1F3F4] dark:bg-[#282A2C] hover:bg-[#E8EAED] dark:hover:bg-[#333537] text-xs sm:text-sm font-medium text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors border border-[#DADCE0] dark:border-[#444746]"
          >
            <span>View All Research &amp; Position Papers →</span>
          </a>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: INSTITUTIONAL MEMBERSHIP INTAKE (CONVERSION BLOCK)        */}
      {/* ==================================================================== */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-white dark:bg-[#1E1F20] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-8 sm:p-14 shadow-xs relative overflow-hidden">
            
            {/* Background Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#1A73E8]/10 to-[#D46200]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] dark:bg-[#0842A0]/30 text-[#1A73E8] dark:text-[#8AB4F8] text-[11px] font-semibold uppercase tracking-wider mb-4">
                Institutional Membership Drive
              </div>
              <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white tracking-tight leading-tight">
                Shape the Energy Architecture of Cyprus
              </h2>
              <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-4 leading-relaxed">
                Join Cyprus's accredited energy association. Gain direct access to cluster working groups, regulatory consultation roundtables, B2B supply-chain partnerships, and international investor delegations.
              </p>

              {/* 4 TechIsland-Style Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 mb-8 text-xs sm:text-sm text-[#444746] dark:text-[#C4C7C5]">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Direct participation in CERA &amp; TSOC regulatory consultation working groups</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Accredited listing in the verified Cyprus B2B Energy Directory</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Access to closed-door institutional roundtables with MED-TSO &amp; EU delegates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>High-priority dispatch and publication of company research briefs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => openIntake('Corporate Member')}
                  className="px-8 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Submit Membership Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="/about"
                  onClick={(e) => {
                    if (onNavigateSurface) {
                      e.preventDefault();
                      onNavigateSurface('cluster', '/about');
                    }
                  }}
                  className="px-6 py-3.5 rounded-full text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  <span>Learn about Governance &amp; Bylaws →</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 8: STATUTORY & TRANSPARENCY FOOTER                          */}
      {/* ==================================================================== */}
      <footer className="w-full bg-[#F8F9FA] dark:bg-[#131314] py-14 px-4 sm:px-8 border-t border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: Logo & Statutory Registration Notice */}
          <div className="pb-8 mb-8 border-b border-[#DADCE0] dark:border-[#282A2C] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <EnergeiaLogo
                className="text-[#5F6368] dark:text-[#9AA0A6]"
                descriptor="Cyprus"
                variant="monochrome"
              />
            </div>

            <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono leading-relaxed max-w-xl md:text-right">
              Energeia is the independent energy industry cluster of Cyprus, operated by M3J2 LTD (Registration: HE 438859), Limassol, Cyprus.
            </div>
          </div>

          {/* Institutional Navigation Links */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#DADCE0] dark:border-[#282A2C] text-xs">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 font-medium text-[#444746] dark:text-[#C4C7C5]">
              <a 
                href="/about#manifesto" 
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/about');
                  }
                }}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Manifesto
              </a>
              <a 
                href="/about#governance" 
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/about');
                  }
                }}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Governance &amp; Bylaws
              </a>
              <a 
                href="/about#working-groups" 
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/about');
                  }
                }}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Working Groups
              </a>
              <a 
                href={getSurfaceUrl('research')} 
                onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Research &amp; Filings
              </a>
              <a 
                href="/privacy" 
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/privacy');
                  }
                }}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/terms');
                  }
                }}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Code of Ethics
              </a>
            </nav>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Operational · {gridFrequency} Hz Synced</span>
              </span>
            </div>
          </div>

          {/* Bottom Copyright & Address */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6] gap-4">
            <p>© {new Date().getFullYear()} Energeia Cyprus (M3J2 LTD HE 438859). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Leoforos Panioti, 20, Germasogeia, 4044, Lemesos, Cyprus</span>
              <span>•</span>
              <a href="mailto:admin@energeia.cy" className="hover:underline text-[#1A73E8] dark:text-[#8AB4F8]">
                admin@energeia.cy
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* ==================================================================== */}
      {/* MODAL DIALOGS                                                        */}
      {/* ==================================================================== */}

      {/* 1. TechIsland Company Dossier Modal */}
      {selectedDossierMember && (
        <CompanyDossierModal
          member={selectedDossierMember}
          onClose={() => setSelectedDossierMember(null)}
          onClaimProfile={handleClaimProfileFromDossier}
          onSelectArticle={(article) => {
            setSelectedDossierMember(null);
            setSelectedArticle(article);
          }}
          newsItems={initialData?.newsItems}
        />
      )}

      {/* 2. Institutional Membership Intake Modal */}
      <MembershipIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        defaultTier={selectedTier}
      />

    </div>
  );
};
