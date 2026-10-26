import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/server.ts"],
//   format: ["esm"],
//   platform: "node",
//   target: "node24",
//   outDir: "dist",
//   clean: true,
//   sourcemap: true,
//   noExternal: ["@repo/shared"],
// });


export default defineConfig({
  entry: {
    server: "src/server.ts",
  },

  format: ["esm"],
  platform: "node",
  target: "node24",

  outDir: "dist",

  clean: true,

  sourcemap: true,

  noExternal: [
    "@repo/shared",
  ],
});