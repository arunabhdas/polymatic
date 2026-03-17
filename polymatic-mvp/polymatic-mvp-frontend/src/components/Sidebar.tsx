import { useStore, LayerKey } from '../store/useStore';
import { Layers, Activity, Ship, Plane, MapPin, Map, Satellite, Flame, Activity as ActivityIcon, Mountain, Factory, Zap, Anchor, Crosshair, Shield, AlertTriangle, CloudRain, Droplets, Pickaxe, GitCommit, Globe as GlobeIcon, Ban, Image as ImageIcon, EyeOff, TrendingUp, Coins, BarChart3, Building2, Landmark, Rocket, Search, Diamond } from 'lucide-react';

const POIS = [
  { id: 'poi-world', name: 'World', lat: 20.0, lng: 0.0, alt: 20000000 },
  { id: 'poi-india', name: 'India', lat: 20.5937, lng: 78.9629, alt: 4000000 },
  { id: 'poi-iran', name: 'Iran', lat: 32.4279, lng: 53.6880, alt: 3000000 },
  { id: 'poi-israel', name: 'Israel', lat: 31.0461, lng: 34.8516, alt: 1500000 },
  { id: 'poi-middle-east', name: 'Middle East', lat: 29.2985, lng: 42.5510, alt: 5000000 },
  { id: 'poi-west-asia', name: 'West Asia', lat: 34.0, lng: 60.0, alt: 6000000 },
  { id: 'poi-ukraine', name: 'Ukraine', lat: 48.3794, lng: 31.1656, alt: 2000000 },
];

interface LayerGroup {
  title: string;
  items: { key: LayerKey; label: string; icon: any; colorClass: string }[];
}

const LAYER_GROUPS: LayerGroup[] = [
  {
    title: 'Aviation & Maritime',
    items: [
      { key: 'aircraft', label: 'Global Aircraft', icon: Plane, colorClass: 'cyan' },
      { key: 'ships', label: 'Global Ships', icon: Ship, colorClass: 'amber' },
      { key: 'darkShips', label: 'Dark Ships (No AIS)', icon: EyeOff, colorClass: 'zinc' },
      { key: 'airspace', label: 'Airspace Restrictions', icon: Ban, colorClass: 'red' },
    ]
  },
  {
    title: 'Space & Weather',
    items: [
      { key: 'satellites', label: 'Satellite Orbits', icon: Satellite, colorClass: 'indigo' },
      { key: 'weather', label: 'Global Weather', icon: CloudRain, colorClass: 'blue' },
      { key: 'satelliteImagery', label: 'Satellite Imagery', icon: ImageIcon, colorClass: 'emerald' },
    ]
  },
  {
    title: 'Natural Disasters',
    items: [
      { key: 'wildfires', label: 'Wildfires (FIRMS)', icon: Flame, colorClass: 'orange' },
      { key: 'earthquakes', label: 'Earthquakes (USGS)', icon: ActivityIcon, colorClass: 'rose' },
      { key: 'volcanoes', label: 'Volcanic Activity', icon: Mountain, colorClass: 'red' },
      { key: 'floods', label: 'Flood Monitoring', icon: Droplets, colorClass: 'blue' },
    ]
  },
  {
    title: 'Infrastructure & Energy',
    items: [
      { key: 'oilGas', label: 'Oil & Gas Infra', icon: Factory, colorClass: 'stone' },
      { key: 'powerGrid', label: 'Power Grid', icon: Zap, colorClass: 'yellow' },
      { key: 'ports', label: 'Global Ports', icon: Anchor, colorClass: 'sky' },
      { key: 'mining', label: 'Mining Operations', icon: Pickaxe, colorClass: 'amber' },
      { key: 'pipelines', label: 'Pipeline Network', icon: GitCommit, colorClass: 'orange' },
      { key: 'internet', label: 'Internet Infra', icon: GlobeIcon, colorClass: 'blue' },
    ]
  },
  {
    title: 'Geopolitics & Conflict',
    items: [
      { key: 'chokepoints', label: 'Strategic Chokepoints', icon: Crosshair, colorClass: 'red' },
      { key: 'militaryBases', label: 'Military Bases', icon: Shield, colorClass: 'green' },
      { key: 'conflicts', label: 'Conflict Incidents', icon: AlertTriangle, colorClass: 'rose' },
      { key: 'political', label: 'Political Map', icon: Map, colorClass: 'emerald' },
    ]
  },
  {
    title: 'Market Intelligence',
    items: [
      { key: 'commodityPrices', label: 'Commodity Prices', icon: TrendingUp, colorClass: 'emerald' },
      { key: 'preciousMetals', label: 'Precious Metals', icon: Coins, colorClass: 'yellow' },
      { key: 'industrialMetals', label: 'Industrial Metals', icon: Factory, colorClass: 'stone' },
      { key: 'rareEarths', label: 'Rare Earth Elements', icon: Zap, colorClass: 'indigo' },
      { key: 'agriculturalCommodities', label: 'Agricultural Commodities', icon: CloudRain, colorClass: 'green' },
      { key: 'cropYields', label: 'Crop Yields', icon: Map, colorClass: 'amber' },
      { key: 'foodSupplyChain', label: 'Food Supply Chain', icon: Anchor, colorClass: 'sky' },
      { key: 'energyCommodities', label: 'Energy Commodities', icon: Flame, colorClass: 'orange' },
      { key: 'mineralExports', label: 'Mineral Exports', icon: Ship, colorClass: 'blue' },
      { key: 'priceShocks', label: 'Price Shocks', icon: AlertTriangle, colorClass: 'rose' },
    ]
  },
  {
    title: 'Equity Market Intelligence',
    items: [
      { key: 'indiaStocks', label: 'India Stock Market', icon: BarChart3, colorClass: 'orange' },
      { key: 'indiaSectors', label: 'India Sectors', icon: Building2, colorClass: 'amber' },
      { key: 'singaporeMarkets', label: 'Singapore Markets', icon: Landmark, colorClass: 'sky' },
      { key: 'aseanMarkets', label: 'ASEAN Growth Tracker', icon: TrendingUp, colorClass: 'green' },
      { key: 'globalEM', label: 'Global EM Comparison', icon: GlobeIcon, colorClass: 'indigo' },
    ]
  },
  {
    title: 'Startup Ecosystem',
    items: [
      { key: 'indiaStartups', label: 'India Startups', icon: Rocket, colorClass: 'orange' },
      { key: 'singaporeStartups', label: 'Singapore Startups', icon: Building2, colorClass: 'sky' },
      { key: 'startupFunding', label: 'Funding Signals', icon: Coins, colorClass: 'emerald' },
      { key: 'startupOpportunity', label: 'Opportunity Discovery', icon: Search, colorClass: 'cyan' },
      { key: 'unicornTracker', label: 'Unicorn Tracker', icon: Diamond, colorClass: 'yellow' },
    ]
  }
];

export default function Sidebar() {
  const { layers, toggleLayer, selectedEntity, activePoi, setActivePoi, sidebarOpen, setSidebarOpen } = useStore();

  return (
    <>
      {/* Backdrop — mobile only, visible when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    <div className={`absolute top-0 left-0 h-full w-80 bg-zinc-950/90 border-r border-zinc-800 text-zinc-300 p-4 z-10 flex flex-col font-mono text-sm backdrop-blur-sm overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'max-md:-translate-x-full'}`}>
      <div className="flex items-center gap-2 mb-8 shrink-0">
        <Activity className="text-cyan-500" />
        <h1 className="text-xl font-bold tracking-widest text-white uppercase">PolyMatic</h1>
      </div>

      <div className="mb-8 shrink-0">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <MapPin size={14} /> Places of Interest
        </h2>
        <div className="space-y-2">
          {POIS.map((poi) => (
            <button
              key={poi.id}
              onClick={() => setActivePoi(poi)}
              className={`w-full flex items-center justify-between p-2 rounded border ${
                activePoi?.id === poi.id ? 'bg-indigo-950/50 border-indigo-900 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2">POI - {poi.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 sticky top-0 bg-zinc-950/90 py-2 z-10">
          <Layers size={14} /> Intelligence Layers
        </h2>
        
        <div className="space-y-6 pb-4">
          {LAYER_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">{group.title}</h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = layers[item.key];
                
                // Dynamic color classes based on the item's colorClass
                let activeClasses = '';
                switch (item.colorClass) {
                  case 'cyan': activeClasses = 'bg-cyan-950/50 border-cyan-900 text-cyan-400'; break;
                  case 'amber': activeClasses = 'bg-amber-950/50 border-amber-900 text-amber-400'; break;
                  case 'emerald': activeClasses = 'bg-emerald-950/50 border-emerald-900 text-emerald-400'; break;
                  case 'indigo': activeClasses = 'bg-indigo-950/50 border-indigo-900 text-indigo-400'; break;
                  case 'blue': activeClasses = 'bg-blue-950/50 border-blue-900 text-blue-400'; break;
                  case 'orange': activeClasses = 'bg-orange-950/50 border-orange-900 text-orange-400'; break;
                  case 'rose': activeClasses = 'bg-rose-950/50 border-rose-900 text-rose-400'; break;
                  case 'red': activeClasses = 'bg-red-950/50 border-red-900 text-red-400'; break;
                  case 'stone': activeClasses = 'bg-stone-900 border-stone-700 text-stone-400'; break;
                  case 'yellow': activeClasses = 'bg-yellow-950/50 border-yellow-900 text-yellow-400'; break;
                  case 'sky': activeClasses = 'bg-sky-950/50 border-sky-900 text-sky-400'; break;
                  case 'green': activeClasses = 'bg-green-950/50 border-green-900 text-green-400'; break;
                  case 'zinc': activeClasses = 'bg-zinc-800 border-zinc-600 text-zinc-300'; break;
                  default: activeClasses = 'bg-zinc-800 border-zinc-700 text-white';
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => toggleLayer(item.key)}
                    className={`w-full flex items-center justify-between p-2 rounded border text-left transition-colors ${
                      isActive ? activeClasses : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-2"><Icon size={14} className="shrink-0" /> <span className="truncate">{item.label}</span></span>
                    <span className="text-[10px] shrink-0">{isActive ? 'ON' : 'OFF'}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedEntity && (
        <div className="mt-4 border-t border-zinc-800 pt-4 shrink-0">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Target Inspector</h2>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between">
              <span className="text-zinc-500">ID</span>
              <span className="text-white truncate max-w-[150px]">{selectedEntity.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LAT</span>
              <span className="text-white">{selectedEntity.lat.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LNG</span>
              <span className="text-white">{selectedEntity.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ALT</span>
              <span className="text-white">{selectedEntity.alt.toFixed(0)} ft</span>
            </div>
            {Object.entries(selectedEntity.metadata || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-zinc-500 uppercase">{key}</span>
                <span className="text-white truncate max-w-[150px] text-right">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
