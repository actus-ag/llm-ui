import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "LLMUISvelte",
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["svelte", "svelte/store"],
      output: {
        globals: {
          svelte: "Svelte",
          "svelte/store": "SvelteStore",
        },
      },
    },
  },
});
