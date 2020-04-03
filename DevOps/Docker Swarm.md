# 容器编排 Swarm

之前的都是本地docker-cli去连接1台docker服务

但是生产环境一般都是很多的容器，需要在集群里去部署

怎么去管理容器？

怎么水平扩展

怎么自动恢复容器

怎么去更新容器

怎么监控容器

调度容器

保护隐私数据



## Swarm架构

主从模式

manager 主节点 用来管理子节点

worker 子节点用来部署service



manager的服务创建调度流程

swarm manager接收api命令

循环创建service的任务

为任务分配ip地址

将任务分配给子节点

调度一个worker去执行任务



调度之前，我们并不知道哪些子节点会用来部署service，而是由manager自动分配子节点的。



![img](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-233715.png)

## Service

一个service是一个container

相关命令



> 创建service

`docker service create --name ${name} ${image_name} `

![image-20200325220130874](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-25-140131.png)



> Replicas



# 创建docker manager 和 worker

**1.通过docker-machine创建3台装了docker的虚拟机.**

`docker-machine create swarm-manager`

`docker-machine create swarm-worker1`

`docker-machine create swarm-worker2`



**2.创建manager节点**

**`docker swarm init --advertise-addr manager地址`**

```shell
$ docker swarm init --advertise-addr 192.168.99.102
Swarm initialized: current node (um80rij7oxdf0aah5w3rxqwui) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0070gxx0qgp7x8464wazp072naygyszoebrqndbpx06r3xpcuh-bg1t8dcc5zidwxtwd9ofsrk63 192.168.99.102:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

在子节点上，去执行`docker swarm join`的命令;



3.**查看swarm的状态**

![image-20200324215100372](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-135100.png)



**4.查看集群信息**

进入管理节点，执行：docker info 可以查看当前集群的信息。

```shell
$ docker info
```

![image-20200325074004340](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-234004.png)

可以知道当前运行的集群中，有三个节点，其中有一个是管理节点。



5.**部署服务到集群里**

任何和集群相关的操作，都是在manager节点上进行

`docker service  create --replicas 1 --name helloworld alpine ping docker.com`

6.**查看服务**

![image-20200325074715238](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-234715.png)

7.**水平扩展services**

![image-20200325075000990](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-235001.png)

8.删除服务

![image-20200325075215363](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-235215.png)



9.更新服务

```shell
docker service create --replicas 1 --name redis redis:3.0.6
docker service update --image redis:3.0.7 redis
```

![image-20200325075755485](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-24-235756.png)

10.更新节点状态

```shell
$ docker node ls  # 查看所有节点
$ docker node update --avaliability drain swarm-worker1
$ docker node update --availability active swarm-worker1
```



## 实例应用

利用swarm搭建word press



1.创建network

```shell
$ docker network create -d overlay demo 
$ docker network ls
```



2.创建mysql服务

```shell
$ docker service create --name mysql --env MYSQL_ROOT_PASSWORD=root --env MYSQL_DATABASE=wordpress --network demo --mount type=volume,source=mysql-data,destination=/var/lib/mysql mysql
```



3.创建wordpress

```shell
$ docker service create --name wordpress -p 80:80 -e WORDPRESS_DB_HOST=mysql -e WORDPRESS_DB_PASSWORD=root --network demo wordpress
```



# Routing Mesh

- Internal 

Container之间的访问，通过overlay网络进行访问。 service之间的ping，返回的是vip.

Vitural IP

swarm会给service分配虚拟ip，因为会横线扩展，ip是不断变化的。所以ping service都是虚拟ip。

Nslookup tasks.whoami 可以查看真实的ip地址

