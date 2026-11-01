import { DirectoryMember, NewsItem } from '../models/types';

// ============================================================================
// SECTION 2: DYNAMIC NATIONAL ENERGY KPIS & TELEMETRY
// ============================================================================

export interface NationalMetric {
  id: string;
  value: string;
  label: string;
  subtext: string;
  source: string;
  trend: string;
  badge: string;
  badgeColor: string;
}

export const NATIONAL_METRICS: NationalMetric[] = [
  {
    id: 'solar-pv',
    value: '850+ MWp',
    label: 'Installed Solar PV Capacity',
    subtext: 'Over 35,000 grid-connected systems island-wide',
    source: 'CERA / TSOC Verified',
    trend: '+22% YoY Expansion',
    badge: 'Operational',
    badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
  },
  {
    id: 'bess-queue',
    value: '320 MWh',
    label: 'Fast-Track BESS Storage Queue',
    subtext: 'Centralized & co-located battery tenders under evaluation',
    source: 'MECI / CERA Registry',
    trend: 'Allocation Q1 2027',
    badge: 'Tender Stage',
    badgeColor: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
  },
  {
    id: 'res-share',
    value: '19.8%',
    label: 'Current Annual RES Share',
    subtext: 'National generation share · Binding target: 33% by 2030',
    source: 'NECP 2030 Roadmap',
    trend: 'Target: 33% by 2030',
    badge: 'NECP Milestone',
    badgeColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
  },
  {
    id: 'gsi-link',
    value: '€1.9B / 1,000 MW',
    label: 'Great Sea Interconnector',
    subtext: '1,208 km subsea 500 kV HVDC cable connecting Crete & Cyprus',
    source: 'Nexans / IPTO / EC PCI',
    trend: 'Nexans Subsea Contract',
    badge: 'Under Execution',
    badgeColor: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
  },
];

// ============================================================================
// SECTION 3: THE 4 STRATEGIC WORKING PILLARS (TECHISLAND MODEL)
// ============================================================================

export interface StrategicPillar {
  number: string;
  id: string;
  title: string;
  headline: string;
  description: string;
  keyInitiatives: string[];
  iconKey: 'battery' | 'scale' | 'network' | 'shield';
  accentColor: string;
}

export const STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    number: '01',
    id: 'grid-autonomy-bess',
    title: 'Grid Autonomy & BESS Deployment',
    headline: 'Resolving transmission bottlenecks and curtailment',
    description: 'Resolving transmission bottlenecks, expediting central and distributed battery storage, and ending midday solar curtailment across the 132 kV network.',
    keyInitiatives: [
      '150MW+ Centralized Storage Tenders',
      'Behind-the-Meter Commercial BESS Rules',
      'Fast Frequency Response (FFR) Standards',
    ],
    iconKey: 'battery',
    accentColor: 'amber',
  },
  {
    number: '02',
    id: 'wholesale-market',
    title: 'Wholesale Market & Regulatory Modernization',
    headline: 'Constructive advocacy with CERA (PAEK) and TSOC',
    description: 'Constructive advocacy with CERA (PAEK) and TSOC for competitive market opening and transparent ancillary service mechanisms under the European Target Model.',
    keyInitiatives: [
      'Target Model Go-Live Readiness',
      'Day-Ahead & Balancing Settlement',
      'Ancillary Services Tariff Design',
    ],
    iconKey: 'scale',
    accentColor: 'blue',
  },
  {
    number: '03',
    id: 'utility-generation',
    title: 'Utility Generation & Regional Interconnection',
    headline: 'Multi-megawatt renewables & Mediterranean interconnection',
    description: 'Supporting multi-megawatt PV installations, agro-voltaics, and the geopolitical realization of the EuroAsia subsea link to terminate Cyprus’s energy isolation.',
    keyInitiatives: [
      'Great Sea Interconnector (GSI) 500kV HVDC',
      'Agro-Voltaic Spatial Licensing Standards',
      'Private Bilateral Corporate PPAs',
    ],
    iconKey: 'network',
    accentColor: 'purple',
  },
  {
    number: '04',
    id: 'workforce-standards',
    title: 'Workforce Safety & Engineering Standards',
    headline: 'High-voltage certification & academic pipelines',
    description: 'Certifying high-voltage technicians, PV installers, and fostering energy engineering curricula across Cyprus universities to build local technical capacity.',
    keyInitiatives: [
      'High-Voltage Switching Certification',
      'National PV Installer Code of Practice',
      'University Engineering Fellowships',
    ],
    iconKey: 'shield',
    accentColor: 'emerald',
  },
];

// ============================================================================
// SECTION 4: MEMBERS & STRATEGIC PARTNERS (4 CATEGORIZED TIERS)
// ============================================================================

export type MemberTierKey = 
  | 'Strategic Partners' 
  | 'Corporate Operators' 
  | 'EPC & Infrastructure Contractors' 
  | 'Advisory & ESG Members';

export interface TierDefinition {
  key: MemberTierKey;
  label: string;
  badgeCount: number;
  description: string;
}

export const MEMBER_TIERS: TierDefinition[] = [
  {
    key: 'Strategic Partners',
    label: 'Strategic Partners',
    badgeCount: 4,
    description: 'Sovereign grid operators, statutory market authorities, and cross-border interconnector sponsors.',
  },
  {
    key: 'Corporate Operators',
    label: 'Corporate Operators',
    badgeCount: 6,
    description: 'Licensed independent power producers (IPPs), multi-megawatt solar portfolios, and baseload bioenergy operators.',
  },
  {
    key: 'EPC & Infrastructure Contractors',
    label: 'EPC & Infrastructure',
    badgeCount: 5,
    description: 'Class A electrical contractors, substation builders, BESS integrators, and Tier-1 hardware distributors.',
  },
  {
    key: 'Advisory & ESG Members',
    label: 'Advisory & ESG',
    badgeCount: 4,
    description: 'Top-tier energy legal practices, financial structuring advisors, technical auditors, and ESG assurance specialists.',
  },
];

export interface PortalMemberEntry extends DirectoryMember {
  tierCategory: MemberTierKey;
  operationalCapacityText: string;
  logoSvgUrl?: string;
}

export const CLUSTER_PORTAL_MEMBERS: PortalMemberEntry[] = [
  // Tier 1: Strategic Partners
  {
    id: 'member-eac',
    name: 'Electricity Authority of Cyprus (EAC / AHK)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    roleOrCategory: 'State Electricity Utility & Distribution System Operator',
    email: 'eacinfo@eac.com.cy',
    phone: '+357 22 201000',
    location: 'Nicosia, Cyprus',
    category: 'Government & Associations',
    expertiseTags: ['Smart Grids', 'Energy Efficiency', 'O&M', 'Policy & Regulatory'],
    logoUrl: '/logos/eac.svg',
    logoSvgUrl: '/logos/eac.svg',
    website: 'https://www.eac.com.cy',
    linkedin: 'https://www.linkedin.com/company/eac-cyprus',
    keyContactName: 'Adonis Yiasemides',
    keyContactRole: 'Acting General Manager & Chief Operations Officer',
    description: 'Cyprus state utility responsible for power generation, transmission, and distribution grid operation under DTR regulation.',
    operationalCapacityText: '1,480 MW Generation · 850+ MWp RES Interface',
    isVerified: true,
  },
  {
    id: 'member-tsoc',
    name: 'Transmission System Operator Cyprus (TSOC / DSM)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    roleOrCategory: 'National Transmission & Market System Operator',
    email: 'info@dsm.org.cy',
    phone: '+357 22 877777',
    location: 'Nicosia, Cyprus',
    category: 'Government & Associations',
    expertiseTags: ['Smart Grids', 'Grid Balancing', 'ENTSO-E Synchronous', 'Dispatch'],
    logoUrl: '/logos/tsoc.svg',
    logoSvgUrl: '/logos/tsoc.svg',
    website: 'https://www.dsm.org.cy',
    linkedin: 'https://www.linkedin.com/company/cyprus-transmission-system-operator',
    keyContactName: 'Stavros Stavrinos',
    keyContactRole: 'Executive Director of System Operations',
    description: 'Independent statutory operator managing the Cyprus 132/66 kV high-voltage transmission grid, frequency stability, and electricity wholesale market dispatch.',
    operationalCapacityText: '1,320 MW Peak Transmission Capacity (132/66 kV)',
    isVerified: true,
  },
  {
    id: 'member-cera',
    name: 'Cyprus Energy Regulatory Authority (CERA / RAEK)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    roleOrCategory: 'National Energy Market Regulatory Body (Observer)',
    email: 'info@cera.org.cy',
    phone: '+357 22 666363',
    location: 'Nicosia, Cyprus',
    category: 'Government & Associations',
    expertiseTags: ['Policy & Regulatory', 'Market Rules', 'Tariff Methodology', 'Licensing'],
    logoUrl: '/logos/cera.svg',
    logoSvgUrl: '/logos/cera.svg',
    website: 'https://www.cera.org.cy',
    linkedin: 'https://www.linkedin.com/company/cera-cyprus',
    keyContactName: 'Dr. Andreas Poullikkas',
    keyContactRole: 'Chairman of CERA / Energy Systems Strategist',
    description: 'Autonomous regulatory authority established under Law 122(I)/2003 overseeing electricity, natural gas, consumer protection, and market compliance in Cyprus.',
    operationalCapacityText: '100% Republic of Cyprus Energy Market Supervision',
    isVerified: true,
  },
  {
    id: 'member-gsi',
    name: 'Great Sea Interconnector (EuroAsia HVDC)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    roleOrCategory: 'Cross-Border Transmission Infrastructure Operator',
    email: 'info@greatseainterconnector.com',
    phone: '+357 22 792200',
    location: 'Nicosia / Athens',
    category: 'Government & Associations',
    expertiseTags: ['HVDC Subsea', 'Regional Interconnection', 'Cross-Border Trading', 'ENTSO-E'],
    logoUrl: '/logos/gsi.svg',
    logoSvgUrl: '/logos/gsi.svg',
    website: 'https://greatseainterconnector.com',
    linkedin: 'https://www.linkedin.com/company/great-sea-interconnector',
    keyContactName: 'Project Management Directorate',
    keyContactRole: 'HVDC Technical Director',
    description: 'Promoter of the 1,208 km subsea 500 kV HVDC cable connecting the electrical grids of Israel, Cyprus, and Crete (Greece), ending Cyprus’s isolated energy status.',
    operationalCapacityText: '1,000 MW / 500 kV Subsea HVDC Corridor',
    isVerified: true,
  },

  // Tier 2: Corporate Operators
  {
    id: 'member-bioland',
    name: 'Bioland Energy Group',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Utility-Scale Solar PV & BESS Developer',
    email: 'info@biolandenergy.com',
    phone: '+357 24 533833',
    location: 'Larnaca, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Solar PV', 'Energy Storage', 'EPC', 'O&M'],
    logoUrl: '/logos/bioland.svg',
    logoSvgUrl: '/logos/bioland.svg',
    website: 'https://biolandenergy.com',
    linkedin: 'https://www.linkedin.com/company/bioland-energy-ltd',
    keyContactName: 'Dimitris Constantinou',
    keyContactRole: 'Managing Director',
    description: 'Leading independent power producer developing multi-megawatt ground-mounted photovoltaic parks, utility battery storage, and waste recycling facilities across Cyprus.',
    operationalCapacityText: '95+ MWp Operational Solar PV Assets',
    isVerified: true,
  },
  {
    id: 'member-muskita',
    name: 'Muskita Solar Systems',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Renewable Power Producer & Industrial PV Operator',
    email: 'solar@muskita.com.cy',
    phone: '+357 25 844444',
    location: 'Limassol, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Solar PV', 'Industrial Prosumer', 'Aluminium PV Mounting'],
    logoUrl: '/logos/muskita.svg',
    logoSvgUrl: '/logos/muskita.svg',
    website: 'https://muskita.com.cy',
    linkedin: 'https://www.linkedin.com/company/muskita-aluminium-industries',
    keyContactName: 'Demos Mouskis',
    keyContactRole: 'Executive Chairman',
    description: 'Pioneering Cyprus industrial renewable producer with extensive utility solar assets and domestic manufacturing of certified aluminum solar mounting systems.',
    operationalCapacityText: '40+ MWp Commercial & Utility PV Portfolio',
    isVerified: true,
  },
  {
    id: 'member-geg',
    name: 'Green Energy Group (GEG)',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Utility PV Developer & Substation Specialist',
    email: 'info@geg.com.cy',
    phone: '+357 22 443444',
    location: 'Nicosia, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Solar PV', 'Energy Trading', 'PPA Structuring', 'Substation EPC'],
    logoUrl: '/logos/geg.svg',
    logoSvgUrl: '/logos/geg.svg',
    website: 'https://geg.com.cy',
    linkedin: 'https://www.linkedin.com/company/green-energy-group-cyprus',
    keyContactName: 'George Georgiou',
    keyContactRole: 'Chief Executive Officer',
    description: 'Vertically integrated renewable energy powerhouse operating large-scale solar farms, private electricity supply licensing, and high-voltage grid connections.',
    operationalCapacityText: '70+ MWp Utility PV & Substation Portfolio',
    isVerified: true,
  },
  {
    id: 'member-akerasi',
    name: 'Akerasi Bioenergy Plant',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Baseload Renewable Power & Biogas Producer',
    email: 'info@akerasi.com.cy',
    phone: '+357 24 639300',
    location: 'Larnaca, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Biomass', 'Baseload Generation', 'Waste-to-Energy', 'Anaerobic Digestion'],
    logoUrl: '/logos/akerasi.svg',
    logoSvgUrl: '/logos/akerasi.svg',
    website: 'https://akerasi.com.cy',
    linkedin: 'https://www.linkedin.com/company/akerasi-energy',
    keyContactName: 'Andreas Kourris',
    keyContactRole: 'Plant Operations Director',
    description: 'Flagship anaerobic digestion facility generating round-the-clock dispatchable green electricity and heat from agricultural and organic residues in Larnaca district.',
    operationalCapacityText: '15+ MW Biomass Baseload & Biogas Cogeneration',
    isVerified: true,
  },
  {
    id: 'member-lanitis',
    name: 'Lanitis Energy',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Commercial Power Producer & Energy Trading',
    email: 'energy@lanitis.com',
    phone: '+357 25 820920',
    location: 'Limassol, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Solar PV', 'Corporate PPAs', 'Energy Storage', 'Asset Management'],
    logoUrl: '/logos/lanitis.svg',
    logoSvgUrl: '/logos/lanitis.svg',
    website: 'https://lanitis.com',
    linkedin: 'https://www.linkedin.com/company/lanitis-group',
    keyContactName: 'Marios Lanitis',
    keyContactRole: 'Executive Director — Energy Division',
    description: 'Part of the historic Lanitis Group, developing, financing, and operating utility solar parks, corporate bilateral PPAs, and upcoming battery storage assets.',
    operationalCapacityText: '65+ MWp Solar PV Portfolio & Corporate PPAs',
    isVerified: true,
  },
  {
    id: 'member-helleniq',
    name: 'HELLENiQ Renewables Cyprus',
    type: 'Company',
    tierCategory: 'Corporate Operators',
    roleOrCategory: 'Multi-Megawatt Renewable Energy Operator',
    email: 'renewables@helleniq.gr',
    phone: '+357 22 477000',
    location: 'Nicosia, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Solar PV', 'Wind Power', 'BESS', 'Energy Trading'],
    logoUrl: '/logos/helleniq.svg',
    logoSvgUrl: '/logos/helleniq.svg',
    website: 'https://helleniqenergy.gr',
    linkedin: 'https://www.linkedin.com/company/helleniq-energy',
    keyContactName: 'Stelios Louca',
    keyContactRole: 'Cyprus Country Manager',
    description: 'Clean energy subsidiary of HELLENiQ ENERGY, deploying institutional capital into utility solar parks and battery energy storage across Cyprus and Greece.',
    operationalCapacityText: '50+ MWp Utility Solar Portfolio',
    isVerified: true,
  },

  // Tier 3: EPC & Infrastructure Contractors
  {
    id: 'member-caramondani',
    name: 'Caramondani Energy Solutions (Caramondani Bros PLC)',
    type: 'Company',
    tierCategory: 'EPC & Infrastructure Contractors',
    roleOrCategory: 'Certified Class A High-Voltage EPC Contractor',
    email: 'info@caramondani.com.cy',
    phone: '+357 22 716100',
    location: 'Nicosia, Cyprus',
    category: 'Engineering & EPC',
    expertiseTags: ['EPC', 'Substations', '132/22 kV Transformers', 'BESS Engineering'],
    logoUrl: '/logos/caramondani.svg',
    logoSvgUrl: '/logos/caramondani.svg',
    website: 'https://caramondani.com.cy',
    linkedin: 'https://www.linkedin.com/company/caramondani-group',
    keyContactName: 'Eleni Caramondani',
    keyContactRole: 'Managing Director',
    description: 'Over 60 years of engineering excellence delivering turnkey high-voltage substations, transmission lines, utility solar plants, and specialized desalination infrastructure.',
    operationalCapacityText: '45+ MWp Turnkey Solar Farms & Substations',
    isVerified: true,
  },
  {
    id: 'member-conercon',
    name: 'Conercon Energy Solutions (Petrolina Group)',
    type: 'Company',
    tierCategory: 'EPC & Infrastructure Contractors',
    roleOrCategory: 'Turnkey EPC & BESS Storage System Integrator',
    email: 'info@conercon.com',
    phone: '+357 24 645300',
    location: 'Larnaca, Cyprus',
    category: 'Engineering & EPC',
    expertiseTags: ['EPC', 'BESS Integration', 'O&M', 'Industrial Rooftop'],
    logoUrl: '/logos/conercon.svg',
    logoSvgUrl: '/logos/conercon.svg',
    website: 'https://conercon.com',
    linkedin: 'https://www.linkedin.com/company/conercon-energy-solutions',
    keyContactName: 'Costas Demetriou',
    keyContactRole: 'Head of Renewable Energy & EPC',
    description: 'Renewable energy arm of Petrolina Group providing engineering, procurement, and construction of commercial solar systems, utility ground mounts, and storage integration.',
    operationalCapacityText: '55+ MWp Utility, Industrial & Rooftop Solar',
    isVerified: true,
  },
  {
    id: 'member-bigsolar',
    name: 'Big Solar Cyprus Ltd',
    type: 'Company',
    tierCategory: 'EPC & Infrastructure Contractors',
    roleOrCategory: 'Tier-1 Equipment Distributor & System Integrator',
    email: 'cyprus@bigsolar.com.cy',
    phone: '+357 22 466800',
    location: 'Nicosia, Cyprus',
    category: 'Engineering & EPC',
    expertiseTags: ['Tier-1 Inverters', 'PV Modules', 'BESS Containers', 'Grid Support'],
    logoUrl: '/logos/bigsolar.svg',
    logoSvgUrl: '/logos/bigsolar.svg',
    website: 'https://bigsolar.com.cy',
    linkedin: 'https://www.linkedin.com/company/big-solar-cyprus',
    keyContactName: 'Giorgos Georgiou',
    keyContactRole: 'Commercial Director',
    description: 'Authorized national distributor of Tier-1 solar panels, string and central inverters, and utility battery containers, serving certified installers island-wide.',
    operationalCapacityText: '80+ MWp Photovoltaic Hardware Deliveries',
    isVerified: true,
  },
  {
    id: 'member-firstelectric',
    name: 'First Electric Solar Ltd',
    type: 'Company',
    tierCategory: 'EPC & Infrastructure Contractors',
    roleOrCategory: 'High-Voltage Grid Substation & Cable Specialist',
    email: 'info@firstelectricsync.com',
    phone: '+357 25 723450',
    location: 'Limassol, Cyprus',
    category: 'Engineering & EPC',
    expertiseTags: ['High-Voltage Cables', 'Substation Switchgear', 'Grid Interconnection'],
    logoUrl: '/logos/firstelectric.svg',
    logoSvgUrl: '/logos/firstelectric.svg',
    website: 'https://firstelectricsync.com',
    linkedin: 'https://www.linkedin.com/company/first-electric-solar',
    keyContactName: 'Nikolas Hadjipavlou',
    keyContactRole: 'Technical Director',
    description: 'Specialist electrical contractor constructing MV/HV transmission connections, transformer stations, and automated grid protection relays for solar parks.',
    operationalCapacityText: '30+ MWp High-Voltage Grid Substations',
    isVerified: true,
  },
  {
    id: 'member-suntechnics',
    name: 'Suntechnics Ltd (Green Energy Group)',
    type: 'Company',
    tierCategory: 'EPC & Infrastructure Contractors',
    roleOrCategory: 'Commercial & Industrial Solar Engineering',
    email: 'info@suntechnics.com.cy',
    phone: '+357 22 443444',
    location: 'Nicosia, Cyprus',
    category: 'Engineering & EPC',
    expertiseTags: ['C&I Solar', 'EPC', 'BESS Integration', 'O&M Monitoring'],
    logoUrl: '/logos/suntechnics.svg',
    logoSvgUrl: '/logos/suntechnics.svg',
    website: 'https://suntechnics.com.cy',
    linkedin: 'https://www.linkedin.com/company/suntechnics-ltd',
    keyContactName: 'Panayiotis Koutsoudis',
    keyContactRole: 'Operations Manager',
    description: 'Dedicated EPC engineering contractor focused on large commercial rooftops, net-billing prosumer installations, and agricultural solar microgrids.',
    operationalCapacityText: '25+ MWp Commercial & Industrial Solar',
    isVerified: true,
  },

  // Tier 4: Advisory & ESG Members
  {
    id: 'member-chryses-demetriades',
    name: 'Chryses Demetriades & Co. LLC',
    type: 'Company',
    tierCategory: 'Advisory & ESG Members',
    roleOrCategory: 'Energy Law, CERA Regulatory Licensing & Project Finance',
    email: 'info@demetriades.com',
    phone: '+357 25 800000',
    location: 'Limassol / Nicosia',
    category: 'Professional Services',
    expertiseTags: ['Energy Law', 'CERA Licensing', 'PPA Contracts', 'Project Finance'],
    logoUrl: '/logos/lanitis.svg', // Fallback or clean monogram
    website: 'https://demetriades.com',
    linkedin: 'https://www.linkedin.com/company/chryses-demetriades-&-co--llc',
    keyContactName: 'Alexandros Tsirides',
    keyContactRole: 'Partner — Energy & Infrastructure Practice',
    description: 'Premier Cyprus law firm advising on CERA licensing, wholesale market rules, cross-border HVDC interconnector treaties, and multi-million euro project finance.',
    operationalCapacityText: 'Tier-1 Energy Law & CERA Regulatory Licensing',
    isVerified: true,
  },
  {
    id: 'member-deloitte',
    name: 'Deloitte Cyprus (Energy & ESG Advisory)',
    type: 'Company',
    tierCategory: 'Advisory & ESG Members',
    roleOrCategory: 'Transaction Advisory, Project Finance & ESG Assurance',
    email: 'cyenergy@deloitte.com',
    phone: '+357 22 360300',
    location: 'Nicosia, Cyprus',
    category: 'Professional Services',
    expertiseTags: ['Financial Advisory', 'ESG Assurance', 'EU Taxonomy', 'M&A'],
    website: 'https://www.deloitte.com/cy',
    linkedin: 'https://www.linkedin.com/company/deloitte-cyprus',
    keyContactName: 'Nicos Papakyriacou',
    keyContactRole: 'Partner, Energy Practice Leader',
    description: 'Providing comprehensive M&A transaction support, capital raising, feasibility analysis, and CSRD/ESG sustainability reporting for renewable energy operators.',
    operationalCapacityText: 'Energy M&A, Financial Advisory & ESG Assurance',
    isVerified: true,
  },
  {
    id: 'member-pwc',
    name: 'PwC Cyprus (Energy & Infrastructure Deals)',
    type: 'Company',
    tierCategory: 'Advisory & ESG Members',
    roleOrCategory: 'Market Modeling, Target Model Readiness & PPAs',
    email: 'pwc.cyprus@cy.pwc.com',
    phone: '+357 22 555000',
    location: 'Nicosia, Cyprus',
    category: 'Professional Services',
    expertiseTags: ['Market Modeling', 'Corporate PPAs', 'Valuations', 'Regulatory Strategy'],
    website: 'https://www.pwc.com.cy',
    linkedin: 'https://www.linkedin.com/company/pwc-cyprus',
    keyContactName: 'Cleo Papadopoulou',
    keyContactRole: 'Partner, Head of Transportation & Infrastructure',
    description: 'Assisting energy developers with wholesale market dispatch modeling, bankable corporate PPA valuation, and regulatory transformation advisory.',
    operationalCapacityText: 'Target Market Readiness & Corporate PPA Advisory',
    isVerified: true,
  },
  {
    id: 'member-kpmg',
    name: 'KPMG Cyprus (Sustainability & Decarbonization)',
    type: 'Company',
    tierCategory: 'Advisory & ESG Members',
    roleOrCategory: 'Decarbonization Pathways, Carbon Auditing & Taxonomy',
    email: 'kpmg@kpmg.com.cy',
    phone: '+357 22 209000',
    location: 'Nicosia, Cyprus',
    category: 'Professional Services',
    expertiseTags: ['ESG Auditing', 'Carbon Accounting', 'Renewable Certifications', 'Taxonomy'],
    website: 'https://kpmg.com/cy',
    linkedin: 'https://www.linkedin.com/company/kpmg-cyprus',
    keyContactName: 'Christophoros Anayiotos',
    keyContactRole: 'Board Member & Head of Energy Practice',
    description: 'Guiding corporate entities through net-zero transition roadmaps, Green Asset Ratios, EU ETS compliance, and carbon footprint audits across the Eastern Mediterranean.',
    operationalCapacityText: 'Decarbonization Pathways & EU Taxonomy Assurance',
    isVerified: true,
  },
];

// ============================================================================
// SECTION 5: ECOSYSTEM SURFACES & OFFICIAL STATUTORY RESOURCES
// ============================================================================

export interface EcosystemSurfaceItem {
  id: string;
  name: string;
  subdomain: string;
  path: string;
  surfaceKey: 'research' | 'helios' | 'members' | 'academy';
  headline: string;
  description: string;
  badge: string;
  accentColor: string;
}

export const CLUSTER_SURFACES: EcosystemSurfaceItem[] = [
  {
    id: 'surface-research',
    name: 'Energeia Research',
    subdomain: 'research.energeia.cy',
    path: '/research',
    surfaceKey: 'research',
    headline: 'Editorial intelligence & policy filings',
    description: 'Institutional publications, CERA regulatory decisions, TSOC curtailment analytics, and wholesale market models.',
    badge: 'Intelligence Stream',
    accentColor: '#1A73E8',
  },
  {
    id: 'surface-helios',
    name: 'Helios 3D Terminal',
    subdomain: 'helios.energeia.cy',
    path: '/helios',
    surfaceKey: 'helios',
    headline: 'Mission-critical energy geospatial GIS',
    description: 'Interactive map of the 132/66 kV transmission grid, 520+ power stations, subsea HVDC corridor, and live grid frequency.',
    badge: 'Geospatial HUD',
    accentColor: '#D46200',
  },
  {
    id: 'surface-members',
    name: 'Ecosystem Directory',
    subdomain: 'members.energeia.cy',
    path: '/members',
    surfaceKey: 'members',
    headline: 'Accredited B2B partner registry',
    description: 'Verified directory of licensed IPPs, EPC contractors, battery storage developers, and energy legal advisors.',
    badge: 'B2B Registry',
    accentColor: '#137333',
  },
  {
    id: 'surface-academy',
    name: 'Energeia Academy',
    subdomain: 'academy.energeia.cy',
    path: '/academy',
    surfaceKey: 'academy',
    headline: 'Workforce certifications & masterclasses',
    description: 'High-voltage safety standards, solar engineering certifications, and executive masterclasses with universities.',
    badge: 'Education & Standards',
    accentColor: '#7B1FA2',
  },
];

export interface StatutoryResource {
  id: string;
  name: string;
  greekName: string;
  category: string;
  description: string;
  website: string;
  roleBadge: string;
}

export const STATUTORY_CYPRUS_RESOURCES: StatutoryResource[] = [
  {
    id: 'cera-paek',
    name: 'CERA (PAEK)',
    greekName: 'Ρυθμιστική Αρχή Ενέργειας Κύπρου (ΡΑΕΚ)',
    category: 'Statutory Regulator',
    description: 'Independent state regulator governing electricity licensing, wholesale market competition, and consumer tariffs.',
    website: 'https://www.cera.org.cy',
    roleBadge: 'Market Authority',
  },
  {
    id: 'tsoc-dsm',
    name: 'TSOC (ΔΣΜΚ)',
    greekName: 'Διαχειριστής Συστήματος Μεταφοράς Κύπρου (ΔΣΜΚ)',
    category: 'System Operator',
    description: 'Independent transmission operator managing the 132/66 kV electrical network, grid dispatch, and real-time balancing.',
    website: 'https://www.dsm.org.cy',
    roleBadge: 'Transmission & Dispatch',
  },
  {
    id: 'eac-ahk',
    name: 'Electricity Authority of Cyprus (EAC)',
    greekName: 'Αρχή Ηλεκτρισμού Κύπρου (ΑΗΚ)',
    category: 'National Utility & DSO',
    description: 'Semi-governmental power producer and licensed Distribution System Operator (DSO) serving over 600,000 customers.',
    website: 'https://www.eac.com.cy',
    roleBadge: 'DSO & Generation',
  },
  {
    id: 'meci-yeeb',
    name: 'Ministry of Energy, Commerce & Industry (YEEB)',
    greekName: 'Υπουργείο Ενέργειας, Εμπορίου και Βιομηχανίας (ΥΕΕΒ)',
    category: 'Government Ministry',
    description: 'Executive energy service custodian of the National Energy & Climate Plan (NECP 2030), renewable subsidies, and offshore gas policy.',
    website: 'https://meci.gov.cy',
    roleBadge: 'National Energy Policy',
  },
];

// ============================================================================
// SECTION 6: CLUSTER NEWS & POLICY BRIEFINGS (ASSOCIATION EDITORIAL STREAM)
// ============================================================================

export const CLUSTER_EDITORIAL_BRIEFS: NewsItem[] = [
  {
    id: 'cluster-brief-bess-framework',
    title: 'Energeia Position Paper: Accelerated Framework for Behind-the-Meter Commercial BESS Integration in Cyprus',
    slug: 'position-paper-commercial-bess-framework-cyprus',
    summary: 'Technical and economic proposals submitted to CERA advocating for fast-track behind-the-meter battery installations for commercial and industrial producers to mitigate midday solar curtailment.',
    content: `### Executive Summary

As solar photovoltaic penetration exceeds 850 MWp across the isolated electrical system of Cyprus, midday renewable curtailment has reached critical levels, frequently surpassing 25% of instantaneous production during low-demand spring and autumn weekends.

The Cyprus Clean Energy Industry Cluster (**Energeia**) has formally submitted an urgent regulatory position paper to the Cyprus Energy Regulatory Authority (**CERA / ΡΑΕΚ**) and the Transmission System Operator of Cyprus (**TSOC / ΔΣΜΚ**), outlining an accelerated regulatory and technical framework for Behind-the-Meter (**BTM**) Commercial and Industrial (**C&I**) Battery Energy Storage Systems.

### Key Regulatory Recommendations

1. **Expedited Fast-Track Permitting**: Exemption from full environmental impact assessments for containerized lithium iron phosphate (LFP) installations under 2 MWh deployed within existing industrial boundaries.
2. **Dynamic Net-Billing Self-Consumption**: Permitting C&I producers to soak excess solar energy during peak midday generation hours and discharge during evening peak tariff windows (18:00–22:00) without incurring arbitrary DSO network standby fees.
3. **Harmonized Safety & Grid Compliance Codes**: Implementation of EN 50549-2 and IEC 62619 standards for battery inverter synchronization with the EAC distribution grid.
4. **Fast Frequency Response (FFR) Participation**: Structuring a transitional ancillary service compensation mechanism allowing aggregated BTM storage fleets to offer sub-second frequency stabilization to the TSOC dispatch center.

### Economic Impact Assessment

Implementing this framework is projected to unlock over 65 MWh of private storage investment within 14 months, avoiding an estimated 38,000 metric tons of CO2 emissions from conventional heavy-fuel-oil units at the Dhekelia power station while directly protecting industrial competitiveness.`,
    category: 'Policy & Regulatory',
    source: 'Energeia Policy Secretariat',
    sourcePublisher: 'Cyprus Clean Energy Cluster',
    sourceUrl: 'https://energeia.cy/research',
    publishedAt: '2026-10-28T08:00:00Z',
    createdAt: '2026-10-28T08:00:00Z',
    status: 'Published',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    isEditorial: true,
  },
  {
    id: 'cluster-brief-tsoc-wholesale',
    title: 'Cluster Secretariat Submits Recommendations on TSOC Wholesale Market Rules Ahead of 2026 Trial Operations',
    slug: 'cluster-recommendations-tsoc-wholesale-market-rules',
    summary: 'Comprehensive feedback on the interim market rules, proposing transparent imbalance settlement pricing and streamlined clearing mechanisms for private bilateral contracts.',
    content: `### Transitioning from Interim Bilateral Regime to the European Target Model

The transition of the Cyprus electricity market from the interim bilateral contractual regime (approved under CERA Regulatory Decision 01/2017) to the fully liberalized European Target Model marks the most significant reform of the island’s energy architecture in two decades.

Following the circulation of the TSOC Market Rules Draft (Version 4.2), the Energeia Wholesale Market Working Group (WG 03) convened leading independent power producers, licensed traders, and corporate off-takers to compile a consensus memorandum.

### Core Areas of Submission

1. **Dual-Pricing Imbalance Settlement Risk**: The proposed punitive penalties for intermittent solar forecasting deviations risk bankrupting small-to-medium PV aggregators in the absence of a liquid intra-day balancing market. Energeia proposes a transitional 12-month tolerance band (±15%) pegged to marginal thermal costs.
2. **Transparent Ancillary Service Remuneration**: The TSOC must establish competitive auctions for primary and secondary frequency control rather than relying on mandatory non-remunerated EAC generation dispatch.
3. **Clearing House & Credit Collateral Standards**: Streamlining bank guarantee requirements for private suppliers entering bilateral Corporate Power Purchase Agreements (CPPAs) with commercial hotels and manufacturing centers in Limassol and Nicosia.

### Next Steps & Stakeholder Hearings

The Cluster Secretariat has requested an institutional hearing with the CERA Board of Directors and the TSOC System Operator in early November 2026 to present the quantitative dispatch simulation model prepared by the Energeia Analytics Unit.`,
    category: 'Grid & Infrastructure',
    source: 'Energeia Market Committee',
    sourcePublisher: 'Cyprus Clean Energy Cluster',
    sourceUrl: 'https://energeia.cy/research',
    publishedAt: '2026-10-15T09:30:00Z',
    createdAt: '2026-10-15T09:30:00Z',
    status: 'Published',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80',
    isEditorial: true,
  },
  {
    id: 'cluster-brief-clean-energy-summit',
    title: 'Cyprus Clean Energy Summit 2026: Annual Gathering of Sovereign & Private Energy Stakeholders in Limassol',
    slug: 'cyprus-clean-energy-summit-2026-limassol',
    summary: 'The premier institutional summit uniting European Commission representatives, MED-TSO operators, private IPPs, and institutional financiers at the Parklane Resort, Limassol.',
    content: `### Convening the Mediterranean Energy Transition

The Board of Directors of **Energeia Cyprus** is proud to announce the **Cyprus Clean Energy Summit 2026**, scheduled to take place at the Parklane Resort & Spa in Limassol, Cyprus, under the auspices of the Ministry of Energy, Commerce & Industry.

As the Eastern Mediterranean emerges as a vital energy corridor connecting Europe, North Africa, and the Levant, the summit will convene over 450 senior delegates representing utility-scale solar developers, institutional infrastructure funds, transmission system operators, and European policymaking institutions.

### Summit Program Tracks

* **Track A — Grid Interconnectivity & HVDC Corridors**: Deep-dive into the technical execution and financing of the Great Sea Interconnector (Crete–Cyprus 500 kV HVDC subsea link), subsea survey progress by Nexans, and cross-border market integration with the European mainland.
* **Track B — Utility Storage & Solar Modernization**: Overcoming grid saturation, deploying 320 MWh of centralized BESS, battery safety standards, and agro-voltaic dual-use land planning.
* **Track C — Corporate PPAs & Wholesale Market Go-Live**: Structuring bankable bilateral contracts, green guarantees of origin (GOs), and corporate off-take strategies for multinational enterprises operating in Cyprus.
* **Track D — Green Hydrogen & Industrial Decarbonization**: Developing the Vasilikos energy corridor, clean bunkering for the Limassol shipping sector, and industrial fuel substitution.

### Registration & Cluster Accreditation

Accredited Energeia cluster members receive priority delegate passes and access to the closed-door sovereign investor roundtable. Non-member organizations and international delegations may apply for admission through the Cluster Secretariat.`,
    category: 'Market & Finance',
    source: 'Energeia Executive Directorate',
    sourcePublisher: 'Cyprus Clean Energy Cluster',
    sourceUrl: 'https://energeia.cy/research',
    publishedAt: '2026-09-30T10:00:00Z',
    createdAt: '2026-09-30T10:00:00Z',
    status: 'Published',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    isEditorial: true,
  },
];
