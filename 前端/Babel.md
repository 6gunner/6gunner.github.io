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