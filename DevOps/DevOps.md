# 						DevOps实践

## 准备工作

### Vagrant安装

```shell
# 如果设置共享目录失败
vagrant plugin install vagrant-vbguest
```



## [Docker简介](./DevOps实践 - Docker)





### Docker持久化

为了避免container被删除，将docker的数据持久化

![image-20190614220107727](http://ww1.sinaimg.cn/large/006tNc79ly1g4117c8bm9j31xz0u0nhe.jpg)

### 

#### 持久化方案

- 本地的volume。 通过-v参数来实现
- 基于plugin的volume。支持第三方存储，比如aws；

volume类型

自动创建，由docker后台创建

绑定挂载的volume，通过用户指定



### Docker Compose多容器部署



### Docker Swarm 容器编排



### Docker Cloud 和 Docker企业版



### Kubernets 第三方容器编排



### 容器的运维和监控



### Docker + DevOps实战 工具&过程



##搭建一个 CI/CD 环境

Gitlab 和 gitlab-ci之间的关系

![img](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-090946.jpg)

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-20-092419.png" alt="image-20200320172419445" style="zoom:50%;" />



