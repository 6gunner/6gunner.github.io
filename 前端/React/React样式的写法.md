# 第一种

==直接写style样式，不推荐==

这种写法应该是个人都知道，这里介绍一下是因为下面有一种方案和他很类似，但是支持的点不同。

```jsx
// 可以直接写，但是要注意格式变成驼峰的格式
<div>
  <div style={{backgroundColor:"red"}}>bg1</div>
</div>
​```
```

也可以将样式剥离到js文件里

```js
//js file
export default {
	table: {
		display: 'table',
	},
	row: {
		display: 'table-row'
	},
	cell: {
		display: 'table-cell',
		padding: 5,
		// 这些东西都不能生效
		'&:nthChild(1)': {
			background: '#f00'
		},
		'&:nthChild(2)': {
			background: '#0f0'
		}
	}
}
```
组件
```
// 引用
import React from 'react'
import styles from './JsStyle'

export default function () {
	return (
		<div style={styles.table}>
			<div style={styles.row}>
				<div style={styles.cell}>table1</div>
				<div style={styles.cell}>table2</div>
				<div style={styles.cell}>table3</div>
			</div>
		</div>
	)
}

```

**总结：**

这个的最大问题就是：没办法嵌套class，也没法让伪元素生效





# 第二种写法

直接定义css、less等样式文件

```
// css代码省略
```

引入到组件里

通过css名进行设置样式

```js
...
import styles from './User.css'
...
function componentA() {
  return (
    // 使用样式
		<div className={styles.normal}>
			<div>
        // 使用样式
				<div className={styles.create}>
					<UserModal record={{}} onOk={addHandler}>
						<Button>Create User</Button>
					</UserModal>
				</div>
			</div>
		</div>
	)
}
...
```



**总结**

这种写法是最常见，也是我觉得最好用的方法，简单容易理解。

结合webpack的css-loader还可以把[css 模块化](http://www.alloyteam.com/2017/03/getting-started-with-css-modules-and-react-in-practice/)，==不用担心css作用域污染的问题。==



# 第三种写法

上面那种写法是把css引入为styles对象，通过jsx语法引入。

但是有一个问题，需要不断的用styles.xxx。（而且需要引入全局css也很麻烦）

怎么能方便的直接写class名字呢？

可以使用[React CSS Modules](https://github.com/gajus/babel-plugin-react-css-modules)

具体配置可以参考官网的，dva和umi的框架下面，我没有配置成功。（search不到）

纯webpack文件配置如下：

```js
/* eslint-disable filenames/match-regex, import/no-commonjs */

const path = require('path');
const context = path.resolve(__dirname, 'src');

module.exports = {
  context,
  entry: './index.js',
  module: {
    loaders: [
      {
        include: path.resolve(__dirname, './src'),
        loaders: [
          'style-loader',
          'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
        test: /\.css$/
      },
      {
        include: path.resolve(__dirname, './src'),
        loader: 'babel-loader',
        query: {
          plugins: [
            '@babel/transform-react-jsx',
            [
              'react-css-modules',
              {
                context
              }
            ]
          ]
        },
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js'
  },
  stats: 'minimal'
};

```

Package.json如下：

```json
"dependencies": {
  	// 这个要放到dependencies里。
    "babel-plugin-react-css-modules": "^4.0.0",
    "react": "^15.4.1",
    "react-dom": "^15.4.1",
    "webpack": "^2.7.0"
  },
```



这个插件的原理

1. 构建每个文件的所有样式表导入的索引（导入具有`.css` 或`.scss` 扩展名的文件）。
2. 使用 [postcss](https://github.com/postcss/postcss) 解析匹配到的 css 文件
3. 遍历所有 [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) 元素声明
4. 把 `styleName` 属性解析成匿名和命名的局部 css 模块引用
5. 查找与 CSS 模块引用相匹配的 CSS 类名称：
* 如果 `styleName` 的值是一个字符串字面值，生成一个字符串字面值。
* 如果是 JSXExpressionContainer，在运行时使用 helper 函数来构建如果 `styleName` 的值是一个 [`jSXExpressionContainer`](https://github.com/babel/babel/tree/master/packages/babel-types#jsxexpressioncontainer), 使用辅助函数（[`getClassName`] 在运行时构造 `className` 值。
6. 从元素上移除 `styleName` 属性。
7. 将生成的 `className` 添加到现有的 `className` 值中（如果不存在则创建 `className` 属性）



**总结**

使用`[React CSS Modules]`就可以不用使用`camelCase`的命名格式来写样式了。

也不用写style.xxxx了

但是在component里使用时，==要注意用`styleName`而不是`className`==

这个似乎用的人不是很多，查问题基本上查不到，最好不在项目里使用，否则踩坑没法解决。





# 第四种

第三种的核心思想是[Css-in-js](https://github.com/MicheleBertoli/css-in-js)

项目里用到了`material-ui`，这个ui的[官方文档](https://material-ui.com/zh/styles/basics/)介绍了这种方式去覆盖样式。

当然也可以单独安装`@material-ui/styles`

```
yarn add @material-ui/styles
```



首先和第一种写法一样，定义js样式文件

```js
export default {
	root : {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',

	},
	testhaha: {
		display: 'block',
		marginRight: '20px',
		fontSize: 16,
		fontWeight: 400,
	}
}
```



写组件

```jsx
import React from 'react';
import { makeStyles, styled } from '@material-ui/styles'

import styles from './CssInJsStyle';

// 方式1
const useStyles = makeStyles(styles);

function Button(props) {
	return (
		<button {...props}>{props.children}</button>
	)
}
// 方式2
const MyButton = styled(Button)({
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
	border: 0,
	borderRadius: 3,
	boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
	color: 'white',
	height: 48,
	padding: '0 30px',
})

export default function () {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<p className={classes.testhaha}>testhaha</p>
			<MyButton>Styled Component</MyButton>
		</div>
	)
}

```



**withStyles的用法**

`withStyles()`实际上返回一个高阶组件，传入组件，将classes通过props的形式传入进去。

```jsx
import React from 'react';
import { withStyles } from '@material-ui/styles'

import styles from './HigherOrderStyle.js';

export default withStyles(styles)(function ({classes}) {
	return (
		<div className={classes.root}>
			<p className={classes.testhaha}>Higher Order</p>
			<button className={classes.button}>Styled Component</button>
		</div>
	)
})
```



**将props传入样式文件**

如果想在组件上设置一些样式的props，并且想把这些props传给样式文件，实现动态样式。

样式文件可以这么写

```js
export default {
	testhaha: (props) => {
		console.log(props)
		return {
			display: 'block',
			marginRight: '20px',
			fontSize: 16,
			fontWeight: 400,
			color: props.color
		}
	},
}
// {color: "red"}
```

```
<HigherOrderComponent color="red"/>
```

![image-20200419110327255](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-19-030327.png)





**设置theme**

图方便，把Inner和Outter的组件写在了一起。

theme最关键的是`ThemeProvider`这个Provider，将theme传入到了子组件里

```jsx
import React from 'react'
import { ThemeProvider, withTheme, withStyles } from '@material-ui/styles'

import styles from './ThemeStyle'

function ThemeComponent () {
	const WithStyledComponent = withStyles(styles)(InnerComponent)
	return (
		<ThemeProvider theme={{
			color: '#2196f3'
		}}>
			<WithStyledComponent/>
		</ThemeProvider>
	)
}

function InnerComponent (props) {
	const { classes } = props
	return (
		<div>
			<div className={classes.root}>
				color: theme.color
			</div>
		</div>
	)
}

export default withTheme(ThemeComponent)
```





**怎么使用插件**

安装插件 以`jss-plugin-nested`为例子

```
yarn add jss-plugin-nested
```

写法1

```js
export default {
	root : {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		// 可以对伪元素有效
		'&:hover': {
			background: 'gray',
		},
  }
}

```



写法2

```
export default {
	root : {
		// 对于全局的样式可以生效
		'&.clear': {
			clear: 'both'
		},
		// 对于全局的样式可以生效
		'& .button': {
			background: 'red'
		},
	},
}

```

上面的写法，需要在在组件上加一个对应的class, ==名称要一模一样，打包后名称也不能变，否则不生效。==

```jsx

<div className={classNames(classes.root, 'clear')}>
	<p className={classes.test}>testhaha</p>
  <button className="button">Styled Component</button>
 </div>
```



写法3

上面的嵌套写法局限就很大，只能对css自带的伪元素、以及元素选择器有用，对于类选择器很不方便。

如果要嵌套类名，可以用下面的写法：

```js
export default {
	root : {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		// 对伪元素有效
		'&:hover': {
			background: 'gray',
			'& $button': {
				background: 'red',
				color: 'blue'
			},
		},
		// $可以嵌套引用一个本地的类名
		'& $test': {
			color: 'red'
		},
		// $可以嵌套引用一个本地的类名
		'& button': {
			color: 'red'
		},
	},

	test: {
		display: 'block',
		marginRight: '20px',
		fontSize: 16,
		fontWeight: 400,
	},

	button: {
		height: 100,
		width: 200,
	}
}
```

```jsx
<div className={classNames(classes.root, 'clear')}>
	<p className={classes.test}>testhaha</p>
	<button className={classes.button}>Styled Component</button>
 </div>
```



**总结**

这个方案也是比较成熟、比较收欢迎的一种。和第二中css-module比起来，可以突破一些局限性。毕竟可以用js实现一些强大的功能（动态样式）

默认的jss支持的写法比较少，但是可以用一些插件来支持:[JSS Plugins](https://github.com/cssinjs/jss/blob/master/docs/plugins.md)

比如想要支持嵌套的css类选择



# 第五种

依赖于`styled-component`

```
npm install --save styled-components
```

语法：

```js
import React from 'react';
import styled from 'styled-components';

const MyDiv = styled.div`
background-color: #44014C;
width: 300px;
min-height: 200px;
margin: 30px auto;
box-sizing: border-box;
`;

const MyH2 = styled.h2`
	color: white;
	text-align: center;
`

export default function () {
	return (
		<MyDiv>
			<MyH2>ToDo</MyH2>
		</MyDiv>
	)
}
```

**总结**

个人没有实际应用，只是尝试了demo，觉得应该很转换思路去写这样的代码，但是作为一个解决方案记录在这。





# 附：classnames

https://github.com/JedWatson/classnames#readme

在react里写样式，一般都是通过指定`className={}`的形式来的。

但是className只能传入一个值

`<p className={[classes.test, classes.test2]}>test2</p>` 这种写法是错误的，会导致样式全都不生效



为了解决这个问题，就引入了`classnames`这个lib库

可以很方便的帮助传入多个class，还可以根据条件来控制class的使用与否

```jsx
<p className={classNames(classes.test, classes.test2)}>testhaha</p>

<p className={
  classNames({
    [classes.test]: true,
    [classes.test2]: false
  })
}>testhaha</p>
```



当然不用也可以，你可以字符串拼接：

```jsx
<p className={classes.test + ' ' + classes.test2}>test4</p>
```

但是这个复杂情况就很不好写，而且很难理解。

打印一下classes，其实他们都是解析成了字符串。

所以用`+`拼接也可以

![image-20200419165627062](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-19-085627.png)