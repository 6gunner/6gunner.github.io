# React开发



# Dva

> 官方文档 https://dvajs.com/guide/
>
> 已经升级为=> UMI



## Dva 是什么？

dva是一个基于redux和redux-saga的数据流方案，再加上集成了react-router和fetch。可以理解为一套框架的总结。



## 快速入门

### 最简结构

```js
import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
```



#### 定义model

1.第一步是在main.js里通过app.model()方法来注册model

```diff
const app = dva();

+ app.model({ /**/ });

app.router(() => <App />);
app.start('#root');
```

也可以在路由里指定组件使用的model，参考[dva/dynamic](#dva/dynamic)



2.第二步是定义model

```js
export default {
  namespace: 'user',
  state: {
    userInfo: {
      name: 'keyang',
      age: '28',
    }
  },
  subscriptions: {

  },
  effects: {

  },
  reducers: {
    updateUser(state, action) {
      state.userInfo = action.payload.userInfo;
    }
  }
}

```

model里有很多属性，这里简单代过，后面有[详细介绍](#Model的概念)

- state：表示react里面维护的全局state。
- [subscriptions](#subscription): 可以理解为dva提供的一种监听机制，它会在应用刚启动时执行所有的方法。你可以在里面去定义一些监听事件，包括初订阅ws请求、绑定各种键盘、路由变化的监听器等。
- [effects](#effect)：一般用来放一些异步请求、或者是一些延迟的处理逻辑。
- [reducers](#reducer):纯函数，用来改变state的



#### 在view组件里使用dispatch

```jsx
function IndexPage ({ count, dispatch }) {
  function increment() {
    dispatch({
    	// 带上namespace
      type: 'example/incrementAsync'
    })
  }
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>当前数量：{count}</h1>
      <div className={styles.welcome}/>
      <button onClick={increment}>增加
      </button>
      <button onClick={
        () => dispatch({
          type: 'example/decrementAsync'
        })
      }>减少
      </button>
    </div>
  )
}
```



#### 在view组件里使用connect

```js
import { connect } from 'dva';

function mapStateToProps(state) {
  return { todos: state.todos };
}
export default connect(mapStateToProps)(IndexPage);
```





#### dva路由跳转

- 通过LINK组件跳转
- 通过history对象跳转
- 用dva/withRouter提供的redux action进行跳转



## 代码规范/约束

### 组件定义

在 dva 中我们通常将Container Components（容器组件）约束为 Route Components，因为在 dva 中我们通常以页面维度来设计 Container Components。

所以在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在`/routes/`目录下，而`/components/`目录下则是纯组件（Presentational Components 展示组件）。





## [dva图解](./dva图解)

https://www.yuque.com/flying.ni/the-tower/tvzasn









### 核心特性

https://umijs.org/guide/#architecture

- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) 实现 components、routes 和 models 的 HMR

##  

### 和react 框架对比

#### React提供的东西

提供组件的编写，将组件编译成虚拟 dom

#### React不能解决的问题

- 组件间的通信：react目前只支持父子组件的传参。
- 数据流：
  - 数据如何和 view 的串联？ redux
  - 路由如何和数据绑定？react-router
  - 如何编写异步请求。redux-middleware 

#### dva的组成

所以基于上面react不能解决的问题，dva提出了一个总结方案。

dva = React-Router + Redux + Redux-saga





#### App架构对比

|      | 原始                                                         | dva                                               |
| ---- | ------------------------------------------------------------ | ------------------------------------------------- |
| 路由 | 引用 react-router 组件，通过中间件将应用路由和 react-redux 结合在一起； | 通过 dva/router 来引入，底层用的还是 react-router |
|      |                                                              |                                                   |
|      |                                                              |                                                   |







### 数据流向

![img](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-24-003446.png)

component 通过connect 使用state

通过dispatch actions触发reducer

如果是异步操作，通过sagas来触发effect进行异步请求

最终修改state



### model的概念

#### namespace

针对model的一个命名空间，这样就不同的model里面其实reducer、effect就可以重复命名，不用担心冲突了。

#### reducer

reducer本身是一个纯函数，它是可以改变state的唯一一个方法。所有的更新state操作都是需要通过action来触发reducer，最终实现的。

#### effect

effect的定义是副作用。因为同样的输入不一定会得到同样的输出，这违背了reducer纯函数的概念，称之为副作用。dva实际上是通过[redux-saga](#Redux-Saga)来进行异步请求的，但是他和redux的写法有一些细微的差别。

```js
* incrementAsync ({}, { call, put }) {
  yield call(delay, 1000); // 踩坑：这里写yield delay(1000) 会导致effect无法调用。
  yield put({
    type: 'INCREMENT',
  })
},

* decrementAsync ({}, { call, put }) {
  yield call(delay, 1000);
  yield put({
    type: 'DECREMENT',
  });
},
```

第二参数里面有很多对象，是dva替我们封装的：

```js
take: ƒ take(type) // 用来监听一个事件
takem: ƒ ()
put: ƒ put(action) // 调用一个reducer
all: ƒ all(effects)
race: ƒ race(effects)
call: ƒ call(fn)
apply: ƒ apply(context, fn)
cps: ƒ cps(fn)
fork: ƒ fork(fn)
spawn: ƒ spawn(fn)
join: ƒ join()
cancel: ƒ cancel()
select: ƒ select(selector)
actionChannel: ƒ actionChannel(pattern, buffer)
cancelled: ƒ cancelled()
flush: ƒ flush(channel)
getContext: ƒ getContext(prop)
setContext: ƒ setContext(props)
takeEvery: ƒ takeEvery(patternOrChannel, worker)
takeLatest: ƒ takeLatest(patternOrChannel, worker)
throttle: ƒ throttle(ms, pattern, worker)
```



#### subscription

subscription是用来订阅一个数据源，根据条件dispatch需要的action。数据源可以是ws连接、当前时间、history路由变化、keyboard输入等。

```js
import key from 'keymaster';
...
app.model({
  namespace: 'count',
  subscriptions: {
    keyEvent({dispatch}) {
      // 触发增加的action
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  }
});
```

注意：subscriptions里面的属性名其实可以任意命名，dva其实并不关心对象里面到底是`keyEvent`还是`setUp`。所以开发者可以尽情的去定义，只需要自己管理好业务逻辑，做好业务拆分，避免代码量过大难以理解。

结合subscription.js这个源码来看

![image-20200226091438078](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-26-011438.png)

因为subs里面所有的属性都必须是方法。实际上它就是遍历subs里面所有的key，然后去调用这些方法，传入了dispatch、history两个对象。













## 常用的API

https://dvajs.com/api/#dva

### dva/dynamic

> 动态加载组件

```js
const PageComponet = dynamic({
  app,
  models: () => [import("./models/users")], //
  components: () => import("./routes/Page")
});
```

- app: dva 实例，加载 models 时需要
- models: 返回 Promise 数组的函数，Promise 返回 dva model
- component：返回 Promise 的函数，Promise 返回 React Component

## 

## 复杂用法











# UMI

## 快速入门



###  本地验证

发布之前，可以通过 `serve` 做本地验证，

```bash
$ yarn global add serve
$ serve ./dist

Serving!

- Local:            http://localhost:5000
- On Your Network:  http://{Your IP}:5000

Copied local address to clipboard!
```

访问 http://localhost:5000，正常情况下应该是和 `umi dev` 一致的。



### 部署

本地验证完，就可以部署了，这里通过 [now](http://now.sh/) 来做演示。

```bash
yarn global add now
$ now ./dist

> Deploying /private/tmp/sorrycc-1KVCmK/dist under chencheng
> Synced 3 files (301.93KB) [2s]
> https://dist-jtckzjjatx.now.sh [in clipboard] [1s]
> Deployment complete!
```

通过now + zeit可以学会自动部署 https://zeit.co/account



## 创建项目

## 约定路由

### 动态路由

umi 里约定，带 `$` 前缀的目录或文件为动态路由。

比如以下目录结构：

```tex
+ pages/
  + $post/
    - index.js
    - comments.js
  + users/
    $id.js
  - index.js
```

会生成路由配置如下：

```js
[
  { path: '/', component: './pages/index.js' },
  //约定$id文件名会创建一个:id的路由，代表一个变量
  { path: '/users/:id', component: './pages/users/$id.js' },
  // $post = :post;
  { path: '/:post/', component: './pages/$post/index.js' },
  { path: '/:post/comments', component: './pages/$post/comments.js' },
]
```

### 可选的动态路由

umi 里约定动态路由如果带 `$` 后缀，则为可选动态路由。

比如以下结构：

```text
+ pages/
  + users/
    - $id$.js
  - index.js
```

会生成路由配置如下：

```js
[
  { path: '/': component: './pages/index.js' },
  { path: '/users/:id?': component: './pages/users/$id$.js' },
]
```



## 配置路由

在`.umirc.(ts|js)` 或者 `config/config.(ts|js)` 文件中配置 `routes` 属性，**此配置项存在时则不会对 `src/pages` 目录做约定式的解析**。

配置文档：https://umijs.org/zh/config/#routes

```diff
// component 指向的路由组件文件是从 src/pages 目录开始解析的
  routes: [
    {
      path: '/',
+     exact: true,
      component: '../layouts/index',
      routes: [
        { path: '/', component: './index' },
      ],
    }, {
      path: '/users',
      component: '../layouts/index',
      routes: [
        { path: '/users', component: './users/index' },
        { path: '/users/:id', component: './users/$id' },
      ]
    }
  ],
```

### 路由权限配置

```diff
routes: [
...
+ {
+	
+  	path: '/list',
+  	component: './list/index',
+  	// 渲染都会经过 ./routes/PrivateRoute.js，需要从src目录下配置目录
+  	Routes: ['./src/routes/PrivateRoute.js']  
+}
...
]
```

**PrivateRoutes**参考逻辑

```js
export default (props) => {
  if (sessionStorage.user) {
  return (
    <div>
      <div>PrivateRoute (routes/PrivateRoute.js)</div>
      { props.children }
    </div>
  );
  } else {
    return (
      <div>
        <div>PrivateRoute (routes/PrivateRoute.js)</div>
      </div>
    )
  }
}

```





# Redux-Saga

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
