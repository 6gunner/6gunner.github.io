## Redux-Saga



## effects

以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 `state`。由 `action` 触发，可以触发 `action`，可以和服务器交互，可以获取全局 `state` 的数据等等。

格式为 `*(action, effects) => void` 或 `[*(action, effects) => void, { type }]`。

type 类型有：

- `takeEvery`
- `takeLatest`
- `throttle`
- `watcher`

详见：https://github.com/dvajs/dva/blob/master/packages/dva-core/test/effects.test.js

重新定义 side-effects 为`Effects`



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



## 监听action

```
subscriptions: {
    setup ({ dispatch }) {  // eslint-disable-line
      dispatch({
        type: 'watchAndLog'
      });
    },
    setup2({dispatch}) {
      dispatch({
        type: 'watchFirstThreeTodosCreation'
      })
    }
  },

  effects: {
    *watchAndLog({}, {select, put, takeEvery}) {
      function* logger(action) {
        const state = yield select();
        console.log('action', action);
        console.log('state after', state);
      }
      yield takeEvery('*', logger);
    },

    *watchFirstThreeTodosCreation({}, {take, put}) {
      for (let i = 0; i < 3; i++) {
        const action = yield take('increment');
      }
      yield put({
        type: 'SHOW_CONGRATUATION'
      })
    },
```





## 同时执行多个任务

```javascript
import { call } from 'redux-saga/effects'

// 正确写法, effects 将会同步执行
const [users, repos] = yield [
  call(fetch, '/users'),
  call(fetch, '/repos')
]
```



Saga 只会在这之后终止：

- 它终止了自己的指令
- 所有附加的 forks 本身被终止



## takeEvery

```javascript
import {fork, take} from "redux-saga/effects"

const takeEvery = (pattern, saga, ...args) => fork(function*() {
  while (true) {
    const action = yield take(pattern)
    yield fork(saga, ...args.concat(action))
  }
})
```

`takeEvery` 可以让多个 `saga` 任务并行被 fork 执行。

## `takeLatest`

```javascript
import {cancel, fork, take} from "redux-saga/effects"

const takeLatest = (pattern, saga, ...args) => fork(function*() {
  let lastTask
  while (true) {
    const action = yield take(pattern)
    if (lastTask) {
      yield cancel(lastTask) // 如果任务已经结束，则 cancel 为空操作
    }
    lastTask = yield fork(saga, ...args.concat(action))
  }
})
```

`takeLatest` 不允许多个 `saga` 任务并行地执行。一旦接收到新的发起的 action，它就会取消前面所有 fork 过的任务（如果这些任务还在执行的话）。

