import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "nginx/dist",
    sourcemap: true,
  },
  base: "https://pssdconnect.org",
  plugins: [
    nodePolyfills(),
    react(),
    VitePWA({
      strategies: "injectManifest",
      injectRegister: null,
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "PSSD Connect",
        short_name: "PSSD Connect",
        theme_color: "#ffffff",
        display: "standalone",
        background_color: "#ffffff",
        orientation: "portrait",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "icon512_maskable.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "icon512_rounded.png",
            type: "image/png",
          },
        ],
      },
    }),
    sentryVitePlugin({
      org: "pssd-network",
      project: "javascript-react",
    }),
  ],
});
