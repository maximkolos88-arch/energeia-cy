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
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useInitialData } from '../context/InitialDataContext';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { NewsItem } from '../models/types';
import { getOptimizedImageUrl } from '../utils/imageProxy';
import { EcosystemSurface, getSurfaceUrl } from '../utils/ecosystemRouting';

export interface ClusterPortalLayoutProps {
  onNavigateSurface?: (surface: EcosystemSurface, path?: string) => void;
  language?: string;
}

interface WorkingGroup {
  id: string;
  number: string;
  title: string;
  focus: string;
  initiatives: string[];
  chair: string;
}

const WORKING_GROUPS: WorkingGroup[] = [
  {
    id: 'bess-grid',
    number: 'WG 01',
    title: 'Grid Modernization & BESS Storage',
    focus: 'Overcoming TSOC grid curtailment, co-located battery tenders (150MW+), and fast-frequency reserve market design.',
    initiatives: ['Curtailment Reduction Framework', 'Centralized BESS Tender Rules', 'Fast Frequency Response Standards'],
    chair: 'Technical Grid Committee',
  },
  {
    id: 'utility-solar',
    number: 'WG 02',
    title: 'Solar PV & Utility Generation',
    focus: 'Accelerating spatial licensing, agricultural land zoning standards, and private bilateral corporate PPA structures.',
    initiatives: ['Licensing Bottleneck Reduction', 'Agri-PV Technical Guidance', 'Corporate PPA Standard Contracts'],
    chair: 'Renewables Working Group',
  },
  {
    id: 'regulatory-cera',
    number: 'WG 03',
    title: 'Regulatory Modernization & CERA Sandbox',
    focus: 'Advocating for full wholesale electricity market opening, net-billing evolution, and smart meter data interoperability.',
    initiatives: ['Target Market Transitional Rules', 'Net-Billing Tariff Evolution', 'Open Grid Data Access'],
    chair: 'Policy & Regulatory Affairs',
  },
  {
    id: 'interconnector',
    number: 'WG 04',
    title: 'Regional Interconnection & Offshore Wind',
    focus: 'Great Sea Interconnector (500kV HVDC) integration, cross-border trading readiness, and Cyprus EEZ marine spatial planning.',
    initiatives: ['EuroAsia HVDC Market Coupling', 'Offshore Wind Feasibility in EEZ', 'Regional Subsea Transmission'],
    chair: 'Cross-Border Taskforce',
  },
  {
    id: 'green-h2',
    number: 'WG 05',
    title: 'Green Hydrogen & Industrial Decarbonization',
    focus: 'Industrial clean fuels roadmap for the Vasilikos and Dhekelia industrial corridors and heavy transport decarbonization.',
    initiatives: ['Vasilikos Hydrogen Hub Study', 'Port Decarbonization Framework', 'Renewable Fuels of Non-Biological Origin (RFNBO)'],
    chair: 'Decarbonization Council',
  },
];

const NATIONAL_KPIS = [
  {
    label: 'Installed Solar PV Capacity',
    value: '850+ MW',
    subtext: 'Utility-scale & distributed generation',
    trend: '+22% YoY',
  },
  {
    label: 'Great Sea Interconnector',
    value: '€1.9B',
    subtext: '500kV HVDC subsea cable (Greece-Cyprus)',
    trend: 'Under Construction',
  },
  {
    label: 'Cataloged Power Stations',
    value: '520+',
    subtext: 'Monitored across 6 administrative districts',
    trend: 'Helios 3D GIS',
  },
  {
    label: 'RES Electricity Share',
    value: '19.8%',
    subtext: 'Gross final consumption target 33% by 2030',
    trend: 'NECP 2030 Roadmap',
  },
  {
    label: 'Accredited Cluster Operators',
    value: '50+',
    subtext: 'Producers, EPCs, storage & grid specialists',
    trend: 'National Registry',
  },
];

const STRATEGIC_INITIATIVES = [
  {
    title: 'Great Sea Interconnector (EuroAsia Subsea HVDC)',
    status: 'In Progress',
    statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    description: '1,208 km subsea 500kV HVDC interconnection connecting Cyprus to Crete and mainland Europe, terminating the island’s energy isolation.',
    timeline: 'Target Commercial Ops: 2029',
  },
  {
    title: '150MW+ Battery Energy Storage (BESS) Fast-Track Tender',
    status: 'Consultation',
    statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    description: 'Ministry of Energy and CERA framework to deploy centralized and co-located storage to stem rising renewable curtailment (>25%).',
    timeline: 'Allocation Window: Q1 2027',
  },
  {
    title: 'Full Liberalized Wholesale Market Opening (CERA/TSOC)',
    status: 'Final Staging',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    description: 'Transition from the interim bilateral contract regime to the European Target Model with Day-Ahead and Balancing Markets.',
    timeline: 'Go-Live Readiness 2027',
  },
];

const ACCREDITED_PARTNERS = [
  { name: 'Electricity Authority of Cyprus (EAC)', role: 'National Power Producer & DSO', category: 'Grid Operator' },
  { name: 'Transmission System Operator (TSOC)', role: 'Transmission & Market Operator', category: 'System Operator' },
  { name: 'Cyprus Energy Regulatory Authority (CERA)', role: 'Independent Energy Regulator', category: 'Statutory Regulator' },
  { name: 'Bioland Energy', role: 'Utility-Scale Solar & BESS Developer', category: 'Producer & EPC' },
  { name: 'Muskita Energy', role: 'Renewable Power Producer', category: 'Producer' },
  { name: 'Green Energy Group', role: 'EPC & Grid Integration Specialist', category: 'EPC Contractor' },
];

export const ClusterPortalLayout: React.FC<ClusterPortalLayoutProps> = ({
  onNavigateSurface,
  language = 'en',
}) => {
  const { t } = useTranslation();
  const initialData = useInitialData();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    if (initialData?.newsItems && initialData.newsItems.length > 0) {
      setNews(initialData.newsItems.slice(0, 3));
      return;
    }

    NewsRepository.getPublishedNews('All Updates')
      .then((items) => {
        if (isMounted) {
          setNews(items.slice(0, 3));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  const handleSurfaceNavigate = (e: React.MouseEvent, surface: EcosystemSurface, path = '') => {
    if (onNavigateSurface) {
      e.preventDefault();
      onNavigateSurface(surface, path);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors">
      
      {/* 1. INSTITUTIONAL MASTHEAD SECTION (Google & TechIsland Model) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        
        {/* Subtle Decorative Flag Area Gradient Dot Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C] ring-1 ring-black/10 dark:ring-white/20" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
            Cyprus National Energy Cluster • M3J2 LTD HE 438859
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[34px] sm:text-[56px] font-normal tracking-tight text-[#1F1F1F] dark:text-[#E3E3E3] leading-[1.12] max-w-4xl mb-6">
          The national energy industry cluster of Cyprus
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed max-w-3xl mb-8">
          Convening utility-scale solar developers, battery storage operators, network engineers, institutional capital, and policymakers to accelerate the Cyprus energy transition, Mediterranean interconnectivity, and market modernization.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Energy Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={getSurfaceUrl('helios')}
            onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F1F3F4] dark:bg-[#282A2C] hover:bg-[#E8EAED] dark:hover:bg-[#333537] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium text-sm transition-all border border-[#DADCE0] dark:border-[#444746] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#D46200]" />
            <span>Launch Helios 3D GIS</span>
          </a>

          <a
            href="/register"
            onClick={(e) => {
              if (onNavigateSurface) {
                e.preventDefault();
                onNavigateSurface('cluster', '/register');
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-[#E8F0FE] dark:hover:bg-[#0842A0]/20 font-medium text-sm transition-all cursor-pointer"
          >
            <span>Apply for Cluster Membership</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Institutional Authority / Follow Bar */}
        <div className="pt-10 flex flex-wrap items-center justify-between gap-6 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
          <div className="flex items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-white">
              Institutional Pillars:
            </span>
            <span>Policy Advocacy</span>
            <span>•</span>
            <span>Grid Telemetry</span>
            <span>•</span>
            <span>Accredited B2B Registry</span>
            <span>•</span>
            <span>Workforce Certification</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="uppercase tracking-wider font-semibold">Channels:</span>
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

      {/* 2. NATIONAL ENERGY KPIS STRIP */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-12 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
                National Telemetry &amp; Capacity
              </span>
              <h2 className="text-xl sm:text-2xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] mt-1">
                Cyprus Energy Transition Indicators
              </h2>
            </div>
            <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
              Verified against TSOC &amp; CERA reports
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            {NATIONAL_KPIS.map((kpi, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#1E1F20] p-5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] mb-1">
                    {kpi.trend}
                  </div>
                  <div className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1F1F1F] dark:text-white">
                    {kpi.value}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <div className="text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug">
                    {kpi.label}
                  </div>
                  <div className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] mt-1 leading-tight">
                    {kpi.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEDERATED ECOSYSTEM SURFACES (Interactive Architectural Navigator) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] dark:bg-[#0842A0]/30 text-[#1A73E8] dark:text-[#8AB4F8] text-[11px] font-semibold uppercase tracking-wider mb-3">
            Federated Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
            Specialized surfaces powering the national energy network
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
            From high-frequency regulatory briefings to real-time 3D GIS grid telemetry and accredited B2B partner directories, each surface is purpose-built for clean execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Surface 1: Research & Intelligence */}
          <a
            href={getSurfaceUrl('research')}
            onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
            className="group p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] dark:bg-[#0842A0]/30 flex items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8] mb-6 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] mb-1">
                research.energeia.cy
              </div>
              <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                Research &amp; Intelligence
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Editorial publication stream: CERA regulatory filings, TSOC curtailment reports, and wholesale market analytics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8]">
              <span>Enter Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Surface 2: Helios Terminal */}
          <a
            href={getSurfaceUrl('helios')}
            onClick={(e) => handleSurfaceNavigate(e, 'helios', '/helios')}
            className="group p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#D46200] dark:hover:border-[#FFA726] transition-all flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FEF7E0] dark:bg-[#FFA726]/20 flex items-center justify-center text-[#D46200] dark:text-[#FFA726] mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D46200] dark:text-[#FFA726] mb-1">
                helios.energeia.cy
              </div>
              <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#D46200] dark:group-hover:text-[#FFA726] transition-colors">
                Helios 3D Terminal
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Full-screen dark geospatial terminal mapping 520+ power stations, transmission lines, and live ENTSO-E market telemetry.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs font-medium text-[#D46200] dark:text-[#FFA726]">
              <span>Launch Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Surface 3: Members Directory */}
          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="group p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#137333] dark:hover:border-[#81C995] transition-all flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] dark:bg-[#137333]/20 flex items-center justify-center text-[#137333] dark:text-[#81C995] mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#137333] dark:text-[#81C995] mb-1">
                members.energeia.cy
              </div>
              <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#137333] dark:group-hover:text-[#81C995] transition-colors">
                Ecosystem Directory
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Accredited B2B registry of verified solar developers, EPC contractors, battery storage operators, and ESG consultants.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs font-medium text-[#137333] dark:text-[#81C995]">
              <span>Browse Registry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Surface 4: Academy */}
          <a
            href={getSurfaceUrl('academy')}
            onClick={(e) => handleSurfaceNavigate(e, 'academy', '/academy')}
            className="group p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#7B1FA2] dark:hover:border-[#D7AEFB] transition-all flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FD] dark:bg-[#7B1FA2]/20 flex items-center justify-center text-[#7B1FA2] dark:text-[#D7AEFB] mb-6 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7B1FA2] dark:text-[#D7AEFB] mb-1">
                academy.energeia.cy
              </div>
              <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#7B1FA2] dark:group-hover:text-[#D7AEFB] transition-colors">
                Energeia Academy
              </h3>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2.5 leading-relaxed">
                Workforce upskilling, PV certification standards, and technical masterclasses empowering the Mediterranean green transition.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs font-medium text-[#7B1FA2] dark:text-[#D7AEFB]">
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

        </div>
      </section>

      {/* 4. CLUSTER WORKING GROUPS (TechIsland Pillar Model) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
              Institutional Working Groups
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight mt-1">
              Driving national policy reform &amp; grid execution
            </h2>
            <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3">
              Modeled after leading industry associations, Energeia working groups bring together market operators, legal minds, and engineers to draft concrete regulatory proposals.
            </p>
          </div>
          <a
            href="/register"
            onClick={(e) => {
              if (onNavigateSurface) {
                e.preventDefault();
                onNavigateSurface('cluster', '/register');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
          >
            <span>Join a Working Group</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-4">
          {WORKING_GROUPS.map((wg) => (
            <div
              key={wg.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] transition-all hover:border-[#1A73E8] dark:hover:border-[#8AB4F8]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-[#131314] border border-[#DADCE0] dark:border-[#444746] text-[#5F6368] dark:text-[#9AA0A6]">
                    {wg.number}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#1F1F1F] dark:text-white">
                      {wg.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-1.5 max-w-3xl leading-relaxed">
                      {wg.focus}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {wg.initiatives.map((init, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#131314] text-[#444746] dark:text-[#C4C7C5] border border-[#DADCE0] dark:border-[#3C4043]"
                    >
                      {init}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STRATEGIC INITIATIVES & NATIONAL POLICY WATCH */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
              National Policy Watch
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight mt-1">
              Strategic Cyprus Energy Milestones
            </h2>
            <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-3">
              Independent oversight and tracking of major national infrastructure programs and legislative reforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STRATEGIC_INITIATIVES.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <span className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
                      {item.timeline}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-[#1F1F1F] dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                  <a
                    href={getSurfaceUrl('research')}
                    onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
                  >
                    <span>Read Policy Briefings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST INTELLIGENCE BRIEFS (Research Feed Highlights) */}
      {news.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-b border-[#F1F3F4] dark:border-[#282A2C]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
                Editorial Dispatch
              </span>
              <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight mt-1">
                Latest Energy Intelligence
              </h2>
            </div>
            <a
              href={getSurfaceUrl('research')}
              onClick={(e) => handleSurfaceNavigate(e, 'research', '/research')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
            >
              <span>View All Intelligence ({news.length}+ briefs)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => {
              const formattedDate = new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).toUpperCase();

              const articleUrl = item.slug ? `/news/${item.slug}` : '/research';

              return (
                <article key={item.id} className="group flex flex-col justify-between">
                  <div>
                    {item.imageUrl && (
                      <a
                        href={articleUrl}
                        className="relative block w-full aspect-[16/9] overflow-hidden rounded-2xl bg-[#F1F3F4] dark:bg-[#282A2C] mb-4"
                      >
                        <img
                          src={getOptimizedImageUrl(item.imageUrl, 800, 450)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </a>
                    )}
                    <span className="text-[11px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase">
                      {formattedDate}
                    </span>
                    <h3 className="text-lg font-medium text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug mt-1.5 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                      <a href={articleUrl}>{item.title}</a>
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-2 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="text-[12px] text-[#5F6368] dark:text-[#9AA0A6] flex items-center gap-2 mt-4 pt-3 border-t border-[#F1F3F4] dark:border-[#282A2C]">
                    <span className="font-medium text-[#1F1F1F] dark:text-white">{item.category}</span>
                    <span>•</span>
                    <span>{item.readTimeMinutes || 3} min read</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. ACCREDITED MEMBERS STRIP */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-b border-[#F1F3F4] dark:border-[#282A2C]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#137333] dark:text-[#81C995]">
            Accredited Ecosystem Registry
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight mt-1">
            Institutional Members &amp; Certified Operators
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2">
            Connecting key public utilities, independent producers, and engineering consultancies across Cyprus.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ACCREDITED_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col justify-between text-center"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#131314] mx-auto flex items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8] mb-3 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#137333] dark:text-[#81C995]" />
                </div>
                <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white line-clamp-1">
                  {partner.name}
                </div>
                <div className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] mt-1 line-clamp-2">
                  {partner.role}
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#137333] dark:text-[#81C995] mt-3">
                {partner.category}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={getSurfaceUrl('members')}
            onClick={(e) => handleSurfaceNavigate(e, 'members', '/members')}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
          >
            <span>Search full 50+ accredited company directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 8. MEMBERSHIP INTAKE CTA (TechIsland Model) */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#18191A] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-white dark:bg-[#1E1F20] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-8 sm:p-14 text-center shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-2">
              Join the Cyprus All-Energy Network
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white tracking-tight max-w-2xl mx-auto">
              Become an accredited member of the Cyprus Energy Cluster
            </h2>
            <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] max-w-xl mx-auto mt-4 leading-relaxed">
              Gain institutional advocacy representation, participate in CERA regulatory working groups, list in the accredited directory, and access verified market intelligence.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a
                href="/register"
                onClick={(e) => {
                  if (onNavigateSurface) {
                    e.preventDefault();
                    onNavigateSurface('cluster', '/register');
                  }
                }}
                className="px-8 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Submit Membership Application</span>
                <ArrowRight className="w-4 h-4" />
              </a>

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
                <span>Learn about Governance &amp; Bylaws</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
