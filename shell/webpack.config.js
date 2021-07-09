const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

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
} else if (process.env.DEPLOY_ENVIRONMENT === "thorsten") {
  __AUTH_ENDPOINT__ = "https://dev.auth.circles.name";
  __API_ENDPOINT__ = "https://thorsten.api.circles.land";
  __FILES_ENDPOINT__ = "https://dev.files.circles.land";
  __APP_ID__ = "thorsten.circles.land";
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

const sveltePath = path.resolve("node_modules", "svelte");

module.exports = {
  mode,
  devtool: prod ? false : "source-map",
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
            preprocess: sveltePreprocess({
              // https://github.com/kaisermann/svelte-preprocess/#user-content-options
              // sourceMap: true,
              postcss: {
                plugins: [
                  require("tailwindcss"),
                  require("autoprefixer"),
                  require("postcss-nesting"),
                ],
              },
            }),
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
    compress: true,
    contentBase: [path.join(__dirname, "public")],
    port: 5000,
    host:
      process.env.DEPLOY_ENVIRONMENT === "thorsten"
        ? "192.168.178.35"
        : "localhost",
    open: true,
    https: process.env.DEPLOY_ENVIRONMENT === "thorsten" ? true : false,
  },
};
