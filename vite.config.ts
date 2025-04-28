import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@vitejs/plugin-react": path.resolve(
        __dirname,
        "node_modules/@vitejs/plugin-react/dist/index.mjs"
      ),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["react-helmet"], // Removed "react/jsx-runtime" as it should be bundled
    },
  },
  server: {
    port: 7777,
  },
});
