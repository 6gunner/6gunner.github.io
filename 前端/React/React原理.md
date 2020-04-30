## 1.react的核心[API](https://github.com/facebook/react/blob/master/packages/react/src/React.js)

**React**:

```
const React = {
    createElement,
		Component
}
```

- React.createElement:创建虚拟DOM
- React.Component:实现自定义组件

**ReactDom :**

- ReactDOM.render:渲染真实DOM



## 2.jsx的作用

是对js语法的一个扩充，主要是用来实现react的组件。

最终会被编译成通过`React.createElement`创建的组件代码。

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



## 3.模拟实现createElement和render

