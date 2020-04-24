# 常用Plugins

>### CommonsChunkPlugin

有些类库如utils, bootstrap之类的可能被==多个页面==共享，最好是可以合并成一个js，而非每个js单独去引用。这样能够节省一些空间。

这种场景就需要用到CommonsChunkPlugin，我们指定好生成文件的名字，以及想抽取哪些入口js文件的公共代码，webpack就会自动帮我们合并好。

```js
new webpack.optimize.CommonsChunkPlugin({
    name: "common",
  	filename: "js/common.js",
  	chunks: ['index', 'detail]  // 可以指定需要哪些库
 })
```



> ### ~~ExtractTextPlugin~~

它会将所有的入口 chunk(entry chunks)中引用的 `*.css`，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 `styles.css`）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

已过期，替换成mini-css-extract-plugin。作用相同



> ### MiniCssExtractPlugin

==一般生产环境使用==

```js
module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```





> ### optimize-css-assets-webpack-plugin

在miniCssExtract的基础上有做了一层压缩去重的功能，配合cssnano（css优化处理）一起。

==一般生产环境使用==

#### 安装依赖

```
npm install --save-dev optimize-css-assets-webpack-plugin cssnano
```

#### 引入插件

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
```

#### 配置loader

```
module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-import')(),
                                require('autoprefixer')({
                                    browsers: ['last 30 versions', "> 2%", "Firefox >= 10", "ie 6-11"]
                                })
                            ]
                        }
                    }
                ]
            }
     ]
}
```

#### 将多个css文件合并成单一css文件

> 主要是针对多入口，会产生多分样式文件，合并成一个样式文件，减少加载次数 配置如下

1、配置splitChunks

```
optimization:{
	splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                styles: {
                    name: 'style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
}
```

2、配置插件

> 1. `filename` 与`output`中的`filename` 命名方式一样
> 2. 这里是将多个`css`合并成单一`css`文件, 所以`chunkFilename` 不用处理
> 3. 最后产生的样式文件名大概张这样 `style.550f4.css` ； ***style*** 是 `splitChunks`-> `cacheGroups`-> `name`

```
new MiniCssExtractPlugin({
	filename: 'assets/css/[name].[hash:5].css',
	// chunkFilename: "assets/css/[name].[hash:5].css",
}),
```

#### 优化样式文件，去重、压缩等处理

> 1. 主要使用 `optimize-css-assets-webpack-plugin` 插件和 `cssnano` 优化器
> 2. `cssnano` 优化器具体做了哪些优化 可参考 [官网](https://cssnano.co/)
> 3. `cssnano` 优化器也可以在`loader`中配置，除了 `不能去重` 之外，其他效果等同，所以小编这里就只在`plugin`中配置了，免得在配置一遍

有两种配置方式，效果等同

第一种方式

```
optimization:{
	 minimizer: [
		new OptimizeCSSAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			// cssProcessorOptions: cssnanoOptions,
			cssProcessorPluginOptions: {
			preset: ['default', {
				discardComments: {
					removeAll: true,
				},
				normalizeUnicode: false
			}]
		},
		canPrint: true
	})
	]
}
```

> 配置说明：
>
> 1. `cssProcessor` 处理器：默认就是`cssnano`
> 2. `cssProcessorOptions`和`cssProcessorPluginOptions` 都是指定 `cssProcessor` 所需的参数，经本人实验`cssProcessorOptions` 没起作用，所以只需要指定 `cssProcessorPluginOptions` 即可
> 3. `canPrint`: 是否打印处理过程中的日志
>
> `cssnano` 配置说明
>
> 1. `discardComments`: 对注释的处理
> 2. `normalizeUnicode`: 建议设置为`false`,否则在使用 `unicode-range` 的时候会产生乱码 详情参考 [normalizeUnicode](https://cssnano.co/optimisations/normalizeunicode)

第二种方式

就是直接在`webpack`的`plugins`中配置即可

```
plugins:[
        new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
		// cssProcessorOptions: cssnanoOptions,
		cssProcessorPluginOptions: {
			preset: ['default', {
				discardComments: {
					removeAll: true,
				},
				normalizeUnicode: false
			}]
		},
		canPrint: true
	})
]
```







> CopyWebpackPlugin

它可以将代码里面的资源原封不动copy到dist指定的目录里。 

一般用来copy一些static的静态资源，比如我们项目里面的`tradingview`插件。



> HtmlWebpackPlugin + AddAssetHtmlPlugin + [InterpolateHtmlPlugin](https://github.com/zanettin/react-dev-utils)

这几个插件配合使用：

HtmlWebpackPlugin自动生成html文件

AddAssetHtmlPlugin可以向html里面增加js引用

interpolateHtmlPlugin可以在index.html里面使用变量。 

```
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
```

实际例子

```json
{
    "webpack": "^3.6.0",
    "add-asset-html-webpack-plugin": "2.1.3",
    "html-webpack-plugin": "^2.30.1",
    "interpolate-html-plugin": "2.0.0"
}
```

在webpack是3版本的时候，依赖如上。

在配置文件里配置：

```js
const PUBLIC_URL = process.env.PUBLIC_URL  
module.exports = {
  plugins: [
  	new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../static/image-config.js'),
      includeSourcemap: false,
      publicPath: config.dev.assetsPublicPath
    }),
    new InterpolateHtmlPlugin({
      publicUrl: PUBLIC_URL,
    })
  }]
}
```

在页面里使用：htmlplugin自带支持lodash的plugin

```html
window.__login= {
	user: JSON.parse(sessionStorage.getItem('user'))
}
window.__config = {
  publicUrl: '%publicUrl%', // 变量
  thirdType: 'firstbi',
  title: 'firstbi',
  loginMode: '3', // 1: "Company", 2: "Cust", 3: "External
}
```



> ### DefinePlugin

DefinePlugin可以配置一个全局的变量。在webpack打包的时候，帮助开发者进行一个字符串的替换。这样在业务代码里面，就可以忽略开发环境和生产环境的打包规则限制，避免出错。比如：在开发构建中，而不在发布构建中执行日志记录。

**基本用法**

```javascript
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify('5fa3b9'),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1',
  'typeof window': JSON.stringify('object'),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});
```

```js
if (!PRODUCTION) {
  console.log('Debug info');
}

if (PRODUCTION) {
  console.log('Production log');
}
```

`DLLPlugin` 和 `DLLReferencePlugin` 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。

它只是提升打包速度，如果要提取公共类，还是需要通过**CommonsChunkPlugin**或者`SplitChunkPlugin.`



> #### DllPlugin

ddlplugin会生成一个`manifest.json` 的文件，这个文件是用来给 [`DLLReferencePlugin`](#dllreferenceplugin) 映射到相关的依赖上去的。

```js
const webpack = require("webpack");
const path = require("path");

const vendors = [
  "react",
  "react-dom",
  "moment"
  // ...其它库
];
webpack({
  entry: {
    vendor: vendors,
  },
  output: {
    path: path.join(__dirname, "../dll"),
    filename: "[name].js"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dll", "[name]-manifest.json"),
      name: "[name]",
      context: __dirname
    })
  ]
});
```

上面的config文件时用来生成dll.js文件和json文件的。



> #### DllReferencePlugin

```diff
module.exports = {
	plugins: [
+   new AddAssetHtmlPlugin({
+      filepath: path.resolve(__dirname, '../dll/vendors.dll.js'),
+    }),
+ 	new webpack.DllReferencePlugin({
+      manifest: path.resolve(__dirname, '../dll/vendors-manifest.json'),
+    }),
	]
}
```

dllReferencePlugin会根据上面生成的mainfest.json文件，知道已经有哪些依赖项在里面，这样webpack就不会将这些依赖打包到bundle里，从而减少包的体积。

==AddAssetHtmlPlugin==将dll文件加到html里去

低版本webpack用2.1.3的

```
yarn add add-asset-html-webpack-plugin@^2.1.3 --dev
```




> ###ManifestPlugin



