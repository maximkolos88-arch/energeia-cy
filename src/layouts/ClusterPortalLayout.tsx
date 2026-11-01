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
  Wind,
  GraduationCap,
  FileText,
  Lock,
  Sparkles
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
  LABS_MEMBERSHIP_DECK,
  LABS_SITE_SPEC
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

  // labs.google Taxonomy Category Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const openIntakeWithTier = (tierCode: 'strategic' | 'corporate' | 'associate' | string = 'strategic') => {
    let label = 'Strategic Patron (Full Platform + Helios Spotlight)';
    if (tierCode === 'corporate' || tierCode.includes('Corporate')) {
      label = 'Corporate Member (Licensed EPCs & BESS Developers)';
    } else if (tierCode === 'associate' || tierCode.includes('Associate')) {
      label = 'Associate Member (Professional Services & Advisory)';
    }
    setSelectedTier(label);
    setIsIntakeModalOpen(true);
  };

  const handleOpenDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(member);
  };

  const handleClaimProfileFromDossier = (member: DirectoryMember) => {
    setSelectedDossierMember(null);
    openIntakeWithTier('strategic');
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

  // Key Flagship Industry Patrons for Member Registry card (EAC, Bioland, Muskita, GEG)
  const flagshipPatrons = LABS_MEMBERS.filter((m) => 
    ['partner-eac', 'partner-bioland', 'partner-muskita', 'partner-geg'].includes(m.id)
  );

  // Filter conditions for the 6 experiments based on activeCategory
  const showHelios = activeCategory === 'all' || activeCategory === 'grid' || activeCategory === 'generation';
  const showBess = activeCategory === 'all' || activeCategory === 'storage';
  const showGsi = activeCategory === 'all' || activeCategory === 'grid';
  const showResearch = activeCategory === 'all' || activeCategory === 'intelligence';
  const showDirectory = activeCategory === 'all' || activeCategory === 'directory' || activeCategory === 'generation';
  const showAcademy = activeCategory === 'all' || activeCategory === 'intelligence';

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

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.08] max-w-4xl mb-6">
          {LABS_SITE_SPEC.site.headline}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-8">
          {LABS_SITE_SPEC.site.description}
        </p>

        {/* Floating Action Dock */}
        <div className="p-2 rounded-full bg-white dark:bg-[#1E1F20] border border-black/[0.08] dark:border-white/[0.1] shadow-[0_2px_12px_rgba(0,0,0,0.06)] inline-flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
          <button
            type="button"
            onClick={() => openIntakeWithTier('strategic')}
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
            <span>Filter Surface:</span>
          </div>
          {LABS_SITE_SPEC.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1F1F1F] text-white dark:bg-white dark:text-[#111214] shadow-xs font-semibold'
                    : 'bg-white dark:bg-[#1E1F20] text-[#5F6368] dark:text-[#9AA0A6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]'
                }`}
                title={cat.description}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </section>

      {/* ==================================================================== */}
      {/* MODULE B: HETEROGENEOUS BENTO GRID (6 SPEC EXPERIMENTS)              */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 1: HELIOS TERMINAL                                    */}
          {/* Category: grid (8-Cols / 2-Rows in 'all', or adaptive)           */}
          {/* ---------------------------------------------------------------- */}
          {showHelios && (
            <div className={`${
              activeCategory === 'grid' || activeCategory === 'all' ? 'lg:col-span-8 lg:row-span-2' : 'lg:col-span-12'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Header: Lifecycle Tag + SCADA Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="font-mono text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-[#00E5FF]/10 dark:bg-[#00E5FF]/20 text-[#00838F] dark:text-[#00E5FF] border border-[#00E5FF]/30 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    <span>LIVE TELEMETRY // TRY NOW ↗</span>
                  </div>
                  <span className="font-mono text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                    Synced: {lastSyncTime} · 132 kV SCADA
                  </span>
                </div>

                {/* Title & Oscillating Frequency Ticker */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                        Helios Terminal
                      </h2>
                      <span className="text-xs font-mono text-[#D46200] dark:text-[#FFA726] bg-[#D46200]/10 px-2 py-0.5 rounded-md font-semibold">
                        3D Geospatial Grid OS
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 max-w-xl">
                      Full-spectrum spatial monitoring across Cyprus: TSOC 132 kV transmission loops, Vasilikos &amp; Dhekelia dispatch, 520+ solar plants, and live grid frequency tracking.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 self-start sm:self-auto font-mono">
                    <span className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                      {gridFrequency}
                    </span>
                    <span className="text-xl text-[#5F6368] dark:text-[#9AA0A6]">Hz</span>
                  </div>
                </div>

                {/* Live Real-Time Sine Wave Sparkline Canvas */}
                <div className="my-6 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>50.00 Hz Synchronous Nominal (Tolerance: ±0.15 Hz)</span>
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
                  <div className="flex flex-wrap items-center gap-2">
                    {['132 kV Grid', 'Substations', 'Frequency 50Hz', 'Curtailment Tracker'].map((t, idx) => (
                      <span key={idx} className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.05] text-[#5F6368] dark:text-[#9AA0A6]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={getSurfaceUrl('research')}
                      onClick={(e) => handleSurfaceNavigate(e, 'research', '/research/docs/telemetry')}
                      className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6] hover:underline"
                    >
                      Inspect API Docs
                    </a>

                    <a
                      href={getSurfaceUrl('helios')}
                      onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
                      className="bg-[#1F1F1F] dark:bg-white text-white dark:text-[#111214] text-xs font-mono uppercase px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer shadow-xs font-medium"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#00E5FF] dark:text-[#D46200]" />
                      <span>Launch Helios 3D GIS ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 2: CENTRAL BESS QUEUE                                 */}
          {/* Category: storage (4-Cols / 1-Row in 'all', or 12-cols)          */}
          {/* ---------------------------------------------------------------- */}
          {showBess && (
            <div className={`${
              activeCategory === 'storage' ? 'lg:col-span-12' : 'lg:col-span-4'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FBBC05]/15 dark:bg-[#FBBC05]/20 text-[#B06000] dark:text-[#FBBC05] border border-[#FBBC05]/30 inline-flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>IN EVALUATION // TENDER ACTIVE</span>
                  </span>
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-semibold">
                    Fast-Track Batch 01
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  320 <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">MWh</span>
                </div>

                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2 leading-snug">
                  Central BESS Queue
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Tracks allocation status for Cyprus's 320 MWh fast-track utility battery storage tenders across central transmission nodes (Kofinou, Vasilikos, and Moni).
                </p>

                {/* Interactive Battery Charge/Capacity Progress Visualization */}
                <div className="mt-5 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2.5">
                    <span>Node Allocation Status</span>
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
                <button
                  type="button"
                  onClick={() => setSelectedArticle(LABS_BRIEFINGS[0])}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                >
                  <span>Inspect Queue Status</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 3: GREAT SEA INTERCONNECTOR                           */}
          {/* Category: grid (4-Cols / 1-Row in 'all', or adaptive)            */}
          {/* ---------------------------------------------------------------- */}
          {showGsi && (
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
                  <span className="text-xs font-mono text-[#1967D2] dark:text-[#8AB4F8] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md font-semibold">
                    PCI 3.10.1
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  1,208 <span className="text-2xl font-sans text-[#5F6368] dark:text-[#9AA0A6]">km</span>
                </div>

                <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-white mt-2 leading-snug">
                  Great Sea Interconnector
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Subsea 525 kV HVDC Crete–Cyprus cross-border power bridge descending to -3,000m seabed trench to end Cyprus's electrical isolation.
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
                    <span>1,000 MW Capacity</span>
                    <span>Nexans Marine Route Engine</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">Survey Succeeded · Cable Active</span>
                <a
                  href={getSurfaceUrl('helios')}
                  onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios?layer=gsi-subsea')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Inspect Corridor ↗</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 4: ENERGEIA RESEARCH                                  */}
          {/* Category: intelligence (6-Cols / 1-Row in 'all', or adaptive)    */}
          {/* ---------------------------------------------------------------- */}
          {showResearch && (
            <div className={`${
              activeCategory === 'intelligence' ? 'lg:col-span-6' : 'lg:col-span-6'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 inline-flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>TRY NOW // WHITEPAPER DESK</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">Market Reform</span>
                </div>

                <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  Energeia Research
                </div>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Editorial whitepaper stream modeling Google Research: day-ahead market reform, TSOC dispatch rules, negative pricing forecasts, and corporate M&amp;A filings.
                </p>

                {/* Market Clearing Rule Preview Visual */}
                <div className="mt-5 p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] mb-2">
                    <span>Clearing Architecture Preview</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Merit Order &amp; Imbalance Bands</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#5F6368] dark:text-[#9AA0A6]">TSOC Market Trial:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Stage 2 Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E1F20] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#5F6368] dark:text-[#9AA0A6]">Bilateral PPA Tolerance:</span>
                      <span className="font-semibold text-[#1F1F1F] dark:text-white">±15% Transition Band</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">CERA Regulatory Indexer</span>
                <a
                  href={getSurfaceUrl('research')}
                  onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Open Research Hub ↗</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 5: ACCREDITED MEMBER DIRECTORY                        */}
          {/* Category: directory (6-Cols / 1-Row in 'all', or adaptive)       */}
          {/* ---------------------------------------------------------------- */}
          {showDirectory && (
            <div className={`${
              activeCategory === 'directory' || activeCategory === 'generation' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}>
              <div>
                {/* Lifecycle Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#34A853]/15 dark:bg-[#34A853]/20 text-[#137333] dark:text-[#81C995] border border-[#34A853]/30 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED REGISTRY // 50+ ACCREDITED MEMBERS</span>
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">TechIsland Model</span>
                </div>

                <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white mt-1">
                  Accredited Member Directory
                </div>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 leading-relaxed">
                  Commercial B2B registry modeled after TechIsland: company dossiers, HE registrar numbers, operational megawatt pipelines, and certified executive lead routing.
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
                <button
                  type="button"
                  onClick={() => openIntakeWithTier('strategic')}
                  className="font-mono text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1A73E8] transition-colors cursor-pointer"
                >
                  Claim Profile
                </button>
                <a
                  href={getSurfaceUrl('members')}
                  onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Explore Members ↗</span>
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EXPERIMENT 6: ENERGEIA ACADEMY                                   */}
          {/* Category: intelligence (12-Cols / 1-Row in 'all', or adaptive)   */}
          {/* ---------------------------------------------------------------- */}
          {showAcademy && (
            <div className="lg:col-span-12 bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-7 sm:p-9 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 inline-flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>ENROLLING // TECHNICAL CERTIFICATIONS</span>
                    </span>
                    <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                      Workforce &amp; Grid Standards
                    </span>
                  </div>

                  <a
                    href={getSurfaceUrl('academy')}
                    onClick={(e) => handleSurfaceNavigate(e, 'academy', '/academy')}
                    className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium inline-flex items-center gap-1 font-mono text-xs cursor-pointer self-start sm:self-auto"
                  >
                    <span>Open Academy ↗</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1F1F1F] dark:text-white">
                  Energeia Academy
                </div>

                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 max-w-3xl leading-relaxed">
                  Technical upskilling hub standardizing commercial solar installation, utility substation operations, battery system commissioning, and European grid codes.
                </p>

                {/* Curriculum Module Ticker Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      code: 'TRACK 01',
                      title: 'Class A Electrical Certification',
                      subtitle: '132/66 kV Switching & Substation Codes',
                      status: 'Accredited'
                    },
                    {
                      code: 'TRACK 02',
                      title: 'Utility PV & Substation Engineering',
                      subtitle: '132/22 kV Transformer Station Design',
                      status: 'Enrolling'
                    },
                    {
                      code: 'TRACK 03',
                      title: 'Battery Storage Commissioning',
                      subtitle: 'BESS LFP Safety, FFR Integration, Inverter Tuning',
                      status: 'New'
                    },
                    {
                      code: 'TRACK 04',
                      title: 'European Grid Codes & Compliance',
                      subtitle: 'EN 50549-2 & TSOC Statutory Codes',
                      status: 'Standard'
                    }
                  ].map((track, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-[#131314] border border-black/[0.04] dark:border-white/[0.05] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                            {track.code}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#5F6368] dark:text-[#9AA0A6]">
                            {track.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#1F1F1F] dark:text-white leading-snug">
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-2">
                          {track.subtitle}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#80868B] dark:text-[#6E7377]">
                        <span>EAC Safety Code Framework</span>
                        <span>Module Cert</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {['Class A Electrical', 'HV Substation Safety', 'Installer Certification'].map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.05] text-[#5F6368] dark:text-[#9AA0A6]">
                      {t}
                    </span>
                  ))}
                </div>

                <span className="font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                  Energeia Standards Committee &amp; Academic Partners
                </span>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODULE C: "LIFE BEYOND THE LAB" (THE labs.google RETROSPECTIVE)      */}
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
            How experimental regulatory sandboxes and technical working groups graduated into commercial reality across the Republic of Cyprus.
          </p>
        </div>

        {/* 3 Graduated Retrospective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {LABS_SITE_SPEC.lifeBeyondTheLab.map((item) => (
            <div 
              key={item.id}
              className="bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] rounded-[32px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    GRADUATED {item.yearIncubated} → {item.yearGraduated}
                  </span>
                  <span className="text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                    Field Codified
                  </span>
                </div>

                <div className="text-xl font-mono font-medium tracking-[-0.02em] text-[#1F1F1F] dark:text-white">
                  {item.labExperimentName}
                </div>

                <h3 className="text-base font-semibold text-[#1A73E8] dark:text-[#8AB4F8] mt-2 leading-snug">
                  → {item.graduatedProduct}
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#80868B] dark:text-[#6E7377]">
                  CERA / TSOC Validated
                </span>
                <a
                  href={getSurfaceUrl('research')}
                  onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-mono text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
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
          {LABS_SITE_SPEC.membershipTiers.map((tier) => {
            const isPatron = tier.tierId === 'strategic_patron';

            return (
              <div
                key={tier.tierId}
                className={`rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isPatron
                    ? 'bg-[#FFFFFF] dark:bg-[#1E1F20] border-2 border-[#D46200]/40 dark:border-[#D46200]/50 shadow-[0_4px_24px_rgba(212,98,0,0.08)] relative hover:-translate-y-1'
                    : 'bg-[#FFFFFF] dark:bg-[#1E1F20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      isPatron
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

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                    {tier.target}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-6 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] space-y-3">
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
                <div className="mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => openIntakeWithTier(tier.action.modalTierPreselect)}
                    className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPatron
                        ? 'bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] shadow-xs'
                        : 'bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-[#1F1F1F] dark:text-[#E3E3E3] border border-black/[0.06] dark:border-white/[0.08]'
                    }`}
                  >
                    <span>{tier.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODULE E: INSTITUTIONAL FOOTER                                       */}
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
              {LABS_SITE_SPEC.footer.disclaimer}
              <div className="mt-1 text-[#80868B] dark:text-[#6E7377]">
                Operated by {LABS_SITE_SPEC.footer.operator.legalEntity} ({LABS_SITE_SPEC.footer.operator.registrationNumber}), {LABS_SITE_SPEC.footer.operator.headquarters} · Contact: {LABS_SITE_SPEC.footer.operator.contactEmail}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-12 border-b border-black/[0.05] dark:border-white/[0.06] text-xs">
            <div className="flex flex-wrap items-center gap-6 text-[#5F6368] dark:text-[#9AA0A6]">
              {LABS_SITE_SPEC.footer.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  onClick={(e) => {
                    if (link.url.includes('helios')) {
                      handleSurfaceNavigate(e, 'helios', '/helios');
                    } else if (link.url.includes('research')) {
                      handleSurfaceNavigate(e, 'research', '/research');
                    } else if (link.url.includes('members')) {
                      handleSurfaceNavigate(e, 'members', '/members');
                    } else if (link.url.includes('academy')) {
                      handleSurfaceNavigate(e, 'academy', '/academy');
                    }
                  }}
                  className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="font-mono text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
              Republic of Cyprus · EU Clean Energy Package
            </div>
          </div>

          {/* Bottom Utility Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6] gap-4">
            <p>{LABS_SITE_SPEC.footer.copyright}</p>
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
