import postcss from "./postcss.config.js";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import path from "path";
import { Buffer } from "buffer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss,
  },
  define: {
    global: {},
    Buffer: Buffer,
  },
  publicDir: "public",
  resolve: {
    alias: {
      "@shared": path.resolve("./src/shared"),
      "@dapps": path.resolve("./src/dapps"),
      "@toruslabs/openlogin": path.resolve("../node_modules/@toruslabs/openlogin/dist/openlogin.umd.min.js"),
      multihashes: path.resolve("../node_modules/multihashes/dist/index.min.js"),
      "multicodec/src/base-table.json": path.resolve("../node_modules/multicodec/src/base-table.json"),
      multicodec: path.resolve("../node_modules/multicodec/dist/index.min.js"),
      "@ethereumjs-tx": path.resolve("../node_modules/@ethereumjs/tx/dist.browser/index.js"),
      "ethereumjs-util": path.resolve("../node_modules/ethereumjs-util/dist.browser/index.js"),
      web3: path.resolve("../node_modules/web3/dist/web3.min.js"),
    },
  },
  // optimizeDeps: {
  //   include: ["@o-utils/dist/asyncBroadcast.js"],
  // },
});
