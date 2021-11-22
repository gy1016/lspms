'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = '湖北省国土空间规划监测评估预警系统'
const port = process.env.port || process.env.npm_config_port || 9527

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/lspms/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    name: name
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'))
      .set('network', resolve('./src/network'))
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 80
            // 1. 直接写 px，编译后会直接转化成 rem；
            // 2. 在 px 后面添加 /*no*/，不会转化 px，会原样输出；
            // 3. 在 px 后面添加 /*px*/，会根据 dpr 的不同，生成三套代码。
          })
        ]
      }
    }
  }
}
