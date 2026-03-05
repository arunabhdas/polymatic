import type { Entity } from '../types/common.types';

export const seedEntities: Entity[] = [
  // Geopolitics / Defense
  { id: 'e-iran', name: 'Iran', type: 'country' },
  { id: 'e-israel', name: 'Israel', type: 'country' },
  { id: 'e-usa', name: 'United States', type: 'country' },
  { id: 'e-strait-of-hormuz', name: 'Strait of Hormuz', type: 'location' },
  { id: 'e-irgc', name: 'IRGC', type: 'organization' },
  { id: 'e-idf', name: 'IDF', type: 'organization' },
  { id: 'e-nato', name: 'NATO', type: 'organization' },
  { id: 'e-ukraine', name: 'Ukraine', type: 'country' },
  { id: 'e-russia', name: 'Russia', type: 'country' },

  // Economics / Trade
  { id: 'e-fed', name: 'Federal Reserve', type: 'organization' },
  { id: 'e-powell', name: 'Jerome Powell', type: 'person' },
  { id: 'e-ecb', name: 'ECB', type: 'organization' },
  { id: 'e-eu', name: 'European Union', type: 'organization' },
  { id: 'e-trump', name: 'Donald Trump', type: 'person' },
  { id: 'e-biden', name: 'Joe Biden', type: 'person' },
  
  // Tech / Corporate
  { id: 'e-tsmc', name: 'TSMC', type: 'organization' },
  { id: 'e-openai', name: 'OpenAI', type: 'organization' },
  { id: 'e-nvidia', name: 'NVIDIA', type: 'organization' },
  { id: 'e-sam-altman', name: 'Sam Altman', type: 'person' },
  { id: 'e-jensen', name: 'Jensen Huang', type: 'person' },
  
  // Commodities / Assets
  { id: 'e-gpt5', name: 'GPT-5', type: 'commodity' },
  { id: 'e-brent', name: 'Brent Crude', type: 'commodity' },
  { id: 'e-btc', name: 'Bitcoin', type: 'commodity' },
  
  // Locations
  { id: 'e-arizona-fab', name: 'Arizona Fab 2', type: 'location' },
  { id: 'e-taiwan', name: 'Taiwan', type: 'country' },
  { id: 'e-dc', name: 'Washington D.C.', type: 'location' }
];

export const getEntityById = (id: string): Entity | undefined => 
  seedEntities.find(e => e.id === id);

export const getRandomEntities = (min: number, max: number): Entity[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...seedEntities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
