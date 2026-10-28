import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    esbuild: {
      legalComments: 'none',
    },
    build: {
      sourcemap: true,
      target: 'esnext',
      cssMinify: true,
      rollupOptions: isSsrBuild
        ? undefined
        : {
            output: {
              manualChunks(id) {
                if (id.includes('node_modules')) {
                  if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react';
                  if (id.includes('@supabase')) return 'vendor-supabase';
                  if (id.includes('lucide-react')) return 'vendor-icons';
                  if (id.includes('i18next')) return 'vendor-i18n';
                  if (
                    id.includes('react-markdown') ||
                    id.includes('remark') ||
                    id.includes('micromark') ||
                    id.includes('mdast') ||
                    id.includes('unist') ||
                    id.includes('vfile')
                  ) {
                    return 'vendor-markdown';
                  }
                }
              },
            },
          },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/db.json', '**/db.json.tmp']
      },
    },
  };
});
