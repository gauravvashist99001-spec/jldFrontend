import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request the frontend makes to /api/... gets forwarded to the
      // backend server-side, so the browser never talks to a different
      // origin directly -> no CORS issue in dev.
      "/api": {
        target: "https://jldbrontend.onrender.com/",
        changeOrigin: true,
      },
    },
  },
});
