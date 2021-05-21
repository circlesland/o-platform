const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

let circlesGardenApiBaseUrl = "https://api.circles.garden/api/users/";
let auth_endpoint = "https://auth.circles.name";
let api_endpoint = "https://api.circles.land";
let files_endpoint = "https://files.circles.land";
let appId = "circles.land";
let filesAppId = "files.circles.land";

if (process.env.DEPLOY_ENVIRONMENT === "main") {
  auth_endpoint = "https://auth.circles.name";
  api_endpoint = "https://api.circles.land";
  files_endpoint = "https://files.circles.land";
  appId = "circles.land";
  filesAppId = "files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "dev") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "https://dev.api.circles.land";
  files_endpoint = "https://dev.files.circles.land";
  appId = "dev.circles.land";
  filesAppId = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "thorsten") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "https://thorsten.api.circles.land";
  files_endpoint = "https://dev.files.circles.land";
  appId = "thorsten.circles.land";
  filesAppId = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "local") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "https://local.api.circles.land";
  files_endpoint = "https://dev.files.circles.land";
  appId = "local.circles.land";
  filesAppId = "dev.files.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "ultralocal") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "http://localhost:8989";
  files_endpoint = "https://dev.files.circles.land";
  appId = "ultralocal.circles.land";
  filesAppId = "dev.files.circles.land";
}

console.log(`Auth Endpoint Url: ${auth_endpoint}`);
console.log(`Api Endpoint Url: ${api_endpoint}`);
console.log(`Files Endpoint Url: ${files_endpoint}`);
console.log(`AppId: ${appId}`);
console.log(`Files AppId: ${filesAppId}`);
console.log(`circlesGardenApiBaseUrl: ${circlesGardenApiBaseUrl}`);

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
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__AUTH_ENDPOINT__",
          replace: auth_endpoint,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__API_ENDPOINT__",
          replace: api_endpoint,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_GARDEN_API__",
          replace: circlesGardenApiBaseUrl,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__FILES_ENDPOINT__",
          replace: files_endpoint,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__APP_ID__",
          replace: appId,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__FILES_APP_ID__",
          replace: filesAppId,
          flags: "g",
        },
      },
      {
        test: /\.tsx?$/,
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
