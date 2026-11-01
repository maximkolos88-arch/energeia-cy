import { DirectoryMember, NewsItem } from '../models/types';

// ============================================================================
// SECTION 2: LIVE TELEMETRY & NATIONAL METRICS
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
    subtext: 'Over 35,000 distributed & utility installations island-wide',
    source: 'CERA / TSOC Verified',
    trend: '+22% YoY Expansion',
    badge: 'Operational',
    badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
  },
  {
    id: 'bess-queue',
    value: '320 MWh',
    label: 'Utility Storage Pipeline',
    subtext: 'Centralized & co-located fast-track battery tenders',
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
// SECTION 3: STRATEGIC WORKING GROUPS (LABS INITIATIVES BENTO)
// ============================================================================

export interface LabsWorkingGroup {
  id: string;
  code: string;
  number: string;
  title: string;
  subtitle: string;
  scope: string;
  chair: string;
  status: string;
  statusColor: string;
  initiatives: string[];
}

export const LABS_WORKING_GROUPS: LabsWorkingGroup[] = [
  {
    id: 'wg-01',
    code: '[WG-01]',
    number: '01',
    title: 'Storage & Flexibility',
    subtitle: 'Centralized & Behind-the-Meter BESS Fast-Tracking',
    scope: 'Resolving TSOC grid curtailment (>25%), structuring co-located 150MW+ battery tenders, and establishing fast-frequency response (FFR) subsea grid standards.',
    chair: 'Technical Grid Committee',
    status: 'Active Consultation',
    statusColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    initiatives: [
      'Centralized 150MW+ Tender Framework',
      'Behind-the-Meter C&I Storage Rules',
      'Fast Frequency Response (FFR) Codes',
    ],
  },
  {
    id: 'wg-02',
    code: '[WG-02]',
    number: '02',
    title: 'Wholesale Market Reform',
    subtitle: 'Competitive EU Target Model Transition',
    scope: 'Direct engagement with CERA (PAEK) and TSOC for liberalized electricity market opening, day-ahead balancing rules, and transparent ancillary remuneration.',
    chair: 'Regulatory Affairs Taskforce',
    status: 'CERA Filing Staged',
    statusColor: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
    initiatives: [
      'EU Target Model Trial Operations',
      'Imbalance Settlement Tolerance Bands',
      'Corporate Bilateral PPA Standards',
    ],
  },
  {
    id: 'wg-03',
    code: '[WG-03]',
    number: '03',
    title: 'Utility Generation & Agro-PV',
    subtitle: 'Land Zoning & Multi-Megawatt Renewable Deployment',
    scope: 'Accelerating spatial licensing for multi-megawatt PV installations, dual-use agricultural solar standards, and 132/22 kV high-voltage substation connections.',
    chair: 'Renewables Council',
    status: 'Inter-Ministry Review',
    statusColor: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40',
    initiatives: [
      'Agro-Voltaic Spatial Standards',
      'Substation Interconnection Quotas',
      'Fast-Track Environmental Licensing',
    ],
  },
  {
    id: 'wg-04',
    code: '[WG-04]',
    number: '04',
    title: 'Technical Standards & Safety',
    subtitle: 'Class A Engineering Criteria & Workforce Codes',
    scope: 'High-voltage switching certification, national PV installer codes of practice, and co-developing accredited clean energy engineering curricula with Cyprus universities.',
    chair: 'Engineering & Safety Board',
    status: 'Standards Active',
    statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    initiatives: [
      'High-Voltage Switching Certification',
      'National PV Installer Code of Practice',
      'University Engineering Fellowships',
    ],
  },
];

// ============================================================================
// SECTION 4: ACCREDITED MEMBERS SHOWCASE (GOOGLE LABS GALLERY)
// ============================================================================

export type LabsTierKey = 
  | 'Strategic Patrons' 
  | 'Corporate Operators' 
  | 'EPC & Engineering' 
  | 'Advisory';

export interface LabsMemberEntry extends DirectoryMember {
  labsTier: LabsTierKey;
  tierBadgeText: string;
  capacityMetric: string;
  logoSvgUrl?: string;
  featuredQuote?: string;
}

export const LABS_MEMBERS: LabsMemberEntry[] = [
  // Strategic Patrons
  {
    id: 'partner-eac',
    name: 'Electricity Authority of Cyprus (EAC / AHK)',
    type: 'Company',
    labsTier: 'Strategic Patrons',
    tierBadgeText: 'Sovereign Utility Patron',
    roleOrCategory: 'National Power Producer & Distribution System Operator',
    email: 'eacinfo@eac.com.cy',
    phone: '+357 22 201000',
    location: 'Nicosia, Cyprus',
    category: 'Government & Associations',
    expertiseTags: ['Smart Grids', 'Energy Efficiency', 'DSO Operation', 'Generation'],
    logoUrl: '/logos/eac.svg',
    logoSvgUrl: '/logos/eac.svg',
    website: 'https://www.eac.com.cy',
    linkedin: 'https://www.linkedin.com/company/eac-cyprus',
    keyContactName: 'Adonis Yiasemides',
    keyContactRole: 'Acting General Manager & Chief Operations Officer',
    description: 'Cyprus state utility responsible for power generation, transmission, and distribution grid operation under DTR regulation.',
    capacityMetric: '1,480 MW Generation · 850+ MWp RES Interface',
    isVerified: true,
  },
  {
    id: 'partner-bioland',
    name: 'Bioland Energy Group',
    type: 'Company',
    labsTier: 'Strategic Patrons',
    tierBadgeText: 'Strategic Energy Patron',
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
    capacityMetric: '95+ MWp Operational Solar PV Assets',
    isVerified: true,
  },
  {
    id: 'partner-muskita',
    name: 'Muskita Solar Systems',
    type: 'Company',
    labsTier: 'Strategic Patrons',
    tierBadgeText: 'Strategic Energy Patron',
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
    capacityMetric: '40+ MWp Commercial & Utility PV Portfolio',
    isVerified: true,
  },
  {
    id: 'partner-geg',
    name: 'Green Energy Group (GEG)',
    type: 'Company',
    labsTier: 'Strategic Patrons',
    tierBadgeText: 'Strategic Energy Patron',
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
    capacityMetric: '70+ MWp Utility PV & Substation Portfolio',
    isVerified: true,
  },
  {
    id: 'partner-lanitis',
    name: 'Lanitis Energy',
    type: 'Company',
    labsTier: 'Strategic Patrons',
    tierBadgeText: 'Strategic Energy Patron',
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
    capacityMetric: '65+ MWp Solar PV Portfolio & Corporate PPAs',
    isVerified: true,
  },

  // Corporate Operators
  {
    id: 'operator-akerasi',
    name: 'Akerasi Bioenergy Plant',
    type: 'Company',
    labsTier: 'Corporate Operators',
    tierBadgeText: 'Corporate Operator',
    roleOrCategory: 'Baseload Renewable Power & Biogas Producer',
    email: 'info@akerasi.com.cy',
    phone: '+357 24 639300',
    location: 'Larnaca, Cyprus',
    category: 'Renewables',
    expertiseTags: ['Biomass', 'Baseload Generation', 'Waste-to-Energy'],
    logoUrl: '/logos/akerasi.svg',
    logoSvgUrl: '/logos/akerasi.svg',
    website: 'https://akerasi.com.cy',
    linkedin: 'https://www.linkedin.com/company/akerasi-energy',
    keyContactName: 'Andreas Kourris',
    keyContactRole: 'Plant Operations Director',
    description: 'Flagship anaerobic digestion facility generating round-the-clock dispatchable green electricity and heat from agricultural and organic residues in Larnaca district.',
    capacityMetric: '15+ MW Biomass Baseload & Biogas Cogeneration',
    isVerified: true,
  },
  {
    id: 'operator-helleniq',
    name: 'HELLENiQ Renewables Cyprus',
    type: 'Company',
    labsTier: 'Corporate Operators',
    tierBadgeText: 'Corporate Operator',
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
    capacityMetric: '50+ MWp Utility Solar Portfolio',
    isVerified: true,
  },

  // EPC & Engineering
  {
    id: 'partner-caramondani',
    name: 'Caramondani Energy Solutions (Caramondani Bros PLC)',
    type: 'Company',
    labsTier: 'EPC & Engineering',
    tierBadgeText: 'Class A EPC Contractor',
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
    capacityMetric: '45+ MWp Turnkey Solar Farms & Substations',
    isVerified: true,
  },
  {
    id: 'partner-conercon',
    name: 'Conercon Energy Solutions (Petrolina Group)',
    type: 'Company',
    labsTier: 'EPC & Engineering',
    tierBadgeText: 'Turnkey EPC Partner',
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
    capacityMetric: '55+ MWp Utility, Industrial & Rooftop Solar',
    isVerified: true,
  },
  {
    id: 'partner-bigsolar',
    name: 'Big Solar Cyprus Ltd',
    type: 'Company',
    labsTier: 'EPC & Engineering',
    tierBadgeText: 'Tier-1 Hardware Partner',
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
    capacityMetric: '80+ MWp Photovoltaic Hardware Deliveries',
    isVerified: true,
  },
  {
    id: 'partner-firstelectric',
    name: 'First Electric Solar Ltd',
    type: 'Company',
    labsTier: 'EPC & Engineering',
    tierBadgeText: 'HV Grid Specialist',
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
    capacityMetric: '30+ MWp High-Voltage Grid Substations',
    isVerified: true,
  },

  // Advisory & Professional Services
  {
    id: 'partner-chryses-demetriades',
    name: 'Chryses Demetriades & Co. LLC',
    type: 'Company',
    labsTier: 'Advisory',
    tierBadgeText: 'Energy Legal Counsel',
    roleOrCategory: 'Energy Law, CERA Regulatory Licensing & Project Finance',
    email: 'info@demetriades.com',
    phone: '+357 25 800000',
    location: 'Limassol / Nicosia',
    category: 'Professional Services',
    expertiseTags: ['Energy Law', 'CERA Licensing', 'PPA Contracts', 'Project Finance'],
    website: 'https://demetriades.com',
    linkedin: 'https://www.linkedin.com/company/chryses-demetriades-&-co--llc',
    keyContactName: 'Alexandros Tsirides',
    keyContactRole: 'Partner — Energy & Infrastructure Practice',
    description: 'Premier Cyprus law firm advising on CERA licensing, wholesale market rules, cross-border HVDC interconnector treaties, and multi-million euro project finance.',
    capacityMetric: 'Tier-1 Energy Law & CERA Regulatory Licensing',
    isVerified: true,
  },
  {
    id: 'partner-deloitte',
    name: 'Deloitte Cyprus (Energy & ESG Practice)',
    type: 'Company',
    labsTier: 'Advisory',
    tierBadgeText: 'Transaction Advisory',
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
    capacityMetric: 'Energy M&A, Financial Advisory & ESG Assurance',
    isVerified: true,
  },
  {
    id: 'partner-pwc',
    name: 'PwC Cyprus (Energy & Infrastructure Deals)',
    type: 'Company',
    labsTier: 'Advisory',
    tierBadgeText: 'Market Modeling & Deals',
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
    capacityMetric: 'Target Market Readiness & Corporate PPA Advisory',
    isVerified: true,
  },
];

// ============================================================================
// SECTION 5: CLUSTER BRIEFINGS & POLICY DESK (EDITORIAL STREAM)
// ============================================================================

export const LABS_BRIEFINGS: NewsItem[] = [
  {
    id: 'brief-bess-framework',
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
    id: 'brief-tsoc-wholesale',
    title: 'Cluster Secretariat Submits Recommendations on TSOC Wholesale Market Rules Ahead of 2026 Trial Operations',
    slug: 'cluster-recommendations-tsoc-wholesale-market-rules',
    summary: 'Comprehensive feedback on the interim market rules, proposing transparent imbalance settlement pricing and streamlined clearing mechanisms for private bilateral contracts.',
    content: `### Transitioning from Interim Bilateral Regime to the European Target Model

The transition of the Cyprus electricity market from the interim bilateral contractual regime (approved under CERA Regulatory Decision 01/2017) to the fully liberalized European Target Model marks the most significant reform of the island’s energy architecture in two decades.

Following the circulation of the TSOC Market Rules Draft (Version 4.2), the Energeia Wholesale Market Working Group (WG 02) convened leading independent power producers, licensed traders, and corporate off-takers to compile a consensus memorandum.

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
    id: 'brief-clean-energy-summit',
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

// ============================================================================
// SECTION 6: MEMBERSHIP TIERS COMPARISON DECK (GOOGLE LABS STYLING)
// ============================================================================

export interface LabsMembershipTier {
  id: string;
  name: string;
  category: string;
  targetAudience: string;
  badge: string;
  isPatronHighlight?: boolean;
  deliverables: string[];
}

export const LABS_MEMBERSHIP_DECK: LabsMembershipTier[] = [
  {
    id: 'tier-strategic-patron',
    name: 'Strategic Patron',
    category: 'Flagship Utility & Systemic Operators',
    targetAudience: 'National utilities, licensed IPPs (50MW+), infrastructure funds, and large-scale BESS developers',
    badge: 'Flagship Patron',
    isPatronHighlight: true,
    deliverables: [
      'Dedicated high-priority corporate dossier with live generation telemetry & asset metrics',
      'Branded operational asset pins & high-voltage grid interconnection display on Helios 3D GIS terminal',
      'Permanent steering seat on CERA & TSOC regulatory consultation working groups',
      'Unlimited corporate PR briefings & guaranteed editorial distribution across Research & Google News',
      'Direct priority routing for institutional investor, sovereign fund & commercial PPA inquiries',
    ],
  },
  {
    id: 'tier-corporate-member',
    name: 'Corporate Member',
    category: 'Licensed EPCs & BESS Developers',
    targetAudience: 'Turnkey solar EPC contractors, high-voltage engineers, equipment distributors, and storage operators',
    badge: 'Certified Operator',
    deliverables: [
      'Verified Directory placement with official "Certified Cyprus Energy Operator" badge',
      'Direct B2B commercial RFQ & contractor lead routing from prosumers, hotels, and utility developers',
      'Quarterly turnkey project spotlights & commissioned plant case studies published on the portal',
      'Participation in cluster technical working groups (WG-01 Storage & WG-03 Utility PV)',
      'Direct notifications on verified national procurement tenders & equipment inquiries',
    ],
  },
  {
    id: 'tier-associate-member',
    name: 'Associate Member',
    category: 'Professional Services & ESG Consultancies',
    targetAudience: 'Energy law practices, project finance advisors, technical auditors, and ESG assurance specialists',
    badge: 'Professional Services',
    deliverables: [
      'Standard verified corporate registry listing & lead partner profile with direct booking links',
      'CERA regulatory commentary & legal policy analysis publication rights in the Energeia Research feed',
      'Inbound deal-structuring, project finance & ESG advisory lead forwarding',
      'Official institutional accreditation badge for corporate communications and website trust seal',
      'Invitations to closed-door commercial roundtables with European Commission & MED-TSO delegates',
    ],
  },
];

// Backwards-compatible aliases
export const FEATURED_PARTNERS = LABS_MEMBERS;
export const CLUSTER_PORTAL_MEMBERS = LABS_MEMBERS;
export const CLUSTER_EDITORIAL_BRIEFS = LABS_BRIEFINGS;
export const STRATEGIC_PILLARS = LABS_WORKING_GROUPS;

// ============================================================================
// OFFICIAL LABS.GOOGLE ARCHITECTURE & DATA SPECIFICATION (ENERGEIA.CY)
// ============================================================================

export interface LabsCategoryDefinition {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export interface LabsExperimentLifecycle {
  state: 'TRY_NOW' | 'IN_EVALUATION' | 'IN_EXECUTION' | 'VERIFIED_REGISTRY' | 'ENROLLING' | string;
  label: string;
  badge: string;
  isGated: boolean;
}

export interface LabsExperimentLayout {
  bentoSpan: {
    desktopCols: number;
    desktopRows: number;
    mobileCols: number;
    mobileRows: number;
  };
  featured: boolean;
  visualComponent: string;
}

export interface LabsExperimentMedia {
  previewType: string;
  aspectRatio: string;
  thumbnailUrl: string;
  previewLoopUrl?: string;
}

export interface LabsExperimentMeta {
  team: string;
  releasedAt: string;
  technologiesUsed: string[];
  tags: string[];
}

export interface LabsExperimentActions {
  primary: { label: string; url: string };
  secondary?: { label: string; url: string };
}

export interface LabsExperiment {
  id: string;
  name: string;
  internalCodename: string;
  category: string;
  tagline: string;
  summary: string;
  lifecycle: LabsExperimentLifecycle;
  layout: LabsExperimentLayout;
  media: LabsExperimentMedia;
  meta: LabsExperimentMeta;
  actions: LabsExperimentActions;
}

export interface LifeBeyondTheLabItem {
  id: string;
  labExperimentName: string;
  graduatedProduct: string;
  yearIncubated: number;
  yearGraduated: number;
  description: string;
  productUrl: string;
}

export interface LabsMembershipTierNew {
  tierId: string;
  name: string;
  badge: string;
  target: string;
  deliverables: string[];
  action: {
    label: string;
    modalTierPreselect: 'strategic' | 'corporate' | 'associate';
  };
}

export interface LabsFooterConfig {
  copyright: string;
  disclaimer: string;
  operator: {
    legalEntity: string;
    registrationNumber: string;
    headquarters: string;
    contactEmail: string;
  };
  links: Array<{ label: string; url: string }>;
}

export interface LabsSiteSpec {
  site: {
    name: string;
    domain: string;
    headline: string;
    description: string;
    theme: {
      light: {
        background: string;
        surface: string;
        surfaceVariant: string;
        border: string;
        textPrimary: string;
        textSecondary: string;
      };
      dark: {
        background: string;
        surface: string;
        surfaceVariant: string;
        border: string;
        textPrimary: string;
        textSecondary: string;
      };
      accents: {
        copper: string;
        olive: string;
        cyan: string;
        solarGold: string;
        googleBlue: string;
        signalRed: string;
        gridEmerald: string;
      };
    };
  };
  categories: LabsCategoryDefinition[];
  experiments: LabsExperiment[];
  lifeBeyondTheLab: LifeBeyondTheLabItem[];
  membershipTiers: LabsMembershipTierNew[];
  footer: LabsFooterConfig;
}

export const LABS_SITE_SPEC: LabsSiteSpec = {
  site: {
    name: "Energeia",
    domain: "energeia.cy",
    headline: "The operating system for Cyprus’s clean energy transition",
    description: "The national clean energy industry cluster uniting licensed producers, utility BESS developers, grid engineers, and institutional capital across the Republic of Cyprus.",
    theme: {
      light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        surfaceVariant: "#F1F3F4",
        border: "rgba(0, 0, 0, 0.06)",
        textPrimary: "#1F1F1F",
        textSecondary: "#5F6368"
      },
      dark: {
        background: "#131314",
        surface: "#1E1F20",
        surfaceVariant: "#282A2C",
        border: "rgba(255, 255, 255, 0.08)",
        textPrimary: "#E3E3E3",
        textSecondary: "#9AA0A6"
      },
      accents: {
        copper: "#D46200",
        olive: "#3C4E1C",
        cyan: "#00E5FF",
        solarGold: "#FBBC05",
        googleBlue: "#1A73E8",
        signalRed: "#EA4335",
        gridEmerald: "#34A853"
      }
    }
  },
  categories: [
    { id: "all", label: "All Surfaces", slug: "all", description: "All cluster surfaces, infrastructure maps, and regulatory sandboxes" },
    { id: "generation", label: "Generation & PV", slug: "generation", description: "Utility solar PV assets, agro-voltaics, and independent power producers" },
    { id: "storage", label: "Storage & BESS", slug: "storage", description: "Centralized utility storage pipelines, fast-track tenders, and commercial flexibility" },
    { id: "grid", label: "Grid & Interconnection", slug: "grid", description: "132 kV transmission telemetry, substation dispatch, and subsea HVDC corridors" },
    { id: "intelligence", label: "Intelligence & Policy", slug: "intelligence", description: "CERA regulatory decisions, TSOC market clearing rules, and whitepapers" },
    { id: "directory", label: "B2B Directory", slug: "directory", description: "Accredited operators, licensed EPC contractors, and institutional member dossiers" }
  ],
  experiments: [
    {
      id: "helios_terminal",
      name: "Helios Terminal",
      internalCodename: "3D Geospatial Grid OS",
      category: "grid",
      tagline: "Real-time 3D spatial GIS and substation telemetry terminal",
      summary: "Full-spectrum spatial monitoring across Cyprus: TSOC 132 kV transmission loops, Vasilikos & Dhekelia dispatch, 520+ solar plants, and live grid frequency tracking.",
      lifecycle: {
        state: "TRY_NOW",
        label: "Launch Terminal",
        badge: "Live Telemetry",
        isGated: false
      },
      layout: {
        bentoSpan: {
          desktopCols: 8,
          desktopRows: 2,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: true,
        visualComponent: "live_grid_telemetry_hud"
      },
      media: {
        previewType: "interactive_gis_slice",
        aspectRatio: "16:9",
        thumbnailUrl: "https://energeia.cy/assets/helios-preview.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/helios-3d-loop.mp4"
      },
      meta: {
        team: "Energeia Spatial Engineering & TSOC Interface",
        releasedAt: "2026-04-15",
        technologiesUsed: ["MapLibre GL", "Three.js", "TSOC SCADA Bridge", "WebAssembly"],
        tags: ["132 kV Grid", "Substations", "Frequency 50Hz", "Curtailment Tracker"]
      },
      actions: {
        primary: { label: "Launch Helios 3D GIS ↗", url: "https://helios.energeia.cy" },
        secondary: { label: "Inspect API Docs", url: "https://research.energeia.cy/docs/telemetry" }
      }
    },
    {
      id: "bess_pipeline_tracker",
      name: "Central BESS Queue",
      internalCodename: "Flexibility Sandbox",
      category: "storage",
      tagline: "Utility battery storage allocation and curtailment mitigation engine",
      summary: "Tracks allocation status for Cyprus's 320 MWh fast-track utility battery storage tenders across central transmission nodes (Kofinou, Vasilikos, and Moni).",
      lifecycle: {
        state: "IN_EVALUATION",
        label: "Tender Active",
        badge: "Fast-Track Batch 01",
        isGated: true
      },
      layout: {
        bentoSpan: {
          desktopCols: 4,
          desktopRows: 1,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: false,
        visualComponent: "bess_capacity_gauge"
      },
      media: {
        previewType: "interactive_gauge",
        aspectRatio: "16:9",
        thumbnailUrl: "https://energeia.cy/assets/bess-queue.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/bess-sim.mp4"
      },
      meta: {
        team: "Energeia WG-01 Storage Taskforce",
        releasedAt: "2026-06-01",
        technologiesUsed: ["TimescaleDB", "CERA Regulatory Indexer"],
        tags: ["320 MWh", "Grid Autonomy", "Fast-Track Tender"]
      },
      actions: {
        primary: { label: "Inspect Queue Status", url: "https://research.energeia.cy/briefings/bess-allocation-2026" }
      }
    },
    {
      id: "great_sea_interconnector",
      name: "Great Sea Interconnector",
      internalCodename: "Project EuroAsia HVDC",
      category: "grid",
      tagline: "Subsea 525 kV HVDC Crete–Cyprus cross-border power bridge",
      summary: "Geopolitical and engineering tracking of the €1.9B European Project of Common Interest (PCI 3.10.1) descending to -3,000m seabed trench to end Cyprus's electrical isolation.",
      lifecycle: {
        state: "IN_EXECUTION",
        label: "Milestone Tracker",
        badge: "PCI 3.10.1 · €1.9B",
        isGated: false
      },
      layout: {
        bentoSpan: {
          desktopCols: 4,
          desktopRows: 1,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: false,
        visualComponent: "bathymetric_cable_profile"
      },
      media: {
        previewType: "bathymetric_3d",
        aspectRatio: "16:9",
        thumbnailUrl: "https://energeia.cy/assets/gsi-corridor.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/gsi-route.mp4"
      },
      meta: {
        team: "EU Infrastructure Taskforce",
        releasedAt: "2026-01-20",
        technologiesUsed: ["Nexans Marine Route Engine", "VSC-HVDC Modeling"],
        tags: ["1,000 MW", "Subsea HVDC", "-3,000m Trench", "Kofinou Converter"]
      },
      actions: {
        primary: { label: "Inspect Corridor ↗", url: "https://helios.energeia.cy?layer=gsi-subsea" }
      }
    },
    {
      id: "research_briefings",
      name: "Energeia Research",
      internalCodename: "Market Intelligence Desk",
      category: "intelligence",
      tagline: "Institutional intelligence, CERA statutory rulings, and market briefs",
      summary: "Editorial whitepaper stream modeling Google Research: day-ahead market reform, TSOC dispatch rules, negative pricing forecasts, and corporate M&A filings.",
      lifecycle: {
        state: "TRY_NOW",
        label: "Read Briefings",
        badge: "Whitepaper Desk",
        isGated: false
      },
      layout: {
        bentoSpan: {
          desktopCols: 6,
          desktopRows: 1,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: false,
        visualComponent: "whitepaper_reader_card"
      },
      media: {
        previewType: "document_preview",
        aspectRatio: "16:9",
        thumbnailUrl: "https://energeia.cy/assets/research-cover.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/research-briefings.mp4"
      },
      meta: {
        team: "Energeia Editorial Board & Legal Analysts",
        releasedAt: "2026-05-10",
        technologiesUsed: ["Structured JSON-LD", "SSG Prerendering", "CERA PDF OCR Engine"],
        tags: ["CERA Decisions", "Market Reform", "Wholesale Rules", "PPA Pricing"]
      },
      actions: {
        primary: { label: "Open Research Hub ↗", url: "https://research.energeia.cy" }
      }
    },
    {
      id: "member_registry",
      name: "Accredited Member Directory",
      internalCodename: "Cluster B2B Network",
      category: "directory",
      tagline: "Accredited registry of verified solar operators, BESS funds, and EPCs",
      summary: "Commercial B2B registry modeled after TechIsland: company dossiers, HE registrar numbers, operational megawatt pipelines, and certified executive lead routing.",
      lifecycle: {
        state: "VERIFIED_REGISTRY",
        label: "Browse Directory",
        badge: "50+ Accredited Members",
        isGated: false
      },
      layout: {
        bentoSpan: {
          desktopCols: 6,
          desktopRows: 1,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: false,
        visualComponent: "verified_dossier_stack"
      },
      media: {
        previewType: "partner_dossier_grid",
        aspectRatio: "16:9",
        thumbnailUrl: "https://energeia.cy/assets/directory-preview.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/directory-flow.mp4"
      },
      meta: {
        team: "Cluster Secretariat & Membership Committee",
        releasedAt: "2026-07-01",
        technologiesUsed: ["Supabase B2B Registry", "Cyprus Registrar HE Sync"],
        tags: ["Bioland", "Muskita", "Green Energy Group", "EAC", "Verified EPC"]
      },
      actions: {
        primary: { label: "Explore Members ↗", url: "https://members.energeia.cy" },
        secondary: { label: "Claim Profile", url: "https://energeia.cy/register" }
      }
    },
    {
      id: "energeia_academy",
      name: "Energeia Academy",
      internalCodename: "Workforce & Grid Standards",
      category: "intelligence",
      tagline: "Engineering standards, high-voltage safety, and installer certifications",
      summary: "Technical upskilling hub standardizing commercial solar installation, utility substation operations, battery system commissioning, and European grid codes.",
      lifecycle: {
        state: "ENROLLING",
        label: "Browse Tracks",
        badge: "Technical Certifications",
        isGated: false
      },
      layout: {
        bentoSpan: {
          desktopCols: 12,
          desktopRows: 1,
          mobileCols: 12,
          mobileRows: 1
        },
        featured: false,
        visualComponent: "curriculum_module_ticker"
      },
      media: {
        previewType: "course_browser",
        aspectRatio: "21:9",
        thumbnailUrl: "https://energeia.cy/assets/academy-banner.webp",
        previewLoopUrl: "https://energeia.cy/assets/videos/academy-walkthrough.mp4"
      },
      meta: {
        team: "Energeia Standards Committee & Academic Partners",
        releasedAt: "2026-08-15",
        technologiesUsed: ["LMS Engine", "EAC Safety Code Framework"],
        tags: ["Class A Electrical", "HV Substation Safety", "Installer Certification"]
      },
      actions: {
        primary: { label: "Open Academy ↗", url: "https://academy.energeia.cy" }
      }
    }
  ],
  lifeBeyondTheLab: [
    {
      id: "net_billing_to_utility_boom",
      labExperimentName: "5 MWp Net-Billing Sandbox",
      graduatedProduct: "850+ MWp National PV Pipeline",
      yearIncubated: 2023,
      yearGraduated: 2025,
      description: "Originally launched as an experimental distributed generation sandbox with CERA, now graduated into the national private solar foundation generating 19.8% of the Republic's electricity.",
      productUrl: "https://research.energeia.cy/case-studies/net-billing-scale"
    },
    {
      id: "kofinou_pilot_to_bess_code",
      labExperimentName: "Kofinou Substation Inverter Pilot",
      graduatedProduct: "2026 National Utility BESS Grid Code",
      yearIncubated: 2024,
      yearGraduated: 2026,
      description: "Technical field testing of virtual inertia and zero-voltage ride-through at Kofinou graduated into the statutory grid-connection code for all 320 MWh battery storage tender applicants.",
      productUrl: "https://research.energeia.cy/case-studies/bess-grid-code"
    },
    {
      id: "curtailment_taskforce_to_ppa",
      labExperimentName: "Midday Curtailment Mitigation Taskforce",
      graduatedProduct: "Direct B2B Green Corporate PPA Framework",
      yearIncubated: 2025,
      yearGraduated: 2026,
      description: "An emergency working group addressing solar clipping evolved into the formal bilateral PPA framework enabling industrial off-takers to contract directly with private IPPs.",
      productUrl: "https://members.energeia.cy/ppas"
    }
  ],
  membershipTiers: [
    {
      tierId: "strategic_patron",
      name: "Strategic Patron",
      badge: "Board & Institutional IPP",
      target: "Utility asset owners (20+ MWp pipeline), systemic banks, major BESS infrastructure funds",
      deliverables: [
        "Permanent homepage brand showcase & board-level positioning",
        "Dedicated interactive asset dossier on Helios 3D GIS Terminal",
        "Guaranteed publication rights for corporate & commissioning briefings in Energeia Research",
        "Co-chair steering seats on CERA & TSOC regulatory consultation working groups"
      ],
      action: {
        "label": "Request Patron Accreditation",
        "modalTierPreselect": "strategic"
      }
    },
    {
      tierId: "corporate_member",
      name: "Corporate Member",
      badge: "Licensed EPC & Operator",
      target: "Commercial solar developers, high-voltage contractors, equipment distributors, BESS integrators",
      deliverables: [
        "Verified B2B Directory Dossier with certified lead routing",
        "Up to 6 published project commissioning and expansion releases per year",
        "Voting representation in Grid Modernization and Wholesale Market working groups",
        "Access to institutional B2B supplier networking delegations"
      ],
      action: {
        "label": "Apply for Corporate Tier",
        "modalTierPreselect": "corporate"
      }
    },
    {
      tierId: "associate_member",
      name: "Associate Member",
      badge: "Professional Services",
      target: "Energy law practices, ESG compliance consultants, technical auditors, insurance syndicates",
      deliverables: [
        "Accredited professional registry listing in Member Directory",
        "Bi-annual legal or ESG regulatory whitepaper publication rights",
        "Direct inquiry routing for project finance and statutory compliance"
      ],
      action: {
        "label": "Join as Associate",
        "modalTierPreselect": "associate"
      }
    }
  ],
  footer: {
    copyright: "© 2026 Energeia. All rights reserved.",
    disclaimer: "Energeia is the independent energy industry cluster of the Republic of Cyprus. Data streamed from TSOC and CERA is for institutional monitoring and analytical orientation.",
    operator: {
      legalEntity: "M3J2 LTD",
      registrationNumber: "HE 438859",
      headquarters: "Limassol, Cyprus",
      contactEmail: "secretariat@energeia.cy"
    },
    links: [
      { label: "Cluster Manifesto", url: "https://energeia.cy/manifesto" },
      { label: "Research Desk", url: "https://research.energeia.cy" },
      { label: "Helios GIS Terminal", url: "https://helios.energeia.cy" },
      { label: "B2B Member Registry", url: "https://members.energeia.cy" },
      { label: "Academy Certifications", url: "https://academy.energeia.cy" },
      { label: "Privacy Policy", url: "https://energeia.cy/privacy" },
      { label: "Statutory Governance", url: "https://energeia.cy/governance" }
    ]
  }
};

