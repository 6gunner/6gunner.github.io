# Nuxt

学会服务端渲染的使用、部署流程。

2种部署方式：1种静态部署、1种server部署

服务端渲染

## nuxt命令

nuxt自带4个命令：

```
"scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate"
  },
```

`nuxt`主要是用来开启一个开发环境

`nuxt build`用来打包生产环境需要的文件，配合`nuxt start`来开启一个服务端渲染的server。

如果是部署服务器，build之后需要把一些文件拷贝到服务器上去才能运行start，这个后面会讲到。

`nuxt generate`会生成一个可以直接部署使用的静态的资源，它是不涉及服务端渲染的。可以理解为只是webpack打包。



## Nuxt部署步骤

1.`npm run build`

2.在服务器上传`.nuxt`, `express`,`static`,`nuxt.config.js`,`package.json`文件

3.在服务器执行npm install && npm run start 验证服务

4.利用pm2来跑后台守护进程