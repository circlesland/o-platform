const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
let prod = mode === "production";
const dev = !prod;
const DEBUG = !process.argv.includes("--release");
const VERBOSE = process.argv.includes("--verbose");

let __CIRCLES_GARDEN_API__ = "https://api.circles.garden/api/users/";
let __AUTH_ENDPOINT__ = "https://auth.circles.name";
let __API_ENDPOINT__ = "https://api.circles.land";
let __HUMANODE_AUTH_URL__ = "https://auth.staging.oauth2.humanode.io/oauth2/auth";
let __HUMANODE_TOKEN_URL__ = "https://auth.staging.oauth2.humanode.io/oauth2/token";
let __HUMANODE_REDIRECT_URL__ = "http://localhost:5000/";
let __HUMANODE_CLIENT_ID__ = "circles-ubi-jwks";
let __HUMANODE_SCOPE__ = "openid";
let __EXTERNAL_URL__ = "https://circles.land";
let __CIRCLES_SUBGRAPH_ENDPOINT__ = "https://api.thegraph.com/subgraphs/name/circlesubi/circles";
let __PATHFINDER_ENDPOINT__ = "https://rpc.circles.land/pathfinder";
let __APP_ID__ = "circles.land";
let __FILES_APP_ID__ = "files.circles.land";
let __SAFE_SCHEMA_VERSION__ = "2";
let __CIRCLES_HUB_ADDRESS__ = "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543";
let __CIRCLES_HUB_BLOCK__ = "12529458";
let __SAFE_PROXY_FACTORY_ADDRESS__ = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
let __SAFE_ADDRESS__ = "0x3E5c63644E683549055b9Be8653de26E0B4CD36E";
let __RPC_ENDPOINT__ = "https://rpc.circles.land";
let __OPENLOGIN_CLIENT_ID__ =
  process.env.OPENLOGIN_CLIENT_ID ??
  "BHqazms23gbTZQ2fYvvUaFzv718Ft8Ox1XwSEqVt81jtZJRQRb-N5cnThtZGSjZF9Dtj9MQxkEQTUo47I_wiihE";
let __ALLOW_VERIFY__ = "true"; // !process.env.ALLOW_VERIFY ? "false" : "true";
let __ALLOW_CREATE_ORGANISATION__ = !process.env.ALLOW_CREATE_ORGANISATION ? "false" : "true";
let __USE_MOCKS__ = !process.env.USE_MOCKS ? "false" : "true";
let __FIXED_GAS_PRICE__ = !process.env.FIXED_GAS_PRICE ? "0" : process.env.FIXED_GAS_PRICE;
let __SHOW_LANGUAGE_SWITCHER__ = "true";
let __HERE_API_KEY__ = "fhiIkoASi1B-z8R7ytKBnfJltOpaUlYBV1kydXyK1sE";

if (process.env.DEPLOY_ENVIRONMENT === "main") {
  __AUTH_ENDPOINT__ = "https://auth.circles.name";
  __API_ENDPOINT__ = "https://api.circles.land";
  __APP_ID__ = "circles.land";
  __EXTERNAL_URL__ = "https://circles.land";
  __FILES_APP_ID__ = "files.circles.land";
  __SHOW_LANGUAGE_SWITCHER__ = "false";
  prod = true;
} else if (process.env.DEPLOY_ENVIRONMENT === "dev") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "https://dev.api.circles.land";
  __APP_ID__ = "staging.circles.land";
  __EXTERNAL_URL__ = "https://staging.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
  __HUMANODE_CLIENT_ID__ = "circles-ubi-staging";
  __SHOW_LANGUAGE_SWITCHER__ = "false";
  prod = false;
} else if (process.env.DEPLOY_ENVIRONMENT === "local") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "https://local.api.circles.land";
  __APP_ID__ = "local.circles.land";
  __EXTERNAL_URL__ = "https://localhost:5000";
  __FILES_APP_ID__ = "dev.files.circles.land";
  __HUMANODE_CLIENT_ID__ = "circles-ubi-staging";
  prod = false;
} else if (process.env.DEPLOY_ENVIRONMENT === "ultralocal") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "http://localhost:8989";
  __APP_ID__ = "ultralocal.circles.land";
  __EXTERNAL_URL__ = "http://localhost:5000";
  __FILES_APP_ID__ = "dev.files.circles.land";
  __HUMANODE_CLIENT_ID__ = "circles-ubi-staging";
  prod = false;
} else if (process.env.DEPLOY_ENVIRONMENT === "docker") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = process.env.API_ENDPOINT ? process.env.API_ENDPOINT : "https://localhost:8989";
  __APP_ID__ = "ultralocal.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
  __CIRCLES_HUB_ADDRESS__ = process.env.CIRCLES_HUB_ADDRESS;
  __CIRCLES_HUB_BLOCK__ = process.env.CIRCLES_HUB_BLOCK;
  __SAFE_PROXY_FACTORY_ADDRESS__ = process.env.SAFE_PROXY_FACTORY_ADDRESS;
  __SAFE_ADDRESS__ = process.env.SAFE_ADDRESS;
  __RPC_ENDPOINT__ = process.env.RPC_ENDPOINT ?? "http://localhost:8545";
  __ALLOW_VERIFY__ = "true";
  __ALLOW_CREATE_ORGANISATION__ = "true";
  __FIXED_GAS_PRICE__ = "1";
  __HUMANODE_CLIENT_ID__ = "circles-ubi-staging";
  prod = false;
}

__HUMANODE_REDIRECT_URL__ = __EXTERNAL_URL__;

console.log(`__AUTH_ENDPOINT__: ${__AUTH_ENDPOINT__}`);

console.log(`__HUMANODE_AUTH_URL__: ${__HUMANODE_AUTH_URL__}`);
console.log(`__HUMANODE_TOKEN_URL__: ${__HUMANODE_TOKEN_URL__}`);
console.log(`__HUMANODE_REDIRECT_URL__: ${__HUMANODE_REDIRECT_URL__}`);
console.log(`__HUMANODE_CLIENT_ID__: ${__HUMANODE_CLIENT_ID__}`);
console.log(`__HUMANODE_SCOPE__: ${__HUMANODE_SCOPE__}`);

console.log(`__APP_ID__: ${__APP_ID__}`);
console.log(`__EXTERNAL_URL__: ${__EXTERNAL_URL__}`);
console.log(`__FILES_APP_ID__: ${__FILES_APP_ID__}`);
console.log(`__CIRCLES_GARDEN_API__: ${__CIRCLES_GARDEN_API__}`);
console.log(`__SAFE_SCHEMA_VERSION__: ${__SAFE_SCHEMA_VERSION__}`);
console.log(`__PATHFINDER_ENDPOINT__: ${__PATHFINDER_ENDPOINT__}`);
console.log(`__CIRCLES_SUBGRAPH_ENDPOINT__: ${__CIRCLES_SUBGRAPH_ENDPOINT__}`);
console.log(`__CIRCLES_HUB_ADDRESS__: ${__CIRCLES_HUB_ADDRESS__}`);
console.log(`__CIRCLES_HUB_BLOCK__: ${__CIRCLES_HUB_BLOCK__}`);
console.log(`__SAFE_PROXY_FACTORY_ADDRESS__: ${__SAFE_PROXY_FACTORY_ADDRESS__}`);
console.log(`__SAFE_ADDRESS__: ${__SAFE_ADDRESS__}`);
console.log(`__RPC_ENDPOINT__: ${__RPC_ENDPOINT__}`);
console.log(`__OPENLOGIN_CLIENT_ID__: ${__OPENLOGIN_CLIENT_ID__}`);
console.log(`__USE_MOCKS__: ${__USE_MOCKS__}`);
console.log(`__ALLOW_VERIFY__: ${__ALLOW_VERIFY__}`);
console.log(`__ALLOW_CREATE_ORGANISATION__: ${__ALLOW_CREATE_ORGANISATION__}`);
console.log(`__FIXED_GAS_PRICE__: ${__FIXED_GAS_PRICE__}`);
console.log(`__SHOW_LANGUAGE_SWITCHER__: ${__SHOW_LANGUAGE_SWITCHER__}`);

const sveltePath = path.resolve("node_modules", "svelte");

module.exports = {
  mode,
  devtool: prod ? false : "inline-cheap-module-source-map",
  entry: {
    bundle: ["./src/main.ts"],
  },
  resolve: {
    alias: {
      svelte: sveltePath,
      src: path.resolve(__dirname, "src"),
      libs: path.resolve(__dirname, "libs"),
      // dapps: path.resolve( __dirname, 'dapps'),
      // libs: path.resolve( __dirname, 'dapps')
    },
    extensions: [".mjs", ".tsx", ".ts", ".js", ".svelte", ".svx"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    chunkFilename: "bundle.[id].js",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },

  module: {
    rules: [
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HUMANODE_SCOPE__",
          replace: __HUMANODE_SCOPE__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HERE_API_KEY__",
          replace: __HERE_API_KEY__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HUMANODE_CLIENT_ID__",
          replace: __HUMANODE_CLIENT_ID__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HUMANODE_REDIRECT_URL__",
          replace: __HUMANODE_REDIRECT_URL__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HUMANODE_TOKEN_URL__",
          replace: __HUMANODE_TOKEN_URL__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HUMANODE_AUTH_URL__",
          replace: __HUMANODE_AUTH_URL__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__FIXED_GAS_PRICE__",
          replace: __FIXED_GAS_PRICE__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__USE_MOCKS__",
          replace: __USE_MOCKS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__ALLOW_VERIFY__",
          replace: __ALLOW_VERIFY__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__ALLOW_CREATE_ORGANISATION__",
          replace: __ALLOW_CREATE_ORGANISATION__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_HUB_ADDRESS__",
          replace: __CIRCLES_HUB_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__OPENLOGIN_CLIENT_ID__",
          replace: __OPENLOGIN_CLIENT_ID__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SAFE_ADDRESS__",
          replace: __SAFE_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SAFE_PROXY_FACTORY_ADDRESS__",
          replace: __SAFE_PROXY_FACTORY_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_HUB_BLOCK__",
          replace: __CIRCLES_HUB_BLOCK__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__PATHFINDER_ENDPOINT__",
          replace: __PATHFINDER_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_SUBGRAPH_ENDPOINT__",
          replace: __CIRCLES_SUBGRAPH_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__AUTH_ENDPOINT__",
          replace: __AUTH_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__API_ENDPOINT__",
          replace: __API_ENDPOINT__,
          flags: "g",
        },
      },
      {
        // https://github.com/sveltejs/svelte-loader/issues/139
        test: /.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SAFE_SCHEMA_VERSION__",
          replace: __SAFE_SCHEMA_VERSION__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__RPC_ENDPOINT__",
          replace: __RPC_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_GARDEN_API__",
          replace: __CIRCLES_GARDEN_API__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__EXTERNAL_URL__",
          replace: __EXTERNAL_URL__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__APP_ID__",
          replace: __APP_ID__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__FILES_APP_ID__",
          replace: __FILES_APP_ID__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SHOW_LANGUAGE_SWITCHER__",
          replace: __SHOW_LANGUAGE_SWITCHER__,
          flags: "g",
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /.(svelte|html|svx)$/,
        use: {
          loader: "svelte-loader-hot",
          options: {
            dev,
            hotReload: true,
            hotOptions: {
              // whether to preserve local state (i.e. any `let` variable) or
              // only public props (i.e. `export let ...`)
              noPreserveState: false,
              // optimistic will try to recover from runtime errors happening
              // during component init. This goes funky when your components are
              // not pure enough.
              optimistic: true,

              // See docs of svelte-loader-hot for all available options:
              //
              // https://github.com/rixo/svelte-loader-hot#usage
            },
            // https://github.com/sveltejs/svelte-loader/issues/139
            emitCss: false,
            hotReload: true,
            preprocess: sveltePreprocess({}),
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "bundle.[name].css",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ],
  optimization: {
    minimize: prod,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  devServer: {
    compress: false,
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: process.env.DEPLOY_ENVIRONMENT !== "docker" ? 5000 : 8080,
    host: "localhost",
    open: true,
    https: false,
  },
};
