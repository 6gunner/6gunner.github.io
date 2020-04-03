# Nginx配置

## 踩坑1：mac配置后403

> brew安装目录：/usr/local/Cellar/nginx/1.15.10

> 产生背景

mac配置完nginx后，明明路径都是正确的，但是还是无法打开页面，日志报403错误；

> 问题现象

```verilog
2019/12/24 21:24:34 [error] 80457#0: *1 open() "/Users/keyang/Workspace/temp/build/manifest.json" failed (13: Permission denied), client: 127.0.0.1, server: www.asproex.com
```

> 问题原因

没有权限，但是没有权限的原因有很多：

可能是nginx启动用户不对；

也可能是用户无法访问目录，需要配置权限 777；

> 问题解决

我这里解决方案就是去设置了777的目录权限（包括根目录）；

比如我访问的目录是：`/Users/keyang/Workspace/temp/build`

那么需要`drwxrwxrwx   5 keyang  staff   160B 12 24 21:56 temp`这个目录就开始配置权限；

```bash
sudo chomd 777 `/Users/keyang/Workspace/temp/build`
```



> 另一种思路

还有一种解决方案是设置user为启动用户

先查看nginx的启动用户 `ps aux | grep nginx`

![image-20200214170852232](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-14-090852.png)

然后设置nginx的配置里user对象和master一致

```diff
- #user nobody;
+ user root owner;
```





## 踩坑2：保留nginx目录

如果有多级路径的话，文件目录也要有多级；

比如我想把浏览器路径配置为：`http://xxx.domain.com/activity/ieo `

nginx配置需要是：

```nginx
location ^~ /activity/ieo {
  root /Users/keyang/Workspace/temp/build/;
  index index.html;
}

// 然后build这个目录里面还需要有子目录，最终的结构是：
/Users/keyang/Workspace/temp/build/activity/ieo
            
```



## 踩坑3：goddy ssl证书从购买到配置

公司的客户的网站证书都是从goddy上买的，然后部署到国外服务器。

由于菜的抠脚，记录以下证书的创建的过程；主要还是参考以下链接：[域名网站 SSL Nginx证书配置](https://blog.csdn.net/weixin_38109191/article/details/98479353)

步骤在博主的博客里记录的很清楚，就不再复制黏贴了。主要是几个点：

1. nginx配置需要的私钥，并不是从goddy上下载的，而是一开始通过ssl命令生成的。也就是说，ssl证书需要先在本地创建一个私钥，然后再生成一个csr文件。最后通过csr文件来生成ssl证书。
2. 创建私钥的命令有两种：

```shell
openssl req -new -newkey rsa:2048 -nodes -keyout 您的域名.key -out 您的域名.csr
```

这种可以一次性搞定；

```shell
openssl genrsa -des3 -out <name of your certificate>.key 2048
openssl req -new -key <name of your certificate>.key -out <name of your certificate>.csr
```

这种就是两步，第一步创建一个key，第二步拿上面的key创建csr；

3. 生成crt证书

```cmd
cat f84e19a2f44c6386.crt gd_bundle-g2-g1.crt >> coolexample.crt
```



## 4： resolver的含义



![image-20191231153014650](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-12-31-073015.png)

![image-20191231153141975](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-12-31-073142.png)



nginx会动态利用resolver设置的DNS服务器（本机设置的DNS服务器或/etc/hosts无效），将域名解析成IP，proxy模块会将请求转发到解析后的IP上



## 5: 文件过大413

客户端做了一个上传app包的功能，服务器上测试的时候报错了，因为nginx不允许传太大的文件。

打开nginx主配置文件nginx.conf，找到`http{}`段，添加`client_max_body_size 10M`；

client_max_body_size这个参数限制了上传文件的大小，默认是1M，我在上面的修改中给了10M的限制。