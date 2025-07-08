import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src/writing',
  plugins: [react()],
  build: {
    outDir: '../../public/writing',
    emptyOutDir: true
  }
});
