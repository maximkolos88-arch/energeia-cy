/**
 * Energeia - Industry Expertise Tag Localization Helper
 */

const TAG_KEY_MAP: Record<string, string> = {
  'Solar PV': 'solarPv',
  'Solar': 'solar',
  'Wind Power': 'windPower',
  'Wind': 'wind',
  'Energy Storage': 'energyStorage',
  'Storage': 'storage',
  'Hydrogen': 'hydrogen',
  'Smart Grids': 'smartGrids',
  'Grid': 'grid',
  'Energy Efficiency': 'energyEfficiency',
  'EV Infrastructure': 'evInfrastructure',
  'Microgrids': 'microgrids',
  'E&P (Exploration & Production)': 'epExploration',
  'E&P': 'epExploration',
  'LNG Infrastructure': 'lngInfrastructure',
  'LNG': 'lngInfrastructure',
  'Offshore Support': 'offshoreSupport',
  'Bunkering': 'bunkering',
  'EPC': 'epc',
  'O&M': 'om',
  'Project Management': 'projectManagement',
  'Energy Trading': 'energyTrading',
  'PPA Structuring': 'ppaStructuring',
  'Legal Counsel': 'legalCounsel',
  'Financial Advisory': 'financialAdvisory',
  'ESG & Environmental': 'esgEnvironmental',
  'ESG': 'esg',
  'Policy & Regulatory': 'policyRegulatory',
  'Policy': 'policy',
  'ESG Auditors': 'esgAuditors',
  'Solar Installers': 'solarInstallers'
};

export const getLocalizedTag = (tag: string, t: (key: string, options?: any) => string): string => {
  if (!tag) return '';
  const trimmed = tag.trim();
  const mappedKey = TAG_KEY_MAP[trimmed];
  
  if (mappedKey) {
    const translation = t(`tags.${mappedKey}`);
    if (translation && translation !== `tags.${mappedKey}`) {
      return translation;
    }
  }

  // Case-insensitive fallback
  for (const [englishLabel, key] of Object.entries(TAG_KEY_MAP)) {
    if (englishLabel.toLowerCase() === trimmed.toLowerCase()) {
      const translation = t(`tags.${key}`);
      if (translation && translation !== `tags.${key}`) {
        return translation;
      }
    }
  }

  return tag; // Graceful fallback to original English string
};
