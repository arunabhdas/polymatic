import { describe, it, expect } from 'vitest';
import { useStore } from '../src/store/useStore';

describe('PolyMatic Store Integration', () => {
  it('should initialize with default layers', () => {
    const state = useStore.getState();
    expect(state.layers.aircraft).toBe(true);
    expect(state.layers.ships).toBe(true);
    expect(state.layers.satellites).toBe(false);
    expect(state.layers.commodityPrices).toBe(false);
    expect(state.layers.priceShocks).toBe(false);
  });

  it('should toggle layers correctly', () => {
    const store = useStore.getState();
    store.toggleLayer('satellites');
    store.toggleLayer('commodityPrices');
    
    const updatedState = useStore.getState();
    expect(updatedState.layers.satellites).toBe(true);
    expect(updatedState.layers.commodityPrices).toBe(true);
  });

  it('should update entities correctly', () => {
    const store = useStore.getState();
    const mockEntities = [
      { id: 'test-1', lat: 0, lng: 0, alt: 0, heading: 0, metadata: {} }
    ];
    
    store.updateEntities('aircraft', mockEntities);
    store.updateEntities('commodityPrices', mockEntities);
    
    const updatedState = useStore.getState();
    expect(updatedState.aircraft['test-1']).toBeDefined();
    expect(updatedState.aircraft['test-1'].id).toBe('test-1');
    expect(updatedState.commodityPrices['test-1']).toBeDefined();
    expect(updatedState.commodityPrices['test-1'].id).toBe('test-1');
  });

  it('should add events correctly', () => {
    const store = useStore.getState();
    const mockEvent = {
      id: 'evt-1',
      timestamp: new Date().toISOString(),
      title: 'Test Event',
      location: 'Test Location',
      severity: 'high'
    };
    
    store.addEvent(mockEvent);
    
    const updatedState = useStore.getState();
    expect(updatedState.events.length).toBeGreaterThan(0);
    expect(updatedState.events[0].id).toBe('evt-1');
  });
});
