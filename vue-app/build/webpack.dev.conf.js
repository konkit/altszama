'use strict'

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')


// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'googleClientId', 'gcmSenderId', 'BACKEND_URL', 'sentryURL']),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
        './service-worker-dev.js'), 'utf-8')}</script>`
    }),
    new FriendlyErrorsPlugin(),
    new WebpackPwaManifest({
      name: 'AltSzama',
      short_name: 'AltSzama',
      description: 'AltSzama app',
      icons: [
        {
          src: path.resolve('static/img/icons/android-chrome-192x192.png'),
          sizes: [192],
          type: "image/png"
        },
        {
          src: path.resolve('static/img/icons/android-chrome-512x512.png'),
          sizes: [512],
          type: "image/png"
        }
      ],
      start_url: "/index.html",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#4DBA87",
      orientation: "portrait",
      gcm_sender_id: config.dev.env.gcmSenderId
    })
  ]
})
