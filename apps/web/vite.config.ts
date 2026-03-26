import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      // Same-origin `/api` in dev so session cookies work with the Trackr API on port 3000.
      "/api": { target: "http://127.0.0.1:3000", changeOrigin: true },
    },
  },
});
