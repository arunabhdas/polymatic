import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeatureFlag } from '@/types'

function envBool(key: string): boolean {
  const val = import.meta.env[key]
  return val === 'true' || val === '1'
}

interface FlagsState {
  dataSourceMode: 'mock' | 'rsdip'
  enableGeoView: boolean
  enableDetect: boolean
  enableWhaleTracking: boolean
  enableTimeline: boolean
  enableLightMode: boolean

  isEnabled: (flag: FeatureFlag) => boolean
  setFlag: (flag: FeatureFlag, value: boolean) => void
}

export const useFlagsStore = create<FlagsState>()(
  persist(
    (set, get) => ({
      dataSourceMode: (import.meta.env.VITE_DATA_SOURCE_MODE as 'mock' | 'rsdip') || 'mock',
      enableGeoView: envBool('VITE_ENABLE_GEO_VIEW'),
      enableDetect: envBool('VITE_ENABLE_DETECT'),
      enableWhaleTracking: envBool('VITE_ENABLE_WHALE_TRACKING'),
      enableTimeline: envBool('VITE_ENABLE_TIMELINE'),
      enableLightMode: envBool('VITE_ENABLE_LIGHT_MODE'),

      isEnabled: (flag) => get()[flag],

      setFlag: (flag, value) => set({ [flag]: value }),
    }),
    {
      name: 'polymatic-flags',
      partialize: (state) => ({
        enableGeoView: state.enableGeoView,
        enableDetect: state.enableDetect,
        enableWhaleTracking: state.enableWhaleTracking,
        enableTimeline: state.enableTimeline,
        enableLightMode: state.enableLightMode,
      }),
    },
  ),
)
