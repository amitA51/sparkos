import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  // Load all env variables including VITE_ prefixed ones
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      headers: {
        // Allow Google Auth popup to communicate with parent window
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      // Explicit HMR configuration
      hmr: {
        overlay: true,
        protocol: 'ws',
        host: 'localhost',
      },
      watch: {
        usePolling: true, // Better compatibility on Windows
        interval: 100,
      },
    },
    plugins: [
      react(), // Fast Refresh is enabled by default
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        injectRegister: 'auto',
        strategies: 'injectManifest',
        srcDir: '',
        filename: 'sw.js',
        injectManifest: {
          swSrc: './public/sw-custom.js',
          swDest: './dist/sw.js',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          injectionPoint: undefined,
        },
        manifest: {
          name: 'Spark Personal Terminal',
          short_name: 'Spark',
          description:
            'A zero-maintenance personal terminal for your thoughts and feeds. Dark mode only, Hebrew UI, powered by AI for summarization and tagging.',
          theme_color: '#0A0A0F',
          background_color: '#0A0A0F',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait-primary',
          categories: ['productivity', 'lifestyle', 'personalization', 'news'],
          id: '/',
          start_url: '/',
          lang: 'he',
          dir: 'rtl',
          launch_handler: {
            client_mode: 'focus-existing',
          },
          icons: [
            {
              src: 'images/spark192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'images/spark512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          shortcuts: [
            {
              name: 'הוסף משימה חדשה',
              short_name: 'משימה',
              description: 'Create a new task',
              url: '/?action=add_task',
              icons: [{ src: 'images/shortcut-icon.png', sizes: '96x96', type: 'image/png' }],
            },
            {
              name: 'הוסף ספארק חדש',
              short_name: 'ספארק',
              description: 'Add a new spark',
              url: '/?action=add_spark',
              icons: [{ src: 'images/shortcut-icon.png', sizes: '96x96', type: 'image/png' }],
            },
            {
              name: "פתח את 'היום'",
              short_name: 'היום',
              description: 'Open Today view',
              url: '/?action=go_today',
              icons: [{ src: 'images/shortcut-icon.png', sizes: '96x96', type: 'image/png' }],
            },
            {
              name: 'פתח את הפיד',
              short_name: 'פיד',
              description: 'Open Feed',
              url: '/?action=go_feed',
              icons: [{ src: 'images/shortcut-icon.png', sizes: '96x96', type: 'image/png' }],
            },
          ],
        },
        devOptions: {
          enabled: false, // Disabled to fix Fast Refresh and dev-sw.js MIME type issues
          // type: 'classic',
          // navigateFallback: 'index.html',
        },
      }),
      // Bundle analyzer - run with ANALYZE=true npm run build to generate stats.html
      process.env.ANALYZE === 'true' && visualizer({
        filename: 'stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ].filter(Boolean),
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(
        env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID
      ),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@components': path.resolve(__dirname, './components'),
        '@hooks': path.resolve(__dirname, './hooks'),
        '@services': path.resolve(__dirname, './services'),
        '@screens': path.resolve(__dirname, './screens'),
        '@utils': path.resolve(__dirname, './utils'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@types': path.resolve(__dirname, './types'),
      },
    },
    build: {
      // Performance optimizations
      target: 'es2020',
      minify: 'esbuild', // ✅ PERF: Re-enabled minification with esbuild (fast & safe)
      sourcemap: true, // Keep for debugging, can disable in CI if needed

      // Bundle splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: id => {
            // Vendor chunks for better caching
            if (id.includes('node_modules')) {
              // React and its peer dependencies MUST be in same chunk to avoid initialization issues
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('use-sync-external-store') ||
                id.includes('scheduler')
              ) {
                return 'vendor-react';
              }
              if (id.includes('firebase')) {
                // Split Firebase into smaller chunks
                if (id.includes('auth')) return 'vendor-firebase-auth';
                if (id.includes('firestore')) return 'vendor-firebase-db';
                if (id.includes('storage')) return 'vendor-firebase-storage';
                return 'vendor-firebase-core';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer';
              }
              if (id.includes('date-fns') || id.includes('react-big-calendar')) {
                return 'vendor-calendar';
              }
              if (
                id.includes('@radix-ui') ||
                id.includes('clsx') ||
                id.includes('tailwind-merge')
              ) {
                return 'vendor-ui';
              }
              if (id.includes('@tiptap') || id.includes('prosemirror')) {
                return 'vendor-editor';
              }
              if (id.includes('@tanstack')) {
                return 'vendor-react'; // Keep react-query with react
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // ✅ PERF: Split heavy libraries into separate chunks
              if (id.includes('canvas-confetti')) {
                return 'vendor-confetti';
              }
              if (id.includes('showdown')) {
                return 'vendor-markdown';
              }
              if (id.includes('react-virtuoso')) {
                return 'vendor-virtuoso';
              }
              return 'vendor-core';
            }

            // Screen-specific chunks for lazy loading
            if (id.includes('/screens/')) {
              if (id.includes('HomeScreen')) {
                return 'screen-home';
              }
              if (id.includes('FeedScreen')) {
                return 'screen-feed';
              }
              if (id.includes('CalendarScreen')) {
                return 'screen-calendar';
              }
              if (id.includes('SettingsScreen')) {
                return 'screen-settings';
              }
              if (id.includes('AssistantScreen')) {
                return 'screen-assistant';
              }
              if (id.includes('LibraryScreen')) {
                return 'screen-library';
              }
              if (id.includes('PasswordManagerScreen')) {
                return 'screen-passwords';
              }
              if (id.includes('SearchScreen')) {
                return 'screen-search';
              }
              if (id.includes('AddScreen')) {
                return 'screen-add';
              }
              if (id.includes('InvestmentsScreen')) {
                return 'screen-investments';
              }
              if (id.includes('ViewsScreen')) {
                return 'screen-views';
              }
              if (id.includes('LoginScreen') || id.includes('SignupScreen')) {
                return 'screen-auth';
              }
            }

            // Feature-specific chunks - Split workout for better lazy loading
            if (id.includes('/components/workout/')) {
              // Active workout session (loaded on-demand)
              if (id.includes('ActiveWorkout')) return 'workout-active';
              // History and summary (loaded when viewing past workouts)
              if (id.includes('WorkoutHistory') || id.includes('WorkoutSummary')) return 'workout-history';
              // Planning and templates (loaded when creating workouts)
              if (id.includes('WorkoutTemplates') || id.includes('WorkoutPlanner')) return 'workout-planning';
              // Analytics dashboard (loaded on-demand)
              if (id.includes('AnalyticsDashboard')) return 'workout-analytics';
              // Core utilities and shared components
              return 'workout-core';
            }
            if (
              id.includes('/components/calendar/') ||
              id.includes('CalendarView') ||
              id.includes('FullCalendarView')
            ) {
              return 'feature-calendar';
            }
            if (id.includes('/components/notebook/')) {
              return 'feature-notebook';
            }

            return undefined;
          },
          chunkFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          entryFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]',
        },
      },

      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,

      // ✅ PERF: Drop console.logs in production for smaller bundle and better performance
      ...(isProd && {
        esbuild: {
          drop: ['console', 'debugger'],
          legalComments: 'none',
        },
      }),
    },

    // Optimize dependencies - pre-bundle for faster dev startup
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'date-fns',
        'react-big-calendar',
        '@tanstack/react-query',
        'clsx',
        'tailwind-merge',
      ],
      exclude: [
        // Large dependencies that should be loaded on demand
      ],
      // ✅ PERF: Force pre-bundling to avoid runtime discovery
      force: false,
    },

    // Enable CSS code splitting
    css: {
      devSourcemap: !isProd,
      // ✅ PERF: Minify CSS in production
      ...(isProd && {
        minify: true,
      }),
    },
  };
});
