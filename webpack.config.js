const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// webpack needs to be explicitly required
const webpack = require("webpack");
// import webpack from 'webpack' // (if you're using ESM)

module.exports = {
  entry: ["babel-polyfill", "./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
