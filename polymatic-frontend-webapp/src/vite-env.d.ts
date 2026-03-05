/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE_MODE: 'mock' | 'rsdip';
  readonly VITE_ENABLE_GEO_VIEW: string;
  readonly VITE_ENABLE_DETECT: string;
  readonly VITE_ENABLE_WHALE_TRACKING: string;
  readonly VITE_ENABLE_TIMELINE: string;
  readonly VITE_ENABLE_LIGHT_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
