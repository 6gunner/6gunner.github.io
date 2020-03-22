# Docker学习

## Docker能干嘛？

容器里可以将应用极其依赖包一起标准化打包，可以运行在任何环境，不依赖操作系统。

以image的形式发布共享。

- 简化配置
- 流水线式生产

![image-20190531075507077](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-80922.jpg)





docker和传统虚拟化技术的区别在于：

传统的虚拟机是需要包含操作系统的，它的虚拟化是基于硬件；

而docker容器，只包含应用以及应用程序的依赖项，以独立的进程运行在操作系统的用户空间上，共享着操作系统的kernel。



## Docker技术概述

### Docker技术基础

namespace：docker基于namespace来进行隔离。

control groups：docker资源统计和隔离。

union file system:  分层镜像实现的基础



### Docker组件

docker client  向进程发送命令

docker daemon 服务进程用来接收client发送的命令

docker registry 镜像仓库



### Docker Machine VS Docker Engine

**Docker Engine**: 也就是我们所说的docker，它是一个CS模型。

包含3个部分：

- Docker Daemon — docker 的守护进程，属于C/S中的server
- Docker REST API — docker daemon向外暴露的REST 接口
- Docker CLI — docker向外暴露的命令行接口（Command Line API）

`client` 通过 `rest api` 向` server` 发送请求。

![engine](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-105519.png)



**Docker Machine**：是一个工具，用来在虚拟主机上安装Docker Engine。

可以通过`docker-machine`命令来连接、管理这些主机上的Engine

他和server之间的关系就像下图：



![machine](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-112550.png)



## Docker安装

### 在mac上装Docker

本地安装docker有几种方式：

- 直接安装，缺点是容易有一堆image，不好删除；
- ~~通过Vmware虚拟化直接来装，缺点是OS太大，而且不免费~~
- 通过Vagrant + VirtualBox装虚拟机，然后安装docker ==(推荐)==
- 通过docker-machine来快速搭建



学习的时候，因为参考着视频，所以就通过vagrant来安装的，免得镜像一大堆，到时候想删除都不好删除。

安装教程：参考官网的教程进行安装[centos上安装docker](https://docs.docker.com/install/linux/docker-ce/centos/)



后面了解到安装docker可以通过[docker toolbox](https://docs.docker.com/docker-for-mac/docker-toolbox/)的方式安装。

docker toolbox里包含了几个组成：

- *docker-cli* : 客户端命令行,目前的版本是19.03.1
-  *docker-machine* : 可以在本机启动用于Docker Engine虚拟机并管理他们
-  *docker-compose* : docker提供的编排工具，支持compose文件，这个并不常用。
- *Kitematic* : Docker的客户端GUI，官方已经废弃了。
-  *Boot2Docker ISO*: 用于创建Docker Engine虚拟机的镜像。由于包中的这个版本并不是最新的，所以创建虚拟机的时候可能会需要重新下载。
- *VirtualBox* : 虚拟机

实际上就是本地用了一下docker-machine，然后通过docker-machine去连接虚拟机的docker-engine, 或者阿里云的docker-engine。



**附**

**启动docker命令**

```shell
sudo systemctl start docker
```



**docker-machine命令**

> 创建一个docker

```
docker-machine create demo
```

会用到最新的镜像iso，如果下载失败可以用迅雷下载[最新版本](https://github.com/boot2docker/boot2docker/releases)，然后放到`/Users/keyang/.docker/machine/machines/default`目录下.



> 查看本地有哪可以连接的docker主机

```
docker-machine ls
```

![image-20200321212849799](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-21-132850.png)



> 连接、停止、删除

```shell
docker-machine ssh demo
docker-machine stop demo
docker-machine rm demo
```

![image-20200321213057626](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-21-133057.png)



> Docker 去连接 虚拟机的 docker engine

```shell
docker-machine env xxx // 查看docker-machine的配置
eval $(docker-machine env xxx) // 连接远程docker-machine
eval $(docker-machine env --unset) // 取消连接远程
```

![image-20200321213500420](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-21-133500.png)





### 在云上安装Docker 

现在很多云服务商都提供了docker的云服务，比如：

- AWS的ECS服务
- Aliyun的Container Service

> 阿里云创建

我们可以通过docker-machine去在阿里云上去创建一个docker。

1.本地安装docker-machine

2.在阿里云查看driver， https://github.com/AliyunContainerService/docker-machine-driver-aliyunecs

3.将driver重命名，并且设置到环境变量中。

` docker-machine-driver-aliyunecs.darwin-amd64 => docker-machine-driver-aliyunecs`

移动到` /usr/local/bin `目录下

4.确认driver是否安装成功

```shell
docker-machine create -d aliyunecs --help
```

5.创建阿里云的docker-machin ，指明accessKey和secertKey

```shell
docker-machine create -d aliyunecs --aliyunecs-io-optimized	optimized --aliyunecs-instance-type	ecs.g5.large --aliyunecs-access-key-id ${access-key} --aliyunecs-access-key-secret ${access-key-secret} --aliyunecs-region cn-qingdao coda-demo
```



完成以上步骤后，如果想要连接docker-machine，可以用下面的命令

```shell
docker-machine env xxx // 查看docker-machine的配置
eval $(docker-machine env xxx) // 连接远程docker-machine
eval $(docker-machine env --unset) // 取消连接远程
```



> 在AWS上安装

https://docs.docker.com/machine/examples/aws/

1.拿到access key

![image-20200321220204504](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-21-140204.png)



2.设置indentity



3.创建machine

我这边创建实例总是报错，说账户被锁住了，所以没成功。





## Docker架构



![image-20190531215056494](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080924.jpg)

#### Docker Image (Docker镜像)

**Docker Image的概念图**

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-22-003643.jpg" width="400px"/>

linux操作系统分为内核空间和用户空间。

- bootfs：内核空间

- rootfs：用户空间

操作系统是挂载在用户空间上的，他们被称为Base Image。



**Docker的Image的定义**

镜像（Image）就是一堆只读层（read-only layer）的统一视角。

什么意思？

![2.png](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-22-004424.png)

左边是一堆只读层的层叠，每一层都有一个指针指向下一层。

Docker的 `统一文件系统（union file system）`技术能够将不同的层整合成一个文件系统，为这些层提供了一个统一的视角，隐藏了多层的存在。在用户的角度看来，只存在一个文件系统。

==不同的Image可以去整合不同的layer，也可以从一个Image上去修改，生成一个新的Image。==

所以也就理解了第一张图的结构。 Image#4是在Image#2的上面，且Image#4和Image#2共享Centos Image。



Image是read-only的



##### Docker Image的获取

从Docker Hub的Registry中拉取Base Image

```sh
# 拉取 hello world
[vagrant@docker-host ~]$ docker pull hello-world
[vagrant@docker-host ~]$ docker run hello-world
```



通过Dockerfile来build，创建一个Base Image

```shell
#1. 创建一个简单的可执行文件，如c语言的执行文件
$ ls
hello  hello.c
#2. 创建自己的Dockerfile
$ touch Dockerfile
FROM scratch
ADD hello /
CMD ["/hello"]
#3. 从当前目录build docker
$ docker build -t coda/hello-gpp .
```



##### Docker Image删除

```shell
$ docker rmi hello-world
```



#### Docker Container (容器)

##### Docker Container的定义

![3.png](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-22-005115.png)

container和image的定义一模一样，只不过container在image的基础上，多了一层可读写的layer。

contaienr通过Image来创建。

container和image的关系就类似于面向对象编程中的class和实例的关系；image是class，contaienr是实例；

Image负责app的存储和分发；Contaienr负责运行app；

![image-20190602103452930](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080916.jpg)

##### 创建Docker Container

- 最简单的方式：直接run image

  ```sh
  [vagrant@docker-host hello-gpp]$ docker run coda/hello-gpp
  ```

- 创建可交互式的container

  ```
  [vagrant@docker-host hello-gpp]$ docker run -it centos
  ```



##### 相关命令

```sh
docker ps # 查看docker中所有contaienr
docker exec -it ${cotainerid} /bin/bash # 可交互式的进入到容器中
docker logs
docker stop/start 
docker inspect # 查看container信息
```



```sh
# 查看docker中所有contaienr
$ docker container ls -a 
$ docker ps # 作用一样

# 查看所有docker images
$ docker images 

# 删除contaienr
$ docker container ls -aq # 列出所有container的id
$ docker stop $(docker container ls -aq)  #停止所有的container
$ docker rm $(docker container ls -aq)  #删除所有的container
```



##### 运行一个nginx

1.创建一个dokcerfile

```dockerfile
FROM nginx
COPY dist/* /home/docker/static-htmls/
copy static.conf /etc/nginx/conf.d
expose 8080
```

2.build image

```shell
$ docker build -t docker-nginx .
```

3.创建一个container

因为是在虚拟机上运行的，所以还要 映射`宿主端口`和`容器端口`: `-p <宿主端口>:<容器端口>`

```shell
$ docker run -d -p 8080:8080 docker-nginx # 容器端口是后面的8080，我们是访问的宿主端口是安装docker的机器端口
```

4.看一下container运行的情况

`$ docker ps`

![image-20200322101133883](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-22-021134.png)

5.访问宿主的host+端口

http://192.168.99.100:8080/#





## 维护自己的Image

方法1：commit新的base image

> 不要使用这种方式，不好管理

```sh
[vagrant@docker-host ~]$ docker commit agitated_panini coda/centos-vim # agitated_panini是container的名称
```



方法2：通过Dockerfile来创建base image

```dockerfile
FROM centos
RUN yum install -y vim
```

**==推荐：尽量用dockerfile来build，避免安全问题==**



### Dockerfile语法

> FROM

指定base image以及版本号，==尽量用官方的==

```dockerfile
FROM scratch # 重头制作base image (hello world image)
FROM centos # 在centos基础上来制作base image
FROM ubuntu:14.04
```

> LABEL

用来定义image的meta data信息

```dockerfile
LABEL maintainer="gunner6@163.com" # 作者
LABEL version="1.0" # 版本
LABEL description="xxx" # 描述信息
```

> RUN

执行命令

需要注意一点，run每执行一次，都会进行分层。所以尽量合并成一条语句。

```dockerfile
RUN yum update && yum install -y vim python-dev
RUN apt-get update && apt-get install -y perl \
	pwgen --no-install-recommennds && \
	rm -rf /var/lib/apt/lists/* # 如果命令太长，不好阅读，可以通过\换行，美化代码
```

> WORKDIR 

设定当前工作目录

==使用WORKDIR，不用RUN cd==

==尽量用绝对目录==

```dockerfile
WORKDIR /root # 绝对目录 改变当前目录,进入到root中

WORKDIR /test # 如果没有test目录，会自动创建test目录
WORKDIR demo  # 相对目录
RUN PWD # 输出/test/demo

```

> ADD or COPY

ADD 不仅可以添加文件到根目录，还==可以自动进行解压==

==优先考虑使用COPY==

添加远程文件/目录，用curl或者wget

```dockerfile
ADD hello / # 把hello这个文件添加到更目录下面
ADD test.tar.gz / # 把test.tar.gz这个添加到更目录下面并且解压

WORKDIR /root # 切换当前目录
ADD hello test/  # 将hello添加到/root/test/hello

WORKDIR /root
COPY hello test/  # /root/test/hello
```

> ENV

```dockerfile
# 尽量用env来增加常亮可维护性
ENV MYSQL_VERSION 5.6 # 设置常量
RUN apt-get install -y mysql-server="${MYSQL_VERSION}" \
```

> RUN & CMD & ENTRYPOINT

```shell
#RUN 用来执行命令，并且创建新的Image	Layer
#CMD 设置容器启动后默认执行的命令和参数
#ENTRYPOINT 设置容器启动时运行的命令
# DEMO
FROM daocloud.io/ubuntu:14.04
RUN apt-get update && apt-get install -y stress
ENTRYPOINT ["/usr/bin/stress"]
# 可以设置默认的stress的命令参数，也可以通过run的时候传入参数进来
CMD []
```

两种命令格式：Shell 格式

```dockerfile
RUN apt-get install -y vim
CMD echo "hello docker"
ENTRYPOINT echo "hello docker"
```

Exec 格式

```dockerfile
RUN ["apt-get", "install", "-y", "vim"]
CMD echo "hello docker"
ENTRYPOINT ["/bin/echo", "hello docker"]
```

CMD 和 ENTRYPOINT的区别

| 区别     | CMD                                                       | ENTRYPOINT                       |
| -------- | --------------------------------------------------------- | -------------------------------- |
| 最佳实践 |                                                           | 写一个shell脚本作为entrypoint    |
| 作用     | 设置容器启动后默认执行的命令和参数                        | 执行应用程序                     |
| 执行     | 如果docker run指定了其他命令或者参数，CMD里面命令会被忽略 | ENTRYPOINT不会被忽略, 一定会执行 |



### 发布自己的docker image

- 注册docker hub账户密码

在terminal登录docker hub账户密码

```shell
Username: gunner6
Password:
WARNING! Your password will be stored unencrypted in /home/vagrant/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

- push docker image

```sh
[vagrant@docker-host hello-gpp]$ docker push gunner6/hello-gpp:latest
The push refers to repository [docker.io/gunner6/hello-gpp]
c0d1d7ec5bba: Pushed
```

- 拉取docker image

```sh
[vagrant@docker-host hello-gpp]$ docker pull gunner6/hello-gpp
```



### 搭建私有的docker hub

```sh
#1. 拉取registry 
$ docker pull registry
#2. 运行dokcer hub 
$ docker run -d -p 5000:5000 --restart always --name registry registry:2
#3. push image 到本地镜像
$ docker tag gunner6/hello-gpp:latest localhost:5000/hello-gpp
$ docker push localhost:5000/hello-gpp
```





------



## Docker网络

### 网络基础知识

网络类型

<img src="http://ww2.sinaimg.cn/large/006tNc79ly1g3s8jrcg6mj30yw0oyq9h.jpg" width=500 style="zoom: 44%;">

**网络分层模型**

​	ISO/OSI 7层分层

​	TCP/IP 5层分层模型

​		应用层  （ftp协议、http协议）

​		传输层  （TCP协议、UDP协议）

​		IP层  （IP数据报）

​		链路 （网络接口协议）

​		物理层 （网线、光纤）

**网络路由**

​	网络中去访问服务器，是通过路由器去自动查找路径的。路由器是中间的转化器

**公有IP、私有IP**

​	公有类型

​		互联网上唯一标识

​	私有类型 （不可以在互联网上使用，只有在内部使用）

​		A类 10.0.0.0 ~ 10.255.255.255.255

​		B类 172.16.0.0 ~ 172.31.255.255

​		C类 192.168.0.0 ~ 192.168.255.255



**NAT 网络地址转化**

NAT会将私有类型的地址转换成公网地址，记录在翻译表里。等得到数据后，再将公有地址，转化为私有地址。

​	网络地址转化端口翻译。将内网的地址转换成公网地址

![image-20190607075056727](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080919.jpg)

**ping**

​	验证ip的可达性

**telnet**

​	验证服务端口的可用性





### 网络命名空间

#### Docker Network Namespace

> docker在创建容器时，会同时创建独立的network namespace。如下所示

```sh
[vagrant@docker-node1 labs]$ docker run -d --name test1 busybox /bin/sh -c "while true; do sleep 3600; done" # 启用run命令创建一个container，将其命名为test1，使用的镜像为用busybox
```

```sh
[vagrant@docker-node1 labs]$ docker exec -it 0c4129204eec /bin/sh
/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
5: eth0@if6: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
/ # 查看这个contaienr的ip地址，可以看到它被分配了一个172.17.0.2的ip地址。
```

同理，如果我们再用第一个命令，再创建一个container “test2”。docker也会创建一个network namespace。且这两个namespace可以相互连接。

那它底层的原理究竟是什么呢？我们先来做个试验：

#### Linux Network Namespace

```sh
# 1首先，使用linux的ip netns命令创建两个netns "test1"和"test2"
[vagrant@docker-node1 labs]$ sudo ip netns add test1
[vagrant@docker-node1 labs]$ sudo ip netns add test2
[vagrant@docker-node1 labs]$ sudo ip netns list
test2
test1
# 2分别查看test1和test2的netns
[vagrant@docker-node1 ~]$ sudo ip netns exec test1 ip a
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
[vagrant@docker-node1 ~]$ sudo ip netns exec test2 ip a
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 # 这个时候我们看到这两个netns的lo端口是down的，而且没有mac地址

# 3使用ip link命令将lo端口开启，但是lo的state还是unknow的
[vagrant@docker-node1 ~]$ sudo ip netns exec test1 ip link set dev lo up
[vagrant@docker-node1 ~]$ sudo ip netns exec test1 ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00

# 4 使用veth pair将两个netns连接起来
[vagrant@docker-node1 ~]$ sudo ip link add veth-test1 type veth peer name veth-test2 # 创建veth peer对
4: veth-test2@veth-test1: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 3a:21:3b:9d:43:4e brd ff:ff:ff:ff:ff:ff
5: veth-test1@veth-test2: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 56:a8:37:0c:12:34 brd ff:ff:ff:ff:ff:ff
[vagrant@docker-node1 ~]$ sudo ip link set veth-test1 netns test1 # 将veth-test1添加到test1的netns中去
[vagrant@docker-node1 ~]$ sudo ip link set veth-test2 netns test2 # 将veth-test2添加到test2的netns中去
[vagrant@docker-node1 ~]$ sudo ip netns exec test1 ip addr add 192.168.5.1/24 dev veth-test1
# 为veth-test1添加ip地址
[vagrant@docker-node1 ~]$ sudo ip netns exec test2 ip addr add 192.168.5.2/24 dev veth-test2
# 为veth-test2添加ip地址
[vagrant@docker-node1 ~]$ sudo ip netns exec test1 ip link set dev veth-test1 up # 将veth-test1端口启动起来
[vagrant@docker-node1 ~]$ sudo ip netns exec test2 ip link set dev veth-test2 up # 将veth-test2端口启动起来
# 至此，两个netns就可以相互通信了
```

<img src="http://ww1.sinaimg.cn/large/006tNc79ly1g3s9ttixmdj31jc0u07bf.jpg" width=500>

以上，docker的namespace的原理和linux的网络原理类似；

#### 两个容器是如何连接的？

先看下本地的docker的network

```
[vagrant@docker-node1 ~]$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
a1010ce919fe        bridge              bridge              local
b37c3a6633c5        host                host                local
c915a3cf2c83        none                null                local
```

我们看到一个bridge类型的网络, 通过insepct命令查看这个bridge网络

```sh
[vagrant@docker-node1 ~]$ docker network inspect a1010ce919fe
...
"Containers": {
            "fb1fd0092971f06c794ac00b3c76aa847f5d3a04ce06121df5bdecfbf94daa05": {
                "Name": "test2",
                "EndpointID": "ed20c7186ee7ea73285dbffdbf10e4d4d161773fff1c29eac621b14703f98379",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        }
...
```

思考一个问题：test2的contaienr想要连接到主机上，需要怎么去建立连接？

那根据前面linux的network namespace知识我们了解到，需要test2 contaienr的namespace中有一个veth连接到主机的namespace上。

```sh
# 先查看test2这个容器上的ip address
[vagrant@docker-node1 ~]$ docker exec -it test2 ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
7: eth0@if8: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
  
# 再来看一下本机的ip address，可以看到有一个veth39e589a@if7的端口。它其实和test2的eth0端口是一对儿。
 6: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:16:59:ba:ae brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:16ff:fe59:baae/64 scope link
       valid_lft forever preferred_lft forever
8: veth39e589a@if7: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether da:9b:ea:44:9f:44 brd ff:ff:ff:ff:ff:ff link-netnsid 2
    inet6 fe80::d89b:eaff:fe44:9f44/64 scope link
       valid_lft forever preferred_lft forever
```

我们可以通过brctl这个命令来证明！veth39e589a是docker0的一个接口，就是用来将docker0和eth0连接起来；

```sh
[vagrant@docker-node1 ~]$ brctl show
bridge name	bridge id		STP enabled	interfaces
docker0		8000.02421659baae	no		veth39e589a

# 再添加一个container，经验证，证明的确是这样的一个关系；
8: veth39e589a@if7: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP mode DEFAULT group default
    link/ether da:9b:ea:44:9f:44 brd ff:ff:ff:ff:ff:ff link-netnsid 2
12: vethb2551a2@if11: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP mode DEFAULT group default
    link/ether b6:99:79:20:6a:89 brd ff:ff:ff:ff:ff:ff link-netnsid 3
[vagrant@docker-node1 ~]$ brctl show
bridge name	bridge id		STP enabled	interfaces
docker0		8000.02421659baae	no		veth39e589a
							                    vethb2551a2
```

网络拓扑图如下：

![image-20190607211943412](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080921.jpg)

#### 单个容器怎么访问外网？

![image-20190607212112356](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080922.jpg)



#### Docker Network Link (作了解)

> 在创建后台服务时，经常我们会碰到在代码里面配置服务器的ip地址，以实现后台服务器之间的相互通信。这个时候，一般我们事先并不知道ip地址是什么，但是我们可以通过用name的方式来连接。

```sh
# docker run --link name
[vagrant@docker-node1 ~]$ docker run -d --name test2 --link test1 busybox /bin/sh -c "while true; do sleep 3600; done"
#我们通过docker run --link的命令，创建了一个test2的容器，并且把test1 link到了test2上面，这样test2容器就可以通过test1这个名字来连通服务器了。
[vagrant@docker-node1 ~]$ docker exec -it test2 ping test1
PING test1 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.087 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.083 ms
# 注意，link是有方向性的，所以在test1的container中，是没办法用test2这个名字去ping通的

```



#### Docker Network Bridge

> **如何创建自己的network，并且将container指向这个network**

```sh
# 创建一个自己的bridge类型的network
[vagrant@docker-node1 ~]$ sudo docker network create my-bridge -d bridge 
# 查看当前network
[vagrant@docker-node1 ~]$ docker network ls
# 通过 --network参数，指定新建的container的network; -d参数表示后台执行
[vagrant@docker-node1 ~]$ docker run -d --name test3 --network my-bridge busybox /bin/sh -c "while true; do sleep 3600; done"
# 查看这个新的network，可以看到有一个test3的contaienr
[vagrant@docker-node1 ~]$ docker network inspect 958b7afe0c77
...
"Containers": {
            "a5469d704899c3ba4e514f9ecd742e1f5e118026ec90556606fe03e0e670a049": {
                "Name": "test3",
                "EndpointID": "e8fbbac97d36d7b27c97f5194e4a7b22eee85ab9c1c86629c6c1365f98d37e4a",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            }
        },
...
# 也可以看到这个network也有了一个新的interface
[vagrant@docker-node1 ~]$ brctl show
bridge name	bridge id		STP enabled	interfaces
br-958b7afe0c77		8000.0242a5447697	no		vetha835200
```

> **如何把之前的contaienr连接到新的network上？**

```sh
[vagrant@docker-node1 ~]$ docker network connect my-bridge test1 # 通过network connect命令将test1连接到my-bridge网络上
[vagrant@docker-node1 ~]$ docker exec -it test1 ip a # test1就有了两个端口
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
11: eth0@if12: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
20: eth1@if21: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:12:00:04 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.4/16 brd 172.18.255.255 scope global eth1
       valid_lft forever preferred_lft forever
       
# 很神奇的，如果两个contaienr是在同一个bridge里，那么这两个contaienr是会自动link上。也就是可以相互通过name来找到对方
[vagrant@docker-node1 ~]$ docker exec -it test1 ping test2
PING test2 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.107 ms
64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.084 ms
[vagrant@docker-node1 ~]$ docker exec -it test2 ping test1
PING test1 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.076 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.106 ms
[vagrant@docker-node1 ~]$ docker exec -it test2 ping test3
PING test3 (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.081 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.128 ms
64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.088 ms

```



#### 如何把docker container的端口映射到本地？

```sh
[vagrant@docker-node1 ~]$ docker run --name nginx -d -p 80:80 nginx #将container的80端口映射到本地的80端口
```



![image-20190609210453382](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080917.jpg)



#### Docker Host Network

没有自己独立的netns，只能共享host的。

#### Docker None Network

任何人都无法访问到这个网络



### Docker部署多容器复杂应用程序

网络结构：

![image-20190614214232085](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-80919.jpg)

#### 1. 分组件去部署

```sh
[vagrant@docker-node1 flask-redis]$ docker run -d --name redis redis
```

#### 2. 设置link、映射端口、设置环境变量

```sh
# -e 可以设置docker contaienr的环境变量
[vagrant@docker-node1 flask-redis]$ docker run -d --link redis --name flask-redis -p 5000:5000 -e REDIS_HOST=redis coda/flask-redis
```

#### 3. 多机器通信

![image-20190614214111867](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080920.jpg)



通信方案：两个服务本身是无法通信的。需要通过vxlan的方式来进行通信。将两个服务的通信包封装到各自eth0的通信包上，通信过程中进行解包，来实现通信。下图是通信包的格式：下面是underlay，上层是overlay。

![image-20190615062812381](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080918.jpg)

依赖分布式存储：etcd 

**在两台机器上建立etcd的服务**

在docker-node1上

```sh
vagrant@docker-node1:~$ sudo yum install wget
vagrant@docker-node1:~$ sudo wget https://github.com/coreos/etcd/releases/download/v3.0.12/etcd-v3.0.12-linux-amd64.tar.gz
vagrant@docker-node1:~$ sudo tar zxvf etcd-v3.0.12-linux-amd64.tar.gz
vagrant@docker-node1:~$ cd etcd-v3.0.12-linux-amd64
vagrant@docker-node1:~$ nohup ./etcd --name docker-node1 --initial-advertise-peer-urls http://192.168.205.10:2380 \
--listen-peer-urls http://192.168.205.10:2380 \
--listen-client-urls http://192.168.205.10:2379,http://127.0.0.1:2379 \
--advertise-client-urls http://192.168.205.10:2379 \
--initial-cluster-token etcd-cluster \
--initial-cluster docker-node1=http://192.168.205.10:2380,docker-node2=http://192.168.205.11:2380 \
--initial-cluster-state new&
```

在docker-node2上

```sh
vagrant@docker-node1:~$ sudo yum install wget
vagrant@docker-node2:~$ sudo wget https://github.com/coreos/etcd/releases/download/v3.0.12/etcd-v3.0.12-linux-amd64.tar.gz
vagrant@docker-node2:~$ sudo tar zxvf etcd-v3.0.12-linux-amd64.tar.gz
vagrant@docker-node2:~$ cd etcd-v3.0.12-linux-amd64/
vagrant@docker-node2:~$ nohup ./etcd --name docker-node2 --initial-advertise-peer-urls http://192.168.205.11:2380 \
--listen-peer-urls http://192.168.205.11:2380 \
--listen-client-urls http://192.168.205.11:2379,http://127.0.0.1:2379 \
--advertise-client-urls http://192.168.205.11:2379 \
--initial-cluster-token etcd-cluster \
--initial-cluster docker-node1=http://192.168.205.10:2380,docker-node2=http://192.168.205.11:2380 \
--initial-cluster-state new&
```

检查cluster状态

```
vagrant@docker-node2:~/etcd-v3.0.12-linux-amd64$ ./etcdctl cluster-health
member 21eca106efe4caee is healthy: got healthy result from http://192.168.205.10:2379
member 8614974c83d1cc6d is healthy: got healthy result from http://192.168.205.11:2379
cluster is healthy
```



重启docker服务









创建overlay的网络





## Docker持久化数据共享



### Docker持久化

为了避免container被删除，将docker的数据持久化

![image-20190614220107727](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-21-100848.jpg)

### 

#### 持久化方案

- 本地的volume。 通过-v参数来实现
- 基于plugin的volume。支持第三方存储，比如aws；

volume类型

自动创建，由docker后台创建

绑定挂载的volume，通过用户指定





## Docker Compose 多容器部署



