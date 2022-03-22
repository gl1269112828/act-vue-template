const path = require('path');
// const defaultSettings = require('./src/settings.js')
function resolve(dir) {
  return path.join(__dirname, dir);
}

// const name = defaultSettings.title || ""// page title

module.exports = {
  css: {
    extract: false // 组件的样式是否另外打包成单独的css文件。默认为true
  },
  runtimeCompiler: true,
  publicPath: '/',
  outputDir: 'dist', //打包名
  // assetsDir: 'static',//静态资源目录
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    // host: '127.0.0.1',
    port: 8088, //端口号
    open: true, //配置自动启动浏览器
    overlay: {
      warnings: true,
      errors: true
    },
    disableHostCheck: true,
    proxy: {
      '/': {
        target: '/',//your server api
        changOrigin: true, //允许跨域
        ws: false,
        pathRewrite: {
          '^/': '' //请求的时候使用这个api就可以
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        config: resolve('vue.config')
      }
    }
  }
};
