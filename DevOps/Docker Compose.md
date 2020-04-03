# Docker Compose 多容器部署

主要用来本地开发的工具

docker 批处理



yml文件

docker-compose.yml 默认文件名



三大概念

services

1个service代表1个container。可以是docker hub pull的image，也可以是本地build的

可以指定volumes和networks



Networks

Volumes



## 安装Docker Compose

Mac和Windows不需要单独安装

Linux安装教程：https://docs.docker.com/compose/install

```shell
$ docker-compose --version
docker-compose version 1.24.1, build 4667896b
```



## 基本命令

> 创建启动

`docker-compose up` 默认去找`docker-compose.yml`

指定yml文件：`docker-compose up -f 文件路径` 

`-d`: 守护进程



> 列出所有的container

`docker-compose ps`

![image-20200324185223400](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-105223.png)

这个和`docker ps`的命令效果一致

![image-20200324183653037](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-103653.png)



> 开始container

`docker-compose start`



> 执行单个的

`docker-compose exec xxx bash`



> 停止container

`docker-compose stop`



> 停止并且删除container

`docker-compose down --volumes`

带上`--volumes`，可以一起删除volume

```
docker-compose down
Stopping compose_web_1   ... done
Stopping compose_redis_1 ... done
Removing compose_web_1   ... done
Removing compose_redis_1 ... done
Removing network compose_default
```



### Compose实例1 - flask-redis

docker-compose.yml

```yml
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    environment:
      FLASK_ENV: development
  redis:
    image: "redis:alpine"
```



运行

```
docker-compose up -d
```



## Scale

使用--scale可以实现水平扩展container，实现简单的负载均衡服务。

```
docker-compose up -d --scale web=3 
```

**负载均衡的实现**

`haproxy`





## build

`docker-compose build` 

可以用来单独进行编译，

up命令是先编译，再执行。



## 常见问题

碰到下载pipe很慢

可以在dockerfile里配置一下镜像

`RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories`



## 总结

docker-compose可以通过一个yml文件，来配置多个image，以及对应的关系。

通过程序来实现一个环境的配置，简化手动配置。