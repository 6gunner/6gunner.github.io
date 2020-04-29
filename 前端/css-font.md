# Web字体

> #### 先贴几张图

![企业微信截图_b01ee30a-de2f-40b1-b913-2af00239bd89](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-28-235242.png)

![企业微信截图_7bfc689d-cbf5-4f1e-ab7d-4ca2aef8dba5](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-28-235251.png)



上面的图片详细的介绍了不同的字体的区别，以及他们发展历史。可以作为一个知识储备。



## CSS的字体使用

在web项目里，经常会使用到不同的字体（主要是设计师这么设计的）

那有一些客户端（浏览器）支持这个字体，有一些又不支持（或者说浏览器默认不挟带我需要的字体）。

那么为了解决这个问题，就要通过css来加载字体，然后让浏览器去使用我的字体来渲染。

举个例子：

```css
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: normal;
  src: url("../fonts/Roboto-Medium.woff") format("woff");
}
```

上面的代码，指定了一个Roboto的字体，然后它指定了字体的路径。（其他属性待会介绍）



这样我们在写css的时候，就可以大胆的使用这个字体了。

```css
html,
body {
  font-family: "Roboto"
}
```



## 多种字体

有时候，在css里经常看到，`font-family`指定了多个字体：

```css
  body.zh-cn {
    font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", Arial, sans-serif;
  }

  body.en-us {
    font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
      Arial, sans-serif;
  }

```

这个是告诉浏览器，从左到右，依次去尝试使用这些字体。 如果某一个字体支持，那么就使用这个字体。

一般系统或者浏览器都会自动携带一些字体。比如：`Arial, sans-serif`。windows的电脑会带`Microsoft YaHei` 这样。

（还有一个要注意的是，有一些字体是不能商用的）



## 下载&使用字体

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-29-000243.png" alt="image-20200429080243098" style="zoom:33%;" />

之前在一个官网的项目里，用到了一些字体。然后这个字体默认不支持，就去下载了一些字体。

但是下载的字体有很多，一时间很懵逼。问了UI后，才知道了这些后缀有什么区别。

```
regular：默认的字体样式，正常都会用这些字体；
medium：介于regular和bold之间；
bold: 加粗的字体，在css指定font-weight:bold的时候来使用；
```

这个时候，我才明白，原来以前写css的时候。==font-weight的效果是要靠字体来实现的，一直以为是浏览器自己去渲染加粗的。诶，年轻呀。。。==

那么这么多字体，怎么去使用呢？ 这就回到了font-face的语法了.

```css
@font-face {
  font-family: "Circular Std";
  font-style: normal;
  font-weight: 900;
  src: local("Circular Std Black"),
    url("../fonts/CircularStd-Black.woff") format("woff");
}
@font-face {
  font-family: "Circular Std";
  font-style: italic;
  font-weight: 900;
  /* 这个语法是说，先用本地的字体，如果没有，那么就去下载url指定路径的字体 */
  src: local("Circular Std Black Italic"),
    url("../fonts/CircularStd-BlackItalic.woff") format("woff");
}

@font-face {
  font-family: "Noto Sans SC";
  font-style: normal;
  font-weight: 300;
  src: url("../fonts/NotoSansSC-Regular.woff") format("woff");
}
@font-face {
  font-family: "Noto Sans SC";
  font-style: bold;
  font-weight: 700;
  src: url("../fonts/NotoSansSC-Bold.woff") format("woff");
}

```

上面贴了几个不同的例子

很明显的看到：

不同的` font-style`和` font-weight`，他们对应的字体都不同。

`normal `的都是`regular`的字体，而`italic`的style会用到italic字体。

同理，`weight:700`的用的是bold的字体，而`weight:900`的用的是`black的字体`

依次类推

==所以在项目里，如果要用到斜体、加粗 这些样式，就需要去下载各个不同风格的字体了。==

