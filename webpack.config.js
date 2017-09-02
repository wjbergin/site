'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const babelOptions = {
  "presets": "env"
};

function isVendor(module) {
  return module.context && module.context.indexOf('node_modules') !== -1;
}

const entries = {
  index: './themes/driftwood/src/js/index.js'
};

module.exports = {
  stats: 'minimal',
  devtool: 'source-map',
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'themes', 'driftwood', 'static', 'js')
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        }
      ]
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
        }
      ]
    }]
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    overlay: true,
    port: 9000,
    compress: true,
    hot: true,
    clientLogLevel: 'info',
    stats: 'errors-only',
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
/*
    new CopyWebpackPlugin([
      {from: './src/*.html', to: path.resolve(__dirname, 'build'), flatten: true},
    ]),
*/
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function (module, count) {
        // creates a common vendor js file for libraries in node_modules
        return isVendor(module);
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      chunks: Object.keys(entries),
      minChunks: function (module, count) {
        // creates a common vendor js file for libraries in node_modules
        return !isVendor(module) && count > 1;
      }
    })
  ]
};

