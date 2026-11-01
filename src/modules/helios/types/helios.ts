export type HeliosAssetType = 
  | 'substation' 
  | 'thermal' 
  | 'solar' 
  | 'wind' 
  | 'storage' 
  | 'interconnector' 
  | 'transmission_line';

export type AssetStatus = 'operational' | 'construction' | 'planned' | 'alert' | 'standby';

export interface HeliosAsset {
  id: string;
  name: string;
  type: HeliosAssetType;
  subtype?: string;
  operator: string;
  voltageKv?: number | string;
  capacityMw?: number;
  capacityMwh?: number;
  coordinates: [number, number] | [number, number][]; // [lng, lat]
  pccSubstation?: string;
  status: AssetStatus;
  commissioningYear?: number | string;
  description: string;
  technicalDetails?: Record<string, string | number>;
  feedersCount?: number;
  transformerMva?: number;
}

export interface LayerVisibilityState {
  transmission132: boolean;
  subTransmission66: boolean;
  thermalPlants: boolean;
  solarClusters: boolean;
  windFarms: boolean;
  bessStorage: boolean;
  greatSeaInterconnector: boolean;
}

export type SimulationPreset = 'live' | 'midday' | 'evening' | 'night';

export interface TelemetryState {
  frequencyHz: number;
  totalDemandMw: number;
  solarGenerationMw: number;
  windGenerationMw: number;
  thermalGenerationMw: number;
  storageDischargeMw: number;
  curtailedMw: number;
  curtailmentPct: number;
  timestamp: string;
  preset: SimulationPreset;
}
