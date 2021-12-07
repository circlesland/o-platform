/** @type {import("snowpack").SnowpackUserConfig } */

import fs from "fs";

const cert = fs.readFileSync("./localhost.crt");
const key = fs.readFileSync("./localhost.key");

// const mode = process.env.NODE_ENV || "development";
// const prod = mode === "production";
// const DEBUG = !process.argv.includes("--release");
// const VERBOSE = process.argv.includes("--verbose");

let __CIRCLES_GARDEN_API__ = "https://api.circles.garden/api/users/";
let __AUTH_ENDPOINT__ = "https://auth.circles.name";
let __API_ENDPOINT__ = "https://api.circles.land";
let __FILES_ENDPOINT__ = "https://files.circles.land";
let __APP_ID__ = "circles.land";
let __FILES_APP_ID__ = "files.circles.land";

// let __PATHFINDER_ENDPOINT__ = "https://rpc.circles.land/pathfinder";
// let __SAFE_SCHEMA_VERSION__ = "2";

// if (process.env.DEPLOY_ENVIRONMENT === "main") {
//   __AUTH_ENDPOINT__ = "https://auth.circles.name";
//   __API_ENDPOINT__ = "https://api.circles.land";
//   __FILES_ENDPOINT__ = "https://files.circles.land";
//   __APP_ID__ = "circles.land";
//   __FILES_APP_ID__ = "files.circles.land";
// } else if (process.env.DEPLOY_ENVIRONMENT === "dev") {
//   __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
//   __API_ENDPOINT__ = "https://dev.api.circles.land";
//   __FILES_ENDPOINT__ = "https://dev.files.circles.land";
//   __APP_ID__ = "dev.circles.land";
//   __FILES_APP_ID__ = "dev.files.circles.land";
// } else if (process.env.DEPLOY_ENVIRONMENT === "thorsten") {
//   __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
//   __API_ENDPOINT__ = "https://thorsten.api.circles.land";
//   __FILES_ENDPOINT__ = "https://dev.files.circles.land";
//   __APP_ID__ = "thorsten.circles.land";
//   __FILES_APP_ID__ = "dev.files.circles.land";
// } else if (process.env.DEPLOY_ENVIRONMENT === "local") {
//   __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
//   __API_ENDPOINT__ = "https://local.api.circles.land";
//   __FILES_ENDPOINT__ = "https://dev.files.circles.land";
//   __APP_ID__ = "local.circles.land";
//   __FILES_APP_ID__ = "dev.files.circles.land";
// } else if (process.env.DEPLOY_ENVIRONMENT === "ultralocal") {
//   __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
//   __API_ENDPOINT__ = "http://localhost:8989";
//   __FILES_ENDPOINT__ = "https://dev.files.circles.land";
//   __APP_ID__ = "ultralocal.circles.land";
//   __FILES_APP_ID__ = "dev.files.circles.land";
// }

__AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
__API_ENDPOINT__ = "https://dev.api.circles.land";
__FILES_ENDPOINT__ = "https://dev.files.circles.land";
__APP_ID__ = "dev.circles.land";
__FILES_APP_ID__ = "dev.files.circles.land";
// module.exports = {
//   env: {
//     CIRCLES_GARDEN_API: __CIRCLES_GARDEN_API__,
//     AUTH_ENDPOINT: __AUTH_ENDPOINT__,
//     API_ENDPOINT: __API_ENDPOINT__,
//     FILES_ENDPOINT: __FILES_ENDPOINT__,
//     CIRCLES_SUBGRAPH_ENDPOINT:
//       "https://api.thegraph.com/subgraphs/name/circlesubi/circles",
//     PATHFINDER_ENDPOINT: "https://rpc.circles.land/pathfinder",
//     APP_ID: __APP_ID__,
//     FILES_APP_ID: __FILES_APP_ID__,
//     SAFE_SCHEMA_VERSION: "2",
//     API_URL: "api.google.com",
//   },
//   packageOptions: {
//     external: [
//       "@o-platform/o-utils",
//       "@o-platform/o-events",
//       "@o-platform/o-interfaces",
//       "@o-platform/o-process",
//       "@o-platform/o-circles",
//       "@o-platform/o-editors",
//     ],
//   },
//   mount: {
//     /* ... */
//   },
//   plugins: ["@snowpack/plugin-svelte"],
// };

export default {
  env: {
    CIRCLES_GARDEN_API: __CIRCLES_GARDEN_API__,
    AUTH_ENDPOINT: __AUTH_ENDPOINT__,
    API_ENDPOINT: __API_ENDPOINT__,
    FILES_ENDPOINT: __FILES_ENDPOINT__,
    CIRCLES_SUBGRAPH_ENDPOINT:
      "https://api.thegraph.com/subgraphs/name/circlesubi/circles",
    PATHFINDER_ENDPOINT: "https://rpc.circles.land/pathfinder",
    APP_ID: __APP_ID__,
    FILES_APP_ID: __FILES_APP_ID__,
    SAFE_SCHEMA_VERSION: "2",
    API_URL: "api.google.com",
  },

  mount: {
    // public: { url: "/", static: true },
    public: { url: "/" },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-svelte",
    "@snowpack/plugin-dotenv",
    [
      "@snowpack/plugin-typescript",
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: "yarn pnpify tsc" } : {}),
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    external: [
      "@o-platform/o-utils",
      "@o-platform/o-events",
      "@o-platform/o-interfaces",
      "@o-platform/o-process",
      "@o-platform/o-circles",
      "@o-platform/o-editors",
    ],
  },
  devOptions: {
    secure: { cert, key },
    hmr: true,
    port: 5000,
    output: "stream",
  },
  buildOptions: {
    /* ... */
  },
  alias: {
    components: {
      "@o-platform": "../packages",
    },
    // "@o-platform/o-events": "../packages/o-events",
    // "@o-platform/o-interfaces": "../packages/o-interfaces",
    // "@o-platform/o-process": "../packages/o-process",
    // "@o-platform/o-circles": "../packages/o-circles",
    // "@o-platform/o-editors": "../packages/o-editors",
  },
};
