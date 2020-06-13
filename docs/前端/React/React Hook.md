[官方文档](https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation)



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

只有当传入的依赖参数变化时，才真正执行函数。

```
	const theme = React.useMemo(() => ({ color }), [color])
```

只有当color变化时，才会返回新的color。





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



