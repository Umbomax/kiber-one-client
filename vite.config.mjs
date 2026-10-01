import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env.REACT_APP_API_URL": JSON.stringify(env.REACT_APP_API_URL || ""),
    },
    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT || 3002),
      strictPort: true,
    },
    build: {
      outDir: "build",
    },
  };
});
