import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import cesium from 'vite-plugin-cesium';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    root: 'polymatic-mvp-frontend',
    plugins: [react(), tailwindcss(), cesium()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.CESIUM_ION_TOKEN': JSON.stringify(env.CESIUM_ION_TOKEN),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './polymatic-mvp-frontend/src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    }
  };
});
