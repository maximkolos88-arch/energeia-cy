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
// SECTION 3: COMMERCIAL PARTNER TIERS (THE MONETIZATION MATRIX)
// ============================================================================

export interface CommercialTier {
  id: string;
  name: string;
  subtitle: string;
  targetAudience: string;
  priceLabel: string;
  billingFrequency: string;
  deliverables: string[];
  badge: string;
  badgeColor: string;
  isPopular?: boolean;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'tier-1-strategic',
    name: 'Strategic Energy Partner',
    subtitle: 'Flagship platform placement for utility power producers, systemic infrastructure banks, and large-scale BESS developers.',
    targetAudience: 'National utilities, licensed IPPs (50MW+), institutional capital, and centralized storage operators',
    priceLabel: 'Custom Corporate Proposal',
    billingFrequency: 'Annual Enterprise Placement',
    badge: 'Flagship Tier',
    badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    isPopular: true,
    deliverables: [
      'Dedicated high-priority corporate dossier with live generation telemetry & verified pipeline metrics',
      'Branded operational asset pins & high-voltage grid interconnection display on Helios 3D GIS terminal',
      'Unlimited corporate PR briefings & guaranteed editorial distribution across Research feed & Google News',
      'Featured executive commentary & high-level energy policy roundtable representation',
      'Direct priority lead routing for institutional investor, sovereign fund & commercial PPA inquiries',
    ],
  },
  {
    id: 'tier-2-epc-tech',
    name: 'Certified EPC & Technology Partner',
    subtitle: 'Procurement-focused placement for high-voltage contractors, equipment vendors, and balance-of-plant specialists.',
    targetAudience: 'Class A electrical contractors, substation builders, BESS container vendors, and inverter distributors',
    priceLabel: 'Annual Corporate Subscription',
    billingFrequency: 'Billed Annually',
    badge: 'High-Growth Tier',
    badgeColor: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    deliverables: [
      'Verified Directory placement with official "Certified EPC Supplier" institutional badge',
      'Direct B2B RFQ & commercial tender lead routing from prosumers, hotels, and utility developers',
      'Quarterly turnkey project spotlights & commissioned plant case studies published on the portal',
      'Inbound procurement inquiry notifications with verified buyer credentials and contact details',
      'Priority inclusion in the Cyprus national equipment distribution & subcontracting registry',
    ],
  },
  {
    id: 'tier-3-associate',
    name: 'Associate & Professional Services',
    subtitle: 'Institutional visibility for top-tier energy law practices, ESG sustainability auditors, and financial advisory desks.',
    targetAudience: 'Corporate energy legal counsel, transaction advisors, technical auditors, and ESG assurance specialists',
    priceLabel: 'Annual Professional Listing',
    billingFrequency: 'Billed Annually',
    badge: 'Professional Tier',
    badgeColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    deliverables: [
      'Standard verified corporate registry listing & lead partner profile with direct booking links',
      'CERA regulatory commentary & legal policy analysis publication rights in the Energeia Research feed',
      'Inbound advisory, project finance & deal structuring lead forwarding',
      'Official institutional accreditation badge for corporate communications and website trust seal',
      'Invitations to closed-door commercial roundtables with European Commission & MED-TSO delegates',
    ],
  },
];

// ============================================================================
// SECTION 4: COMMERCIAL SERVICES (WHAT PARTNERS PAY FOR)
// ============================================================================

export interface CommercialService {
  id: string;
  title: string;
  headline: string;
  description: string;
  features: string[];
  iconKey: 'dossier' | 'spatial' | 'pr' | 'rfq';
  accentColor: string;
  badge: string;
}

export const COMMERCIAL_SERVICES: CommercialService[] = [
  {
    id: 'service-dossier',
    title: 'Institutional Directory Dossier',
    headline: 'Authoritative B2B Profile & Lead Funnel',
    description: 'Comprehensive digital corporate passport detailing licensed operating capacity (MWp), CERA permits, key executive contacts, and direct inbound commercial RFQ inquiry forms.',
    features: [
      'Verified Corporate Standing & HE Registration Audit',
      'Operating & Pipeline MWp Asset Portfolio Metrics',
      'Direct Executive Routing & Inbound Lead Capture',
      'SEO-Indexed Corporate Landing Page with Domain Authority'
    ],
    iconKey: 'dossier',
    accentColor: 'blue',
    badge: 'B2B Ecosystem Placement',
  },
  {
    id: 'service-spatial',
    title: 'Helios 3D Spatial Spotlight',
    headline: 'Branded Infrastructure on the National Grid',
    description: 'Interactive geospatial mapping of your operational solar parks, 132/66 kV substations, and battery storage containers on the national energy terminal viewed by global energy funds.',
    features: [
      'Branded 3D Substation & Solar Farm Map Pins',
      'TSOC Transmission Grid Node Interconnection Overlay',
      'Asset Inspector Drawer with Verified Company Branding',
      'Real-Time Generation & GIS Capacity Telemetry'
    ],
    iconKey: 'spatial',
    accentColor: 'amber',
    badge: 'Helios 3D GIS Sponsorship',
  },
  {
    id: 'service-pr',
    title: 'Corporate PR & Native Media Desk',
    headline: 'Guaranteed Distribution Across Industry Channels',
    description: 'Targeted native publication for asset commissioning milestones, corporate acquisitions, technology whitepapers, and regulatory opinions across Energeia Research and Google News index.',
    features: [
      'Featured Editorial Feed Distribution Across Cyprus',
      'Google News & Industry RSS Syndication',
      'Distinctive "Partner Briefing" Sponsor Attribution',
      'Bi-Weekly Executive Newsletter Distribution to CERA/TSOC'
    ],
    iconKey: 'pr',
    accentColor: 'purple',
    badge: 'Intelligence & Native PR Desk',
  },
  {
    id: 'service-rfq',
    title: 'Direct Tender & RFQ Access',
    headline: 'Inbound Commercial Procurement Leads',
    description: 'Commercial off-takers, hotel prosumers, and industrial manufacturers submit B2B requests for quotation (RFQs) routed directly to your commercial desk without platform commission.',
    features: [
      'Direct Buyer Lead Routing to Corporate Inboxes',
      'B2B Corporate PPA Offtake Matching Inquiries',
      'Substation & Turnkey Solar EPC Procurement Tenders',
      'Pre-Screened Counterparty Verification & KYC'
    ],
    iconKey: 'rfq',
    accentColor: 'emerald',
    badge: 'Direct Tender & RFQ Access',
  },
];

// ============================================================================
// SECTION 5: VERIFIED CORPORATE PARTNERS (THE COMMERCIAL DIRECTORY)
// ============================================================================

export type CommercialTierKey = 
  | 'Strategic Partners' 
  | 'Certified EPC & Tech' 
  | 'Advisory & Services';

export interface PortalMemberEntry extends DirectoryMember {
  tierCategory: CommercialTierKey;
  commercialBadge: string;
  operationalCapacityText: string;
  logoSvgUrl?: string;
  isSponsored?: boolean;
}

export const FEATURED_PARTNERS: PortalMemberEntry[] = [
  // Strategic Energy Partners
  {
    id: 'partner-eac',
    name: 'Electricity Authority of Cyprus (EAC / AHK)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    commercialBadge: 'National Utility Partner',
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
    isSponsored: true,
  },
  {
    id: 'partner-bioland',
    name: 'Bioland Energy Group',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    commercialBadge: 'Strategic Energy Partner',
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
    isSponsored: true,
  },
  {
    id: 'partner-muskita',
    name: 'Muskita Solar Systems',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    commercialBadge: 'Strategic Energy Partner',
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
    isSponsored: true,
  },
  {
    id: 'partner-geg',
    name: 'Green Energy Group (GEG)',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    commercialBadge: 'Strategic Energy Partner',
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
    isSponsored: true,
  },
  {
    id: 'partner-lanitis',
    name: 'Lanitis Energy',
    type: 'Company',
    tierCategory: 'Strategic Partners',
    commercialBadge: 'Strategic Energy Partner',
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
    isSponsored: true,
  },

  // Certified EPC & Technology Partners
  {
    id: 'partner-caramondani',
    name: 'Caramondani Energy Solutions (Caramondani Bros PLC)',
    type: 'Company',
    tierCategory: 'Certified EPC & Tech',
    commercialBadge: 'Certified Class A EPC',
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
    isSponsored: true,
  },
  {
    id: 'partner-conercon',
    name: 'Conercon Energy Solutions (Petrolina Group)',
    type: 'Company',
    tierCategory: 'Certified EPC & Tech',
    commercialBadge: 'Certified BESS Integrator',
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
    isSponsored: true,
  },
  {
    id: 'partner-bigsolar',
    name: 'Big Solar Cyprus Ltd',
    type: 'Company',
    tierCategory: 'Certified EPC & Tech',
    commercialBadge: 'Tier-1 Hardware Distributor',
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
    isSponsored: true,
  },
  {
    id: 'partner-firstelectric',
    name: 'First Electric Solar Ltd',
    type: 'Company',
    tierCategory: 'Certified EPC & Tech',
    commercialBadge: 'High-Voltage Grid Specialist',
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
    isSponsored: true,
  },

  // Advisory & Professional Services
  {
    id: 'partner-chryses-demetriades',
    name: 'Chryses Demetriades & Co. LLC',
    type: 'Company',
    tierCategory: 'Advisory & Services',
    commercialBadge: 'Energy Legal Counsel',
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
    operationalCapacityText: 'Tier-1 Energy Law & CERA Regulatory Licensing',
    isVerified: true,
    isSponsored: true,
  },
  {
    id: 'partner-deloitte',
    name: 'Deloitte Cyprus (Energy & ESG Practice)',
    type: 'Company',
    tierCategory: 'Advisory & Services',
    commercialBadge: 'Transaction & ESG Advisory',
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
    isSponsored: true,
  },
  {
    id: 'partner-pwc',
    name: 'PwC Cyprus (Energy & Infrastructure Deals)',
    type: 'Company',
    tierCategory: 'Advisory & Services',
    commercialBadge: 'Market Modeling & Deals',
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
    isSponsored: true,
  },
];

// ============================================================================
// SECTION 6: CORPORATE PR DESK (SPONSORED BRIEFINGS & PROJECT SPOTLIGHTS)
// ============================================================================

export const COMMERCIAL_PARTNER_BRIEFS: NewsItem[] = [
  {
    id: 'commercial-brief-bioland-aradippou',
    title: 'Bioland Energy Group Commissions 18 MWp Agrivoltaic Cluster in Larnaca District with Integrated Storage Ready Interconnect',
    slug: 'bioland-energy-commissions-18mwp-agrivoltaic-cluster-larnaca',
    summary: 'Bioland Energy announces the commercial energization of its flagship 18 MWp agrivoltaic installation in Aradippou, featuring Tier-1 bifacial modules, smart tracker algorithms, and MV connection to the TSOC 132/22 kV substation.',
    content: `### Commercial Project Milestone

**Larnaca, Cyprus** — Bioland Energy Group has formally announced the commercial energization of its landmark 18 MWp agrivoltaic solar installation located in the Aradippou agricultural zone of Larnaca district.

The facility represents one of the largest private capital investments in dispatch-optimized renewable generation in Cyprus, incorporating advanced dual-use agricultural zoning methodologies that allow continued sheep grazing and forage production beneath elevated tracker arrays.

### Technical & Engineering Architecture

1. **High-Efficiency Bifacial Generation**: Equipped with Tier-1 n-type TOPCon bifacial modules achieving over 22.4% module efficiency and up to 18% additional albedo boost from calcified ground cover.
2. **Substation & MV Connection**: Direct 22 kV underground feeder connecting to the EAC/TSOC primary distribution substation, equipped with automated remote terminal units (RTUs) for dynamic curtailment control.
3. **Storage-Ready Inverter Configuration**: Centralized string inverters pre-configured for DC-coupled 8 MWh containerized lithium-iron-phosphate (LFP) battery storage retrofit under the upcoming Ministry fast-track storage tender.

### Commercial Off-Take & B2B Inquiries

Energy produced by the facility will be marketed through private bilateral contracts and the interim electricity pool. Industrial off-takers interested in corporate power purchase agreements (CPPAs) can request formal term sheets through the Bioland Energy corporate dossier on Energeia.`,
    category: 'Renewables',
    source: 'Bioland Energy Press Desk',
    sourcePublisher: 'Bioland Energy Group',
    sourceUrl: 'https://biolandenergy.com',
    publishedAt: '2026-10-29T08:00:00Z',
    createdAt: '2026-10-29T08:00:00Z',
    status: 'Published',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    isEditorial: false,
    isPartnerBriefing: true,
    sponsorName: 'Bioland Energy Group',
    sponsorLogoUrl: '/logos/bioland.svg',
  },
  {
    id: 'commercial-brief-caramondani-bess-contract',
    title: 'Caramondani Bros PLC Awarded Turnkey High-Voltage 132 kV Substation Contract for 40 MWh Utility BESS Project',
    slug: 'caramondani-awarded-turnkey-132kv-substation-contract-bess',
    summary: 'Caramondani Energy Solutions secures the turnkey balance-of-plant (BOP) contract for one of Cyprus’s premier fast-track centralized battery energy storage facilities, delivering transformer integration and protection relays.',
    content: `### High-Voltage EPC Contract Award

**Nicosia, Cyprus** — Caramondani Energy Solutions, a division of Caramondani Bros PLC, has been formally selected as the lead engineering, procurement, and construction (EPC) partner for a flagship 40 MWh utility-scale battery energy storage system (BESS) installation in central Cyprus.

The project marks a major milestone in high-voltage grid infrastructure execution, engineered to provide sub-second fast frequency response (FFR) and synthetic inertia to the Transmission System Operator of Cyprus (TSOC).

### Engineering Scope of Delivery

* **132/22 kV Step-Up Substation**: Complete civil and electrical works, including high-voltage GIS switchgear, outdoor busbars, and 50 MVA power transformers.
* **SCADA & Relay Integration**: State-of-the-art telecontrol relays communicating synchronously with the TSOC National Control Center in Strovolos via dual redundant fiber optic loops.
* **Thermal Management & Fire Suppression**: NFPA 855-compliant containerized containment with automated aerosol suppression and continuous thermal imaging sensors.

### Corporate Capabilities

With over 60 years of engineering leadership in Cyprus and the Middle East, Caramondani Energy Solutions continues to lead high-voltage electrical execution. Developers seeking turnkey balance-of-plant proposals may contact the engineering team via their verified Energeia company dossier.`,
    category: 'Engineering & EPC',
    source: 'Caramondani Corporate Communications',
    sourcePublisher: 'Caramondani Bros PLC',
    sourceUrl: 'https://caramondani.com.cy',
    publishedAt: '2026-10-20T09:30:00Z',
    createdAt: '2026-10-20T09:30:00Z',
    status: 'Published',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80',
    isEditorial: false,
    isPartnerBriefing: true,
    sponsorName: 'Caramondani Energy Solutions',
    sponsorLogoUrl: '/logos/caramondani.svg',
  },
  {
    id: 'commercial-brief-muskita-geg-ppa',
    title: 'Muskita Solar & Green Energy Group Complete €14M Commercial PPA Portfolio for Mediterranean Industrial Consumers',
    slug: 'muskita-geg-complete-14m-commercial-ppa-portfolio',
    summary: 'Strategic consortium agreement between Muskita Solar and Green Energy Group delivers long-term fixed bilateral renewable power contracts to major manufacturing and hospitality facilities across Limassol.',
    content: `### Bilateral Renewable Power Agreement

**Limassol, Cyprus** — In a major expansion of private electricity trading in Cyprus, Muskita Solar Systems and Green Energy Group (GEG) have finalized a multi-asset corporate Power Purchase Agreement (CPPA) consortium delivering clean solar power to premier industrial and hospitality off-takers in Limassol district.

The syndicated portfolio encompasses 22 MWp of dedicated photovoltaic installations linked directly through private bilateral contracts under the CERA interim electricity market framework.

### Strategic Market Impact

1. **Fixed Long-Term Energy Pricing**: Protecting heavy energy consumers from volatile fossil-fuel and EU ETS carbon penalty fluctuations by guaranteeing stable kilowatt-hour rates over 10-year agreements.
2. **Green Guarantees of Origin (GOs)**: Full certification allowing corporate buyers to meet mandatory European CSRD decarbonization mandates and ESG reporting compliance.
3. **Advanced Microgrid Synchronization**: Intelligent peak-shaving control matching daytime manufacturing load curves with real-time PV generation output.

### Commercial Participation

Commercial prosumers and industrial facility managers in Cyprus seeking competitive corporate solar off-take terms are invited to submit procurement requests through the Muskita and GEG corporate profiles on Energeia.`,
    category: 'Market & Finance',
    source: 'Consortium Press Bureau',
    sourcePublisher: 'Muskita & Green Energy Group',
    sourceUrl: 'https://geg.com.cy',
    publishedAt: '2026-10-10T10:00:00Z',
    createdAt: '2026-10-10T10:00:00Z',
    status: 'Published',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    isEditorial: false,
    isPartnerBriefing: true,
    sponsorName: 'Muskita & Green Energy Group',
    sponsorLogoUrl: '/logos/muskita.svg',
  },
];

// Backwards-compatible aliases for other surfaces if imported
export const CLUSTER_PORTAL_MEMBERS = FEATURED_PARTNERS;
export const CLUSTER_EDITORIAL_BRIEFS = COMMERCIAL_PARTNER_BRIEFS;
