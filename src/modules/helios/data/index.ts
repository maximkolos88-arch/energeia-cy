import transmissionGridData from './cyprus_transmission_grid.json';
import generationAssetsData from './cyprus_generation_assets.json';
import gsiData from './great_sea_interconnector.json';
import bessData from './bess_storage_pipeline.json';
import { HeliosAsset } from '../types/helios';

export {
  transmissionGridData,
  generationAssetsData,
  gsiData,
  bessData
};

export function getAllHeliosAssets(): HeliosAsset[] {
  const assets: HeliosAsset[] = [];

  // 1. Substations & Lines
  transmissionGridData.features.forEach((f: any) => {
    assets.push({
      id: f.id || f.properties.id,
      name: f.properties.name,
      type: f.properties.type,
      operator: f.properties.operator || 'TSOC',
      voltageKv: f.properties.voltageKv,
      coordinates: f.geometry.coordinates,
      status: f.properties.status || 'operational',
      commissioningYear: f.properties.commissioningYear,
      description: f.properties.description,
      feedersCount: f.properties.feedersCount,
      transformerMva: f.properties.transformerMva,
      technicalDetails: {
        'Voltage Level': `${f.properties.voltageKv || 132} kV`,
        'Operator': f.properties.operator || 'TSOC / EAC',
        'Status': f.properties.status || 'Operational',
        ...(f.properties.feedersCount ? { 'Feeders': f.properties.feedersCount } : {}),
        ...(f.properties.transformerMva ? { 'Transformer Capacity': `${f.properties.transformerMva} MVA` } : {}),
        ...(f.properties.ratingMva ? { 'Continuous Rating': `${f.properties.ratingMva} MVA` } : {}),
        ...(f.properties.conductor ? { 'Conductor Spec': f.properties.conductor } : {})
      }
    });
  });

  // 2. Generation Assets (Thermal, Solar, Wind)
  generationAssetsData.features.forEach((f: any) => {
    assets.push({
      id: f.id || f.properties.id,
      name: f.properties.name,
      type: f.properties.type,
      subtype: f.properties.subtype,
      operator: f.properties.operator,
      capacityMw: f.properties.capacityMw,
      coordinates: f.geometry.coordinates,
      pccSubstation: f.properties.pccSubstation,
      status: f.properties.status || 'operational',
      commissioningYear: f.properties.commissioningYear,
      description: f.properties.description,
      technicalDetails: {
        'Capacity': `${f.properties.capacityMw} MW`,
        'Technology': f.properties.subtype || f.properties.technology || 'Power Generation',
        'PCC Interconnection': f.properties.pccSubstation || 'National Grid',
        'Operator': f.properties.operator,
        ...(f.properties.fuelType ? { 'Primary Fuel': f.properties.fuelType } : {}),
        ...(f.properties.technology ? { 'Equipment Spec': f.properties.technology } : {})
      }
    });
  });

  // 3. Great Sea Interconnector
  gsiData.features.forEach((f: any) => {
    assets.push({
      id: f.id || f.properties.id,
      name: f.properties.name,
      type: 'interconnector',
      subtype: f.properties.subtype,
      operator: f.properties.operator,
      capacityMw: f.properties.capacityMw || 1000,
      voltageKv: f.properties.voltageKv || 525,
      coordinates: f.geometry.coordinates,
      status: f.properties.status || 'construction',
      pccSubstation: f.properties.pccSubstation || 'Kofinou 400kV/132kV',
      description: f.properties.description,
      technicalDetails: {
        'Rated Capacity': '1,000 MW (Phase 1) / 2,000 MW (Phase 2)',
        'Operating Voltage': '525 kV VSC-HVDC',
        'Max Water Depth': '-3,000 meters trench',
        'Total Length': '1,208 km',
        'EU Classification': 'Project of Common Interest (PCI 3.10.1)',
        'Budget': '€1.94 Billion',
        'Operator / Sponsor': f.properties.operator
      }
    });
  });

  // 4. BESS Pipeline
  bessData.features.forEach((f: any) => {
    assets.push({
      id: f.id || f.properties.id,
      name: f.properties.name,
      type: 'storage',
      subtype: f.properties.subtype,
      operator: f.properties.operator,
      capacityMw: f.properties.capacityMw,
      capacityMwh: f.properties.capacityMwh,
      voltageKv: f.properties.voltageKv || 132,
      coordinates: f.geometry.coordinates,
      pccSubstation: f.properties.pccSubstation,
      status: f.properties.status || 'construction',
      commissioningYear: f.properties.commissioningYear,
      description: f.properties.description,
      technicalDetails: {
        'Power Rating': `${f.properties.capacityMw} MW`,
        'Energy Capacity': `${f.properties.capacityMwh} MWh (${f.properties.durationHours || 4}h duration)`,
        'Cell Chemistry': f.properties.chemistry || 'Lithium Iron Phosphate (LFP)',
        'Grid Connection': f.properties.pccSubstation || 'TSOC Transmission',
        'Primary Function': 'FCR / aFRR Frequency Reserves & Solar Curtailment Shifting',
        'Status': f.properties.status === 'construction' ? 'Fast-Track Under Construction' : 'Planned'
      }
    });
  });

  return assets;
}
