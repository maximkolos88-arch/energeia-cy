import React, { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  transmissionGridData, 
  generationAssetsData, 
  gsiData, 
  bessData 
} from '../data';
import { HeliosAsset, LayerVisibilityState } from '../types/helios';

export interface HeliosMapCanvasProps {
  layerVisibility: LayerVisibilityState;
  onSelectAsset: (asset: HeliosAsset) => void;
  focusedAsset?: HeliosAsset | null;
  className?: string;
}

// Bounding box strictly locked to Cyprus EEZ & landmass
const CYPRUS_BOUNDS: [[number, number], [number, number]] = [
  [31.8, 34.1], // Southwest coordinate [lng, lat]
  [34.9, 35.9]  // Northeast coordinate [lng, lat]
];

const CARTO_DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const HeliosMapCanvas: React.FC<HeliosMapCanvasProps> = ({
  layerVisibility,
  onSelectAsset,
  focusedAsset,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    try {
      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: CARTO_DARK_STYLE,
        center: [33.38, 35.02],
        zoom: 8.8,
        minZoom: 7.5,
        maxZoom: 16,
        pitch: 20,
        bearing: 0,
        maxBounds: CYPRUS_BOUNDS,
        attributionControl: false
      });

      map.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');
      map.addControl(new AttributionControl({ compact: true }), 'bottom-left');

      map.on('load', () => {
        // 1. Add GeoJSON Sources
        map.addSource('transmission-grid-source', {
          type: 'geojson',
          data: transmissionGridData as any
        });

        map.addSource('generation-assets-source', {
          type: 'geojson',
          data: generationAssetsData as any
        });

        map.addSource('gsi-source', {
          type: 'geojson',
          data: gsiData as any
        });

        map.addSource('bess-source', {
          type: 'geojson',
          data: bessData as any
        });

        // 2. Add Great Sea Interconnector (GSI) Subsea Cable Layer
        // Wide luminous glow underneath
        map.addLayer({
          id: 'gsi-subsea-glow',
          type: 'line',
          source: 'gsi-source',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#2979FF',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 4
          }
        });

        // Core crisp pulsed dash stroke
        map.addLayer({
          id: 'gsi-subsea-core',
          type: 'line',
          source: 'gsi-source',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#2979FF',
            'line-width': 2.5,
            'line-opacity': 0.95,
            'line-dasharray': [2, 3]
          }
        });

        // 3. Add 132 kV Transmission Grid Lines
        // Glow effect
        map.addLayer({
          id: 'grid-132kv-glow',
          type: 'line',
          source: 'transmission-grid-source',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'voltageKv', 132]],
          paint: {
            'line-color': '#00E5FF',
            'line-width': 6,
            'line-opacity': 0.35,
            'line-blur': 3
          }
        });

        // Core line
        map.addLayer({
          id: 'grid-132kv-core',
          type: 'line',
          source: 'transmission-grid-source',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'voltageKv', 132]],
          paint: {
            'line-color': '#00E5FF',
            'line-width': 2,
            'line-opacity': 0.95
          }
        });

        // 4. Add 66 kV Sub-Transmission Lines
        map.addLayer({
          id: 'grid-66kv-core',
          type: 'line',
          source: 'transmission-grid-source',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'voltageKv', 66]],
          paint: {
            'line-color': '#FFB300',
            'line-width': 1.5,
            'line-opacity': 0.85,
            'line-dasharray': [3, 2]
          }
        });

        // 5. Add Substations Layer
        map.addLayer({
          id: 'substations-points',
          type: 'circle',
          source: 'transmission-grid-source',
          filter: ['==', '$type', 'Point'],
          paint: {
            'circle-color': '#0E0F10',
            'circle-radius': 6.5,
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#00E5FF',
            'circle-stroke-opacity': 0.9
          }
        });

        // Substation labels at zoom >= 10
        map.addLayer({
          id: 'substations-labels',
          type: 'symbol',
          source: 'transmission-grid-source',
          filter: ['==', '$type', 'Point'],
          minzoom: 10,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-offset': [0, 1.3],
            'text-anchor': 'top',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
          },
          paint: {
            'text-color': '#E3E3E3',
            'text-halo-color': '#0E0F10',
            'text-halo-width': 2
          }
        });

        // 6. Add Generation Assets Layers
        // 6a. Thermal Power Plants
        map.addLayer({
          id: 'gen-thermal-points',
          type: 'circle',
          source: 'generation-assets-source',
          filter: ['==', 'type', 'thermal'],
          paint: {
            'circle-color': '#FF5252',
            'circle-radius': 9,
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-opacity': 0.9
          }
        });

        // 6b. Solar PV Clusters
        map.addLayer({
          id: 'gen-solar-points',
          type: 'circle',
          source: 'generation-assets-source',
          filter: ['==', 'type', 'solar'],
          paint: {
            'circle-color': '#FDD835',
            'circle-radius': 7.5,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#181A1C',
            'circle-stroke-opacity': 0.9
          }
        });

        // 6c. Wind Farms
        map.addLayer({
          id: 'gen-wind-points',
          type: 'circle',
          source: 'generation-assets-source',
          filter: ['==', 'type', 'wind'],
          paint: {
            'circle-color': '#00E5FF',
            'circle-radius': 8,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#181A1C',
            'circle-stroke-opacity': 0.9
          }
        });

        // 7. Add BESS Storage Layer
        map.addLayer({
          id: 'bess-storage-points',
          type: 'circle',
          source: 'bess-source',
          paint: {
            'circle-color': '#00E676',
            'circle-radius': 8,
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-opacity': 0.9
          }
        });

        // 8. Add Click & Hover Event Handlers for Interactive Selection
        const interactiveLayers = [
          'substations-points',
          'gen-thermal-points',
          'gen-solar-points',
          'gen-wind-points',
          'bess-storage-points',
          'gsi-subsea-core',
          'grid-132kv-core'
        ];

        interactiveLayers.forEach((layerId) => {
          map.on('click', layerId, (e) => {
            if (e.features && e.features[0]) {
              const f = e.features[0];
              const asset: HeliosAsset = {
                id: (f.properties?.id || f.id) as string,
                name: f.properties?.name || 'Energy Asset',
                type: (f.properties?.type || 'substation') as any,
                subtype: f.properties?.subtype,
                operator: f.properties?.operator || 'TSOC / EAC',
                voltageKv: f.properties?.voltageKv,
                capacityMw: f.properties?.capacityMw ? Number(f.properties.capacityMw) : undefined,
                capacityMwh: f.properties?.capacityMwh ? Number(f.properties.capacityMwh) : undefined,
                coordinates: (f.geometry as any).coordinates,
                pccSubstation: f.properties?.pccSubstation,
                status: (f.properties?.status || 'operational') as any,
                commissioningYear: f.properties?.commissioningYear,
                description: f.properties?.description || 'Cyprus transmission or generation asset.',
                feedersCount: f.properties?.feedersCount ? Number(f.properties.feedersCount) : undefined,
                transformerMva: f.properties?.transformerMva ? Number(f.properties.transformerMva) : undefined
              };
              onSelectAsset(asset);
            }
          });

          map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
          });
        });

        setMapLoaded(true);
      });

      mapRef.current = map;
    } catch (err) {
      console.warn('MapLibre GL initialization error:', err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Synchronize Layer Visibility State with MapLibre Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const setVisibility = (layers: string[], isVisible: boolean) => {
      layers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
        }
      });
    };

    setVisibility(['grid-132kv-glow', 'grid-132kv-core', 'substations-points', 'substations-labels'], layerVisibility.transmission132);
    setVisibility(['grid-66kv-core'], layerVisibility.subTransmission66);
    setVisibility(['gen-thermal-points'], layerVisibility.thermalPlants);
    setVisibility(['gen-solar-points'], layerVisibility.solarClusters);
    setVisibility(['gen-wind-points'], layerVisibility.windFarms);
    setVisibility(['bess-storage-points'], layerVisibility.bessStorage);
    setVisibility(['gsi-subsea-glow', 'gsi-subsea-core'], layerVisibility.greatSeaInterconnector);
  }, [layerVisibility, mapLoaded]);

  // Focus FlyTo when user searches or selects an asset
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !focusedAsset) return;

    if (Array.isArray(focusedAsset.coordinates[0])) {
      // LineString: center on middle point
      const coords = focusedAsset.coordinates as [number, number][];
      const mid = coords[Math.floor(coords.length / 2)];
      map.flyTo({
        center: mid,
        zoom: 9.5,
        pitch: 25,
        duration: 1200
      });
    } else {
      // Point: fly directly to coordinates
      const [lng, lat] = focusedAsset.coordinates as [number, number];
      map.flyTo({
        center: [lng, lat],
        zoom: 12.5,
        pitch: 35,
        duration: 1400
      });
    }
  }, [focusedAsset, mapLoaded]);

  return (
    <div className={`relative w-full h-full bg-[#0E0F10] overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Fallback loader when map is initializing */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0E0F10] text-[#9AA0A6] gap-3 z-10">
          <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
            Initializing TSOC Geospatial Grid Canvas...
          </span>
        </div>
      )}
    </div>
  );
};
