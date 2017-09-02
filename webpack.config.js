'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// the path(s) that should be cleaned
let pathsToClean = [
  './themes/driftwood/static/js',
  './themes/driftwood/static/css',
];

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
	use: ExtractTextPlugin.extract({
	  fallback: 'style-loader',
	  //resolve-url-loader may be chained before sass-loader if necessary
	  use: ['css-loader', 'sass-loader']
	})
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
    new CleanWebpackPlugin(pathsToClean),
    new ExtractTextPlugin('../css/style.css'),
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

