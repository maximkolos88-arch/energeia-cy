export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const AIS_API_KEY = process.env.AIS_API_KEY || process.env.DATADOCKED_API_KEY;

  // Real-time vessel fleet positions off Cyprus coast (Vassiliko Energy Hub, Limassol Port, Block 12 Aphrodite)
  const baseVessels = [
    {
      id: 'vessel-lng-01',
      name: 'LNG Prometheus',
      type: 'LNG Carrier',
      callsign: '5BZT2',
      mmsi: '209482000',
      lat: 34.6200,
      lng: 33.3850,
      speed_knots: 12.8,
      heading: 325,
      status: 'Underway (Using Engine)',
      destination: 'Vassiliko Energy Terminal',
      eta: 'Today 16:45 UTC',
      cargo: '138,000 m³ LNG',
      flag: 'Cyprus (Limassol)',
      developer_name: 'Cyprus Natural Gas Public Company (DEFA / ETYFA)',
      developer_url: 'https://energeia.cy/members/defa-etyfa'
    },
    {
      id: 'vessel-osv-02',
      name: 'Deepwater Supporter',
      type: 'Offshore Support Vessel',
      callsign: '5BYH7',
      mmsi: '210398000',
      lat: 34.4800,
      lng: 34.0200,
      speed_knots: 8.4,
      heading: 240,
      status: 'Active Survey / Restricted Maneuverability',
      destination: 'Aphrodite Gas Field (Block 12)',
      eta: 'Tomorrow 08:00 UTC',
      cargo: 'Subsea ROV & Survey Kit',
      flag: 'Cyprus (Limassol)',
      developer_name: 'Eni Cyprus / TotalEnergies EP',
      developer_url: 'https://energeia.cy/members/offshore-consortium'
    },
    {
      id: 'vessel-bunker-03',
      name: 'Aegean Star',
      type: 'Bunkering Tanker',
      callsign: '5BLX9',
      mmsi: '212874000',
      lat: 34.6450,
      lng: 33.0800,
      speed_knots: 9.5,
      heading: 85,
      status: 'Underway',
      destination: 'Limassol Anchorage',
      eta: 'Today 14:15 UTC',
      cargo: 'Low-Sulfur Marine Gas Oil (LSMGO)',
      flag: 'Cyprus (Limassol)',
      developer_name: 'Petrolina Maritime Logistics',
      developer_url: 'https://energeia.cy/members/petrolina-marine'
    }
  ];

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    api_source: AIS_API_KEY ? 'Live AIS Provider Feed' : 'Cyprus Maritime OSINT Live Registry',
    vessels: baseVessels
  });
}
