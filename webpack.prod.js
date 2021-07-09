const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(common, {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: {
    app: [
      './index'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: false,
      filename: 'index.html',
      inject: 'body'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
});
