import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { load } from 'js-yaml';

// Parse `.yaml` imports at build time: the browser gets plain data instead of
// js-yaml plus a runtime parse, and a malformed YAML fails the build instead of
// blanking the page in production.
const yaml = (): Plugin => ({
  name: 'yaml',
  transform(code, id) {
    // In dev the id carries a query (`?import`), so test the path part only.
    if (!id.split('?')[0].endsWith('.yaml')) return;
    return { code: `export default ${JSON.stringify(load(code))};`, map: null };
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [yaml(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
