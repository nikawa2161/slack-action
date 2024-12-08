import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: true,
    target: "node18",
    outDir: "dist",
    rollupOptions: {
      input: "src/index.ts",
      output: {
        inlineDynamicImports: true,
        format: 'cjs',
        entryFileNames: "function.js",
      },
    },
  },
});
