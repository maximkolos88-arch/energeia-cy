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
  Activity,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useInitialData } from '../context/InitialDataContext';
import { NewsItem, DirectoryMember } from '../models/types';
import { EcosystemSurface, getSurfaceUrl } from '../utils/ecosystemRouting';
import { MembershipIntakeModal } from '../components/membership/MembershipIntakeModal';
import { CompanyDossierModal } from '../components/directory/CompanyDossierModal';
import { ArticleDetailView } from '../components/research/ArticleDetailView';
import { EnergeiaLogo } from '../components/EnergeiaLogo';
import { 
  NATIONAL_METRICS,
  LABS_WORKING_GROUPS,
  LABS_MEMBERS,
  LabsMemberEntry,
  LABS_BRIEFINGS,
  LABS_MEMBERSHIP_DECK
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

  // Key Flagship Industry Patrons for Module 4 (EAC, Bioland, Muskita, GEG)
  const flagshipPatrons = LABS_MEMBERS.filter((m) => 
    ['partner-eac', 'partner-bioland', 'partner-muskita', 'partner-geg'].includes(m.id)
  );

  return (
    <div className="relative w-full bg-[#F8F9FA] dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40 overflow-hidden font-sans min-h-screen">

      {/* ==================================================================== */}
      {/* SECTION 1: HERO & FLOATING CONTROL DOCK                              */}
      {/* ==================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-28 pb-14 sm:pb-20">
        
        {/* Micro-tag Technical Chip */}
        <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-1.5 mb-8 text-[#5F6368] dark:text-[#9AA0A6]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>[ CYPRUS ENERGY CLUSTER // v2.6 ]</span>
        </div>

        {/* Bold, Punchy Google Labs Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.08] max-w-4xl mb-8">
          The operating system for<br className="hidden sm:inline" /> Cyprus's clean energy transition.
        </h1>

        {/* Google Labs Floating Action Dock */}
        <div className="rounded-full p-2 bg-white dark:bg-[#1E1F20] border border-black/[0.08] dark:border-white/[0.1] shadow-lg inline-flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => openIntakeWithTier('Strategic Patron (Full Platform + Helios Spotlight)')}
            className="px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Apply for Membership</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#444746] dark:text-[#C4C7C5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Directory ↗</span>
          </a>

          <div className="flex items-center gap-2 font-mono text-[11px] px-4 py-2.5 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-[#1F1F1F] dark:text-white border border-black/[0.05] dark:border-white/[0.07] font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>TSOC Live Grid: {gridFrequency} Hz</span>
          </div>
        </div>

        {/* Subtle Horizontal Ingress Strip */}
        <div className="mt-12 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">
          <div className="flex items-center gap-4">
            <span className="text-[#1F1F1F] dark:text-white font-semibold uppercase">Surfaces:</span>
            <a 
              href={getSurfaceUrl('helios')} 
              onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
              className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors flex items-center gap-1"
            >
              <span>Helios GIS ↗</span>
            </a>
            <span>/</span>
            <a 
              href={getSurfaceUrl('research')} 
              onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
              className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors flex items-center gap-1"
            >
              <span>Research Desk ↗</span>
            </a>
            <span>/</span>
            <a 
              href={getSurfaceUrl('academy')} 
              onClick={(e) => handleSurfaceNavigate(e, 'academy', '/academy')}
              className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors flex items-center gap-1"
            >
              <span>Academy ↗</span>
            </a>
          </div>
          <div>50+ Accredited Energy Operators · Limassol Headquarters</div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: AUTHENTIC GOOGLE LABS BENTO GRID                          */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ---------------------------------------------------------------- */}
          {/* MODULE 1: BIG HERO CARD (8-COLS / 2-ROWS)                       */}
          {/* "Grid Situational Awareness"                                    */}
          {/* ---------------------------------------------------------------- */}
          <div className="lg:col-span-8 lg:row-span-2 bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.05] dark:border-white/[0.06] rounded-[32px] p-8 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div>
              {/* Top: Micro-badge + Sync timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-1.5 text-[#1F1F1F] dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>TELEMETRY // TSOC FEED</span>
                </div>
                <span className="font-mono text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                  Synced: {lastSyncTime}
                </span>
              </div>

              {/* Title & Live Status */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                    Grid Situational Awareness
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1">
                    Synchronous dispatch &amp; real-time frequency stabilization across Cyprus's 132/66 kV network.
                  </p>
                </div>

                {/* Instantaneous Frequency Display */}
                <div className="flex items-baseline gap-2 self-start sm:self-auto font-mono">
                  <span className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                    {gridFrequency}
                  </span>
                  <span className="text-xl text-[#5F6368] dark:text-[#9AA0A6]">Hz</span>
                </div>
              </div>

              {/* Frequency Stability Sparkline */}
              <div className="my-6 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Nominal: 50.00 Hz (Operating Tolerance: ±0.15 Hz)</span>
                  </span>
                  <span>System Load: <strong className="text-[#1F1F1F] dark:text-white">{systemLoadMw} MW</strong></span>
                </div>

                {/* SVG Frequency Sparkline Waveform */}
                <div className="w-full h-12 flex items-center">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 48">
                    <line x1="0" y1="24" x2="400" y2="24" stroke="currentColor" strokeDasharray="3 3" className="text-black/10 dark:text-white/10" strokeWidth="1" />
                    <path
                      d="M0,24 Q30,22 60,25 T120,23 T180,26 T240,22 T300,25 T360,23 T400,24"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="2"
                    />
                    <circle cx="390" cy="24" r="3.5" fill="#1A73E8" className="animate-ping opacity-75" />
                    <circle cx="390" cy="24" r="2.5" fill="#1A73E8" />
                  </svg>
                </div>
              </div>

              {/* Middle: Giant Split Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-6 border-b border-black/[0.05] dark:border-white/[0.06]">
                <div>
                  <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                    850+
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mt-1.5">
                    MWp Installed Solar
                  </div>
                  <div className="text-[11px] text-[#80868B] dark:text-[#6E7377] mt-0.5">
                    +22% YoY · 35,000+ Systems
                  </div>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                    19.8%
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mt-1.5">
                    Annual RES Share
                  </div>
                  <div className="text-[11px] text-[#80868B] dark:text-[#6E7377] mt-0.5">
                    70.1% Midday Peak
                  </div>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                    320
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mt-1.5">
                    MWh BESS Queue
                  </div>
                  <div className="text-[11px] text-[#80868B] dark:text-[#6E7377] mt-0.5">
                    Fast-Track Allocation Q1 2027
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Generation Mix Segment Bar & Helios Ingress Button */}
            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#5F6368] dark:text-[#9AA0A6]">Instantaneous Power Mix</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFA726]"></span> Solar 42%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00BCD4]"></span> Wind 12%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span> Thermal 46%
                    </span>
                  </div>
                </div>

                {/* Horizontal Segment Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/[0.05] dark:bg-white/[0.06] p-0.5 gap-0.5">
                  <div className="h-full rounded-full bg-[#FFA726] transition-all duration-500" style={{ width: '42%' }} title="Solar PV: 42%" />
                  <div className="h-full rounded-full bg-[#00BCD4] transition-all duration-500" style={{ width: '12%' }} title="Wind: 12%" />
                  <div className="h-full rounded-full bg-[#EA4335] transition-all duration-500" style={{ width: '46%' }} title="Thermal Baseload: 46%" />
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                  Source: CERA Registered Assets &amp; TSOC Dispatch System
                </span>

                <a
                  href={getSurfaceUrl('helios')}
                  onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                  className="bg-white dark:bg-black text-[#1F1F1F] dark:text-white border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono uppercase px-4 py-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFA726]" />
                  <span>Launch Helios 3D GIS ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MODULE 2: GREAT SEA INTERCONNECTOR (4-COLS / 1-ROW)              */}
          {/* ---------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.05] dark:border-white/[0.06] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[#1F1F1F] dark:text-white inline-flex items-center gap-1.5">
                  <Network className="w-3 h-3 text-[#1A73E8]" />
                  <span>HVDC // PCI 3.10.1</span>
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">1,000 MW</span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                €1.9B
              </div>

              <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2 leading-snug">
                Great Sea Interconnector
              </h3>

              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                Subsea HVDC corridor linking Crete to Kofinou (1,000 MW capacity), terminating the island's energy isolation and coupling with European wholesale markets.
              </p>

              {/* Depth Indicator Graphic: -3,000m Mediterranean Trench */}
              <div className="mt-5 p-3.5 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                  <span>Sea Level: 0m</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">-3,000m Trench Route</span>
                </div>

                {/* Bathymetry Depth Visual */}
                <div className="w-full h-8 relative rounded-lg overflow-hidden bg-gradient-to-b from-[#E8F0FE] to-[#0D47A1]/20 dark:from-[#0D47A1]/20 dark:to-[#0A192F] p-1 flex items-center">
                  <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#5F6368] dark:text-[#9AA0A6] px-1.5 z-10">
                    <span>Crete (Chania)</span>
                    <span className="font-semibold text-[#1F1F1F] dark:text-white">1,208 km Cable Length</span>
                    <span>Cyprus (Kofinou)</span>
                  </div>
                  {/* Cable path indicator */}
                  <div className="absolute inset-x-2 bottom-1.5 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 rounded-full" />
                </div>

                <div className="mt-2 text-[10px] font-mono text-[#80868B] dark:text-[#6E7377] flex items-center justify-between">
                  <span>Cable: Nexans Subsea</span>
                  <span>Voltage: ±525 kV VSC</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">Seabed Survey Active</span>
              <a
                href={getSurfaceUrl('helios')}
                onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Inspect on Map</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MODULE 3: CERA WHOLESALE REFORM (4-COLS / 1-ROW)                 */}
          {/* ---------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.05] dark:border-white/[0.06] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 inline-flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-[#1A73E8]" />
                  <span>REGULATORY SANDBOX</span>
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">2026 Target</span>
              </div>

              <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                Wholesale Market Reform
              </div>

              <div className="text-xs font-mono text-[#D46200] dark:text-[#FFA726] mt-1 font-semibold uppercase tracking-wider">
                Day-Ahead &amp; Intraday Market Rules 2026
              </div>

              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                Direct engagement with CERA (PAEK) and TSOC to transition Cyprus from interim bilateral arrangements to the liberalized European Target Model with transparent imbalance settlement and corporate PPAs.
              </p>

              {/* Regulatory Milestones */}
              <div className="mt-5 space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-[16px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between">
                  <span className="text-[#5F6368] dark:text-[#9AA0A6]">Market Trial Runs:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Stage 2 Operational</span>
                </div>
                <div className="p-2.5 rounded-[16px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between">
                  <span className="text-[#5F6368] dark:text-[#9AA0A6]">Imbalance Tolerance:</span>
                  <span className="font-semibold text-[#1F1F1F] dark:text-white">±15% Transition Band</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">CERA Decision No. 01/2017</span>
              <button
                type="button"
                onClick={() => setSelectedArticle(LABS_BRIEFINGS[1])}
                className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                <span>Read Briefing</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MODULE 4: ACCREDITED INDUSTRY PATRONS (12-COLS / HORIZONTAL)    */}
          {/* ---------------------------------------------------------------- */}
          <div className="lg:col-span-12 bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.05] dark:border-white/[0.06] rounded-[32px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[#1F1F1F] dark:text-white inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>CLUSTER PATRONS // VERIFIED</span>
                </span>
                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                  Accredited Industry Patrons
                </h3>
              </div>

              <a
                href={getSurfaceUrl('members')}
                onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
                className="text-xs font-mono uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All 50+ Dossiers →</span>
              </a>
            </div>

            {/* 4 Flagship Patrons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flagshipPatrons.map((patron) => (
                <div
                  key={patron.id}
                  onClick={() => handleOpenDossier(patron)}
                  className="rounded-[28px] p-5 bg-[#F8F9FA] dark:bg-[#282A2C] border border-black/[0.05] dark:border-white/[0.06] flex flex-col justify-between hover:border-black/[0.12] dark:hover:border-white/[0.14] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div>
                    {/* Top Monogram / Logo & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-mono font-bold text-xs text-[#1A73E8] dark:text-[#8AB4F8] shadow-2xs group-hover:scale-105 transition-transform">
                        {patron.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E6F4EA] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81C995] border border-[#CEEAD6] dark:border-[#137333]/40">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-[#1F1F1F] dark:text-white leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                      {patron.name}
                    </h4>
                    <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-1">
                      {patron.roleOrCategory}
                    </p>

                    <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.04] dark:border-white/[0.06] text-[11px] font-mono text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-[#D46200] dark:text-[#FFA726] flex-shrink-0" />
                      <span className="truncate">{patron.capacityMetric}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8]">
                    <span>Inspect Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: THE 3 MEMBERSHIP TIERS (GOOGLE CLOUD PRICING STYLE)       */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-black/[0.05] dark:border-white/[0.06]">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
            Accreditation Matrix · Membership
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3]">
            Cluster Accreditation &amp; Partnership
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            Transparent institutional tiers providing regulatory working group seats, national GIS terminal mapping, and commercial RFQ routing.
          </p>
        </div>

        {/* 3 Distinct Rounded Cards (rounded-[32px] p-8) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {LABS_MEMBERSHIP_DECK.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                tier.isPatronHighlight
                  ? 'bg-[#FFFFFF] dark:bg-[#1E1F20] border-2 border-[#D46200]/40 dark:border-[#D46200]/50 shadow-[0_4px_24px_rgba(212,98,0,0.08)] relative hover:-translate-y-1'
                  : 'bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.05] dark:border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
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

                <h3 className="text-2xl font-medium tracking-[-0.02em] text-[#1F1F1F] dark:text-white leading-snug">
                  {tier.name}
                </h3>
                <p className="text-xs text-[#D46200] dark:text-[#FFA726] font-medium mt-1 uppercase tracking-wide">
                  {tier.category}
                </p>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                  {tier.targetAudience}
                </p>

                {/* Deliverables Checklist (3 Key Deliverables) */}
                <div className="mt-6 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white block mb-2 font-mono">
                    Tier Deliverables:
                  </span>
                  {tier.deliverables.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#444746] dark:text-[#C4C7C5]">
                      <Check className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => openIntakeWithTier(`${tier.name} (Full Platform + Helios Spotlight)`)}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.isPatronHighlight
                      ? 'bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] shadow-xs'
                      : 'bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-[#1F1F1F] dark:text-[#E3E3E3] border border-black/[0.06] dark:border-white/[0.08]'
                  }`}
                >
                  <span>Request Accreditation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: MINIMALIST INSTITUTIONAL FOOTER                           */}
      {/* ==================================================================== */}
      <footer className="w-full bg-[#F1F3F4] dark:bg-[#18191B] py-16 px-4 sm:px-8 border-t border-black/[0.05] dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: Operator Statement & Logo */}
          <div className="pb-10 mb-10 border-b border-black/[0.05] dark:border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-black/[0.05] dark:border-white/[0.06] text-xs">
            
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
