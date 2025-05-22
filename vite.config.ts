import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ["@tanstack/react-query"]
  },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client/src"),
          "@shared": path.resolve(__dirname, "shared"),
          "@vitejs/plugin-react": path.resolve(__dirname, "node_modules/@vitejs/plugin-react/dist/index.mjs"),
          // Ensure React and JSX runtime resolve correctly
          "react": path.resolve(__dirname, "node_modules/react"),
          "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
          "@tanstack/react-query": path.resolve(__dirname, "node_modules/@tanstack/react-query"),
        },
      },
  root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        external: ["react-helmet"], // Remove react/jsx-runtime from external modules
      },
    },
  server: {
    port: 7777,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:3000', // Assuming backend runs on port 3000
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Set to true if backend uses HTTPS with valid cert
        // rewrite: (path) => path.replace(/^\/api/, ''), // Uncomment if backend doesn't expect /api prefix
      },
    },
  },
});
