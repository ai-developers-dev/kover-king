import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "app",
      routesDirectory: "routes",
    }),
    // maxDuration lets the AI blog generation (web research + LLM write) run
    // up to 60s on Vercel Pro. On the free tier Vercel still caps at ~10s.
    nitro({ serverDir: "app/server", vercel: { functions: { maxDuration: 60 } } }),
  ],
});
