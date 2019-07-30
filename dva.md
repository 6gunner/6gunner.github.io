# Dva

## react框架

#### 提供的东西

提供组件的编写，将组件编译成虚拟dom

#### 不能解决的问题

- 组件间的通信：react只能支持父子组件的传参
- 数据流：数据如何和view的串联？路由如何和数据绑定？如何编写异步请求



### react架构对比

|         | 原始                                                         | dva                                            |
| ------- | ------------------------------------------------------------ | ---------------------------------------------- |
| APP路由 | 引用react-router组件，通过中间件将应用路由和react-redux结合在一起； | 通过dva/router来引入，底层用的还是react-router |
|         |                                                              |                                                |
|         |                                                              |                                                |





## API

### dva/dynamic

> 动态加载组件

```js
const PageComponet = dynamic({
	app,
	models: () => [
		import('./models/users'),
	], // 
	components: () => import('./routes/Page'),
})
```

