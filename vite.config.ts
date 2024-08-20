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
        theme_color: "#06091c",
        display: "standalone",
        background_color: "#06091c",
        icons: [
          {
            src: "logo-48-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "logo-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "logo-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
