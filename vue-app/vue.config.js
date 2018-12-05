const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
    assetsDir: "static",
    configureWebpack: config => {
        return {
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
            plugins: [
                new WebpackPwaManifest({
                    name: 'AltSzama',
                    short_name: 'AltSzama',
                    description: 'AltSzama app',
                    icons: [
                        {
                            src: path.resolve('public/img/icons/android-chrome-192x192.png'),
                            sizes: [192],
                            type: "image/png"
                        },
                        {
                            src: path.resolve('public/img/icons/android-chrome-512x512.png'),
                            sizes: [512],
                            type: "image/png"
                        }
                    ],
                    start_url: "/index.html",
                    display: "standalone",
                    background_color: "#000000",
                    theme_color: "#4DBA87",
                    orientation: "portrait",
                    gcm_sender_id: process.env.gcmSenderId
                }),
                new CopyWebpackPlugin([
                    {
                        // copy custom service worker
                        from: './src/custom-service-worker.js',
                        to: './[name].js'
                    }
                ])
            ],
        }
    },

};