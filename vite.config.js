import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Lets `npm run dev` hit the payment API when `node serve.mjs` is also
      // running locally (e.g. `npm run build && npm run serve`).
      '/api': 'http://127.0.0.1:4173',
    },
  },
});
