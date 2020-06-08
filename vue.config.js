module.exports = {
  publicPath: '/',
  devServer: {
    port: 3000
  },
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: 'source-maps'
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
