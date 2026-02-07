import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "web",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3200",
    },
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
});
