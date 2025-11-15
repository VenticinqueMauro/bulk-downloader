/// <reference types="vitest" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: [
            'node_modules/',
            'tests/',
            'dist/',
            '*.config.js',
            '*.config.ts',
            'generate-icons.js',
          ],
        },
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            popup: path.resolve(__dirname, 'popup.html'),
            options: path.resolve(__dirname, 'options.html'),
            background: path.resolve(__dirname, 'background.ts'),
          },
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
            manualChunks: {
              // Separate React into its own chunk
              'react-vendor': ['react', 'react-dom'],
              // Separate Google Generative AI into its own chunk (loaded only when needed)
              'ai-vendor': ['@google/genai'],
            }
          }
        },
        outDir: 'dist',
        // TEMPORARILY DISABLED for debugging - keep console.log statements visible
        minify: false,
        // terserOptions: {
        //   compress: {
        //     drop_console: true, // Remove console.log in production
        //     drop_debugger: true,
        //   },
        // },
        // Optimize chunk size warnings
        chunkSizeWarningLimit: 500,
      },
      define: {
        'import.meta.env.VITE_PROXY_URL': JSON.stringify(env.VITE_PROXY_URL || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
