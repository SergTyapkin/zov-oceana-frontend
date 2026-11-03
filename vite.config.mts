import { defineConfig, loadEnv } from 'vite';
import pluginVue from '@vitejs/plugin-vue';
import pluginBasicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import { existsSync } from 'node:fs';
import { VitePWA as pluginVitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy as pluginViteStaticCopy } from 'vite-plugin-static-copy';
import pluginSitemap from 'vite-plugin-sitemap';
import pluginAutoprefixer from 'autoprefixer';
import routes from './src/routes';
// import pluginTsCompileServiceWorker from './src/serviceWorker/pluginTsCompileServiceWorker';
import pluginAssetsInserter from './src/serviceWorker/pluginAssetsListGenerator';
import pluginDynamicImport from 'vite-plugin-dynamic-import';
import pluginOpenGraph from 'vite-plugin-open-graph';

const pluginPrettier = () => ({ name: 'prettier' });
const pluginRequireApk = () => ({
  name: 'require-android-apk',
  apply: 'build' as const,
  buildStart() {
    if (!existsSync(path.resolve('public/downloads/zov-oceana.apk'))) {
      throw new Error('Missing public/downloads/zov-oceana.apk. Build a signed Android release or copy the APK there before building the frontend. See android-app/README.md.');
    }
  },
});

export default defineConfig(({ mode }: { command: 'build' | 'serve'; mode: 'development' | 'production' | string }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '.'));
  console.log(`Loaded env file(s) from: ${path.resolve(__dirname, '.')}:`, env);

  return {
    plugins: [
      pluginVue({
        include: [/\.vue$/],
      }),
      pluginDynamicImport(),
      pluginPrettier(),
      pluginRequireApk(),
      pluginViteStaticCopy({
        targets: [
          { src: 'static/favicon.png', dest: 'static' },
          { src: 'static/apple-touch-icon.png', dest: 'static' },
          { src: 'static/app-icon-512.png', dest: 'static' },
          { src: 'static/.well-known/assetlinks.json', dest: '.well-known' },
          { src: 'static/open-graph-preview.png', dest: 'static' },
        ],      }),
      pluginSitemap({
        hostname: `${/true/i.test(env.VITE_HTTPS) ? 'https' : 'http'}://${env.VITE_DEPLOY_HOSTNAME}`,
        dynamicRoutes: Object.keys(routes).filter(route => routes[route]),
        generateRobotsTxt: true,
      }),
      // pluginTsCompileServiceWorker(),
      pluginVitePWA({
        // strategies: 'injectManifest',
        // injectRegister: false,
        // injectManifest: {
        //   injectionPoint: undefined,
        // },
        // srcDir: 'dist',
        // filename: 'sw.js',


        includeManifestIcons: true,
        includeAssets: ['/static/favicon.png'],
        workbox: {
          globIgnores: ['**/*.apk'],
          navigateFallbackDenylist: [/^\/downloads\//],
        },
        manifest: {
          short_name: 'Зов Океана',
          name: 'Зов Океана',
          lang: 'ru',
          description: 'Интернет-магазин морепродуктов',
          icons: [
            {
              src: '/static/favicon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/static/app-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          theme_color: '#181818',
          background_color: '#181818',
          display: 'standalone',
          id: '/?source=pwa',
          start_url: '/?source=pwa',
          scope: '/',
          prefer_related_applications: false,
          shortcuts: [
            {
              name: 'Каталог',
              short_name: 'Каталог',
              description: 'Каталог морепродуктов',
              url: '/market?source=pwa',
            },
          ],
        },
      }),
      pluginOpenGraph({
        basic: {
          title: 'Зов Океана',
          siteName: 'Зов Океана',
          description: 'Магазин премиальных морепродуктов по доступным ценам',
          type: 'image/png',
          url: `${env.VITE_HTTPS === 'true' ? 'https' : 'http'}://${env.VITE_DEPLOY_HOSTNAME}`,
          image: `${env.VITE_HTTPS === 'true' ? 'https' : 'http'}://${env.VITE_DEPLOY_HOSTNAME}/static/open-graph-preview.png`,
          determiner: 'auto',
          locale: 'ru_RU',
          localeAlternate: [],
        }
      }),
      pluginAssetsInserter({
        outBuildDir: 'dist',
        additionalDirs: ['static'],
      }),
    ].concat(/true/i.test(env.VITE_HTTPS) ? [pluginBasicSsl()] : []),
    css: {
      postcss: {
        plugins: [
          pluginAutoprefixer(),
        ]
      }
    },
    define: {
      BUILD_TIMESTAMP: Date.now(),
      BUILD_VERSION: JSON.stringify(import('./package.json').version),
    },
    server: {
      https: /true/i.test(env.VITE_HTTPS),
      proxy: {
        // '/ws': {
        //   target: `ws://127.0.0.1:9000`,
        //   secure: true,
        //   ws: true,
        //   changeOrigin: true,
        // },
        '/api': {
          target: env.VITE_DEV_API_PROXY_URL,
          secure: false,
          changeOrigin: false,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
        '/image': {
          target: env.VITE_DEV_API_PROXY_URL,
          secure: false,
          changeOrigin: false,
          rewrite: (path: string) => path,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: '~', // to use ~ as project root like: "import Some from '~/components/Some.vue'"
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: '#', // to use # as static root like: "import SomeResource from '#/icons/SomeResource.png'"
          replacement: path.resolve(__dirname, 'static'),
        }
      ],
    },
    build: {
      // chunkSizeWarningLimit: 600,
      modulePreload: false,
      target: 'esnext',
      minify: true,
      sourcemap: mode !== 'production',
      cssCodeSplit: false,
    },
  };
});
