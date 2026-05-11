import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "dist",
    sourcemap: true,
    splitting: false,
    treeshake: true,
    noExternal: ["gbk.js"],
  },
]);
