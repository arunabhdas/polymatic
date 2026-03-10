import { create } from 'zustand';

export interface Entity {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  heading: number;
  metadata: any;
}

export interface EventAlert {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  severity: string;
}

export interface POI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}

export type LayerKey = 
  | 'aircraft' | 'ships' | 'satellites' | 'wildfires' | 'earthquakes' | 'volcanoes'
  | 'oilGas' | 'powerGrid' | 'ports' | 'chokepoints' | 'militaryBases' | 'conflicts'
  | 'weather' | 'floods' | 'mining' | 'pipelines' | 'internet' | 'airspace'
  | 'satelliteImagery' | 'darkShips' | 'political'
  | 'commodityPrices' | 'preciousMetals' | 'industrialMetals' | 'rareEarths'
  | 'agriculturalCommodities' | 'cropYields' | 'foodSupplyChain' | 'energyCommodities'
  | 'mineralExports' | 'priceShocks';

interface PolyMaticState {
  layers: Record<LayerKey, boolean>;
  aircraft: Record<string, Entity>;
  ships: Record<string, Entity>;
  satellites: Record<string, Entity>;
  wildfires: Record<string, Entity>;
  earthquakes: Record<string, Entity>;
  volcanoes: Record<string, Entity>;
  oilGas: Record<string, Entity>;
  powerGrid: Record<string, Entity>;
  ports: Record<string, Entity>;
  chokepoints: Record<string, Entity>;
  militaryBases: Record<string, Entity>;
  conflicts: Record<string, Entity>;
  weather: Record<string, Entity>;
  floods: Record<string, Entity>;
  mining: Record<string, Entity>;
  pipelines: Record<string, Entity>;
  internet: Record<string, Entity>;
  airspace: Record<string, Entity>;
  darkShips: Record<string, Entity>;
  commodityPrices: Record<string, Entity>;
  preciousMetals: Record<string, Entity>;
  industrialMetals: Record<string, Entity>;
  rareEarths: Record<string, Entity>;
  agriculturalCommodities: Record<string, Entity>;
  cropYields: Record<string, Entity>;
  foodSupplyChain: Record<string, Entity>;
  energyCommodities: Record<string, Entity>;
  mineralExports: Record<string, Entity>;
  priceShocks: Record<string, Entity>;
  
  events: EventAlert[];
  selectedEntity: Entity | null;
  activePoi: POI | null;
  sidebarOpen: boolean;
  eventFeedOpen: boolean;

  toggleLayer: (layer: LayerKey) => void;
  updateEntities: (layer: LayerKey, data: Entity[]) => void;
  addEvent: (event: EventAlert) => void;
  selectEntity: (entity: Entity | null) => void;
  setActivePoi: (poi: POI | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setEventFeedOpen: (open: boolean) => void;
}

export const useStore = create<PolyMaticState>((set) => ({
  layers: {
    aircraft: true,
    ships: true,
    satellites: false,
    wildfires: false,
    earthquakes: false,
    volcanoes: false,
    oilGas: false,
    powerGrid: false,
    ports: false,
    chokepoints: false,
    militaryBases: false,
    conflicts: false,
    weather: false,
    floods: false,
    mining: false,
    pipelines: false,
    internet: false,
    airspace: false,
    satelliteImagery: false,
    darkShips: false,
    political: false,
    commodityPrices: false,
    preciousMetals: false,
    industrialMetals: false,
    rareEarths: false,
    agriculturalCommodities: false,
    cropYields: false,
    foodSupplyChain: false,
    energyCommodities: false,
    mineralExports: false,
    priceShocks: false,
  },
  aircraft: {},
  ships: {},
  satellites: {},
  wildfires: {},
  earthquakes: {},
  volcanoes: {},
  oilGas: {},
  powerGrid: {},
  ports: {},
  chokepoints: {},
  militaryBases: {},
  conflicts: {},
  weather: {},
  floods: {},
  mining: {},
  pipelines: {},
  internet: {},
  airspace: {},
  darkShips: {},
  commodityPrices: {},
  preciousMetals: {},
  industrialMetals: {},
  rareEarths: {},
  agriculturalCommodities: {},
  cropYields: {},
  foodSupplyChain: {},
  energyCommodities: {},
  mineralExports: {},
  priceShocks: {},
  
  events: [],
  selectedEntity: null,
  activePoi: null,
  sidebarOpen: false,
  eventFeedOpen: false,
  
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
    
  updateEntities: (layer, data) =>
    set((state) => {
      // Only update if it's a valid entity layer
      if (layer === 'political' || layer === 'satelliteImagery') return state;
      
      const newEntities = { ...state[layer] };
      data.forEach((entity) => {
        newEntities[entity.id] = entity;
      });
      return { [layer]: newEntities };
    }),
    
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 50), // Keep last 50 events
    })),
    
  selectEntity: (entity) => set({ selectedEntity: entity }),
  setActivePoi: (poi) => set({ activePoi: poi }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setEventFeedOpen: (open) => set({ eventFeedOpen: open }),
}));
