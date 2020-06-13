# DOM



## 盒子模型

每个HTML元素都是长方形盒子。

盒子模型有两种：**IE盒子模型**、**标准W3C盒子模型**

IE的content部分包含了border和pading

标准W3C盒模型包含：内容(content)、填充(padding)、边界(margin)、边框(border)。



## Position

**相对定位元素**： relative

**绝对定位元素**： abloute，相对于非static的元素的位置

**固定定位元素**： fixed 固定于body的位置

**粘性定位元素**： 是相对定位和固定定位的混合。元素在跨越某一阈值之前为相对定位，在跨越某一阈值之后，为固定定位。常用于定位==字母列表的头部元素==。标示 B 部分开始的头部元素在滚动 A 部分时，始终处于 A 的下方。而在开始滚动 B 部分时，B 的头部会固定在屏幕顶部，直到所有 B 的项均完成滚动后，才被 C 的头部替代。



## margin穿透怎么解决

> 父级设置

```css
display: flex;
display: inline-block;
display: table;
overflow: auto;
overflow: hidden;
padding: 0.1px;
border: 1px solid #000000;
```





## 行内元素/块状元素

- 块级元素：div,p,h1,form,ul,li; 

  每一个块状元素占据单独的一块，他们的display属性默认是block的。

  

- 行内元素 : span>,a,label,input,img,strong,em;

  占据一行，默认是inline。



### 深入理解vertical-align

https://juejin.im/post/5a7d6b886fb9a06349129463

初学者使用`vertical-align`属性时，经常会发现最终的表现结果并不能如愿，“vertical-align无效”也是CSS问题里搜索频率比较高的一个。大部分是因为对于该属性理解不够透彻引起的，只有理解了该属性的特点，表现行为以及与其他属性（`如line-height`）的共同作用机制和效果，才能很好的解决vertical-align带来的一些问题，并有效的利用它。

1. **起作用的前提**

   vertical-align起作用的前提是元素为inline水平元素或table-cell元素，包括`span`, `img`,`input`, `button`, `td` 以及通过display改变了显示水平为inline水平或者table-cell的元素。这也意味着，默认情况下，`div`, `p`等元素设置vertical-align无效。





## 重绘回流

**浏览器的渲染流程：**

```js
解析html,形成DOM树；
解析css,形成CSSOM树；
两者结合，形成render树；
进行layout，得到需要展示的元素，并且得到他们的大小和位置；
根据render树和layout信息，进行paninting，得到元素的像素大小，绘制在屏幕上。
```

**什么是回流 （reflow）?**

回流其实就是指重新计算layout。



**什么是重绘（repaint）?**

重绘其实就是浏览器根据render树以及回流阶段重新得到的layout信息，进行像素的绘制。



**什么时候会发生回流？**

当页面发生布局变化，或者几何信息发生变化的时候，就会产生回流。

比如：

- dom的增加删除
- 元素的position发生改变
- 元素的大小发生改变（包括margin、padding、border、height、width等）
- 内容发生变化（其实也是导致元素大小产生变化）
- 浏览器窗口大小发生变化



**怎么避免发生回流？**

- 当需要对元素进行修改时，让元素脱离文档流。因为脱离文档流的元素， 不会引起回流；对其进行多次修改后，再将其加入文档流。

- 尽量合并对样式的操作，减少回流的发生次数。比如，修改某一个元素的样式时，不要一个个去执行。

- 避免触发同步布局事件。比如去读取元素的offsetWidth属性，会导致浏览器强制清空执行队列，引发回流重绘。

  需要控制元素显示隐藏时，用z-index、transform属性来替代display的属性。避免回流。



## 居中

> 垂直居中的几种实现方式

1. 子元素position设置absolute，margin设置为auto, left和right设置为0； 需要设置width、height
2. 父级设置`text-align: center`，`line-height`等同高度。 对inline元素有效
3. 子元素position设置为absolute，top:50%，left:50%，transform: translate(-50%, -50%);
4. 父元素设置table布局，子元素设置display：table-cell; vertical-align: middle;
5. 父元素设置flex布局，设置justify-content: center,  align-items:center;
6. 父元素设置grid布局，子元素设置 justify-self: center, align-self: center;



## 常见布局

### 网格布局grid

容器：采用网格布局的区域，称为"容器"（container）

项目：容器内部采用网格定位的子元素，称为"项目"（item）。item只能是容器的顶层子元素，不包含项目的子元素。

https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html

#### **container**

1. 可以设置定义每行每列的宽、高（grid-template-columns、grid-template-rows）。
2. 可以定义行数、列数。（  grid-template-columns: 70% 30%;  2列）

2. 还可以设置自动填充（  grid-template-columns: repeat(auto-fill, 100px)）
3. 也可以通过fr来设置比例关系

**grid-auto-flow 属性**

可以设置container的子元素自动排放规则（先行后列、先列后行等）

**justify-items 属性， align-items 属性， place-items 属性**

可以设置container的子元素水平位置、垂直位置。

**justify-content 属性， align-content 属性， place-content 属性**

设置container的所有内容区域在容器的位置；



#### **item**

**grid-column-start 属性， grid-column-end 属性， grid-row-start 属性， grid-row-end 属性**

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

> - `grid-column-start`属性：左边框所在的垂直网格线
> - `grid-column-end`属性：右边框所在的垂直网格线

```css
.item-1 {
  grid-column-start: 2;
  grid-column-end: 4;
}
```

**grid-column 属性， grid-row 属性**

`grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式，`grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。

**grid-area 属性**

`grid-area`属性指定项目放在哪一个区域。



**justify-self 属性， align-self 属性， place-self 属性**

和container的justify-items属性用法相同，只不过是只应用于单个项目。



### flex布局

浮动布局

通过指定display: flex;来表示浮动布局

用flex-direction指定浮动方向

justify-content: space-between;

还可以通过 flex: number来表示权重；



## 块状格式上下文(BFC)

## 开启bfc

### 高度塌陷问题如何解决？

子元素脱离文档流如果是float，则可以通过[开启bfc]()解决。

但是如果是absolute或者fixed，则开启BFC同样不管用。只能通过指定parent的高度来避免高度丢失。

所以尽量避免用absolute来布局。







## 层叠上下文(Stacking Context)

**层叠上下文（stacking context）**

层叠上下文由满足以下任意一个条件的元素形成。

- **根层叠上下文**
  指的是页面根元素，也就是滚动条的默认的始作俑者``元素。这就是为什么，绝对定位元素在`left`/`top`等值定位的时候，如果没有其他定位元素限制，会相对浏览器窗口定位的原因。

- **定位元素与传统层叠上下文**

  对于positiion:relative/positiion:absolute的定位元素，当z-index值不为auto的时候，会创建层叠上下文。

- **CSS3与新时代的层叠上下文**

  1. `z-index`值不为`auto`的`flex`项(父元素`display:flex|inline-flex`)，子元素才是层叠上下文
  2. 元素的`opacity`值不是`1`.

**层叠水平（stacking level）**

普通元素的层叠水平由层叠上下文决定。只有同一个`层叠上下文`的元素，比较`层叠level`才有意义。

不要将z-index和层叠上下文混为一谈。

z-index某种程度上会影响层叠上下文

z-index只在position:absolute 的情况下有作用，以及在flex的容器的子元素下才有作用。

但层叠水平每一个层叠上下文的元素都有。



**层叠顺序（stacking order）**

元素发生层叠时，垂直方向（z轴）的排列顺序。

![层叠顺序元素的标注说明](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-09-133558.png)

层叠准则：

当有明显的`层叠水平`标准的时候，比如z-index。那么谁大，谁优先；

当元素的层叠顺序一致，且层叠上下文相同的时候，DOM中，后面的元素比前面的元素



## Sass/Less

预编译



## html5有哪些新特性、移除了那些元素？

HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。

- 绘画 canvas
- 用于媒介回放的 video 和 audio 元素
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；
- sessionStorage 的数据在浏览器关闭后自动删除
- 语意化更好的内容元素，比如 article、footer、header、nav、section
- 表单控件，calendar、date、time、email、url、search
- 新的技术==webworker==, == websockt==,  Geolocation

移除的元素

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u；
- 对可用性产生负面影响的元素：frame，frameset，noframes；

支持HTML5新标签：

- IE8/IE7/IE6支持通过document.createElement方法产生的标签，
- 可以利用这一特性让这些浏览器支持HTML5新标签，
- 浏览器支持新标签后，还需要添加标签默认的样式：



## CSS的权重以及优先级算法

设置节点样式的方式有很多种，不同的方式它们的权重并不相同，当它们给一个节点设置同一个样式时，谁的权重高谁就生效。

`important`：无限高

`行内样式`：权重值为`1000`

`id选择器`：权重值为`100`

`类、伪类、属性选择器`：权重值为`10`

`元素、伪元素`：权重值为`1`

通配符（*）： 0

LVHA原则（:link、:visited、:hover、:actived） 设置a标签的伪类时，经常安这个顺序定义。





## link和@import的区别

- 所属关系的区别

link是html的语法，@import是css2.1的语法

- 加载顺序区别

link会在加载页面时被加载，@import的css在页面加载完才被加载

- 兼容性区别

@import是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；link标签作为 HTML 元素，不存在兼容性问题。

- link可以通过js来操作插入，@import不行





## 哪些属性可以继承？

字体相关： color、font-size、font-family、font-weight、line-height；

文本相关：text-spacing、text-align、text-indent、word-spacing；

列表相关：list-style

元素可见性:  visibility 





## CSS3新增伪类有哪些?

https://blog.csdn.net/qq_41696819/article/details/81531494



## ::before 和 :after中双冒号和单冒号有什么区别?

单冒号(:) 用于CSS3伪类

双冒号(::) 用于CSS3伪元素。 

伪元素由`双冒号`和`伪元素名称`组成。双冒号是在css3规范中引入的，用于区分伪类和伪元素。

但是伪类兼容现存样式，浏览器需要同时支持旧的伪类，比如`:first-line`、`:first-letter`、`:before`、`:after`等。 

新的伪元素不支持用单引号，但对于CSS2之前已有的伪元素，比如:before，单冒号和双冒号的写法::before作用是一样的。



## **用纯 CSS 创建一个三角形的原理是什么？**

把上、左、右三条边隐藏掉（颜色设为 transparent）

```css
 #demo {
   width:0; 
   height: 0;
   border-width: 20px;
   border-style: solid;
   border-color: transparent transparent red transparent;
}
```







## CSS隐藏元素的几种方法（至少说出三种)

- Opacity:元素本身依然占据它自己的位置并对网页的布局起作用。它也将响应用户交互;
- Visibility:与 opacity 唯一不同的是它不会响应任何用户交互。此外，元素在读屏软件中也会被隐藏;
- Display:display 设为 none 任何对该元素直接打用户交互操作都不可能生效。此外，读屏软件也不会读到元素的内容。这种方式产生的效果就像元素完全不存在;

