# Webpack

## 基本指南

> 什么是webpack？

webpack是一个模块打包工具

webpack的配置文件：webpack.config.js



### loader

> #### loader的作用
>
> https://webpack.docschina.org/loaders/

webpack无法处理.js后缀之外的文件，所以需要loader来进行处理文件。



#### 样式处理loader

- [`style-loader`](https://webpack.docschina.org/loaders/style-loader) 将css模块导出，最终通过<style> 标签的形式添加到 DOM 中。
- [`css-loader`](https://webpack.docschina.org/loaders/css-loader)  会去解析 @import和url() 引入的CSS 文件，将他们当做import 和 require一样去加载进来进行处理。
- [`less-loader`](https://webpack.docschina.org/loaders/less-loader) 加载和转译 LESS 文件
- [`sass-loader`](https://webpack.docschina.org/loaders/sass-loader) 加载和转译 SASS/SCSS 文件
- [`postcss-loader`](https://webpack.docschina.org/loaders/postcss-loader) 使用 [PostCSS](http://postcss.org/) 加载和转译 CSS/SSS 文件
- [`stylus-loader`](https://github.com/shama/stylus-loader) 加载和转译 Stylus 文件



> ##### 基础配置

首先，假如项目里用到了最简单的css，需要配置成如下：

```js
{
  test: /\.(css)$/i,
  use: [
  	'style-loader',
    {
      loader: 'css-loader',
      options: {
      	modules: true,
    	}
  }]
}
```



> ##### 小疑问：为什么需要这么多loader连起来用？

webpack一般建议`style-loader`和`css-loader`结合使用。我的理解是：`css-loader`可以对`.css后缀`的文件进行解析处理，然后交给`style-loader`编译成对应的style样式文件。

之前看到过一种配置方案：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.link\.css$/i,
        use: [
          { loader: 'style-loader', options: { injectType: 'linkTag' } },
          { loader: 'file-loader' },
        ],
      },
    ],
  },
};
```

这种配置方案，css文件被当做file来进行处理，他不会被解析，而是直接通过style-loader生成了style标签，动态插入到了dom里；



> ##### css-loader#importLoaders

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

importLoaders这个属性其实挺关键，这里备注一下：他的作用主要是针对样式文件里@import的样式的处理；

当我们在css里面@import了其他样式后，默认是不会被其他loader处理的。指定了这个配置后，就会去走其他loader。



> ##### 样式模块化

模块化的概念其实就是：各个页面组件里的样式作用域只会在当前模块里起作用，而不会影响到全局样式。这样写样式时就可以放心定义类名。

模块化配置首先要在webpack.config.js里配置好`modules: true`

```js
{
  test: /\.(css)$/i,
  use: [
  	'style-loader',
    {
      loader: 'css-loader',
      options: {
      modules: true,
    }
  ]
}
```

其次，引入样式时，需要将样式import为一个对象，然后去使用这个的属性。

```js
// import './index.css';
import style from './index.css';

const img1 = appendImg(imgPath1);
img1.classList.add(style.avatar);
```

可以理解为，如果是模块化，webpack会将样式处理为一个js对象，然后在页面是使用样式就是使用对象的某一个属性。



> ##### 预处理框架

**什么是CSS预处理技术？**

CSS预处理技术，是指用一种新语言用来为CSS 增加可编程的的特性，无需考虑浏览器的兼容性问题。你可以在 CSS 中使用变量、简单的程序逻辑、函数等等在编程语言中的一些基本技巧，可以让你的 CSS 更见简洁，适应性更强。

**Stylus & Less & Sass**

[Sass、LESS 和 Stylus区别总结](https://juejin.im/post/5c9b17cbf265da60c95b7c3a#heading-4)

Stylus：提供一个高效、动态、和使用表达方式来生成CSS，以供浏览器使用。默认使用 .styl 的作为文件扩展名，支持多样性的CSS语法。

Less：一种动态样式语言，默认使用.less，

Sass：一种动态样式语言，默认使用.sass作为扩展名，也支持.scss类型。

sass基于严格的语法，是严格要求缩进，而且是不能有`{}`、`;`等符号的。

scss就和css的写法类似，没有那么严格的要求。



**CSS 后处理 PostCss** 

PostCSS 是目前流行的一个对 CSS 进行处理的工具（平台）。

它负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。插件基于 CSS 代码的 AST 所能进行的操作是多种多样的，比如可以支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的 CSS 规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式。

从这个角度来说，PostCSS 的强大之处在于其不断发展的插件体系。目前 PostCSS 已经有 200 多个功能各异的插件。开发人员也可以根据项目的需要，开发出自己的 PostCSS 插件。



> postcss-loader

postcss-loader专门用来进行postcss配置的处理；

它可以通过postcss.config.js或者postcss-loader的options来配置PostCss。附上[文档地址](https://github.com/postcss/postcss-loader)



> ##### create-react-app里用到的样式

```js
{
      test: /\.scss$/,
      use: [
        {// 开发环境使用'style-loader',
          // 生产环境使用MiniCssExtractPlugin.loader
          loader: MiniCssExtractPlugin.loader,
          options: {},
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            modules: true
          }
        },
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              postcssNormalize(),
            ],
            sourceMap: false
          },
        },
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: true,
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
      sideEffects: true,
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
}
```





#### 文件处理loader

> #### file-loader vs url-loader

url-loader可以把图片打包到js文件里去，以base64的格式来存放。

file-loader是把图片独立打包出来，形成静态资源。当然file-loader还可以处理字体otf、svg等后缀的静态资源。

```js
module: {
        rules: [{
            test: /\.(png|jpe?g)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    // 10kb;
                    limit: 10240,
                    name: '[name].[ext]?[contenthash]',
                }
            }]
        }, /*{
            test: /\.(png|jpe?g)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[contenthash]',
                    publicPath: '/some/path/',
                    outputPath: '/some/path/',
                    postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
                }
            }]
        }*/]
    }
```

url-loader有一个==limit==的options可以配置。当图片超过了limit的大小，就不会将图片转化为base64, 默认会使用file-loader进行处理。但是这里有一个容易进入的误区：我之前以为需要配置再配置一个file-loader，让url-loader去执行file-loader的配置。实际上不需要再单独配置一个file-loader，url-loader自带了file-loader各个配置。



####如何编写一个loader？

编写loader其实很简单，只需要要返回一个function，接收source参数即可。

webpack会去在执行这个function时，会将代码通过source参数传递进来，同事将this变量内置很多参数和方法，开发者只需要通过this对象来对source进行处理。

```js
module.exports = function(source) {
	// todo 处理source
}
```

编写好loader后怎么使用？

在webpack里面指明需要使用的loader路径。

```diff
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
-     }
+     },
+     {
+        test: /\.js$/,
+        exclude: /node_modules/,
+        use: path.resolve(__dirname, 'src/loader/my-loader.js'),
+     }
    ],
  },
```



### plugins

#### plugins的作用

plugins可以帮助webpack，在打包的不同生命周期中，做不同的处理；

比如在打包之前，做清空处理，使用`CleanWebpackPlugin`。

#### 常用插件

>CommonsChunkPlugin

有些类库如utils, bootstrap之类的可能被==多个页面==共享，最好是可以合并成一个js，而非每个js单独去引用。这样能够节省一些空间。

这种场景就需要用到CommonsChunkPlugin，我们指定好生成文件的名字，以及想抽取哪些入口js文件的公共代码，webpack就会自动帮我们合并好。

```js
new webpack.optimize.CommonsChunkPlugin({
    name: "common",
  	filename: "js/common.js",
  	chunks: ['index', 'detail]  // 可以指定需要哪些库
 })
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



> DefinePlugin

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



#### 怎么写plugins？

> https://www.webpackjs.com/contribute/writing-a-plugin/



> plugin基本架构

1. 编写一个函数，在函数原型上提供`apply方法`。
2. `apply方法`接收一个`compiler`对象，通过compiler的钩子函数来实现各种功能。
3. 通过`compiler`的钩子函数来实现各种功能。

```js
function MyWebpackPlugin() {
}
MyWebpackPlugin.prototype.apply = function(compiler) {
  compiler.hooks.done.tap('done', function(stats) {
    console.log('Hello World!');
    console.log('stats');
  });
}
module.exports = MyWebpackPlugin;
```

3. 在webpack.config.js中使用该插件：

```js
const MyWebpackPlugin = require('./MyWebpackPlugin.js');

module.export = {
  ...
	plugins:[
		new MyWebpackPlugin(options),
		...
	]
}
```



##### compiler 和 cmpiler 钩子

- `compiler` 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当webpack调用插件时，会把这个compiler 对象传给plugin的apply方法。

compiler里面有很多钩子函数，表示有很多时刻。比如`emit`会在生成资源到 output 目录之前触发，而且是一个异步的钩子；

> 钩子的调用方式：

```js
compiler.hooks.someHook.tap(...)
```

不同的钩子类型调用的方式也不一样，也可以在某些钩子上访问 `tapAsync` 和 `tapPromise`。

> 3种tap的理解

```js

  compiler.hooks.emit.tap('emit', compilation => {
    console.log("资源要被打包了.");
  })

  compiler.hooks.run.tapAsync('run', (compilation, callback) => {
    console.log('以异步方式触及 run 钩子。');
    callback(); // 需要callback
  });

  compiler.hooks.run.tapPromise('MyWebpackPlugin', (compilation) => {
    return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
      console.log('以具有延迟的异步方式触及 run 钩子。');
    });
  });

  compiler.hooks.run.tapPromise('MyWebpackPlugin', async (compilation) => {
    await new Promise(resolve => setTimeout(resolve,1000));
    console.log('以具有延迟的异步方式触及 run 钩子。');
  });
```



##### compilation 和 compilation hooks

- `compilation` 对象代表了一次资源版本构建。
- webpack基于模块的，模块经历loaded，sealed，optimized， chunked，hashed，restored。每次文件变化时，webpack重新创建一个compilation对象。
- 一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。





##### plugins调试

> chrome来调试

从 Node v6.3.0+ 开始，开发人员可以使用内置的 `--inspect` 标记，来通过 DevTools 调试 Node.js 应用程序。

先打开chrome的expirement模式  chrome://flags/#enable-devtools-experiments.

2.开启模式后，在setting里开启nodejs的调试，似乎高级版本的chrome不需要上面这2步。

3.最后在package.json里面配置命令如下：

```json
"debug": "node --inspect --inspect-brk ./node_modules/webpack/bin/webpack.js"
```







### devtool

> 参考博客 https://juejin.im/post/58293502a0bb9f005767ba2f



![image-20191230202323229](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-08-230716.png)



> #### 最佳实践

开发环境：cheap-module-eval-source-map

线上环境：cheap-module-source-map 



> #### 几个mode配置的比较

**source-map**

```js
// import style from './index.css';

const img1 = Object(_appendImg__WEBPACK_IMPORTED_MODULE_2__["default"])(_images_avatar_jpeg__WEBPACK_IMPORTED_MODULE_0__["default"]);
// img1.classList.add(style.avatar);
const img2 = Object(_appendImg__WEBPACK_IMPORTED_MODULE_2__["default"])(_images_test_png__WEBPACK_IMPORTED_MODULE_1__["default"]);

consele.log(img2);


/***/ })

/******/ });
//# sourceMappingURL=main.js.map
```

打包代码的同时生成一个sourcemap文件，并在打包文件的末尾添加`//# souceURL`，注释会告诉JS引擎原始文件位置。

```
{
  "version": 3,
  "sources": [
    "webpack:///webpack/bootstrap",
    "webpack:///./src/index.css",
    "webpack:///./node_modules/style-loader/dist/runtime/injectStylesIntoLinkTag.js",
    "webpack:///./src/appendImg.js",
    "webpack:///./src/images/avatar.jpeg",
    "webpack:///./src/images/test.png",
    "webpack:///./src/index.css?b1aa",
    "webpack:///./src/index.js"
  ],
  "names": [],
  "mappings": ";xxxx",
  "file": "main.js",
  "sourcesContent": [xxxxxxx],
  "sourceRoot": ""
}
```



**hidden-source-map**

```js
// import style from './index.css';
const img1 = Object(_appendImg__WEBPACK_IMPORTED_MODULE_2__["default"])(_images_avatar_jpeg__WEBPACK_IMPORTED_MODULE_0__["default"]);
// img1.classList.add(style.avatar);
const img2 = Object(_appendImg__WEBPACK_IMPORTED_MODULE_2__["default"])(_images_test_png__WEBPACK_IMPORTED_MODULE_1__["default"]);
consele.log(img2);
/***/ })
/******/ });
```

去除了末尾的`//# souceURL`



**inline-source-map**

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-12-30-233220.png" alt="image-20191231073219616" style="zoom:40%;" />



**eval**

```
webpackJsonp([1],[
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceURL=webpack:///./src/js/index.js?'
    )
  },
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceURL=webpack:///./src/static/css/app.less?./~/.npminstall/css-loader/0.23.1/css-loader!./~/.npminstall/postcss-loader/1.1.1/postcss-loader!./~/.npminstall/less-loader/2.2.3/less-loader'
    )
  },
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceURL=webpack:///./src/tmpl/appTemplate.tpl?"
    )
  },
...])
```



**eval-source-map**

```
webpackJsonp([1],[
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,...
    )
  },
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,...
    )
  },  
  function(module,exports,__webpack_require__){
    eval(
      ...
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,...
    )
  },
  ...
]);
```

eval-source-map和eval的区别在于，source-map将注释里面的内容换成了dataurl.



**cheap-source-map**

**cheap-module-source-map**

网上说module会带上loader的源码，但是我比较过两个的结果，并没有什么不同。可能是我代码本身没什么需要loader转化的。 后期再比较这个。



**总结**

source-map：打包错误提示信息最全；

inline-source-map：是将源码合并到打包文件中去，以DataUrl的形式写到打包文件里；

cheap-source-map 的意思是生成一个没有列信息的sourceMap文件，只会告诉哪一行出错，而不会告诉是哪一列出错。而且不包含loader的sourcemap

module：的意思是，会打包那些被loader加载的模块源码，不加module只会处理业务逻辑代码；

eval：打包后模块会通过eval的方式来执行，速度最快；



#### //todo SourceMap原理

### devServer配置
> #### contentBase

告诉服务器，从哪里去读取静态文件。它和`publicPath`的区别是,`publicPath`用于确定从哪里提供bundler。默认情况下，使用当前工作目录作为提供内容的目录。

可以修改为其他目录：
```js
// 推荐使用绝对路径
contentBase: path.join(__dirname, "public")
```

也可以从多个目录提供内容：
```js
contentBase: [path.join(__dirname, "public"), path.join(__dirname, "assets")]
```

禁用 contentBase：
```js
contentBase: false
```



#### devServer一些常用配置项

#### devServer.proxy代理配置

```
devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
```

`/api/users`会被代理到`http://localhost:3000/api/users`

> ##### 如果想要重写路径

```
devServer: {
  proxy: {
    '/api': {
    target: 'http://localhost:3000',
  	pathRewrite: {'^/api' : ''}
  	}
	}
}
```

`/api/users`会被代理到`http://localhost:3000/users`

> 如果不是所有都代理，可以传一个function

- 返回null或者undefined会继续通过代理
- 返回false会直接404
- 返回一个路径，会当做`express server`来直接返回.



> ##### 踩坑：405错误

![image-20191227140841502](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-08-230717.png)



proxy配置的优先级默认是从上往下的，只要上面的proxy匹配上了请求规则，就不会继续向下找了。即使下面的匹配更完全。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-12-27-230628.png" alt="image-20191228070627938" style="zoom:30%;" />

图1出现的问题就是因为我们把配置写成了123的顺序。导致/ajax/api的请求全部代理到了www。改成321的顺序即可。



#### 热重载live reload和热更新HMR

> 1.概念介绍

**热重载**是当代码更新时，webpack自动编译并且刷新页面，这样不用开发者自己手动刷新页面。但是也带来一个问题：页面的状态会丢失。

**热更新**可以动态更新代码，浏览器不会进行刷新页面，而是运行时对模块进行热替换，保证了应用状态不会丢失。

> 2.原理
>
> https://juejin.im/post/5e3a28e6e51d4526f76ea753?utm_source=gold_browser_extension
>
> https://zhuanlan.zhihu.com/p/30669007
>
> 最简版本的hmr
>
> https://github.com/Jocs/webpack-HMR-demo/blob/master/webpack.config.js

**更新流程**：

1. 应用程序要求HMR runtime检查更新

2. HMR runtime异步下载更新

3. HMR runtime应用更新

4. HMR 同步应用更新


**内部原理**:

webpack监听着文件的变化。当我们修改文件时，webpack-dev-server通过webpack-dev-middleware拿到了webpack各个生命周期的打包文件，并且生成socketjs的长连接来推送到webpack-dev-server/client(浏览器客户端)。客户端拿到这些更新文件，通过webpack/hot/dev-server来判断是进行何种模式的更新。

HMR runtime是整个HMR的中区，它接收到更新的消息后，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的chunk模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码，并且将这些模块进行更新。这就是图中 7、8、9 步骤。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-07-104221.jpg" alt="preview" style="zoom:50%;" />





> 开启HMR的配置

1. 通过webpack配置文件开启hmr设置

在devServer里配置hot:true，来让Webpack-dev-server支持hot模式。

```diff
devServer: {
	contentBase: './dist',
+	hot: true,
},
plugins: [
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
		template: './src/index.html'
	}),
	// 这个是关键
+	new webpack.HotModuleReplacementPlugin(),
]
```

需要注意的是，并不是配置了hmr前端就能看到效果了，还需要实现对应的[api接口](https://webpack.docschina.org/api/hot-module-replacement)。

好在有很多plugin和loader都帮助我们解决了这些问题；



2. 还有一种开启方式，这种方式不需要依赖webpack-dev-server, 而是通过自己写server设置。

```js
// 1.首先要在output里定义好webpack-hot-middleware/client
entry: [
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
  // 这是主入口
  './src/index.js',
],
// 2.并且保留HotModuleReplacementPlugin
plugins: [
	new webpack.HotModuleReplacementPlugin(),
]

// 3.新建一个server.js
// 通过nodejs的方式，实现一个devServer
const express = require('express');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const app = express();

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
}));
const options = {
	log: console.log,
	path: '/__webpack_hmr',
	heartbeat: 10 * 1000,
};
// 通过hotMiddleware
app.use(webpackHotMiddleware(compiler, options));

app.listen(3000, () => {
	console.log('Example app listening on port 3000!\n');
})
```

以上两种方式就可以开启一个基础的hmr了。



> 接受 updated module。

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
+
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```



#### HMR 加载样式 

借助于 `style-loader`，使用模块热替换来加载 CSS 实际上极其简单。此 loader 在幕后使用了 `module.hot.accept`，在 CSS 依赖模块更新之后，会将其 patch(修补) 到 `<style>` 标签中。






### babel配置

`@babel/preset-env`是用来将代码转化为es5的语法



> `@babel/polyfill`和`@babel/transform-runtime`的区别

Babel里用到了一些公共的帮助函数`_extend`.默认情况下，它会被加到每一个需要他的函数里。这会导致大量的重复代码；

如果直接引入`@babel/polyfill`,会导致一些内置的变量比如： `Promise`, `Set` and `Map`会污染到全局变量。 如果最终打包的应用是在浏览器里运行的，那么是可以接受的。但是如果打包出来的是lib库给别人使用的，那么会造成问题。

而`@babel/transform-runtime`里的transformer不同，首先它引用了`@babel/runtime`模块，避免打包生产重复代码，其次他和core-js无缝结合，所以不需要而外引入polyfill，也就不会造成全局变量污染；



**总结**

如果是写业务码，最终要在浏览器里运行的。那么在webpack里配置`preset-env`，同事在代码里引入@babel/polyfill就行了；

但是如果是写的lib库，最后打包成第三方类库的代码，要使用@babel/plugin-transform-runtime进行转化。corejs的选项一般选2；

| `corejs` option | Install command                             |
| --------------- | ------------------------------------------- |
| `false`         | `npm install --save @babel/runtime`         |
| `2`             | `npm install --save @babel/runtime-corejs2` |
| `3`             | `npm install --save @babel/runtime-corejs3` |





### treeshaking

> 配置作用

treeshaking的主要作用是将那些在代码里并没有使用到的方法不要打包进来；用官方的生动形象的例子来解释：

不用的代码就如同秋天棕色、死亡的叶子，需要摇树才能让树叶掉落下来；

> 配置步骤

- 首先，treeshaking只支持esmodule的import模式。

- 第一步，如果mode是development模式，在webpack里增加optimization的配置；

```js
mode: 'development',
devtool: 'cheap-module-eval-source-map',
optimization: {
	usedExports: true
}
```

- 第二步，在package.json里配置`sideEffects`。  `sideEffects`里配置的内容代表的意思是，不需要进行treeshaking处理；

  一般比如css文件、第三方依赖文件是不需要处理的

  

### externals

> 配置作用

防止打包的时候将import的组件打包到bundle里，而是在运行时(`runtime`)再去外部获取这些扩展依赖；

> 配置实例

```js
externals: {
  'jquery': 'jQuery',
},
```

上述配置意思是代码里面用到的jquery依赖不打包到bundle里；

比较一下配置前后的打包大小：

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-12-003641.png" alt="image-20200112083641020" style="zoom:30%; float: left" />

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-12-003903.png" alt="image-20200112083902471" style="zoom:30%;float:left"  />



> 配置语法

**string** 可以配置成一个字符串的形式

```js
externals: {
  './a': 'a',
   jquery: 'jQuery'
}
```

解读一下属性：

第一行：'./a'代表应该排除`import a from './a'`，然后需要提供一个全局的`a`变量；

第二行：表示应该排除`import $ from 'jquery'`中的 `jquery`模块。为了替换这个模块，`jquery`的值将被用来检索一个全局的`jQuery`变量。

换句话说，当设置为一个字符串时，它将被视为**全局的**，我们需要在全局变量中，找到这个字符串，才能使程序正确运行。

**Object** 也可以配置成对象的形式

> 外部依赖的形式

- **root**：可以通过一个全局变量访问 library（例如，通过 script 标签）

- **commonjs**：意思是可以通过commonjs的访问来访问我这个 library，但是必须是要用我的名字来使用。

  举个例子：

  ```json
  externals: {
  	lodash: {
  		commonjs: 'lodash'
  	}
  }
  ```

  这里可以用CommonJS 模块访问我的library，但是你必须是`const lodash = require('lodash')`这种写法。

- **commonjs2**：和上面的类似，但导出的是 `module.exports.default`

- **amd**：类似于 `commonjs`，但使用 AMD 模块系统

结合着[output](#output)属性来配置。



### output

> 配置作用

output用来告知 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容。



### Resolve



### 代码分割

> 概念介绍

代码分割: 将代码分离到不同的bundle里，然后按需进行加载，分割的产物就是chunk。

> 关键配置

*SplitChunksPlugin*

从webpack4开始，自带了`SplitChunkPlugin`插件将代码进行，替代了`CommonsChunkPlugin`

> **同步代码分割**：在js里做optimization里配置。

webpack自带了一个optimization的配置项，里面可以手动配置符合自己项目情况的优化项。 

同步分割就主要依赖于`webpack.optimization.splitChunks`这一配置项。

```js

	optimization: {
		splitChunks: {
			chunks: 'all', // 默认是async，意思是只分割异步代码
			// 代码分割的下限
			minSize: 300000000, // 300kb
			maxSize: 0,
			minChunks: 1, // 最小被依赖一次才进行分割
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~', // 自动名称连接符
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					name: 'vendors'
				},
				default: {
					minChunks: 2, 
					priority: -20,
					reuseExistingChunk: true,
				}
			}
		},
	}

```

在上面的配置项中，如果满足代码分割的要求，那么webpack会自动进入到cacheGroups这个配置项，找到对应的规则进行代码分割。

比如`default.minChunks:2`这个配置，如果被依赖的次数小于2，那么webpack是不会把代码打包的。



>  **异步代码**（dynamic-import）

代码会自动分割

只需要写代码时使用：

```js
// dynamic imports

import('./a');
import('./b');
```

打包出来的代码会分割为独立的模块；



### shimming 垫片

> 作用

因为webpack打包是基于模块的，模块与模块之间不会产生互相的影响。所以不同的包之间即使依赖相同的依赖包，也不能公用。

这就导致一个问题：一些老的依赖lib里面，没有用到es6的import语法，比如很早以前的`jquery-ui`这种库，它的使用是需要全局依赖`jquery`插件的。那这种就没法在webpack里使用。

所以webpack提供了一个插件: `webpack.ProvidePlugin`，可以进行自动引入模块。



> webpack.ProvidePlugin使用介绍

```diff
  const path = require('path');
+ const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
  };
```

上面配置的意思是：如果你遇到了至少一处用到 `_` 变量的模块实例，那请你将 `lodash` package 引入进来，并将其提供给需要用到它的模块。

有了这个配置，在代码里就不需要引入`lodash`这个模块就能使用`lodash`的方法了。

```js
// 页面代码，不需要import _ from 'lodash';
function component() {
	var element = document.createElement('div');
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');

	return element;
}

document.body.appendChild(component());
```



> 更细粒度的shimming

有时候，我们在代码里使用到了this变量，期望this指向的是window。但是webpack打包的代码里面，this默认指向了当前模块。为了能将this改成window，webpack提供`imports-loader`进行处理。

```diff
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							[
								"@babel/plugin-transform-runtime",
								{
									corejs: 2,
								}
							]
						]
					}
+				}, {
+				  loader: 'imports-loader?this=>window'
+				}]
			},
		]
	},
}

```



> 全局暴露变量

同样，假如我们写的代码里有用暴露一个全局变量，希望别人去使用这个变量。可以用`exports-loader`将全局变量导出。

```js
// global.js
var file = 'blah.txt';
var helpers = {
	test: function() { console.log('test something'); },
	parse: function() { console.log('parse something'); }
};
```



```js
// index.js
import { file, parse} from './global';

function component() {
	var element = document.createElement('div');
	element.innerHTML = _.join(['Hello', 'webpack', file], ' ');
	return element;
}
parse();
document.body.appendChild(component());
```



```diff
	module: {
		rules: [
	
+			// {
+			// 	test: require.resolve('./src/shimming/index.js'),
+			// 	loader: 'imports-loader?this=>window'
+			// },
+			{
+				test: require.resolve('./src/shimming/global.js'),
+				use: 'exports-loader?file,parse=helpers.parse'
+			}
+		]
	},

}
```



### 打包library

> 参考文档

https://webpack.docschina.org/guides/author-libraries



> 关键参数

#### library属性

`library` 的值的作用，取决于 [libraryTarget](#libraryTarget属性) 选项的值；

> Example：配置多个entry入口

```js
var path = require("path");
module.exports = {
	// mode: "development || "production",
	entry: {
		alpha: "./alpha",
		beta: "./beta"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "MyLibrary.[name].js",
		library: ["MyLibrary", "[name]"],
		libraryTarget: "umd"
	}
};
```



#### libraryTarget属性

> 配置作用

`libraryTarget`用来配置暴露library变量的方式。

> 文档

https://webpack.docschina.org/configuration/output/#output-librarytarget

> 使用实例

举个例子，我写了一个number.js库，我需要支持nodejs、umd、浏览器引用的使用方式。那么可以通过libraryTarget这个属性来配置。

看一下libraryTarget支持哪些配置？

- var(默认值)：作为一个全局变量，通过 `script` 标签来访问（`libraryTarget:'var'`）。
- this：通过 `this` 对象访问变量。this.library（`libraryTarget:'this'`）。
- window：在浏览器中通过 `window` 对象访问（`libraryTarget:'window'`）。
- global: 可以再nodejs里面通过`global`对象来访问；
- umd：在 AMD 或 CommonJS `require` 之后可访问（`libraryTarget:'umd'`）。



#### 引入第三方库

如果在我们编写的library里使用到了其他的第三方库，我们打包的时候不希望把这些第三方库打包进来；

这样就可以用到[externals](#externals)配置



> 总结

一般会把libraryTarget指明为`umd`，支持用import、require等方法来使用。但是不支持通过script标签来使用；

然后把library指明通过script标签引入时，全局暴露的library名称。

如果要用第三方依赖，



### 打包typescript

#### 什么是[typescript](./TypeScript)？

> webpack配置依赖

```bash
yarn add --dev typescript ts-loader
```



>  配置项

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/typescript/index.ts',
	devtool: 'inline-source-map',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},

	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
	]

};
```

ts配置项

```json
{
    "compilerOptions": {
      "outDir": "./dist/",
+     "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "react",
      "allowJs": true
    }
  }
```



ts代码

```tsx
import * as _ from "lodash";

class Greet {
    msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    greeting() {
        console.log(this.msg);
    }

    join(array: Array<any>, separator: string) {
        return _.join(array, separator);
    }

}

const greet = new Greet("hello ts");

greet.greeting();

console.log(greet.join(['a', 'b'], ' '));
```



### 结合eslint配置

> 配置依赖

首先安装eslint和eslint-loader

```bash
yarn add --dev eslint-loader eslint
```

> 配置详情

eslint的需要有一个单独的.eslintrc.js配置文件

这里第一步先创建好.eslintrc.js配置文件，配置上eslint的规范。 可以使用`npx eslint --init`;

然后去配置继承airbnb的规范.

打开[airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base)插件地址，这里分base版本以及其他框架如react版本等等。

根据需求安装好依赖后，在.eslintrc.js里配置extend关系。

依赖配置

```bash
npm i eslint-config-airbnb-base --save-dev
npx install-peerdeps --dev eslint-config-airbnb-base
```

.eslintrc.js配置

参考eslint的[配置文档]()

一般都会去参考[airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base)的规范。

```diff
module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
+	'extends': ['airbnb-base'],
	'globals': {
	},
+  'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
```

webpack.config.js

```diff
module.exports = {
  // ...
  devServer: {
+    overlay: true,
  },
  module: {
    rules: [
+      {
+        test: /\.js$/,
+        exclude: /node_modules/,
+        loader: "eslint-loader",
+			 }
    ]
  }
  // ...
};
```

配置好之后，webpack会在打包的时候自动进行es-lint的规则校验。



> 总结

eslint的配置其实很简单，只需要安装好eslint，eslint-loader，配置好对应的规则即可。

但是在正常项目开发过程中，如果在webpack里配置eslint，那么会降低打包速度（每次重新编译都要走一次eslint规则校验）

所以一般不会用webpack进行配置，而是会在git hook上进行配置，在代码提交时对代码规范进行判断。

// todo 配置git hook



### DDLPlugin

`DLLPlugin` 和 `DLLReferencePlugin` 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。

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
    vendor: require.resolve(path.join(__dirname, "./vendor.js"))
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






### ManifestPlugin




## 实用案例





### 配置优化

#### 打包分析 

如果我们以分离代码作为开始，那么就应该以检查模块的输出结果作为结束，对其进行分析是很有用处的。[官方提供分析工具](https://github.com/webpack/analyse) 是一个好的初始选择。下面是一些可选择的社区支持(community-supported)工具：

- [webpack-chart](https://alexkuz.github.io/webpack-chart/)：webpack stats 可交互饼图。

- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)：可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。

- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)：一个 plugin 和 CLI 工具，它将 bundle 内容展示为便捷的、交互式、可缩放的树状图形式。(推荐)

- [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize)：此工具会分析你的 bundle，并为你提供可操作的改进措施建议，以减少 bundle 体积大小。

  

 ![image-20200207121247825](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-07-041248.png)



#### 打包优化点

- 尽量使用最新的node、npm、yarn

- loader里面合理应用include和exclude

- 尽量减少使用plugin，推荐使用官方的plugin

- 控制打包的大小

  - 使用[ddl](#DDLPlugin)来抽离出不经常变化的代码。

  - 通过[treeshaking](#treeshaking)来去除没被使用的代码

  - 通过splitChunks来动态引入代码，打包拆分为小的代码，加快打包速度。

    

- 开启多进程打包： thread-loader, parallel-webpack, happypack
- 合理使用[sourcemap](#devtool)
- 结合[打包分析](#打包分析 )工具



打包GsComps





### WebpackHtmlPlugin打包多页面













### 懒加载 lazyLoading + preloading + prefetching

> 思想

在做前端代码优化时，把核心放到如何增加code coverage上来思考。

要通过异步加载或者懒加载去减少页面首页的加载时间

如果担心懒加载影响体验，可以使用preload 或 prefetching来在页面空闲时提前加载代码。

> 实践

```js
/* index.js */
import _ from 'lodash';

function getComponent() {
	const element = document.createElement('div');
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');
	const button = document.createElement('button');
	button.innerHTML = 'Click me and look at the console!';
	button.onclick = function () {
		import(/* webpackPrefetch: true */ /* webpackChunkName: 'print' */'./print').then(module => {
			const print = module.default;
			print();
		})
	}
	element.appendChild(button);
	return element;
}

document.body.appendChild(getComponent());
```

> prefetch效果

![image-20200130100349008](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-30-020349.png)

> preload效果

![image-20200130105412163](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-30-025412.png)

```js
button.onclick = function () {
		import(/* webpackPrefetch: false, webpackPreload: true, webpackChunkName: 'print' */'./print').then(module => {
			const print = module.default;
			print();
		})
	}
```

仅仅在引入时配置这个无效，我是手动在index.html里加了`<link rel="preload" as="script" href="/print.js">` . 先看了看效果，原因还没查出来；



> 疑问

**Q:为什么prefetch会在浏览器空闲的时候去下载js，但是实际上这个js没有被使用上去，等到实际业务逻辑用到时又去下载了一次js？**

![image-20200130100815935](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-30-020816.png)

参考答案：prefetch预取是在浏览器空闲时预先去请求模块，放到缓存里，等到真正要用时，预期的chunk已经在http的缓存中，浏览器就可以话费最小的时间从最近的缓存区获取数据。



**Q:可以不可以对每一个模块都预取？**

参考答案：会浪费了很多带宽。 有选择地将它用于很可能被访问的import()也更有益。 不要浪费带宽。



**Q: prefetch 和 preload有啥区别？**

参考答案：preload的使用场景不多。他的意思是，这些资源在本页面里面必须要有，只是在之后才被用到，浏览器先去给他一起下载下来，省的后面要一次性下载一堆文件。



prefetch的意思是，这些资源在未来某一个页面会被用到。浏览器通常会在空闲状态取得这些资源，在取得资源之后搁在HTTP缓存以便于实现将来的请求。



prefetch会占用额外的带宽，因为prefetch去下载的资源未来可能根本不会去使用。

Preload用于更早地发现资源，并避免发起类似瀑布一样的请求。





### create-react-app

首先用`create-react-app`脚手架创建好工程，然后执行脚本`npm run eject`将webpack等相关的配置显示出来。

当前版本对应如下

```json
"dependencies": {
  "@babel/core": "7.8.4",
  "@svgr/webpack": "4.3.3",
  "@testing-library/jest-dom": "^4.2.4",
  "@testing-library/react": "^9.3.2",
  "@testing-library/user-event": "^7.1.2",
  "@typescript-eslint/eslint-plugin": "^2.10.0",
  "@typescript-eslint/parser": "^2.10.0",
  "babel-eslint": "10.0.3",
  "babel-jest": "^24.9.0",
  "babel-loader": "8.0.6",
  "babel-plugin-named-asset-import": "^0.3.6",
  "babel-preset-react-app": "^9.1.1",
  "camelcase": "^5.3.1",
  "case-sensitive-paths-webpack-plugin": "2.3.0",
  "css-loader": "3.4.2",
  "dotenv": "8.2.0",
  "dotenv-expand": "5.1.0",
  "eslint": "^6.6.0",
  "eslint-config-react-app": "^5.2.0",
  "eslint-loader": "3.0.3",
  "eslint-plugin-flowtype": "4.6.0",
  "eslint-plugin-import": "2.20.0",
  "eslint-plugin-jsx-a11y": "6.2.3",
  "eslint-plugin-react": "7.18.0",
  "eslint-plugin-react-hooks": "^1.6.1",
  "file-loader": "4.3.0",
  "fs-extra": "^8.1.0",
  "html-webpack-plugin": "4.0.0-beta.11",
  "identity-obj-proxy": "3.0.0",
  "jest": "24.9.0",
  "jest-environment-jsdom-fourteen": "1.0.1",
  "jest-resolve": "24.9.0",
  "jest-watch-typeahead": "0.4.2",
  "mini-css-extract-plugin": "0.9.0",
  "optimize-css-assets-webpack-plugin": "5.0.3",
  "pnp-webpack-plugin": "1.6.0",
  "postcss-flexbugs-fixes": "4.1.0",
  "postcss-loader": "3.0.0",
  "postcss-normalize": "8.0.1",
  "postcss-preset-env": "6.7.0",
  "postcss-safe-parser": "4.0.1",
  "react": "^16.12.0",
  "react-app-polyfill": "^1.0.6",
  "react-dev-utils": "^10.2.0",
  "react-dom": "^16.12.0",
  "resolve": "1.15.0",
  "resolve-url-loader": "3.1.1",
  "sass-loader": "8.0.2",
  "semver": "6.3.0",
  "style-loader": "0.23.1",
  "terser-webpack-plugin": "2.3.4",
  "ts-pnp": "1.1.5",
  "url-loader": "2.3.0",
  "webpack": "4.41.5",
  "webpack-dev-server": "3.10.2",
  "webpack-manifest-plugin": "2.2.0",
  "workbox-webpack-plugin": "4.3.1"
}
```

先看一下 scripts/build.js 用来进行生产环境打包脚本

核心的webpack配置存在webpack.config.js

### vue-cli
vue-cli是官方提供的脚手架工具。~2.0版本会自动创建webpack的很多配置项。 ~3.0版本做了很大改动，封装了所有的webpack配置项，开发如果需要更改配置，需在项目里创建一个vue.config.js文件，根据文档进行配置。

#### vue-cli@2.0 loader部分
> css-loader

vue-cli2创建的webpack配置里，自动创建了很多处理样式的loader，这里截取下来学习下。

```js
// vue-loader.config.js的css-loader
{
  css: [
    "vue-style-loader", 
    {
      loader: "css-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "postcss-loader", 
      options: {
        sourceMap: true
      }
    }
  ], 
  less: [
    "vue-style-loader", 
    {
      loader: "css-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "postcss-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "less-loader", 
      options: {
        sourceMap: true
      }
    }
  ], 
  sass: [
    "vue-style-loader", 
    {
      loader: "css-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "postcss-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "sass-loader", 
      options: {
        indentedSyntax: true, 
        sourceMap: true
      }
    }
  ], 
  scss: [
    "vue-style-loader", 
    {
      loader: "css-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "postcss-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "sass-loader", 
      options: {
        sourceMap: true
      }
    }
  ], 
  styl: [
    "vue-style-loader", 
    {
      loader: "css-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "postcss-loader", 
      options: {
        sourceMap: true
      }
    }, 
    {
      loader: "stylus-loader", 
      options: {
        sourceMap: true
      }
    }
  ]
}
```
可以看出来，基本上loader的配置顺序为 `vue-style-loader` -> `css-loader` -> `postcss-loader` -> `各自预处理框架的loader`；

除了.vue里写样式之外，一些单独存放的样式文件的处理loader也配置如下。因为基本重复，这里就不贴所有的配置项了。
```js
//生成结果
[
  ...
  {
    test: /\.sass$/
    use: [
      "vue-style-loader", 
      {
        loader: "css-loader", 
        options: {
          sourceMap: true
        }
      }, 
      {
        loader: "postcss-loader", 
        options: {
          sourceMap: true
        }
      }, 
      {
        loader: "sass-loader", 
        options: {
          indentedSyntax: true, 
          sourceMap: true
        }
      }
    ]
  }
]
```

#### vue-cli@3.0 配置
> 官方文档
> https://cli.vuejs.org/zh/config/#baseurl

