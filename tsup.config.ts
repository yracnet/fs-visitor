import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/filter.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["path", "fs", "minimatch"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
