const path = require("path");

const commonConfig = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
    /*
      {
        test: /\.ts$/,
        enforce: "pre",
        loader: "tslint-loader",
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
    */
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".json"]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  mode: "development"
}

module.exports = [
  Object.assign(
    {
      target: "electron-main",
      entry: {main: "./src/main.ts"}
    },
    commonConfig
  ),
  Object.assign(
    {
      target: "electron-renderer",
      entry: { gui: "./src/gui.tsx" }
    },
    commonConfig
  )
];
