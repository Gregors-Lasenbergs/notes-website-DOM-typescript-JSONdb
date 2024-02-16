const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: ["./src/scripts.ts", "./src/styles.css"],
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    client: {
      logging: "none",
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].css" },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "favicon.png",
      chunks: [],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets",
          to: "assets",
        },
      ],
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts.js",
  },
};
