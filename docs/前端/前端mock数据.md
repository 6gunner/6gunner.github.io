在项目开发里，一般前后端一起开发，前端没有接口可以调用。想要写调用接口，就得用mock的方式来实现。

#### 通过webpack配置

结合`webpack-api-mocker` 和 `webpack-dev-server`

首先在webpackDevServer.before参数里增加配置：

```js
const apiMocker = require("webpack-api-mocker");

before(app) {
  // 读取mock/index.js文件
  apiMocker(app, path.resolve('../mock/index.js'), {
    changeHost: true,
	}),
}
```

mock/index.js

模拟了两个接口`assets/data.json`、`assets/depth.json`

```js
const fs = require('fs');

mnodule.exports = {
	'GET /assets/data.json': (req, res) => {
		return res.json(JSON.parse(fs.readFileSync('./src/assets/data.json', 'utf8')));
	},

	'GET /assets/depth.json': (req, res) => {
		return res.json(JSON.parse(fs.readFileSync('./src/assets/depth.json', 'utf8')));
	}
}
```



#### 配置通用mock的服务

一般我们喜欢把mock的文件按业务去划分。

这样可以让mock文件更清晰。

为了支持这种修改，我们需要写一个通用的js文件，避免重复写配置。

```js
const fs = require('fs');
const path = require('path')
const mockPath = path.join(__dirname + '/mock');

// 存放文件路径
const mockFiles = [];
fs.readdirSync(mockPath).forEach(file => {
	mockFiles.push(path.resolve('./mock/'+file));
})
console.log(mockFiles);
module.exports=mockFiles;
```



webpack.config.js

```js
devServer: {
    open: true,
    before(app) {
      // apiMocker(app, path.resolve('./mock/user.js'), {
      //   changeHost: true,
      // })
      apiMocker(app, mockFiles, {
        changeHost: true,
      })
    }
}
```



如果是vue的配置，就这么写

![image-20200415203031805](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-06-03-100334.png)



