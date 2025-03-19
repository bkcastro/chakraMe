import { defineConfig } from "vite";

// Ensure the key and certificate files are read properly

export default defineConfig({
  server: {
    host: true,
    https: {
      key: "key.pem",
      cert: "cert.pem",
    },
    port: 3000,
  },
});
