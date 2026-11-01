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
