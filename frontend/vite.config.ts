import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve('./index.html'),
        colors: path.resolve('./colors.html'),
        experience: path.resolve('./experience.html'),
        styleguide: path.resolve('./styleguide.html'),
        subconsciousStyleguide: path.resolve('./subconscious-styleguide.html'),
      },
    },
  },
});
