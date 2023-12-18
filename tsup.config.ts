import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/main.ts", "src/parse.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["path", "fs"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
