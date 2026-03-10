import { create } from "zustand"

interface FlagsState {
  dataSourceMode: "mock" | "rsdip"
  setDataSourceMode: (mode: "mock" | "rsdip") => void
}

export const useFlagsStore = create<FlagsState>((set) => ({
  dataSourceMode: (import.meta.env.VITE_DATA_SOURCE_MODE as "mock" | "rsdip") || "mock",
  setDataSourceMode: (mode) => set({ dataSourceMode: mode }),
}))
