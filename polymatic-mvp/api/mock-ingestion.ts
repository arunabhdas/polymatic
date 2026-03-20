export function startMockIngestion(broadcast: (data: any) => void) {
  // 1. GLOBAL AIRCRAFT TRACKING
  setInterval(() => {
    const aircraft = [];
    for (let i = 0; i < 50; i++) {
      aircraft.push({
        id: `flight-${i}`,
        lat: 30 + Math.random() * 20,
        lng: -120 + Math.random() * 40,
        alt: 30000 + Math.random() * 10000,
        heading: Math.random() * 360,
        metadata: {
          callsign: `AAL${100 + i}`,
          speed: 400 + Math.random() * 100,
          type: Math.random() > 0.9 ? 'Military' : 'Commercial',
        },
      });
    }
    broadcast({ type: 'ENTITY_UPDATE', layer: 'aircraft', data: aircraft });
  }, 2000);

  // 2. GLOBAL SHIP TRACKING
  setInterval(() => {
    const ships = [];
    for (let i = 0; i < 30; i++) {
      ships.push({
        id: `ship-${i}`,
        lat: 20 + Math.random() * 10,
        lng: -90 + Math.random() * 20,
        alt: 0,
        heading: Math.random() * 360,
        metadata: {
          vesselName: `Cargo-${i}`,
          speed: 15 + Math.random() * 10,
          type: 'Cargo',
        },
      });
    }
    broadcast({ type: 'ENTITY_UPDATE', layer: 'ships', data: ships });
  }, 5000);

  // 3. SATELLITE ORBIT TRACKER
  setInterval(() => {
    const satellites = [];
    for (let i = 0; i < 20; i++) {
      satellites.push({
        id: `sat-${i}`,
        lat: -90 + Math.random() * 180,
        lng: -180 + Math.random() * 360,
        alt: 400000 + Math.random() * 1000000, // LEO to MEO
        heading: Math.random() * 360,
        metadata: {
          name: `STARLINK-${1000 + i}`,
          velocity: '7.66 km/s',
          type: 'Communications',
        },
      });
    }
    broadcast({ type: 'ENTITY_UPDATE', layer: 'satellites', data: satellites });
  }, 3000);

  // 4. GLOBAL WILDFIRE DETECTION
  setInterval(() => {
    const wildfires = [];
    for (let i = 0; i < 15; i++) {
      wildfires.push({
        id: `fire-${i}`,
        lat: 35 + Math.random() * 15,
        lng: -125 + Math.random() * 15, // West Coast US
        alt: 0,
        heading: 0,
        metadata: {
          confidence: Math.floor(50 + Math.random() * 50) + '%',
          frp: (10 + Math.random() * 100).toFixed(1) + ' MW',
        },
      });
    }
    broadcast({ type: 'ENTITY_UPDATE', layer: 'wildfires', data: wildfires });
  }, 10000);

  // 5. EARTHQUAKE DETECTION
  setInterval(() => {
    const earthquakes = [];
    for (let i = 0; i < 5; i++) {
      earthquakes.push({
        id: `eq-${i}`,
        lat: 30 + Math.random() * 20,
        lng: 130 + Math.random() * 20, // Japan area
        alt: 0,
        heading: 0,
        metadata: {
          magnitude: (3.0 + Math.random() * 4.0).toFixed(1),
          depth: Math.floor(10 + Math.random() * 100) + ' km',
        },
      });
    }
    broadcast({ type: 'ENTITY_UPDATE', layer: 'earthquakes', data: earthquakes });
  }, 15000);

  // Static Infrastructure Data (Sent once or infrequently)
  setInterval(() => {
    // 11. MILITARY BASE LOCATIONS
    const bases = [
      { id: 'base-1', lat: 36.2369, lng: -115.0337, alt: 0, heading: 0, metadata: { name: 'Nellis AFB', type: 'Air Base' } },
      { id: 'base-2', lat: 32.6789, lng: -117.1950, alt: 0, heading: 0, metadata: { name: 'Naval Base Coronado', type: 'Naval Base' } },
      { id: 'base-3', lat: 35.0844, lng: 33.0153, alt: 0, heading: 0, metadata: { name: 'RAF Akrotiri', type: 'Air Base' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'militaryBases', data: bases });

    // 10. STRATEGIC CHOKEPOINTS
    const chokepoints = [
      { id: 'choke-1', lat: 26.5667, lng: 56.2500, alt: 0, heading: 0, metadata: { name: 'Strait of Hormuz', type: 'Waterway' } },
      { id: 'choke-2', lat: 1.2500, lng: 103.8333, alt: 0, heading: 0, metadata: { name: 'Malacca Strait', type: 'Waterway' } },
      { id: 'choke-3', lat: 12.5833, lng: 43.3333, alt: 0, heading: 0, metadata: { name: 'Bab-el-Mandeb', type: 'Waterway' } },
      { id: 'choke-4', lat: 30.7050, lng: 32.3481, alt: 0, heading: 0, metadata: { name: 'Suez Canal', type: 'Canal' } },
      { id: 'choke-5', lat: 9.0800, lng: -79.6800, alt: 0, heading: 0, metadata: { name: 'Panama Canal', type: 'Canal' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'chokepoints', data: chokepoints });

    // 9. GLOBAL PORTS
    const ports = [
      { id: 'port-1', lat: 31.2304, lng: 121.4737, alt: 0, heading: 0, metadata: { name: 'Port of Shanghai', type: 'Seaport' } },
      { id: 'port-2', lat: 1.2902, lng: 103.8519, alt: 0, heading: 0, metadata: { name: 'Port of Singapore', type: 'Seaport' } },
      { id: 'port-3', lat: 51.9490, lng: 4.1450, alt: 0, heading: 0, metadata: { name: 'Port of Rotterdam', type: 'Seaport' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'ports', data: ports });

    // 6. VOLCANIC ACTIVITY
    const volcanoes = [
      { id: 'volcano-1', lat: 19.4252, lng: -155.2921, alt: 0, heading: 0, metadata: { name: 'Kilauea', status: 'Active' } },
      { id: 'volcano-2', lat: 37.7562, lng: 14.9949, alt: 0, heading: 0, metadata: { name: 'Mount Etna', status: 'Active' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'volcanoes', data: volcanoes });

    // 7. OIL AND GAS INFRASTRUCTURE
    const oilGas = [
      { id: 'oil-1', lat: 29.7604, lng: -95.3698, alt: 0, heading: 0, metadata: { name: 'Houston Refinery', type: 'Refinery' } },
      { id: 'oil-2', lat: 26.2235, lng: 50.5876, alt: 0, heading: 0, metadata: { name: 'Ghawar Field', type: 'Oil Field' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'oilGas', data: oilGas });

    // 8. POWER GRID INFRASTRUCTURE
    const powerGrid = [
      { id: 'power-1', lat: 35.9333, lng: -114.7378, alt: 0, heading: 0, metadata: { name: 'Hoover Dam', type: 'Hydroelectric' } },
      { id: 'power-2', lat: 47.7580, lng: -121.9836, alt: 0, heading: 0, metadata: { name: 'Grand Coulee', type: 'Hydroelectric' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'powerGrid', data: powerGrid });

    // 15. GLOBAL MINING OPERATIONS
    const mining = [
      { id: 'mine-1', lat: -22.9553, lng: -68.9789, alt: 0, heading: 0, metadata: { name: 'Chuquicamata', type: 'Copper Mine' } },
      { id: 'mine-2', lat: -27.5996, lng: 121.7380, alt: 0, heading: 0, metadata: { name: 'Super Pit', type: 'Gold Mine' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'mining', data: mining });

    // 17. GLOBAL INTERNET INFRASTRUCTURE
    const internet = [
      { id: 'cable-1', lat: 40.7128, lng: -74.0060, alt: 0, heading: 0, metadata: { name: 'Trans-Atlantic Cable Landing', type: 'Submarine Cable' } },
      { id: 'cable-2', lat: 51.5074, lng: -0.1278, alt: 0, heading: 0, metadata: { name: 'London IXP', type: 'Internet Exchange' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'internet', data: internet });

  }, 20000);

  // Dynamic layers (Weather, Floods, Dark Ships, Airspace)
  setInterval(() => {
    // 13. WEATHER SYSTEMS
    const weather = [
      { id: `storm-${Date.now()}`, lat: 15 + Math.random() * 10, lng: -60 + Math.random() * 20, alt: 0, heading: 0, metadata: { name: 'Tropical Storm', category: 'Category 1' } }
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'weather', data: weather });

    // 14. FLOOD MONITORING
    const floods = [
      { id: `flood-${Date.now()}`, lat: 23 + Math.random() * 5, lng: 90 + Math.random() * 5, alt: 0, heading: 0, metadata: { region: 'Brahmaputra Basin', risk: 'High' } }
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'floods', data: floods });

    // 20. DARK SHIPS
    const darkShips = [
      { id: `dark-${Date.now()}`, lat: 10 + Math.random() * 10, lng: 110 + Math.random() * 10, alt: 0, heading: 0, metadata: { detection: 'SAR Satellite', confidence: 'High' } }
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'darkShips', data: darkShips });

    // 18. AIRSPACE RESTRICTIONS
    const airspace = [
      { id: `notam-${Date.now()}`, lat: 49 + Math.random() * 2, lng: 32 + Math.random() * 2, alt: 0, heading: 0, metadata: { type: 'TFR', reason: 'Military Operations' } }
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'airspace', data: airspace });

    // 21. GLOBAL COMMODITY PRICE HEATMAP
    const commodityPrices = [
      { id: `cp-gold-${Date.now()}`, lat: -25.2744, lng: 133.7751, alt: 0, heading: 0, metadata: { commodity: 'Gold', price: '$2,350/oz', change: '+1.2%' } },
      { id: `cp-lithium-${Date.now()}`, lat: -35.6751, lng: -71.5430, alt: 0, heading: 0, metadata: { commodity: 'Lithium', price: '$14,500/t', change: '-0.5%' } },
      { id: `cp-oil-${Date.now()}`, lat: 25.0000, lng: 45.0000, alt: 0, heading: 0, metadata: { commodity: 'Crude Oil', price: '$82.50/bbl', change: '+2.1%' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'commodityPrices', data: commodityPrices });

    // 22. PRECIOUS METALS MARKET INTELLIGENCE
    const preciousMetals = [
      { id: `pm-mine-1`, lat: -26.2041, lng: 28.0473, alt: 0, heading: 0, metadata: { name: 'South Deep Gold Mine', type: 'Gold Mine', status: 'Operational' } },
      { id: `pm-refinery-1`, lat: 46.2044, lng: 6.1432, alt: 0, heading: 0, metadata: { name: 'Argor-Heraeus', type: 'Refinery', status: 'Operational' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'preciousMetals', data: preciousMetals });

    // 23. INDUSTRIAL METALS SUPPLY CHAIN
    const industrialMetals = [
      { id: `im-copper-1`, lat: -22.8986, lng: -68.9312, alt: 0, heading: 0, metadata: { name: 'Escondida', type: 'Copper Mine', status: 'Operational' } },
      { id: `im-aluminum-1`, lat: 54.7825, lng: 100.9575, alt: 0, heading: 0, metadata: { name: 'Bratsk Aluminium Smelter', type: 'Smelter', status: 'Operational' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'industrialMetals', data: industrialMetals });

    // 24. RARE EARTH ELEMENTS INTELLIGENCE
    const rareEarths = [
      { id: `re-mine-1`, lat: 41.6522, lng: 109.8403, alt: 0, heading: 0, metadata: { name: 'Bayan Obo', type: 'Rare Earth Mine', status: 'Operational' } },
      { id: `re-mine-2`, lat: 35.4746, lng: -115.5398, alt: 0, heading: 0, metadata: { name: 'Mountain Pass', type: 'Rare Earth Mine', status: 'Operational' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'rareEarths', data: rareEarths });

    // 25. GLOBAL AGRICULTURAL COMMODITIES DASHBOARD
    const agriculturalCommodities = [
      { id: `ag-wheat-1`, lat: 48.3794, lng: 31.1656, alt: 0, heading: 0, metadata: { commodity: 'Wheat', price: '$6.50/bu', season: 'Harvest' } },
      { id: `ag-soy-1`, lat: -14.2350, lng: -51.9253, alt: 0, heading: 0, metadata: { commodity: 'Soybeans', price: '$11.80/bu', season: 'Planting' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'agriculturalCommodities', data: agriculturalCommodities });

    // 26. CROP YIELD MONITORING
    const cropYields = [
      { id: `cy-us-corn`, lat: 41.8780, lng: -93.0977, alt: 0, heading: 0, metadata: { crop: 'Corn', ndvi: '0.85', forecast: 'Above Average' } },
      { id: `cy-br-coffee`, lat: -19.9167, lng: -43.9345, alt: 0, heading: 0, metadata: { crop: 'Coffee', ndvi: '0.65', forecast: 'Drought Impacted' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'cropYields', data: cropYields });

    // 27. GLOBAL FOOD SUPPLY CHAIN MONITOR
    const foodSupplyChain = [
      { id: `fs-storage-1`, lat: 29.9511, lng: -90.0715, alt: 0, heading: 0, metadata: { name: 'New Orleans Grain Terminal', type: 'Export Terminal', capacity: 'High' } },
      { id: `fs-route-1`, lat: 46.4825, lng: 30.7233, alt: 0, heading: 0, metadata: { name: 'Odesa Port', type: 'Export Terminal', capacity: 'Restricted' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'foodSupplyChain', data: foodSupplyChain });

    // 28. ENERGY COMMODITY INTELLIGENCE
    const energyCommodities = [
      { id: `ec-oil-1`, lat: 31.9686, lng: -99.9018, alt: 0, heading: 0, metadata: { name: 'Permian Basin', type: 'Production Region', status: 'Active' } },
      { id: `ec-lng-1`, lat: 25.9405, lng: 51.5482, alt: 0, heading: 0, metadata: { name: 'Ras Laffan', type: 'LNG Terminal', status: 'Active' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'energyCommodities', data: energyCommodities });

    // 29. GLOBAL MINERAL EXPORT FLOWS
    const mineralExports = [
      { id: `me-iron-1`, lat: -20.3110, lng: 118.5755, alt: 0, heading: 0, metadata: { name: 'Port Hedland', type: 'Iron Ore Export', volume: 'High' } },
      { id: `me-copper-1`, lat: -23.6509, lng: -70.4000, alt: 0, heading: 0, metadata: { name: 'Port of Antofagasta', type: 'Copper Export', volume: 'Medium' } },
    ];
    broadcast({ type: 'ENTITY_UPDATE', layer: 'mineralExports', data: mineralExports });

  }, 12000);

  // Simulate Events (GDELT / Conflicts / Price Shocks)
  setInterval(() => {
    if (Math.random() > 0.5) {
      const eventType = Math.random();
      
      if (eventType > 0.66) {
        // Conflict
        broadcast({
          type: 'ENTITY_UPDATE',
          layer: 'conflicts',
          data: [{
            id: `conflict-${Date.now()}`,
            lat: 48 + Math.random() * 2,
            lng: 31 + Math.random() * 2,
            alt: 0,
            heading: 0,
            metadata: {
              type: 'Protest / Violence',
              source: 'GDELT',
            }
          }]
        });
        broadcast({
          type: 'EVENT_ALERT',
          data: {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: 'CONFLICT ESCALATION DETECTED',
            location: 'Eastern Europe',
            severity: 'high',
          },
        });
      } else if (eventType > 0.33) {
        // GPS Interference
        broadcast({
          type: 'EVENT_ALERT',
          data: {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: 'GPS INTERFERENCE DETECTED',
            location: 'Eastern Seaboard',
            severity: 'medium',
          },
        });
      } else {
        // 30. COMMODITY PRICE SHOCK DETECTION
        const shockData = [
          { id: `shock-${Date.now()}`, lat: -22.8986, lng: -68.9312, alt: 0, heading: 0, metadata: { commodity: 'Copper', change: '+8%', reason: 'Possible mine disruption detected', confidence: '78%' } }
        ];
        broadcast({ type: 'ENTITY_UPDATE', layer: 'priceShocks', data: shockData });
        broadcast({
          type: 'EVENT_ALERT',
          data: {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: 'COMMODITY PRICE SHOCK: Copper +8%',
            location: 'Global / Chile',
            severity: 'high',
          },
        });
      }
    }
  }, 10000);
}
