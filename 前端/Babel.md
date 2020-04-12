https://blog.zfanw.com/babel-js/



babel 7 的一大调整，原来的 `babel-xx` 包统一迁移到[babel 域下](https://docs.npmjs.com/misc/scope) - 域由 `@` 符号来标识，一来便于区别官方与非官方的包，二来避免可能的包命名冲突。



## babel 插件

Babel 6 做了大量模块化的工作，将原来集成一体的各种编译功能分离出去，独立成插件。这意味着，默认情况下，当下版本的 babel 不会编译代码。

现在假定我们的项目下有一个 `script.js` 文件，内容是：

```js
let fun = () => console.log('hello babel.js')
```

我们试试运行 `npx babel script.js`：

```bash
$ npx babel script.js
let fun = () => console.log('hello babel.js');
```

还是原来的代码，没有任何变化。

要将上面的箭头函数编译成 ES5 函数，需要安装额外的 babel 插件

首先，安装 [@babel/plugin-transform-arrow-functions](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-arrow-functions)：

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions
```

然后，在命令行编译时指定使用该插件：

```bash
$ npx babel script.js --plugins @babel/plugin-transform-arrow-functions
let fun = function () {
  return console.log('hello babel.js');
};
```



编译成功。

基础依赖

```js
"@babel/core": "^7.9.0",
"@babel/preset-env": "^7.9.5",
"@babel/plugin-transform-runtime": "^7.9.0",
"babel-loader": "^8.1.0",

```



安装依赖项

```shell
$ yarn add @babel/core @babel/preset-env @babel/plugin-transform-runtime --dev
$ yarn add babel-loader --dev
```



.babelrc

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ],
    "stage-3"
  ],
  "plugins": [
    [
      "transform-runtime",
      {
        "helpers": false,
        "polyfill": false,
        "regenerator": true,
        "moduleName": "babel-runtime"
      }
    ],
    [
      "syntax-dynamic-import"
    ],
    [
      "transform-decorators-legacy"
    ]
  ]
}
```

`transform-decorators-legacy`支持es7的decorator语法