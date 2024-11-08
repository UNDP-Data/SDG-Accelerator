/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), eslint()],
  build: {
    outDir: 'build',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
});
