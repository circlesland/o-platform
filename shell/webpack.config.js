const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

let auth_endpoint = "https://auth.circles.name";
let api_endpoint = "https://api.circles.land";
let auth_app_id = "circles.land";
let files_app_id = "files.circles.land";
if (process.env.DEPLOY_ENVIRONMENT === "main") {
  auth_endpoint = "https://auth.circles.name";
  api_endpoint = "https://api.circles.land";
  auth_app_id = "circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "dev") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "https://dev.api.circles.land";
  auth_app_id = "dev.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "local") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "https://local.api.circles.land";
  auth_app_id = "local.circles.land";
} else if (process.env.DEPLOY_ENVIRONMENT === "ultralocal") {
  auth_endpoint = "https://dev.auth.circles.name";
  api_endpoint = "http://localhost:8989";
  auth_app_id = "ultralocal.circles.land";
}

console.log(`Auth Endpoint Url: ${auth_endpoint}`);
console.log(`Api Endpoint Url: ${api_endpoint}`);
console.log(`Auth AppId: ${auth_app_id}`);
console.log(`Files AppId: ${files_app_id}`);

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
        loader: 'string-replace-loader',
        options: {
          search: '__AUTH_ENDPOINT__',
          replace: auth_endpoint,
          flags: 'g'
        }
      },
      {
        test: /\.ts|\.svelte$/,
        loader: 'string-replace-loader',
        options: {
          search: '__API_ENDPOINT__',
          replace: api_endpoint,
          flags: 'g'
        }
      },
      {
        test: /\.ts|\.svelte$/,
        loader: 'string-replace-loader',
        options: {
          search: '__APP_ID__',
          replace: auth_app_id,
          flags: 'g'
        }
      },
      {
        test: /\.ts|\.svelte$/,
        loader: 'string-replace-loader',
        options: {
          search: '__FILES_APP_ID__',
          replace: files_app_id,
          flags: 'g'
        }
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "bundle.[name].css",
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
    open: true,
    https: false,
  },
};
