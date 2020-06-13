



### credentials

在http的请求里，有一个`withCredentials`属性。它可以设置true或者false。 表示：在跨域请求的情况下，是否允许发送cookies。（同源请求下设置无效）

当设置`withCredentials`为true时，浏览器会向跨域的服务器发送cookie等验证信息。

设置withCredentials有两种方式：

1.通过``XMLHttpRequest.withCredentials`来设置

```
let xml = new XMLHttpRequest()
xhr.open('POST', 'http://example.com/', true)
xhr.withCredentials = true
xhr.send(null)
```

2.新版的api里，可以通过`credentials`来直接设置。它的值有3个：

- omit: 从不发送cookies。

- same-origin: 只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息。

  这是当前浏览器默认值, 在旧版本浏览器，例如safari 11依旧是omit，safari 12已更改

- include: 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息。

```
var myRequest = new Request('flowers.jpg', {
	credentials: 'include';
});
```



==注意：如果请求端设置了`credentials`为`include`, 服务端接受到这个请求时，也需要做对应的处理==。

- 需要在response header里设置`Access-Control-Allow-Origin:`值为request host。
- 设置`Access-Control-Allow-Credentials: true`

否则，浏览器无法处理请求。

![image-20200412080628464](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-12-000629.png)

![image-20200412082217152](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-12-002217.png)

图1是本身服务端限制了跨域接口。

图2是服务端允许``Access-Control-Allow-Origin:*`，但是因为客户端设置了`credentials`，所以浏览器还是认为不合法。