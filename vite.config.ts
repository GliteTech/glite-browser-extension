import { defineConfig } from 'vite';
import { resolve } from 'path';

// Basic Vite config for a browser extension
// See: https://vitejs.dev/guide/backend-integration.html

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true, // Clear dist directory before building
      minify: !isDevelopment, // Minify only in production
      sourcemap: isDevelopment ? 'inline' : false, // Inline sourcemaps for dev

      // Configure Rollup options for extension structure
      rollupOptions: {
        input: {
          // Define entry points - Vite automatically finds HTML files in root/public
          // background needs to be specified if it's a TS file
          background: resolve(__dirname, 'src/background/index.ts'),
          // Add popup/options JS entries if they exist in src/
          // popup: resolve(__dirname, 'src/popup/index.ts'),
          // options: resolve(__dirname, 'src/options/index.ts'),
        },
        output: {
          // Configure output format and naming
          entryFileNames: `[name]/index.js`, // Output JS files in respective directories
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
          // Ensure background script is in the correct format
          format: 'esm', // Use ES Modules for Manifest V3 service workers
        },
      },
    },
    // Copy public folder contents to dist, including manifest.json
    publicDir: resolve(__dirname, 'public'),
    // Resolve aliases if needed
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
