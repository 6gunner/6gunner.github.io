(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{377:function(t,r,a){"use strict";a.r(r);var e=a(25),v=Object(e.a)({},(function(){var t=this,r=t.$createElement,a=t._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"spa-单页应用-及其选型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#spa-单页应用-及其选型"}},[t._v("#")]),t._v(" SPA(单页应用)及其选型")]),t._v(" "),a("p",[t._v("SPA(Single Page Application)，单页应用，即将网站或应用的不同视图与内容都放在同一个页面内进行逻辑处理并展现的方案，使得传统内容间的切换可以无须通过页面的跳转，从而使网站或在线应用得到更快速的、类似桌面应用的用户体验。")]),t._v(" "),a("p",[t._v("SPA前：所有视图跳转需要进行页面重定向，重新加载所有静态资源并整个页面重新渲染\nSPA后：视图跳转通过js进行视图更新/动画，无须重新加载资源/只加载必要资源，页面URL通过hash或是History API的pushState进行更新")]),t._v(" "),a("h2",{attrs:{id:"需要解决的问题："}},[a("a",{staticClass:"header-anchor",attrs:{href:"#需要解决的问题："}},[t._v("#")]),t._v(" 需要解决的问题：")]),t._v(" "),a("ol",[a("li",[t._v("视图渲染与数据绑定： 页面将从传统的整个页面的传输变为只加载部分HTML片段或JSON数据，将视图与数据进行浏览器内的数据绑定。（pjax, jQuery等）")]),t._v(" "),a("li",[t._v("控制逻辑：传统的一次性的DOM逻辑处理将变为更精密的结构，通常变为由控制器（Controller）将视图（View）与模型(Model)分离的 MVC 或 MVVM 模式。（Backbone, Emberjs, Angular 等）")]),t._v(" "),a("li",[t._v("路由：所选择的视图与导航在不刷新页面时能保留页面状态、节点与数据。（History.js, director, pjax, HTML5 History API等），同时，页面URL可直接重现当前状态，使分享URL保持原有功能。")])]),t._v(" "),a("h2",{attrs:{id:"框架选型："}},[a("a",{staticClass:"header-anchor",attrs:{href:"#框架选型："}},[t._v("#")]),t._v(" 框架选型：")]),t._v(" "),a("ul",[a("li",[t._v("jQuery / zepto 配合 Backbone 或 pjax ：较为轻量且传统的开发方式，在传输量及复杂度上相对适中；")]),t._v(" "),a("li",[t._v("React / Angular / EmberJS 等较重量级框架：框架本身较为庞大但自成体系，传输量较大但框架较为成熟全面")]),t._v(" "),a("li",[t._v("Riotjs 或 其它轻量化的jQuery替代方案配合pjax或history.js：最为轻量的解决方案，gzip前框架体积可控制在较小的范围，适合考虑极端网络情况下的传输需求")]),t._v(" "),a("li",[t._v("全原生js方案：最为轻量且底层的实现方案，架构得自己进行把控，开发成本较高但可能达成最小化的传输量，比较适合极其简单的内容为主的页面")])]),t._v(" "),a("h2",{attrs:{id:"常见问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常见问题"}},[t._v("#")]),t._v(" 常见问题")]),t._v(" "),a("ul",[a("li",[t._v("视图切换及动效：需要在路由及视图加载逻辑中做相应的判断处理")]),t._v(" "),a("li",[t._v("加载优化：\n"),a("ul",[a("li",[t._v("首次加载：缩减到尽可能少的内容加速首次加载")]),t._v(" "),a("li",[t._v("延时加载：可以延迟加载的内容进行延时加载")])])]),t._v(" "),a("li",[t._v("路由间的消息机制：\n"),a("ul",[a("li",[t._v("尽可能让所有路由都能由URL信息完全无状态地加载，有些无须重新加载的数据进行缓存处理")]),t._v(" "),a("li",[t._v("实在有状态的情况，可在路由中进行直接的传参加载，修改URL时则不进行整个视图的加载")])])]),t._v(" "),a("li",[t._v("SEO\n"),a("ul",[a("li",[t._v("主体内容最好能在SERVER端直接渲染，这样搜索引擎就能直接从HTML中读取到必要的链接信息")])])])]),t._v(" "),a("h2",{attrs:{id:"backbone-router-spa-代码示例"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#backbone-router-spa-代码示例"}},[t._v("#")]),t._v(" Backbone Router SPA 代码示例")]),t._v(" "),a("p",[t._v("Backbone其自带的Router模块就是个很不错的SPA工具，可以参照以下步骤搭建起一个最简单的单页应用：")]),t._v(" "),a("ul",[a("li",[t._v("初始化整体HTML框架：示例中将所有必要的DOM都已经放在了HTML BODY中，并将除了navbar之外的所有内容隐藏")]),t._v(" "),a("li",[t._v("编写 Router 模块")]),t._v(" "),a("li",[t._v("在 DOM Ready 后初始化 Router 与 Backbone History")]),t._v(" "),a("li",[t._v("检查必要的视图跳转逻辑")])]),t._v(" "),a("p",[a("RouterLink",{attrs:{to:"/H5/examples/router.html"}},[t._v("示例页面链接")])],1),t._v(" "),a("hr"),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/watert/",target:"_blank",rel:"noopener noreferrer"}},[t._v("@watert"),a("OutboundLink")],1)])])}),[],!1,null,null,null);r.default=v.exports}}]);