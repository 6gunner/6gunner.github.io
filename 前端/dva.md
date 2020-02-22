# Dva

> 官方文档 https://dvajs.com/guide/

## Dva 是什么？

### react 框架

#### 提供的东西

提供组件的编写，将组件编译成虚拟 dom

#### 不能解决的问题

- 组件间的通信：react 只能支持父子组件的传参
- 数据流：数据如何和 view 的串联？路由如何和数据绑定？如何编写异步请求

### react 架构对比

|          | 原始                                                                    | dva                                               |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| APP 路由 | 引用 react-router 组件，通过中间件将应用路由和 react-redux 结合在一起； | 通过 dva/router 来引入，底层用的还是 react-router |
|          |                                                                         |                                                   |
|          |                                                                         |                                                   |

## API

### dva/dynamic

> 动态加载组件

```js
const PageComponet = dynamic({
  app,
  models: () => [import("./models/users")], //
  components: () => import("./routes/Page")
});
```

## Redux-Saga

重新定义 side-effects 为`Effects`

yield 调用另一个 effects

```javascript
yield put({
  type: 'user/getusergroupinfo',
  payload,
});
 //直到监听到结束才继续
yield take('user/getusergroupinfo/@@end')
```

yield 获取 state

```js
let address_list = yield select(state => state.finance.address_list);
```

解释一下 take

```
*editpassword({ payload, history }, { call, put, take}) {
```

// 这个是干嘛的？

```
this.props.loading.effects
```

监听浏览器的路径变化

```
 subscriptions: {
    setup ({ dispatch, history }) {
		// 在这里可以对浏览器的url进行监听
		history.listen(location => {
			const pathname = location.pathname
			const search = location.search
			const preview = /preview/.test(search)
		});
	}),

 }
```
