module.exports = {
  publicPath: '/',
  devServer: {
    port: 3000
  },
  configureWebpack: {
    devtool: 'source-maps'
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
