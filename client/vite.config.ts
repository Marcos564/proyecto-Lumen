import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Mismos alias que `tsconfig.json` para que el editor y el bundler resuelvan igual.
const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@shared", replacement: src("./src/shared") },
      { find: "@features", replacement: src("./src/features") },
      { find: "@layouts", replacement: src("./src/layouts") },
      { find: "@/", replacement: src("./src/") },
    ],
  },
});
