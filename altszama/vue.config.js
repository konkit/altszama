module.exports = {
  assetsDir: "static",
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:8088",
        ws: true,
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  },
  transpileDependencies: ["vuetify"]
};
