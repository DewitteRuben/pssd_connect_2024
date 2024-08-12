import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
    }),
  ],
});
