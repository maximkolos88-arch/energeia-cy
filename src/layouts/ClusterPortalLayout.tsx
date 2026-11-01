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
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Sparkles,
  Award,
  Globe
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
  LABS_WORKING_GROUPS,
  LabsWorkingGroup,
  LABS_MEMBERS,
  LabsMemberEntry,
  LabsTierKey,
  LABS_BRIEFINGS,
  LABS_MEMBERSHIP_DECK,
  LabsMembershipTier
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
  const [selectedTier, setSelectedTier] = useState<string>('Strategic Patron (Full Platform + Helios Spotlight)');
  const [selectedDossierMember, setSelectedDossierMember] = useState<DirectoryMember | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Labs Member Showcase Filter
  const [activeLabsTier, setActiveLabsTier] = useState<LabsTierKey>('Strategic Patrons');

  // Expandable Working Groups state
  const [expandedWgId, setExpandedWgId] = useState<string | null>('wg-01');

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

  const openIntakeWithTier = (tierLabel = 'Strategic Patron (Full Platform + Helios Spotlight)') => {
    setSelectedTier(tierLabel);
    setIsIntakeModalOpen(true);
  };

  const handleOpenDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(member);
  };

  const handleClaimProfileFromDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(null);
    openIntakeWithTier('Strategic Patron (Full Platform + Helios Spotlight)');
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

  // Filtered members by active Labs tier
  const filteredMembers = LABS_MEMBERS.filter((m) => m.labsTier === activeLabsTier);

  return (
    <div className="relative w-full bg-[#FFFFFF] dark:bg-[#111214] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40 overflow-hidden font-sans">

      {/* ==================================================================== */}
      {/* AMBIENT ATMOSPHERIC GLOWS (GOOGLE LABS BACKDROP MESH)                */}
      {/* ==================================================================== */}
      <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-[#FFA726]/8 via-[#D46200]/7 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-[-140px] w-[600px] h-[600px] bg-gradient-to-bl from-[#1A73E8]/7 via-[#D46200]/5 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[2200px] left-[-160px] w-[650px] h-[650px] bg-gradient-to-tr from-[#3C4E1C]/8 via-[#D46200]/6 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ==================================================================== */}
      {/* SECTION 1: LABS HERO & AMBIENT CLUSTER MASTHEAD                      */}
      {/* ==================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-14 sm:pt-24 pb-16 sm:pb-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        
        {/* Micro-tag with glowing green pulse */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xs mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] font-semibold">
            Republic of Cyprus · Energy Cluster Hub
          </span>
        </div>

        {/* Confident Google Labs Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.08] max-w-4xl mb-6">
          The Architecture of Cyprus’s Energy Transition
        </h1>

        {/* Refined Subtitle */}
        <p className="text-base sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-10">
          The commercial &amp; institutional engine uniting licensed independent power producers, high-voltage battery storage developers, and network engineers to accelerate the island's energy independence, interconnection, and market modernization.
        </p>

        {/* Google Labs Action Dock (Floating High-Contrast Pill) */}
        <div className="p-2 rounded-full bg-white/90 dark:bg-[#1E1F21]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] inline-flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => openIntakeWithTier('Strategic Patron (Full Platform + Helios Spotlight)')}
            className="px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Apply for Cluster Membership</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#444746] dark:text-[#C4C7C5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Explore Member Directory</span>
          </a>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] px-3.5 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#5F6368] dark:text-[#9AA0A6] border border-black/[0.06] dark:border-white/[0.08] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>50+ Accredited Operators</span>
          </div>
        </div>

        {/* Micro-Features Bottom Strip */}
        <div className="mt-14 pt-8 border-t border-black/[0.07] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white">
              Cluster Surfaces:
            </span>
            <a 
              href={getSurfaceUrl('helios')} 
              onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
              className="inline-flex items-center gap-1 font-medium text-[#D46200] dark:text-[#FFA726] hover:underline"
            >
              <span>Helios 3D Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span>•</span>
            <a 
              href={getSurfaceUrl('research')} 
              onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
              className="inline-flex items-center gap-1 font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
            >
              <span>Research &amp; Filings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span>•</span>
            <a 
              href={getSurfaceUrl('academy')} 
              onClick={(e) => handleSurfaceNavigate(e, 'academy', '/academy')}
              className="inline-flex items-center gap-1 font-medium text-[#7B1FA2] dark:text-[#D7AEFB] hover:underline"
            >
              <span>Energeia Academy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>TSOC Synchronous · Limassol Headquarters</span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: INTERACTIVE BENTO TELEMETRY BOARD (THE LIVE PULSE BENTO) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2 font-semibold">
            Telemetry Board · Live Pulse
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            National Grid Situational Awareness
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            Synchronous transmission telemetry, real-time frequency stabilization, renewable capacity metrics, and HVDC corridor execution tracked across the Cyprus power system.
          </p>
        </div>

        {/* 3-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Span 2 cols on lg): Live Frequency & RES Penetration Gauge */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:border-black/[0.12] dark:hover:border-white/[0.14]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-xs uppercase font-semibold tracking-wider text-[#1F1F1F] dark:text-white">
                    TSOC Transmission Control Telemetry
                  </span>
                </div>
                <span className="font-mono text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                  Synced: {lastSyncTime}
                </span>
              </div>

              {/* Frequency Metric Hero */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
                <div>
                  <div className="text-4xl sm:text-6xl font-medium tracking-tight text-[#1F1F1F] dark:text-white font-mono">
                    {gridFrequency} <span className="text-2xl sm:text-3xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">Hz</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>System Status: Balanced &amp; Synchronized · Load: {systemLoadMw} MW</span>
                  </div>
                </div>

                <a
                  href={getSurfaceUrl('helios')}
                  onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF7E0] dark:bg-[#FFA726]/15 text-[#D46200] dark:text-[#FFA726] text-xs font-semibold hover:bg-[#FEEFC3] transition-colors border border-[#D46200]/20 self-start sm:self-auto cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Open Helios GIS Terminal ↗</span>
                </a>
              </div>

              {/* RES Penetration Gauge Bar */}
              <div className="space-y-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#444746] dark:text-[#C4C7C5]">
                    Current RES Generation Share
                  </span>
                  <span className="font-mono font-semibold text-[#1F1F1F] dark:text-white">
                    19.8% Annual · 70.1% Midday Peak
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#1A73E8] via-[#D46200] to-[#3C4E1C]"
                    style={{ width: '70.1%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                  <span>0% Fossil Baseload</span>
                  <span>NECP 2030 Target: 33% Annual</span>
                  <span>100% Instantaneous</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#5F6368] dark:text-[#9AA0A6] flex items-center justify-between">
              <span>National Dispatch: 132/66 kV Grid Substations</span>
              <span className="font-mono">ENTSO-E Observability</span>
            </div>
          </div>

          {/* Bento Card 2: Solar PV Generation Volume */}
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:border-black/[0.12] dark:hover:border-white/[0.14]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                  Solar PV Fleet
                </span>
                <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono">
                  +22% YoY
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1F1F1F] dark:text-white font-mono mt-2">
                850+ <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">MWp</span>
              </div>

              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white mt-4">
                Installed Solar PV Volume
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 leading-relaxed">
                Over 35,000 distributed rooftop systems and utility ground-mounted parks interconnected island-wide.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono text-[#80868B] dark:text-[#5F6368]">
              Source: CERA / TSOC Registered Assets
            </div>
          </div>

          {/* Bento Card 3: Utility Storage Queue */}
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:border-black/[0.12] dark:hover:border-white/[0.14]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
                  BESS Storage Queue
                </span>
                <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono">
                  Q1 2027
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1F1F1F] dark:text-white font-mono mt-2">
                320 <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">MWh</span>
              </div>

              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white mt-4">
                Fast-Track Storage Pipeline
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 leading-relaxed">
                Centralized storage tenders and co-located commercial batteries under evaluation to alleviate midday curtailment.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono text-[#80868B] dark:text-[#5F6368]">
              Status: Ministry Fast-Track Tender
            </div>
          </div>

          {/* Bento Card 4 (Span 2 cols on lg): Regional Interconnection */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:border-black/[0.12] dark:hover:border-white/[0.14]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                    Interconnection Corridor
                  </span>
                  <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono">
                    PCI 3.10.1
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium tracking-tight text-[#1F1F1F] dark:text-white font-mono">
                  €1.9B / 1,000 MW
                </div>
                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2">
                  Great Sea Interconnector (EuroAsia Subsea HVDC)
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2 max-w-xl leading-relaxed">
                  1,208 km subsea 500 kV HVDC cable connecting Cyprus to Crete and mainland Europe, terminating the island's energy isolation and coupling with European wholesale markets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6] self-start space-y-1.5 shrink-0">
                <div>Route: Crete ↔ Cyprus ↔ Israel</div>
                <div>Contractor: Nexans Subsea Cable</div>
                <div>Operating Voltage: ±525 kV HVDC</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6]">
              <span>Execution Milestone: Seabed Surveying &amp; Cable Manufacturing</span>
              <a 
                href={getSurfaceUrl('helios')} 
                onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex items-center gap-1"
              >
                <span>Inspect Cable Route on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: STRATEGIC WORKING GROUPS (LABS INITIATIVES BENTO)        */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2 font-semibold">
              Cluster Working Groups · Labs Experiments
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Driving Concrete National Energy Policy Reform
            </h2>
            <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
              Modeled after institutional working groups, Energeia clusters convene licensed producers, legal counsel, and grid operators to formulate concrete regulatory filings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openIntakeWithTier('Corporate Member (Licensed EPCs & BESS Developers)')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1E1F21] border border-black/[0.08] dark:border-white/[0.12] text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-black/[0.03] transition-colors cursor-pointer shadow-2xs"
          >
            <span>Join a Working Group</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2x2 Expandable Labs Experiment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {LABS_WORKING_GROUPS.map((wg) => {
            const isExpanded = expandedWgId === wg.id;

            return (
              <div
                key={wg.id}
                className="p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] cursor-pointer group"
                onClick={() => setExpandedWgId(isExpanded ? null : wg.id)}
              >
                <div>
                  {/* Top Bar: Code and Status Chip */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[#1F1F1F] dark:text-white">
                      {wg.code}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${wg.statusColor}`}>
                      {wg.status}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    {wg.title}
                  </h3>

                  <p className="text-xs font-medium text-[#D46200] dark:text-[#FFA726] mt-1.5 uppercase tracking-wide">
                    {wg.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3.5 leading-relaxed">
                    {wg.scope}
                  </p>
                </div>

                {/* Expandable Initiatives Section */}
                <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-medium text-[#1F1F1F] dark:text-white mb-2.5">
                    <span>Active Initiatives &amp; Filings:</span>
                    <span className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-1 font-mono">
                      {isExpanded ? 'Collapse' : 'Expand'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {wg.initiatives.map((init, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.04] text-[#444746] dark:text-[#C4C7C5] border border-black/[0.06] dark:border-white/[0.08]"
                      >
                        {init}
                      </span>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#5F6368] dark:text-[#9AA0A6] space-y-1.5 animate-fade-in">
                      <div><strong>Rapporteur / Committee:</strong> {wg.chair}</div>
                      <div><strong>Consultation Access:</strong> Open to accredited Strategic Patrons &amp; Corporate Members.</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: ACCREDITED MEMBERS SHOWCASE (GOOGLE LABS GALLERY)         */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#137333] dark:text-[#81C995] block mb-2 font-semibold">
              Accredited Cluster Network · Labs Gallery
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Accredited Energy Operators &amp; Strategic Patrons
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
              Connecting sovereign utilities, licensed multi-megawatt IPPs, certified EPC contractors, and institutional capital across Cyprus.
            </p>
          </div>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer flex-shrink-0"
          >
            <span>Search 50+ Accredited Directory</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Tabbed Selector with Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          {(['Strategic Patrons', 'Corporate Operators', 'EPC & Engineering', 'Advisory'] as const).map((tab) => {
            const isActive = activeLabsTier === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveLabsTier(tab)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1A73E8] text-white dark:bg-[#8AB4F8] dark:text-[#062E6F] shadow-2xs font-semibold'
                    : 'bg-white/80 dark:bg-[#18191B]/80 text-[#5F6368] dark:text-[#9AA0A6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.08]'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl rounded-3xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] group"
            >
              <div>
                {/* Top Row: Logo & Cyprus Flag Accent Line */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.08] flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {member.logoSvgUrl ? (
                      <img
                        src={member.logoSvgUrl}
                        alt={member.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
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

                {/* Subtle Cyprus flag accent line */}
                <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C] mb-3" />

                <h3 className="text-base sm:text-lg font-medium text-[#1F1F1F] dark:text-white leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-1">
                  {member.roleOrCategory}
                </p>

                {/* Asset Portfolio Metric */}
                <div className="mt-4 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#D46200] dark:text-[#FFA726] flex-shrink-0" />
                  <span className="truncate">{member.capacityMetric}</span>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.expertiseTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-black/[0.04] dark:bg-white/[0.06] text-[#5F6368] dark:text-[#9AA0A6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inspect Dossier Button */}
              <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => handleOpenDossier(member)}
                  className="w-full py-2.5 px-4 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Inspect Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Labs Callout Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
              Are you an energy operator or EPC contractor in Cyprus?
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1 max-w-2xl">
              Secure your accreditation to access cluster tenders, working groups, high-voltage GIS asset mapping, and direct commercial RFQs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openIntakeWithTier('Corporate Member (Licensed EPCs & BESS Developers)')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer flex-shrink-0"
          >
            <span>Apply for Cluster Accreditation →</span>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: CLUSTER BRIEFINGS & POLICY DESK (EDITORIAL STREAM)        */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#D46200] dark:text-[#FFA726] block mb-2 font-semibold">
              Research &amp; Intelligence · Editorial Stream
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
              Cluster Policy Positions &amp; Technical Whitepapers
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2">
              Official regulatory submissions to CERA, market balancing models, and member commissioning milestones.
            </p>
          </div>
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer flex-shrink-0"
          >
            <span>Explore All Intelligence on Energeia Research ↗</span>
          </a>
        </div>

        {/* 3-Column Bento Deck with 16:9 Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LABS_BRIEFINGS.map((item) => {
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
                    <div className="relative block w-full aspect-[16/9] overflow-hidden rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
                      <img
                        src={getOptimizedImageUrl(item.imageUrl, 800, 450)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-1.5 font-mono">
                    <span>{formattedDate}</span>
                    <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">{item.category}</span>
                  </div>

                  <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="text-[12px] text-[#5F6368] dark:text-[#9AA0A6] flex items-center justify-between mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
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

        {/* Bottom Link */}
        <div className="text-center mt-12">
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs sm:text-sm font-medium text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors border border-black/[0.08] dark:border-white/[0.1] shadow-2xs"
          >
            <span>Explore All Intelligence on Energeia Research ↗</span>
          </a>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: MEMBERSHIP TIERS COMPARISON DECK (TECHISLAND IN LABS)     */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-black/[0.07] dark:border-white/[0.08]">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2 font-semibold">
            Institutional Intake · Membership Tiers
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            Accreditation &amp; Partnership Matrix
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            Modeled after institutional technology clusters, Energeia provides structured tiers granting regulatory working group seats, national GIS terminal mapping, and commercial RFQ routing.
          </p>
        </div>

        {/* 3-Column Google Cloud / Workspace Style Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {LABS_MEMBERSHIP_DECK.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.isPatronHighlight
                  ? 'bg-white/90 dark:bg-[#1A1C1E]/90 backdrop-blur-2xl border-2 border-[#D46200]/40 shadow-[0_4px_30px_rgba(212,98,0,0.12)] relative hover:-translate-y-1'
                  : 'bg-white/80 dark:bg-[#18191B]/80 backdrop-blur-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    tier.isPatronHighlight
                      ? 'text-[#D46200] dark:text-[#FFA726] bg-[#D46200]/10 border-[#D46200]/30'
                      : 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#1A73E8]/10 border-[#1A73E8]/20'
                  }`}>
                    {tier.badge}
                  </span>
                  <span className="font-mono text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                    Accreditation
                  </span>
                </div>

                <h3 className="text-2xl font-medium text-[#1F1F1F] dark:text-white leading-snug">
                  {tier.name}
                </h3>
                <p className="text-xs text-[#D46200] dark:text-[#FFA726] font-medium mt-1 uppercase tracking-wide">
                  {tier.category}
                </p>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                  {tier.targetAudience}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block mb-2 font-mono">
                    Tier Deliverables:
                  </span>
                  {tier.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#444746] dark:text-[#C4C7C5]">
                      <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => openIntakeWithTier(`${tier.name} (Full Platform + Helios Spotlight)`)}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.isPatronHighlight
                      ? 'bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] shadow-xs'
                      : 'bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-[#1F1F1F] dark:text-[#E3E3E3] border border-black/[0.07] dark:border-white/[0.08]'
                  }`}
                >
                  <span>Request Tier Accreditation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: MINIMALIST INSTITUTIONAL FOOTER                           */}
      {/* ==================================================================== */}
      <footer className="w-full bg-white/60 dark:bg-[#0D0E10]/80 backdrop-blur-xl py-16 px-4 sm:px-8 border-t border-black/[0.07] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: Operator Statement & Logo */}
          <div className="pb-10 mb-10 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <EnergeiaLogo
                className="text-[#5F6368] dark:text-[#9AA0A6]"
                descriptor="Cyprus"
                variant="monochrome"
              />
            </div>

            <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono leading-relaxed max-w-xl md:text-right">
              Energeia is the independent energy cluster of Cyprus, operated by M3J2 LTD (HE 438859), Limassol, Cyprus.
            </div>
          </div>

          {/* 4 Clean Vertical Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
            
            {/* Column 1: Cluster */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block">
                Cluster
              </span>
              <ul className="space-y-2 text-[#5F6368] dark:text-[#9AA0A6]">
                <li><a href="/about#manifesto" className="hover:text-[#1A73E8] transition-colors">Manifesto</a></li>
                <li><a href="/about#working-groups" className="hover:text-[#1A73E8] transition-colors">Working Groups</a></li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => openIntakeWithTier('Corporate Member (Licensed EPCs & BESS Developers)')}
                    className="hover:text-[#1A73E8] transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit text-start"
                  >
                    Accreditation Intake
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => openIntakeWithTier('Corporate PR & Sponsored Briefing (Single / Multi-Release)')}
                    className="hover:text-[#1A73E8] transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit text-start"
                  >
                    Press Desk &amp; Releases
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Surfaces */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block">
                Surfaces
              </span>
              <ul className="space-y-2 text-[#5F6368] dark:text-[#9AA0A6]">
                <li>
                  <a 
                    href={getSurfaceUrl('helios')} 
                    onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                    className="hover:text-[#1A73E8] transition-colors"
                  >
                    Helios 3D Terminal
                  </a>
                </li>
                <li>
                  <a 
                    href={getSurfaceUrl('research')} 
                    onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                    className="hover:text-[#1A73E8] transition-colors"
                  >
                    Research &amp; Intelligence
                  </a>
                </li>
                <li>
                  <a 
                    href={getSurfaceUrl('members')} 
                    onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
                    className="hover:text-[#1A73E8] transition-colors"
                  >
                    Member Directory
                  </a>
                </li>
                <li>
                  <a 
                    href={getSurfaceUrl('academy')} 
                    onClick={(e) => handleSurfaceNavigate(e, 'academy', '/academy')}
                    className="hover:text-[#1A73E8] transition-colors"
                  >
                    Energeia Academy
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Governance */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block">
                Governance
              </span>
              <ul className="space-y-2 text-[#5F6368] dark:text-[#9AA0A6]">
                <li><a href="/disclosures" className="hover:text-[#1A73E8] transition-colors">Statutory Disclosures</a></li>
                <li><a href="/terms#ethics" className="hover:text-[#1A73E8] transition-colors">Code of Ethics</a></li>
                <li><a href="/about#governance" className="hover:text-[#1A73E8] transition-colors">Governance &amp; Bylaws</a></li>
                <li><a href="mailto:admin@energeia.cy" className="hover:text-[#1A73E8] transition-colors">Contact Secretariat</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block">
                Legal
              </span>
              <ul className="space-y-2 text-[#5F6368] dark:text-[#9AA0A6]">
                <li><a href="/terms" className="hover:text-[#1A73E8] transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-[#1A73E8] transition-colors">Privacy Policy</a></li>
                <li><a href="/cookies" className="hover:text-[#1A73E8] transition-colors">Cookie Preferences</a></li>
                <li><span className="font-mono text-[11px]">HE 438859 · Limassol</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Utility Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6] gap-4">
            <p>© {new Date().getFullYear()} Energeia Cyprus (M3J2 LTD HE 438859). All rights reserved.</p>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>TSOC Live Telemetry · {gridFrequency} Hz Synced</span>
              </span>
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
