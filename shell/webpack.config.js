const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";
const DEBUG = !process.argv.includes("--release");
const VERBOSE = process.argv.includes("--verbose");

let __CIRCLES_GARDEN_API__ = "https://api.circles.garden/api/users/";
let __AUTH_ENDPOINT__ = "https://auth.circles.name";
let __API_ENDPOINT__ = "https://api.circles.land";
let __FILES_ENDPOINT__ = "https://files.circles.land";
let __CIRCLES_SUBGRAPH_ENDPOINT__ =
  "https://api.thegraph.com/subgraphs/name/circlesubi/circles";
let __PATHFINDER_ENDPOINT__ = "https://rpc.circles.land/pathfinder";
let __APP_ID__ = "circles.land";
let __FILES_APP_ID__ = "files.circles.land";
let __SAFE_SCHEMA_VERSION__ = "2";
let __CIRCLES_HUB_ADDRESS__ = "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543";
let __CIRCLES_HUB_BLOCK__ = "12529458";
let __SAFE_PROXY_FACTORY_ADDRESS__ = "0x8b4404DE0CaECE4b966a9959f134f0eFDa636156";
let __SAFE_ADDRESS__ = "0x3E5c63644E683549055b9Be8653de26E0B4CD36E";
let __RPC_ENDPOINT__ = "https://rpc.circles.land";
let __OPENLOGIN_CLIENT_ID__ = "BHG9boVJt-AxjEnMF3hEdR-CGVO7ust-Vgbu2UTvvamcg-Ora8EpJ-iYXWeskqFlUs7Q3j1sS3Ns4qxEH4311ck";
let __ALLOW_VERIFY__ = !process.env.ALLOW_VERIFY ? "false" : "true";
let __ALLOW_CREATE_ORGANISATION__ = !process.env.ALLOW_CREATE_ORGANISATION ? "false" : "true";
let __USE_MOCKS__ = !process.env.USE_MOCKS ? "false" : "true";

if (process.env.DEPLOY_ENVIRONMENT === "main") {
  __AUTH_ENDPOINT__ = "https://auth.circles.name";
  __API_ENDPOINT__ = "https://api.circles.land";
  __FILES_ENDPOINT__ = "https://files.circles.land";
  __APP_ID__ = "circles.land";
  __FILES_APP_ID__ = "files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "dev") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "https://dev.api.circles.land";
  __FILES_ENDPOINT__ = "https://dev.files.circles.land";
  __APP_ID__ = "dev.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "local") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "https://local.api.circles.land";
  __FILES_ENDPOINT__ = "https://dev.files.circles.land";
  __APP_ID__ = "local.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "ultralocal") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "http://localhost:8989";
  __FILES_ENDPOINT__ = "https://dev.files.circles.land";
  __APP_ID__ = "ultralocal.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "docker") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "http://localhost:8989";
  __FILES_ENDPOINT__ = "https://dev.files.circles.land";
  __APP_ID__ = "ultralocal.circles.land";
  __FILES_APP_ID__ = "dev.files.circles.land";
  __CIRCLES_HUB_ADDRESS__ = process.env.CIRCLES_HUB_ADDRESS;
  __CIRCLES_HUB_BLOCK__ = process.env.CIRCLES_HUB_BLOCK;
  __SAFE_PROXY_FACTORY_ADDRESS__ = process.env.SAFE_PROXY_FACTORY_ADDRESS;
  __SAFE_ADDRESS__ = process.env.SAFE_ADDRESS;
  __RPC_ENDPOINT__ = process.env.RPC_ENDPOINT;
}

console.log(`__AUTH_ENDPOINT__: ${__AUTH_ENDPOINT__}`);
console.log(`__API_ENDPOINT__: ${__API_ENDPOINT__}`);
console.log(`__FILES_ENDPOINT__: ${__FILES_ENDPOINT__}`);
console.log(`__APP_ID__: ${__APP_ID__}`);
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
          search: "__FILES_ENDPOINT__",
          replace: __FILES_ENDPOINT__,
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
            emitCss: true,
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
    watchContentBase: true,
    compress: false,
    contentBase: [path.join(__dirname, "public")],
    port: process.env.DEPLOY_ENVIRONMENT !== "docker" ? 5000 : 8080,
    host: "localhost",
    open: true,
    https: false,
  },
};
