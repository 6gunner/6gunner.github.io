## 1.react的核心[API](https://github.com/facebook/react/blob/master/packages/react/src/React.js)

**React**

```
const React = {
    createElement,
		Component
}
```

- React.createElement: 用来创建虚拟DOM
- React.Component:实现自定义组件



**ReactDOM **

- ReactDOM.render:渲染真实DOM



## 2.jsx的作用

是对js语法的一个扩充，主要是用来实现react的组件。

最终会被babel编译成通过`React.createElement`创建的组件代码。

### jsx的编译结果

[在线编译网站](https://babeljs.io/repl/#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.9.0&externalPlugins=)

**build之前**

```jsx
import React from "react";

function Comp(props) {
  return <h2>hi {props.name}</h2>;
}
const jsx = (
  <div id="demo">
    <span>hi</span>
    <Comp name="kaikeba" />
  </div>
);
console.log(JSON.stringify(jsx, null, 2));

export default function () {
  return jsx;
}
```

**编译之后**

```jsx
function Comp(props) {
  return React.createElement("h2", null, "hi ", props.name);
}

const jsx = React.createElement(
  "div",
  {
    id: "demo",
  },
  React.createElement("span", null, "hi"),
  React.createElement(Comp, {
    name: "kaikeba",
  })
);
```

**打印的jsx**

![image-20200427072009690](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-26-232009.png)





## 为什么要用虚拟dom

因为传统的dom对象里面，存在很多多余的对象，所以就操作起来很浪费性能。

用虚拟dom的js对象，可以减少内存的消耗。

而且通过操作虚拟dom，可以减少了真实dom的操作，处理完得到最终的dom对象后，最后一次性渲染到页面上。





## 模拟实现createElement和render

createElement方法由React提供，会在代码编译时自动被调用。

```js
function createElement(type, props, ...children) {
}
```

render方法会传入createElement方法返回的vnode节点，然后期待渲染到页面上。

```js
function render(vnode, container) {
}
```

实现逻辑：

> 实现createElement方法

1：需要把props和children合并在一起。

2：如果是文本类型的节点，需要单独特殊进行处理，方便render函数进行处理。

> 实现render方法

1: render就是将vnode转换为dom，并且渲染到container上去。

2：因为vnode是一个树形数据结构，所以需要做好递归的判断。

然后如果是文本类型的节点，使用`document.createTextNode(vnode.props.nodeValue)`

如果是其他的节点，用`document.createElement(vnode.type)`进行处理。





