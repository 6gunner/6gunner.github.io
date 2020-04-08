# React学习

## 函数组件

**在函数组件内部使用 `ref` 属性**

```js
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它 
  const textInput = useRef(null);
  function handleClick() {
    textInput.current.focus();  
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} /> 
			<input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```



## [Dva](./Dva)

## [React样式 classnames](https://github.com/JedWatson/classnames#readme)

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

> useEffect

**`useEffect` 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

 **`effect` 可选的清除机制**。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

**怎么避免重复执行useEffect?**

```js
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```





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







### 2.Can't perform a React state update on an unmounted component 

现象如标题所说，不能在unmounted的组件上进行state的更新操作。

这个现象发生的原因一般有2种，一个是忘了取消定时任务，一个是异步请求回来的时候，触发了setState，但是这个时候组件已经销毁了。



解决方案：

第一种很好解决，在`componentWillUnmount里面取消定时任务`

第二种，因为一般异步任务不好去手动取消，所以一般是在setState的时候，对component的状态进行判断。

可以写一个装饰器(没验证过)

```js
function withUnmounted (target){
  // 改装componentWillUnmount，销毁的时候记录一下
  let next = target.prototype.componentWillUnmount
  target.prototype.componentWillUnmount = function () {
    if (next) next.call(this, ...arguments);
    this.unmount = true
  }
  // 对setState的改装，setState查看目前是否已经销毁
  let setState = target.prototype.setState
  target.prototype.setState = function () {
    if ( this.unmount ) return ;
    setState.call(this, ...arguments)
  }
}
@withUnmounted
class BaseComponent extends Component {
}
```

或者手动去修改component的组件

```js
class Page extends Component {
  _isMounted = false;

  state = {
    isLoading: true
  }

  componentDidMount() {
    this._isMounted = true;
  
    callAPI_or_DB(...).then(result => {
      if (this._isMounted) {
        this.setState({isLoading: false})
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>Whatever</div>
    );
  }
}

export default Page;
```

思路都一样

