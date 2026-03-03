import { create } from 'zustand'
import type { CameraPosition, LayerType, GeoRegion } from '@/types'

interface GeoState {
  cameraPosition: CameraPosition
  activeLayers: Set<LayerType>
  selectedRegion: GeoRegion | null
  selectedPOI: string | null
  clusteringZoomThreshold: number

  flyTo: (position: CameraPosition) => void
  toggleLayer: (layer: LayerType) => void
  setSelectedRegion: (region: GeoRegion | null) => void
  setSelectedPOI: (poiId: string | null) => void
}

export const useGeoStore = create<GeoState>()((set) => ({
  cameraPosition: { longitude: 0, latitude: 20, height: 15_000_000 },
  activeLayers: new Set<LayerType>(['events']),
  selectedRegion: null,
  selectedPOI: null,
  clusteringZoomThreshold: 8,

  flyTo: (position) => set({ cameraPosition: position }),
  toggleLayer: (layer) =>
    set((s) => {
      const next = new Set(s.activeLayers)
      if (next.has(layer)) {
        next.delete(layer)
      } else {
        next.add(layer)
      }
      return { activeLayers: next }
    }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedPOI: (poiId) => set({ selectedPOI: poiId }),
}))
