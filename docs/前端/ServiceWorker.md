# ServiceWorker

[理解 Service Workers](https://juejin.im/post/5b06a7b3f265da0dd8567513#heading-6)

[理解 Service Workers](https://cloud.tencent.com/developer/article/1407661)

## 介绍

serviceWorker可以理解为 服务器 与 web应用之间的一个代理服务。

可以用来拦截并处理客户端请求，向客户端发送消息；也可以向服务器发送请求；还可以==缓存一些静态资源==。标黄的是它最重要的功能。



## 注册安装

一般的使用就不介绍了，这里记录一下结合webpack的使用。

首先去install一下一个plugin：serviceworker-webpack-plugin。 注意版本：最新版需要webpack4.0以上，否则安装一下v0.2.3的版本；

下面是我的webpack配置。

```js
var path = require('path')
var webpack = require('webpack')
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'build.js'
  },
  module: {
    rules: [
      // 省略...
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  // dev模式的devServer也适用
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
  },
  plugins: [
    // 指明你的sw文件
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'static'),
      to: 'static',
      ignore: ['.*'],
    }])
  ],
  devtool: '#cheap-eval-source-map'
}
```



sw.js

```js
import runtime from 'serviceworker-webpack-plugin/lib/runtime'

if (navigator.serviceWorker) {
  runtime.register().then(registration => {
    console.log('congrats. scope is: ', registration.scope)
    // 因为active不一定每次都有值
    return new Promise((resolve, reject) => {
      const internal = setInterval(() => {
        if (registration.active) {
          clearInterval(internal);
          resolve(registration.active);
        }
      }, 500)
    });
  }).then(sw => {
    sw.postMessage('343232432')
  }).catch(error => {
    console.log('sorry', error)
  })
}
```

