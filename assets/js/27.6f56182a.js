(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{388:function(a,t,e){"use strict";e.r(t);var n=e(25),s=Object(n.a)({},(function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h2",{attrs:{id:"研发背景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#研发背景"}},[a._v("#")]),a._v(" 研发背景")]),a._v(" "),e("ul",[e("li",[a._v("m3u8视频格式简介\n"),e("ul",[e("li",[a._v("m3u8视频格式原理：将完整的视频拆分成多个 .ts 视频碎片，.m3u8 文件详细记录每个视频片段的地址。")]),a._v(" "),e("li",[a._v("视频播放时，会先读取 .m3u8 文件，再逐个下载播放 .ts 视频片段。")]),a._v(" "),e("li",[a._v("常用于直播业务，也常用该方法规避视频窃取的风险。加大视频窃取难度。")])])]),a._v(" "),e("li",[a._v("鉴于 m3u8 以上特点，无法简单通过视频链接下载，需使用特定下载软件。\n"),e("ul",[e("li",[a._v("但软件下载过程繁琐，试错成本高。")]),a._v(" "),e("li",[a._v("使用软件的下载情况不稳定，常出现浏览器正常播放，但软件下载速度慢，甚至无法正常下载的情况。")]),a._v(" "),e("li",[a._v("软件被编译打包，无法了解内部运行机制，不清楚里面到底发生了什么。")])])])]),a._v(" "),e("h2",{attrs:{id:"思路"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#思路"}},[a._v("#")]),a._v(" 思路")]),a._v(" "),e("h3",{attrs:{id:"解析m3u8文件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#解析m3u8文件"}},[a._v("#")]),a._v(" 解析m3u8文件")]),a._v(" "),e("h3",{attrs:{id:"合并ts视频片段"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#合并ts视频片段"}},[a._v("#")]),a._v(" 合并ts视频片段")]),a._v(" "),e("p",[a._v("采用了如下文件输入办法：")]),a._v(" "),e("blockquote",[e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("ffmpeg -i input.txt -acodec copy -vcodec copy -absf aac_adtstoasc output.mp4\n")])])])]),a._v(" "),e("p",[a._v("其中 input.txt 是一个输入配置文件，内容为需要合并的文件名称，如下：")]),a._v(" "),e("blockquote",[e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("ffconcat version 1.0\nfile 0.ts\nfile 1.ts\n")])])])]),a._v(" "),e("h2",{attrs:{id:"工具依赖"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#工具依赖"}},[a._v("#")]),a._v(" 工具依赖")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v('"ffmpeg-static": "^4.2.5",\n"fluent-ffmpeg": "^2.1.2",\n"m3u8-parser": "",\n"async": // 异步并发\n')])])]),e("p",[a._v("零碎的知识点；")]),a._v(" "),e("p",[a._v("Async.js")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("const async = require('async');\n// create a queue object with concurrency 2\nvar q = async.queue(function(task, callback) {\n\tconsole.log('hello ' + task.name);\n\tcallback();\n}, 10);\n\n// assign a callback\nq.drain(function() {\n\tconsole.log('all items have been processed');\n});\n// or await the end\n// await q.drain()\n\n// assign an error callback\nq.error(function(err, task) {\n\tconsole.error('task experienced an error');\n});\n\n// add some items to the queue\nq.push({name: 'foo'}, function(err) {\n\tconsole.log('finished processing foo');\n});\n// callback is optional\nq.push({name: 'bar'});\n\n// add some items to the queue (batch-wise)\nq.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {\n\tconsole.log('finished processing item');\n});\n\n// add some items to the front of the queue\nq.unshift({name: 'first'}, function (err) {\n\tconsole.log('finished processing bar');\n});\n\n")])])])])}),[],!1,null,null,null);t.default=s.exports}}]);