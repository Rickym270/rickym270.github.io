import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/p/loop-prep/',
  plugins: [react()],
  build: {
    outDir: '../../p/loop-prep',
    emptyOutDir: true,
  },
});
