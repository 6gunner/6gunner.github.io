Docker学习

## Docker能干嘛？

- 简化配置
- 流水线式生产

![image-20190531075507077](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-80922.jpg)

## Docker技术概述

**传统部署**：所有的系统集成在一起



**虚拟化技术**：将每一个程序单独部署在一个vm虚拟器里

<img src="http://ww1.sinaimg.cn/large/006tNc79ly1g3k67q707lj30g20codjd.jpg" width="450px" title="虚拟化技术"/> 

**技术对比**

|          | 传统物理机部署 | 虚拟化技术 |      |
| -------- | -------------- | ---------- | ---- |
| 对比缺点 | 部署慢         |            |      |
|          | 成本高         |            |      |
|          | 迁移慢，难扩展 |            |      |
|          | 资源浪费       |            |      |
|          | 会被限定       |            |      |





## Docker安装

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

![image-20190601074918779](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080923.jpg)



### 在mac上装Docker

本地安装docker有几种方式：

- 直接安装，缺点是容易有一堆image，不好删除；
- ~~通过Vmware虚拟化直接来装，缺点是OS太大，而且不免费~~
- 通过Vagrant + VirtualBox装虚拟机，然后安装docker ==(推荐)==
- 通过docker-machine来快速搭建(精简linux系统)



学习的时候，我用的就是通过vagrant来安装的，免得镜像一大堆

安装教程：参考官网的教程进行安装

[centos上安装docker](https://docs.docker.com/install/linux/docker-ce/centos/)



项目里面因为也要用到docker命令，所以我就安装了一个docker toolbox



### 在云上安装Docker 

现在很多云服务商都提供了docker的云服务

- AWS的ECS服务
- Aliyun的Container Service

#### 安装方式

- 本地安装docker-machine

  

- 在阿里云创建docker-machine

  1.安装driver https://github.com/AliyunContainerService/docker-machine-driver-aliyunecs

  2.设置环境变量 docker-machine-driver-aliyunecs.darwin-amd64 => docker-machine-driver-aliyunecs

  3.确认driver是否安装成功

  ```shell
  docker-machine create -d aliyunecs --help
  ```

  4.创建阿里云的docker-machin ，指明accessKey和secertKey

  ```shell
  docker-machine create -d aliyunecs --aliyunecs-io-optimized	optimized --aliyunecs-instance-type	ecs.g5.large --aliyunecs-access-key-id ${access-key} --aliyunecs-access-key-secret ${access-key-secret} --aliyunecs-region cn-qingdao coda-demo
  ```

  5.想要连接docker-machine，可以用下面的命令

  ```shell
  docker-machine env xxx // 查看docker-machine的配置
  eval $(docker-machine env xxx) // 连接远程docker-machine
  docker-machine unset
  ```

  当然，也可以通过下面命令手动创建一个docker-machine

  ```
  docker-machine create xxx
  ```

  

### Docker架构

![image-20190531215056494](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080924.jpg)

> 底层技术支持：
>
> - namespace：做空间隔离
> - control groups：做资源限制
> - union file systems: 用来将Contaienr 和 Image分层



#### Docker Image (Docker镜像)

首先掌握两个概念：

> bootfs：内核空间
>
> rootfs：用户空间

##### 什么是Base Image？

Image是文件和meta data的集合(root fs)

Image本身是read-only的

image中只存一个可执行文件, 执行这个文件，就会创建一个container



<img src="http://ww1.sinaimg.cn/large/006tNc79ly1g3kujbr7avj30yy0imdou.jpg" width="400px"/>



##### Docker Image的获取

- 通过Dockerfile来build，创建一个Base Image

- 从Docker Hub的Registry中拉取Base Image

  ```sh
  # 拉取 hello world
  [vagrant@docker-host ~]$ docker pull hello-world
  [vagrant@docker-host ~]$ docker run hello-world
  ```

  

##### 创建Docker Image (DEMO)

```shell
#1. 创建一个简单的可执行文件，如c语言的执行文件
[vagrant@docker-host hello-gpp]$ ls
hello  hello.c
#2. 创建自己的Dockerfile
FROM scratch
ADD hello /
CMD ["/hello"]
#3. 从当前目录build docker
[vagrant@docker-host hello-gpp]$ docker build -t coda/hello-gpp .
```



#### Docker Container (容器)

##### 什么是Docker Container

contaienr通过Image来创建

container是在image层上建立的一个, image是只读的，container是可写的

container和image的关系就类似于面向对象编程中的class和实例的关系；image是class，contaienr是实例；

Image负责app的存储和分发；Contaienr负责运行app；

![image-20190602103452930](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080916.jpg)

##### 怎么创建Docker Container

- 最简单的方式：直接run image

  ```sh
  [vagrant@docker-host hello-gpp]$ docker run coda/hello-gpp
  ```

- 创建可交互式的container

  ```
  [vagrant@docker-host hello-gpp]$ docker run -it centos
  ```



##### Docker Container的关键命令

```sh
docker ps 
docker exec -it // 可交互式的进入到容器中
docker logs
docker stop/start
docker inspect
```



#### Docker 的相关命令

```sh
# 查看docker中所有contaienr
[vagrant@docker-host hello-gpp]$ docker container ls -a 

# 查看所有docker images
[vagrant@docker-host ~]$ docker images 

# 删除contaienr
[vagrant@docker-host ~]$ docker container ls -aq # 列出所有container的id
[vagrant@docker-host ~]$ docker rm $(docker container ls -aq)  #删除所有的container

```

#### 如何根据base image来创建自己的image

##### 方法1：commit新的base image

> 不要使用这种方式，不好管理

```sh
[vagrant@docker-host ~]$ docker commit agitated_panini coda/centos-vim # agitated_panini是container的名称
```

##### 方法2：通过Dockerfile来创建base image

```dockerfile
FROM centos
RUN yum install -y vim
```

**推荐：尽量用dockerfile来build，避免安全问题**

#### Dockerfile语法

- FROM

  ```dockerfile
  FROM scratch # 重头制作base image
  FROM centos # 使用centos来制作base image
  ```

- LABEL

  ```docker
  LABEL maintainer="gunner6@163.com"
  LABEL version="1.0"
  LABEL description="xxx"
  ```

- RUN

  ```dockerfile
  # 每一次run都会分层，所以尽量合并, \可以换行
  RUN yum update && yum install -y vim \
  python-dev
  ```

- WORKDIR 

  ```dockerfile
  # 尽量用绝对目录
  WORKDIR /root # 改变当前目录,进入到root中
  
  WORKDIR /test # 如果没有test目录，会自动创建test目录
  WORKDIR demo 
  RUN PWD # 输出/test/demo
  
  ```

- ADD  or COPY

  ```dockerfile
  ADD hello / # 把hello这个文件添加到更目录下面
  ADD test.tar.gz / # 把test这个添加到更目录下面并且解压
  
  WORKDIR /root # 切换当前目录
  ADD hello test/  # 将hello添加到/root/test/hello
  
  # 一般，考虑COPY优先于ADD使用
  WORKDIR /root
  COPY hello test  # /root/test/hello
  ```

- ENV

  ```dockerfile
  # 尽量用env来增加常亮可维护性
  ENV MYSQL_VERSION 5.6 # 设置常量
  RUN apt-get install -y mysql-server="${MYSQL_VERSION}" \
  ```

- RUN & CMD & ENTRYPOINT

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

#### 发布自己的docker image

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

#### 搭建私有的docker hub

```sh
#1. 拉取registry 
docker pull registry
#2. 运行dokcer hub 
$ docker run -d -p 5000:5000 --restart always --name registry registry:2
#3. push image 到本地镜像
[vagrant@docker-host labs]$ docker tag gunner6/hello-gpp:latest localhost:5000/hello-gpp
[vagrant@docker-host labs]$ docker push localhost:5000/hello-gpp
```



------



## Docker网络

网络类型：

<img src="http://ww2.sinaimg.cn/large/006tNc79ly1g3s8jrcg6mj30yw0oyq9h.jpg" width=500 style="width=200px">

NAT技术：网络端口翻译。将内网的地址转换成公网地址

![image-20190607075056727](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-080919.jpg)



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