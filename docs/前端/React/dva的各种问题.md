# 1. uglify 压缩报错问题及 es5-imcompatible-versions

## 缘起

由于维护 roadhog 和 umi，收到构建方面的问题反馈比较多，其中一个常见的是打包时 uglify 压缩的问题。类似下面的报错都是这个引起的，

```text
Failed to minify the bundle. Error: 0.0f3f4c41.async.js from UglifyJs

xx.async.js from UglifyJs Unexpected token: keyword (const)

0.570d21b1.async.js from UglifyJs
Unexpected token: punc ()) [0.570d21b1.async.js:13245,19]

xx.async.js from UglifyJs Unexpected token: operator (>)
```

为啥会有这个问题？

通常 webpack 在构建时，是不会让 node_modules 下的文件走 babel tranpile 的，一是会慢很多，二是 babel@6 时编译编译过的代码会不安全（据说 babel@7 下没问题了），所以业界有个潜在的约定，npm 包发布前需要先用 babel 转出一份 es5 的代码。

但是有些 npm 包不遵守这个约定，没有转成 es5 就发上去，比如 [query-string@6](https://link.zhihu.com/?target=https%3A//github.com/sindresorhus/query-string/blob/597f14a/index.js%23L8%3A31)。然后压缩工具 uglify 又只支持 es5 的语法，遇到 `const`、`let`、`()=>` 类似的语法，就抛错了。

## 解决

有多个解决方法，但各有利弊。

## 使用 uglify-es 进行压缩

uglify-es 支持 es6 语法，所以不会报错。但问题是如果你需要在 IE11 及以下，或者其他的低版本浏览器里跑时，就会报错、白屏了。

## 让 babel 编译 node_modules 下的文件

由于 babel@7 可以保证编译编译过的代码不会出问题，这不失为一个好的解决方案，比如 create-react-app 会在下个版本考虑用这个方案，参考 facebook/create-react-app#3776。问题是会让本来就比较慢的 dev、build 流程雪上加霜。

## babel-engine-plugin

跟进 npm 包的 engine 配置做按需编译。缺点是使用者比较少，如果 npm 包开发者不遵循这个规则一样会出问题。

## umi/roadhog 提供的 extraBabelIncludes 配置

umi/roadhog 默认也是仅用 babel 编译项目文件，但提供了额外的 extraBabelInclude 配置可以指定 node_modules 下的文件。比如：

```js
{
  "extraBabelIncludes:" [
    "node_modules/a",
    "node_modules/b"
  ]
}
```

问题是无法提前预知，都是出错了一脸那啥，翻 issue 或者提问后才知道。而且找到哪个依赖用了 es6 语法也比较麻烦。

所以，有没有一种能提前预知（用户无感知），并且不降低 webpack 构建速度的方案



# 2.使用browserHistory时不能刷新，报错：`Uncaught SyntaxError: Unexpected token <`

## 缘起

因为dva在代理配置的路径是相对路径

## 解决

- 在index.html中修改 .js 引入路径，使用绝对地址进行引入！

假如说是 host:800/first/second 那么 你的引用如果是相对路径 那么 浏览器会去请求 host:800/first/src/somefile.js 而实际你的js路径为 host:800/src/somefiile.js

- 打包时publicPath 使用/publicPath/, 而不是/publicPath. 否则动态js会加载不到。

