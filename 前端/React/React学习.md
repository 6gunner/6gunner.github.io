# React学习

## [Dva](./Dva)

## React Hook

https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation

> #### useState

`initialState` 参数是初始渲染期间使用的状态。 在随后的渲染中，它会被忽略了。 如果初始状态是高开销的计算结果，则可以改为提供函数，该函数仅在初始渲染时执行：

```
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

> useCallback

> useMemoize

返回一个缓存了结果的函数；



> #### useReducer



## Redux中间件

### [redux-saga](./redux-saga)



## 踩坑记录

### 1.在startAdornment里用select组件

> #### 问题描述

在我们的登录页面里，发现在开发模式下，是会崩溃的，但是生产模式下，可以运行。

查看了下控制台，截图如下：

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-02-113014.png" alt="image-20200102193014405" style="zoom: 67%;" />

对应的代码片段如下：

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-054942.png" alt="image-20200102192921583" style="zoom:50%;" />



> #### 问题原因

查看了官网资料，在FormControl里有一个说明了：

⚠️Only one input can be used within a FormControl.

虽然Select是在Input组件的子组件，但是明显因为某种原因，Select被FormControl检测到了。

于是调整如下：

![image-20200102203141716](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-054940.png)

> #### 深入分析

对FormControl代码源码进行阅读，涉及到[Hooks](#React Hook)，

==// todo 目前还是一知半解==

![image-20200102210426794](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-054944.png)

Input代码

![image-20200102210545652](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-054943.png)

![image-20200102210616866](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-054939.png)





