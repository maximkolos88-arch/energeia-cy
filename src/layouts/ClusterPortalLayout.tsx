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
  ChevronUp,
  SlidersHorizontal,
  Flame,
  Sun,
  Wind
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

export type LabsFilterCategory = 'all' | 'generation' | 'storage' | 'grid' | 'policy';

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

  // labs.google Taxonomy Category Filter State
  const [activeCategory, setActiveCategory] = useState<LabsFilterCategory>('all');

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

  // Key Flagship Industry Patrons for Module B / Card 5 (EAC, Bioland, Muskita, GEG)
  const flagshipPatrons = LABS_MEMBERS.filter((m) => 
    ['partner-eac', 'partner-bioland', 'partner-muskita', 'partner-geg'].includes(m.id)
  );

  const categories = [
    { id: 'all', label: 'All Experiments' },
    { id: 'generation', label: 'Generation / PV' },
    { id: 'storage', label: 'Storage / BESS' },
    { id: 'grid', label: 'Grid & Interconnect' },
    { id: 'policy', label: 'Policy / CERA' },
  ] as const;

  // Determine which cards should be displayed based on active category filter
  const showCard1 = activeCategory === 'all' || activeCategory === 'grid';
  const showCard2 = activeCategory === 'all' || activeCategory === 'storage';
  const showCard3 = activeCategory === 'all' || activeCategory === 'grid';
  const showCard4 = activeCategory === 'all' || activeCategory === 'policy';
  const showCard5 = activeCategory === 'all' || activeCategory === 'generation';

  return (
    <div className="relative w-full bg-[#F8F9FA] dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40 overflow-hidden font-sans min-h-screen">

      {/* ==================================================================== */}
      {/* MODULE A: HERO & CATEGORY FILTERING (labs.google TAXONOMY)           */}
      {/* ==================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-8 sm:pb-12">
        
        {/* Header Eyebrow */}
        <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-2 mb-6 text-[#5F6368] dark:text-[#9AA0A6]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>GOOGLE LABS × ENERGEIA // CYPRUS CLEAN TECH HUB</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.08] max-w-4xl mb-6">
          The experimental operating system for Cyprus’s clean energy transition.
        </h1>

        <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-8">
          A living engineering testbed connecting sovereign transmission telemetry, 320 MWh battery queues, European subsea interconnections, and market liberalization sandboxes.
        </p>

        {/* Action Dock */}
        <div className="p-2 rounded-full bg-white dark:bg-[#1E1F20] border border-black/[0.08] dark:border-white/[0.1] shadow-[0_2px_12px_rgba(0,0,0,0.06)] inline-flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
          <button
            type="button"
            onClick={() => openIntakeWithTier('Strategic Patron (Full Platform + Helios Spotlight)')}
            className="px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Apply for Membership</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#444746] dark:text-[#C4C7C5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Directory ↗</span>
          </a>

          <div className="flex items-center gap-2 font-mono text-[11px] px-3.5 py-2 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-[#1F1F1F] dark:text-white border border-black/[0.05] dark:border-white/[0.07] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping opacity-75"></span>
            <span>TSOC Live: {gridFrequency} Hz</span>
          </div>
        </div>

        {/* Top Filter Pills (Active State Swapping) */}
        <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 mr-2 text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Domain:</span>
          </div>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as LabsFilterCategory)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1F1F1F] text-white dark:bg-white dark:text-[#111214] shadow-xs font-semibold'
                    : 'bg-white dark:bg-[#1E1F20] text-[#5F6368] dark:text-[#9AA0A6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </section>

      {/* ==================================================================== */}
      {/* MODULE B: HETEROGENEOUS BENTO GRID (ZERO-FRICTION DISCOVERY)          */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ---------------------------------------------------------------- */}
          {/* CARD 1: TSOC Dynamic Situational Terminal                        */}
          {/* Category: Grid & Interconnect (8-Cols / 2-Rows)                  */}
          {/* ---------------------------------------------------------------- */}
          {showCard1 && (
            <div className={`${
              activeCategory === 'grid' ? 'lg:col-span-8' : 'lg:col-span-8 lg:row-span-2'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Header: Lifecycle Tag + SCADA Observability */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-[#00E5FF]/10 dark:bg-[#00E5FF]/20 text-[#00838F] dark:text-[#00E5FF] border border-[#00E5FF]/30 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    <span>LIVE TELEMETRY // TRY NOW ↗</span>
                  </div>
                  <span className="font-mono text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                    Synced: {lastSyncTime}
                  </span>
                </div>

                {/* Title & Oscillating Frequency Ticker */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                      TSOC Dynamic Situational Terminal
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1">
                      Real-time synchronous frequency control across Cyprus’s 132/66 kV transmission infrastructure.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 self-start sm:self-auto font-mono">
                    <span className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                      {gridFrequency}
                    </span>
                    <span className="text-xl text-[#5F6368] dark:text-[#9AA0A6]">Hz</span>
                  </div>
                </div>

                {/* SVG Real-Time Sine Wave / Sparkline Canvas */}
                <div className="my-6 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>50.00 Hz Baseline (Operating Band: ±0.15 Hz)</span>
                    </span>
                    <span>Total System Load: <strong className="text-[#1F1F1F] dark:text-white">{systemLoadMw} MW</strong></span>
                  </div>

                  <div className="w-full h-14 flex items-center">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 56">
                      <line x1="0" y1="28" x2="500" y2="28" stroke="currentColor" strokeDasharray="3 3" className="text-black/10 dark:text-white/10" strokeWidth="1" />
                      <path
                        d="M0,28 Q35,22 70,30 T140,26 T210,31 T280,25 T350,29 T420,26 T500,28"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="2.5"
                      />
                      <circle cx="485" cy="28" r="4" fill="#00E5FF" className="animate-ping opacity-75" />
                      <circle cx="485" cy="28" r="2.5" fill="#00E5FF" />
                    </svg>
                  </div>
                </div>

                {/* Big Split Metrics */}
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
                      Fast-Track Batch 01
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Live Power Mix Breakdown Bar + Embedded GIS Action */}
              <div className="mt-8 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#5F6368] dark:text-[#9AA0A6]">Current Generation Mix</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FBBC05]"></span> Solar 42% (248 MW)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span> Wind 11% (65 MW)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span> Thermal 47% (279 MW)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/[0.05] dark:bg-white/[0.06] p-0.5 gap-0.5">
                    <div className="h-full rounded-full bg-[#FBBC05] transition-all duration-500" style={{ width: '42%' }} title="Solar PV: 42%" />
                    <div className="h-full rounded-full bg-[#00E5FF] transition-all duration-500" style={{ width: '11%' }} title="Wind: 11%" />
                    <div className="h-full rounded-full bg-[#EA4335] transition-all duration-500" style={{ width: '47%' }} title="Thermal Baseload: 47%" />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                    Transmission Operator: TSOC / EAC High-Voltage SCADA
                  </span>

                  <a
                    href={getSurfaceUrl('helios')}
                    onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                    className="bg-[#1F1F1F] dark:bg-white text-white dark:text-[#111214] text-xs font-mono uppercase px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto font-medium"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#00E5FF] dark:text-[#D46200]" />
                    <span>Launch Fullscreen 3D GIS ↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* CARD 2: Central BESS Queue & Allocation                          */}
          {/* Category: Storage / BESS (4-Cols / 1-Row)                        */}
          {/* ---------------------------------------------------------------- */}
          {showCard2 && (
            <div className={`${
              activeCategory === 'storage' ? 'lg:col-span-12' : 'lg:col-span-4'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FBBC05]/15 dark:bg-[#FBBC05]/20 text-[#B06000] dark:text-[#FBBC05] border border-[#FBBC05]/30 inline-flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>FAST-TRACK TENDER // Q3 2026</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Batch 01</span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  320 <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">MWh</span>
                </div>

                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2 leading-snug">
                  Central BESS Queue &amp; Allocation
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Fast-track battery storage allocation to mitigate midday solar curtailment (&gt;25%) and provide sub-second primary frequency reserves (FFR).
                </p>

                {/* Interactive Battery Charge/Capacity Progress Visualization */}
                <div className="mt-5 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2.5">
                    <span>Allocation Pipeline</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">150 MWh Co-located / 170 MWh Standalone</span>
                  </div>

                  {/* 8-Cell Battery Visual Segment Grid */}
                  <div className="grid grid-cols-8 gap-1.5 h-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                      <div
                        key={cell}
                        className={`rounded-md transition-all ${
                          cell <= 5
                            ? 'bg-amber-400 dark:bg-amber-500 shadow-2xs'
                            : cell <= 7
                            ? 'bg-amber-200 dark:bg-amber-800/60 animate-pulse'
                            : 'bg-black/[0.06] dark:bg-white/[0.08]'
                        }`}
                        title={`Cell Block 0${cell}: ${cell <= 5 ? 'Contracted' : cell <= 7 ? 'Evaluation' : 'Unallocated'}`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#80868B] dark:text-[#6E7377]">
                    <span>Standard: 2-Hour LFP Duration</span>
                    <span>Response: &lt;200ms FFR</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">CERA Decision No. 14/2026</span>
                <a
                  href={getSurfaceUrl('helios')}
                  onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Track BESS Queue</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* CARD 3: Great Sea Interconnector Trench                          */}
          {/* Category: Grid & Interconnect (4-Cols / 1-Row)                   */}
          {/* ---------------------------------------------------------------- */}
          {showCard3 && (
            <div className={`${
              activeCategory === 'grid' ? 'lg:col-span-4' : 'lg:col-span-4'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#4285F4]/15 dark:bg-[#4285F4]/20 text-[#1967D2] dark:text-[#8AB4F8] border border-[#4285F4]/30 inline-flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5" />
                    <span>IN EXECUTION // €1.9B</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">1,000 MW</span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  1,208 <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">km</span>
                </div>

                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2 leading-snug">
                  Great Sea Interconnector Trench
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Subsea ±525 kV HVDC corridor linking Crete to Kofinou, ending the island's energy isolation and coupling Cyprus with the European mainland.
                </p>

                {/* Bathymetric Trench Elevation Chart Snippet */}
                <div className="mt-5 p-3.5 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    <span>Crete (Chania)</span>
                    <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">-3,000m Abyssal Trench</span>
                    <span>Cyprus (Kofinou)</span>
                  </div>

                  {/* Bathymetry SVG profile */}
                  <div className="w-full h-10 relative rounded-lg overflow-hidden bg-gradient-to-b from-[#E8F0FE] to-[#1A73E8]/20 dark:from-[#1A73E8]/20 dark:to-[#0A192F] p-1 flex items-center">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 40">
                      <path
                        d="M0,8 Q50,10 100,32 Q150,38 200,32 Q250,10 300,8"
                        fill="none"
                        stroke="#1A73E8"
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="36" r="3" fill="#D46200" />
                    </svg>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-[#80868B] dark:text-[#6E7377] flex items-center justify-between">
                    <span>Cable: Nexans Subsea</span>
                    <span>Milestone: Cable Fabrication Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">PCI 3.10.1 · EU Priority</span>
                <a
                  href={getSurfaceUrl('helios')}
                  onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Inspect Cable Corridor</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* CARD 4: Day-Ahead Wholesale Market Sandbox                       */}
          {/* Category: Policy / CERA (6-Cols / 1-Row)                         */}
          {/* ---------------------------------------------------------------- */}
          {showCard4 && (
            <div className={`${
              activeCategory === 'policy' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 inline-flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>REGULATORY SANDBOX // CERA DECISION</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Target Model 2026</span>
                </div>

                <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  Day-Ahead Wholesale Market Sandbox
                </div>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Institutional coordination with CERA (PAEK) and TSOC to transition Cyprus from interim bilateral arrangements to the liberalized European Target Model.
                </p>

                {/* Market Clearing Rule Preview Visual */}
                <div className="mt-5 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                    <span>Clearing Architecture</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Merit Order &amp; Imbalance Bands</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#5F6368] dark:text-[#9AA0A6]">Trial Operations:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Stage 2 Live</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#5F6368] dark:text-[#9AA0A6]">Imbalance Tolerance:</span>
                      <span className="font-semibold text-[#1F1F1F] dark:text-white">±15% Transition Protection</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">Decision No. 01/2017</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(LABS_BRIEFINGS[1])}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                >
                  <span>Inspect Regulatory Whitepaper ↗</span>
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* CARD 5: Accredited Commercial Pipeline                           */}
          {/* Category: Generation / PV (6-Cols / 1-Row)                       */}
          {/* ---------------------------------------------------------------- */}
          {showCard5 && (
            <div className={`${
              activeCategory === 'generation' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#34A853]/15 dark:bg-[#34A853]/20 text-[#137333] dark:text-[#81C995] border border-[#34A853]/30 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED ASSETS // 50+ OPERATORS</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Ecosystem Directory</span>
                </div>

                <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  Accredited Commercial Pipeline
                </div>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Verified B2B registry uniting multi-megawatt IPPs, certified Class A EPCs, and battery developers delivering commercial energy transition projects.
                </p>

                {/* Horizontal Logo Strip with Active Cluster Badges */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {flagshipPatrons.map((patron) => (
                    <div
                      key={patron.id}
                      onClick={() => handleOpenDossier(patron)}
                      className="p-3 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05] hover:border-[#1A73E8]/40 transition-colors cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-mono font-bold text-[11px] text-[#1A73E8] dark:text-[#8AB4F8]">
                          {patron.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-xs font-medium text-[#1F1F1F] dark:text-white truncate group-hover:text-[#1A73E8] transition-colors">
                        {patron.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] font-mono text-[#5F6368] dark:text-[#9AA0A6] truncate mt-0.5">
                        {patron.capacityMetric.split('·')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">Verified Registry</span>
                <a
                  href={getSurfaceUrl('members')}
                  onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Explore B2B Directory &amp; Claim Profile ↗</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODULE C: "FROM THE LAB TO THE GRID" (THE labs.google RETROSPECTIVE) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-3xl mb-12">
          <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-1.5 mb-3 text-[#5F6368] dark:text-[#9AA0A6]">
            <span>LIFE BEYOND THE LAB // TRACK RECORD</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3]">
            From Cluster to Grid
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            How experimental regulatory sandboxes and technical working groups graduated into commercial reality across the Cyprus power system.
          </p>
        </div>

        {/* 3 Graduated Retrospective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Retrospective 1 */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  GRADUATED 2023 → 2026
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Solar Scale</span>
              </div>

              <div className="text-2xl font-mono font-medium tracking-[-0.02em] text-[#1F1F1F] dark:text-white">
                5 MWp Pilot → 850+ MWp
              </div>

              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white mt-3 leading-snug">
                Net-Billing Sandbox to National PV Pipeline
              </h3>

              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Started as an experimental regulatory exemption for commercial self-consumption; today it powers over 35,000 distributed installations providing over 70% of peak midday electricity.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] text-[11px] font-mono text-[#80868B] dark:text-[#6E7377]">
              Field Verification: TSOC SCADA Dispatch
            </div>
          </div>

          {/* Retrospective 2 */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  STANDARDIZED // CERA DECISION
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Grid Code</span>
              </div>

              <div className="text-2xl font-mono font-medium tracking-[-0.02em] text-[#1F1F1F] dark:text-white">
                Kofinou Trials → 2026 BESS Code
              </div>

              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white mt-3 leading-snug">
                Substation Inverter Testing to Storage Standard
              </h3>

              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Field trials on fast-frequency response (FFR) and low-voltage ride-through at the Kofinou 132 kV hub directly formed the mandatory technical grid annex for all new 320 MWh utility storage allocations.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] text-[11px] font-mono text-[#80868B] dark:text-[#6E7377]">
              Field Verification: CERA Technical Directive
            </div>
          </div>

          {/* Retrospective 3 */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                  NATIONAL POLICY // EPC STANDARD
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">C&amp;I Real Estate</span>
              </div>

              <div className="text-2xl font-mono font-medium tracking-[-0.02em] text-[#1F1F1F] dark:text-white">
                Behind-the-Meter → Class A Code
              </div>

              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white mt-3 leading-snug">
                Industrial Prosumer Rooftop Mandate
              </h3>

              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Cluster working groups co-developed spatial rooftop criteria with ETEK (Cyprus Technical Chamber). Today, commercial installations over 1,000 m² are codified to integrate on-site solar and micro-storage.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] text-[11px] font-mono text-[#80868B] dark:text-[#6E7377]">
              Field Verification: Ministry Energy Efficiency Standards
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODULE D: MEMBERSHIP TIERS (LABS EDITION)                            */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-3xl mb-12">
          <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-1.5 mb-3 text-[#1A73E8] dark:text-[#8AB4F8]">
            <span>ACCREDITATION MATRIX // GOOGLE CLOUD STYLE</span>
          </div>
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
                  : 'bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1'
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
                  <span>Apply for Cluster Accreditation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODULE E: MINIMALIST INSTITUTIONAL FOOTER                            */}
      {/* ==================================================================== */}
      <footer className="w-full bg-[#F1F3F4] dark:bg-[#18191B] py-16 px-4 sm:px-8 border-t border-black/[0.06] dark:border-white/[0.08]">
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
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
