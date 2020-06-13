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

默认情况下，==主线程和子线程之间的数据是复制关系==，两个线程之间的消息是不互相影响的。

但是针对于大文件，进行数据拷贝会影响性能。所以js允许主线程将数据直接转移给子线程，一旦转移，主线程就无法使用这些二进制文件了，为了防止多线程同时修改数据造成冲突。

如果要直接转移数据的控制权，就要使用下面的写法。

 ```javascript
 // Transferable Objects 格式
 worker.postMessage(arrayBuffer, [arrayBuffer]);
 
 // 例子
 var ab = new ArrayBuffer(1);
 worker.postMessage(ab, [ab]);
 ```



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

***index.vue***

```js
import Worker from 'worker-loader!./worker.js';

  export default {
    data() {
      return {

      }
    },
    mounted() {
      const worker = new Worker();
      this.worker = worker;
      worker.onmessage = function (e) {
        console.log(e.data);
      }

      // demo1 发送二进制
      const uInt8Array = new Uint8Array(new ArrayBuffer(10));
      for (let i = 0; i < uInt8Array.length; ++i) {
        uInt8Array[i] = i * 2; // [0, 2, 4, 6, 8,...]
      }
      worker.postMessage(uInt8Array);

      // demo2 转移arrayBuffer的拥有权
      const arrayBuffer = new ArrayBuffer(8);
      console.log("Index.vue 转移前" + arrayBuffer.byteLength);
      worker.postMessage(arrayBuffer, [arrayBuffer]);
      console.log("Index.vue 转移后" + arrayBuffer.byteLength);

      // demo3
      const message = "普通message";
      worker.postMessage(message);

    },
    beforeDestroy() {
      this.worker.terminate();
    }
  }

```

***Webworker.js***

```js
// Worker 线程
let cache;
/**
 *
 * @param o1 new
 * @param o2 old
 */
function compare(o1, o2) {
  if(JSON.stringify(o1) != JSON.stringify(o2)) {
    return false;
  }
  // todo，更深的比较
  return true;
};

setInterval(function () {
  fetch('/api/quote/v1/rates?tokens=BTC,USDT,BUSDT&legalCoins=BTC,USDT,CNY,USD').then(function (res) {
    return res.json();
  }).then(({ data }) => {
    if (!compare(data, cache)) {
      cache = data;
      self.postMessage(data);
    }
  })
}, 5000);

self.addEventListener('message', event => {
  console.log(event.data);
  if (event.data.constructor == ArrayBuffer) {
    const data = event.data;
    console.log("webworker 转移前" + data.byteLength);
    self.postMessage(data);
    console.log("webworker 正常发送后" + data.byteLength);
    self.postMessage(data, [data]);
    console.log("webworker 转移所有权后" + data.byteLength);
  }
})

```





