# Canvas

https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes



## 绘制矩形

canvas只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。

所有其他类型的图形都是通过一条或者多条路径组合而成的。

canvas提供了三种方法绘制矩形：

- [`fillRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect)

  绘制一个填充的矩形

- [`strokeRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeRect)

  绘制一个矩形的边框

- [`clearRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clearRect)

  清除指定矩形区域，让清除部分完全透明。

> 矩形（Rectangular）例子

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}
```

绘制结果如图：

![image-20200330152653976](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-30-072654.png)

## 绘制路径

绘制路径的步骤如下：

1. 首先，你需要创建路径起始点。
2. 使用[画图命令](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Paths)去画出路径。
3. 把路径封闭。
4. 通过==描边或填充路径区域==来渲染图形。



beignPath()新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

closePath()方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。

fill()会自动闭合图形，产生一个实心图形。

stroke不会自动闭合图形。他通过线条绘制轮廓

moveTo() 把路径移动到画布中的指定点，不创建线条



## Path2D

> API

```js
new Path2D();     // 空的Path对象
new Path2D(path); // 克隆Path对象
new Path2D(d);    // 从SVG建立Path对象
```



```js
drawPath2D () {
		const { canvas } = this
		if (canvas.getContext) {
			const ctx = canvas.getContext('2d')
			const rect = new Path2D()
			rect.rect(25, 25, 100, 100)

			const circle = new Path2D()
			circle.arc(200, 75, 50, 0, Math.PI * 2, true)
			// 我们创造了一个矩形和一个圆。它们都被存为Path2D对象，后面再派上用场
			ctx.strokeStyle = 'rgb(255,144,4)'
			ctx.stroke(rect)
			ctx.fillStyle = 'rgb(255,165,0)'
			ctx.fill(circle)
		}
	}
```



## 填充颜色

ctx默认的填充颜色、绘制线条是黑色的。

设置需要通过手动的去设置

```js
context.strokeStyle = color[2];
context.fillStyle = color[2];
context.font = "22px 'Roboto', 'Helvetica', 'Arial', sans-serif";

```

设置完颜色后，后面的填充、绘制都会使用上面的颜色。



## 写字

```js
ctx.font="20px Georgia";
ctx.fillText("Hello World!",10,50);
```



## 状态的保存和恢复 Saving and restoring state

在了解变形之前，我先介绍两个在你开始绘制复杂图形时必不可少的方法。

- [`save()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save)

  保存画布(canvas)的所有状态

- [`restore()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/restore)

  save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。

Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。

状态包括：

- 当前应用的变形（即移动，旋转和缩放）
- `strokeStyle`, `fillStyle`, `globalAlpha`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `globalCompositeOperation 的值`
- 当前的裁切路径（clipping path)



你可以调用任意多次 `save `方法。

每一次调用 `restore` 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。

