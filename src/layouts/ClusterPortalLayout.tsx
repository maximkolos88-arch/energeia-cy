import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Compass, 
  Zap, 
  Users, 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText, 
  Award, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  BatteryCharging,
  Scale,
  Network,
  TrendingUp,
  Check,
  Briefcase,
  Megaphone,
  MapPin,
  FileCheck2,
  Send,
  Star,
  Layers,
  ChevronRight
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
  COMMERCIAL_TIERS,
  CommercialTier,
  COMMERCIAL_SERVICES,
  FEATURED_PARTNERS,
  PortalMemberEntry,
  CommercialTierKey,
  COMMERCIAL_PARTNER_BRIEFS
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
  const [selectedTier, setSelectedTier] = useState<string>('Strategic Energy Partner (Full Platform + Helios Spotlight)');
  const [selectedDossierMember, setSelectedDossierMember] = useState<DirectoryMember | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Partner Directory Tab Filter
  const [activePartnerFilter, setActivePartnerFilter] = useState<'All' | CommercialTierKey>('All');

  // Dynamic Telemetry State (TSOC / ENTSO-E)
  const [gridFrequency, setGridFrequency] = useState('50.02');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [systemLoadMw, setSystemLoadMw] = useState<number>(592.4);

  // Live Telemetry Simulation & Sync
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

  const openIntakeWithTier = (tierLabel = 'Strategic Energy Partner (Full Platform + Helios Spotlight)') => {
    setSelectedTier(tierLabel);
    setIsIntakeModalOpen(true);
  };

  const handleOpenDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(member);
  };

  const handleClaimProfileFromDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(null);
    openIntakeWithTier('Strategic Energy Partner (Full Platform + Helios Spotlight)');
  };

  // If viewing a sponsored briefing, render the Google Research Whitepaper reader
  if (selectedArticle) {
    return (
      <ArticleDetailView
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        language={language}
      />
    );
  }

  // Filtered partners list
  const filteredPartners = activePartnerFilter === 'All'
    ? FEATURED_PARTNERS
    : FEATURED_PARTNERS.filter((p) => p.tierCategory === activePartnerFilter);

  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40">

      {/* ==================================================================== */}
      {/* SECTION 1: HERO & COMMERCIAL POSITIONING                             */}
      {/* ==================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        
        {/* Cyprus Flag Gradient Dot Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D46200] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C] ring-1 ring-black/10 dark:ring-white/20"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
            Cyprus Clean Energy Business Portal &amp; B2B Intelligence Network
          </span>
        </div>

        {/* Commercial Headline (Google Sans, font-weight 500) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.12] max-w-4xl mb-6">
          Cyprus Energy Market Platform &amp; Corporate Registry
        </h1>

        {/* Commercial Subtitle / Value Proposition */}
        <p className="text-base sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-10">
          The premier commercial gateway connecting licensed energy producers, EPC contractors, storage developers, and institutional capital across the Republic of Cyprus. Showcase your generation pipeline, establish regulatory authority, and connect with commercial off-takers.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => openIntakeWithTier('Strategic Energy Partner (Full Platform + Helios Spotlight)')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Request Media Kit &amp; Partner Tiers</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-[#1E1F20] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium text-sm transition-all border border-[#DADCE0] dark:border-[#444746] cursor-pointer shadow-2xs"
          >
            <Users className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Explore Verified Directory →</span>
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

        {/* Commercial Deliverables Strip */}
        <div className="mt-12 pt-8 border-t border-[#F1F3F4] dark:border-[#282A2C] flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white">
              Commercial Deliverables:
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
              Verified Corporate Dossiers
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D46200]"></span>
              Helios 3D Asset Mapping
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
              Direct Inbound RFQs
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B1FA2]"></span>
              Corporate PR Desk
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
      {/* SECTION 2: NATIONAL GRID TELEMETRY BAR                               */}
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
                Live Grid Telemetry Powered by Helios GIS
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
                <span>Explore 3D Grid Map →</span>
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
      {/* SECTION 3: COMMERCIAL SERVICES BENTO GRID (WHAT PARTNERS PAY FOR)   */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
            Commercial Offerings
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            Commercial B2B Energy Services &amp; Placement Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            High-impact corporate exposure, targeted lead generation, and interactive GIS terminal sponsorship built specifically for the Mediterranean energy market.
          </p>
        </div>

        {/* 4 Bento Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {COMMERCIAL_SERVICES.map((srv) => {
            const getIcon = () => {
              switch (srv.iconKey) {
                case 'dossier':
                  return <FileCheck2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
                case 'spatial':
                  return <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
                case 'pr':
                  return <Megaphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
                case 'rfq':
                default:
                  return <Send className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
              }
            };

            const getBg = () => {
              switch (srv.accentColor) {
                case 'blue':
                  return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40';
                case 'amber':
                  return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40';
                case 'purple':
                  return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40';
                case 'emerald':
                default:
                  return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40';
              }
            };

            return (
              <div
                key={srv.id}
                className="p-8 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6]">
                      {srv.badge}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${getBg()} group-hover:scale-105 transition-transform`}>
                      {getIcon()}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] mt-1.5 uppercase tracking-wide">
                    {srv.headline}
                  </p>

                  <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block mb-2.5">
                    Deliverables &amp; Inclusions:
                  </span>
                  <div className="space-y-1.5">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#444746] dark:text-[#C4C7C5]">
                        <Check className="w-3.5 h-3.5 text-[#137333] dark:text-[#81C995] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: COMMERCIAL PARTNER TIERS (THE MONETIZATION MATRIX)       */}
      {/* ==================================================================== */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#137333] dark:text-[#81C995] block mb-2">
              Partnership Matrix
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Commercial Partner Tiers &amp; Rate Card Packages
            </h2>
            <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
              Select the corporate placement tier tailored to your generation capacity and commercial growth targets. All packages include verified corporate standing and direct business inquiry routing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {COMMERCIAL_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  tier.isPopular
                    ? 'bg-white dark:bg-[#1E1F20] border-2 border-[#1A73E8] dark:border-[#8AB4F8] shadow-md relative'
                    : 'bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badge & Tier Label */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                    <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                      {tier.billingFrequency}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                    {tier.name}
                  </h3>

                  <div className="text-lg sm:text-xl font-semibold text-[#1A73E8] dark:text-[#8AB4F8] mt-2 font-mono">
                    {tier.priceLabel}
                  </div>

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                    {tier.subtitle}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                    <strong className="text-[#1F1F1F] dark:text-white block mb-0.5">Target Counterparty:</strong>
                    {tier.targetAudience}
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="mt-6 pt-5 border-t border-[#F1F3F4] dark:border-[#282A2C] space-y-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block mb-2">
                      Package Deliverables:
                    </span>
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#444746] dark:text-[#C4C7C5]">
                        <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier CTA */}
                <div className="mt-8 pt-5 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <button
                    type="button"
                    onClick={() => openIntakeWithTier(`${tier.name} (Commercial Rate Card)`)}
                    className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      tier.isPopular
                        ? 'bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] shadow-xs'
                        : 'bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#282A2C] dark:hover:bg-[#333537] text-[#1F1F1F] dark:text-[#E3E3E3] border border-[#DADCE0] dark:border-[#444746]'
                    }`}
                  >
                    <span>Select Tier &amp; Request Media Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: VERIFIED CORPORATE PARTNERS SHOWCASE                     */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
              Corporate Directory
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Verified Corporate Partners &amp; Infrastructure Leaders
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
              Showcasing accredited operators, turnkey EPC contractors, and storage developers driving Cyprus's energy transition.
            </p>
          </div>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer flex-shrink-0"
          >
            <span>Explore Full 50+ Directory</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 border-b border-[#F1F3F4] dark:border-[#282A2C]">
          {(['All', 'Strategic Partners', 'Certified EPC & Tech', 'Advisory & Services'] as const).map((tab) => {
            const isActive = activePartnerFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePartnerFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1A73E8] text-white dark:bg-[#8AB4F8] dark:text-[#062E6F] shadow-2xs font-semibold'
                    : 'bg-[#F8F9FA] dark:bg-[#1E1F20] text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] border border-[#DADCE0] dark:border-[#3C4043]'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white dark:bg-[#1E1F20] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 flex flex-col justify-between hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all shadow-2xs hover:shadow-xs group"
            >
              <div>
                {/* Logo and Commercial Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] dark:bg-[#282A2C] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {partner.logoSvgUrl ? (
                      <img
                        src={partner.logoSvgUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                        {partner.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#E6F4EA] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81C995] border border-[#CEEAD6] dark:border-[#137333]/40">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{partner.commercialBadge}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-medium text-[#1F1F1F] dark:text-white leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-1">
                  {partner.roleOrCategory}
                </p>

                {/* Operational Capacity Pill */}
                <div className="mt-4 px-3 py-2 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-xs font-mono text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#D46200] dark:text-[#FFA726] flex-shrink-0" />
                  <span className="truncate">{partner.operationalCapacityText}</span>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {partner.expertiseTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-[#F1F3F4] dark:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Corporate Dossier Button */}
              <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                <button
                  type="button"
                  onClick={() => handleOpenDossier(partner)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#282A2C] dark:hover:bg-[#333537] text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Corporate Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Onboarding Banner Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F8F9FA] dark:bg-[#18191A] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
          <div>
            <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
              Want your infrastructure assets and commercial pipeline featured on Energeia?
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1 max-w-2xl">
              Gain verified corporate status, branded GIS map pins, direct inbound commercial RFQs, and guaranteed editorial distribution in front of key Cyprus energy stakeholders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openIntakeWithTier('Strategic Energy Partner (Full Platform + Helios Spotlight)')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer flex-shrink-0"
          >
            <span>Apply for Corporate Onboarding →</span>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: CORPORATE PR DESK (SPONSORED BRIEFINGS)                  */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D46200] dark:text-[#FFA726] block mb-2">
              Corporate PR Desk &amp; Commercial Feed
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Partner Press, Project Spotlights &amp; Corporate Briefings
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2">
              Sponsored insights, asset commissioning announcements, and commercial milestones from accredited partners.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openIntakeWithTier('Corporate PR & Sponsored Briefing (Single / Multi-Release)')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D46200] dark:text-[#FFA726] hover:underline cursor-pointer"
            >
              <span>Submit Corporate Press Release →</span>
            </button>
            <span className="text-[#DADCE0] dark:text-[#444746]">|</span>
            <a
              href={getSurfaceUrl('research')}
              onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
            >
              <span>Explore Research Feed →</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMMERCIAL_PARTNER_BRIEFS.map((item) => {
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
                      {/* Cyprus Copper Partner Briefing Ribbon */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#D46200] text-white shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Partner Briefing</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-1.5">
                    <span>{formattedDate}</span>
                    <span className="text-[#D46200] dark:text-[#FFA726] font-semibold">{item.category}</span>
                  </div>

                  <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="text-[12px] text-[#5F6368] dark:text-[#9AA0A6] flex items-center justify-between mt-5 pt-3 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <div className="flex items-center gap-2">
                    {item.sponsorLogoUrl && (
                      <div className="w-5 h-5 rounded-full bg-[#F1F3F4] dark:bg-[#282A2C] overflow-hidden p-0.5 border border-[#DADCE0] dark:border-[#444746] flex items-center justify-center">
                        <img src={item.sponsorLogoUrl} alt={item.sponsorName || 'Sponsor'} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className="font-medium text-[#1F1F1F] dark:text-white">
                      {item.sponsorName || item.source}
                    </span>
                  </div>
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
        <div className="text-center mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openIntakeWithTier('Corporate PR & Sponsored Briefing (Single / Multi-Release)')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D46200] hover:bg-[#B85100] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <span>Publish Corporate Release or Whitepaper</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F1F3F4] dark:bg-[#282A2C] hover:bg-[#E8EAED] dark:hover:bg-[#333537] text-xs sm:text-sm font-medium text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors border border-[#DADCE0] dark:border-[#444746]"
          >
            <span>View Full Intelligence Archive →</span>
          </a>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: COMMERCIAL ONBOARDING CONVERSION CONTAINER                */}
      {/* ==================================================================== */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-white dark:bg-[#1E1F20] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-8 sm:p-14 shadow-xs relative overflow-hidden">
            
            {/* Background Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#1A73E8]/10 to-[#D46200]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] dark:bg-[#0842A0]/30 text-[#1A73E8] dark:text-[#8AB4F8] text-[11px] font-semibold uppercase tracking-wider mb-4">
                Corporate Placement &amp; Rate Card
              </div>
              <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white tracking-tight leading-tight">
                Partner With the Cyprus Energy Platform
              </h2>
              <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-4 leading-relaxed">
                Position your organization at the center of the Cyprus clean energy transformation. Access institutional decision-makers, commercial prosumers, and international capital.
              </p>

              {/* 4 Deliverables Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 mb-8 text-xs sm:text-sm text-[#444746] dark:text-[#C4C7C5]">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Verified registry standing &amp; licensed corporate dossier</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Guaranteed press release distribution across Research &amp; Google News</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Interactive branded GIS asset mapping on Helios 3D Terminal</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                  <span>Direct routing of commercial solar, BESS &amp; CPPA procurement leads</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => openIntakeWithTier('Strategic Energy Partner (Full Platform + Helios Spotlight)')}
                  className="px-8 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Request Partner Proposal &amp; Rate Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => openIntakeWithTier('Corporate PR & Sponsored Briefing (Single / Multi-Release)')}
                  className="px-6 py-3.5 rounded-full text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  <span>Download Media Kit Specifications →</span>
                </button>
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
              Energeia is the commercial B2B energy intelligence portal and corporate partner registry of Cyprus, operated by M3J2 LTD (Registration: HE 438859), Limassol, Cyprus.
            </div>
          </div>

          {/* Commercial Navigation Links */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#DADCE0] dark:border-[#282A2C] text-xs">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 font-medium text-[#444746] dark:text-[#C4C7C5]">
              <button
                type="button"
                onClick={() => openIntakeWithTier('Strategic Energy Partner (Full Platform + Helios Spotlight)')}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit"
              >
                Media Kit &amp; Rate Card
              </button>
              <a 
                href={getSurfaceUrl('members')} 
                onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Corporate Registry
              </a>
              <a 
                href={getSurfaceUrl('helios')} 
                onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Helios 3D Terminal
              </a>
              <a 
                href={getSurfaceUrl('research')} 
                onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
              >
                Research &amp; Filings
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
                Terms of Service
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
            </nav>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>TSOC Live Telemetry · {gridFrequency} Hz Synced</span>
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

      {/* 1. Corporate Dossier Modal */}
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

      {/* 2. Commercial Partner Onboarding & Rate Card Inquiry Modal */}
      <MembershipIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        defaultTier={selectedTier}
      />

    </div>
  );
};
