const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: [
      'webpack/hot/only-dev-server',
      './index'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: false,
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({

    })
  ],
  devServer: {
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'assets')],
    compress: true,
    port: 1567
  }
});
