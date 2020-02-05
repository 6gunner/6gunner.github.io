# Web Worker

参考文章：http://www.ruanyifeng.com/blog/2018/07/web-worker.html



> ## 概念介绍

WebWorker为JavaScript增加了多线程能力。

现代浏览器为了利用多cpu，增加程序的处理能力，



> ## 基本用法

主线程创建一个worker

```js
const worker = new Worker('js file');
```



主线程向worker发送消息，通过调用`postMessage`方法。参数可以是任何类型的，包括二进制

```
worker.postMessage('');

worker.postMessage({
	method: 'echo',
	args: ['Work'],
});

```



主线程监听worker发送回来的消息

```js
worker.onmessage = function(event) {
	console.log(event.data);
	doSomething();
}

function doSomething() {
  // 主线程执行任务
  worker.postMessage('Work done!');
}
```



主线程关闭worker

```js
worker.terminate();
```



主线程监听worker的错误

```js
worker.onerror(function (e) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {

});
```





子worker监听消息

```js
self.addEventListener('message', e => {
  // 子线程向主线程发送消息
	self.postMessage(e.data);
}, false);

// 另一种写法
self.onmessage = function(e) {
 
}
```

self代表子worker自身；



子worker关闭自身

`self.close();`



Worker 加载脚本

> worker的使用机制就是启动一个线程来执行一段js脚本

```js
importScripts('script1.js');

// 引入多个脚本
importScripts('script1.js', 'script2.js');
```



备注：同一个 worker 内是单线程。



> ## 线程通信

主线程与子worker之间通信可以是任意格式的数据：字符串、对象、甚至二进制如ArrayBuffer、File、Blob等.

默认情况下，主线程和子线程之间的数据是复制关系，两个线程之间的消息是不互相影响的。

但是针对于大文件，进行数据拷贝会影响性能。所以js允许主线程将数据直接转移给子线程，一旦转移，主线程就无法使用这些二进制文件了，为了防止多线程同时修改数据造成冲突。



> Worker使用方式

通常情况下，worker的代码是单独分开的代码，通过Worker的构造函数进行引入。

但是如果worker的代码很简单，也可以放在html页面里，通过dom读取进来。

```vue
<script id="worker" type="app/worker">
	self.onmessage = function (e) {
    const uInt8Array = e.data;
    postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString());
    postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength);
  };
</script>

const content = new Blob([document.querySelector('#worker').textContent]);
const url = window.URL.createObjectURL(content);
const worker = new Worker(url);
```





> ## Demo

使用vue +  worker来轮询确认服务状态.

因为worker的代码需要单独存放，所以需要借助于worker-loader来帮助我们管理worker代码，否则在vue里就不太好引入。

```vue
<template>
  <div>
  </div>
</template>
<script>
  import Worker from 'worker-loader!./worker.js';

  export default {
    mounted() {
      const worker = new Worker();
      const uInt8Array = new Uint8Array(new ArrayBuffer(10));
      for (let i = 0; i < uInt8Array.length; i++) {
        uInt8Array[i] = i;
      }
      worker.postMessage(uInt8Array);
      worker.onmessage = function (e) {
        console.log(e.data);
      }
    }
  }
</script>

```







