# kubernetes

https://kubernetes.io/zh/docs/concepts/





## 概念

https://www.kubernetes.org.cn/6986.html?from=singlemessage&isappinstalled=0

### 什么是容器编排系统？

假设我们有了一个编排系统，那么肯定有一些服务是用来运行这个编排系统的，剩下的机器用来运行业务容器。

我们把运行编排系统的服务器叫==master节点==，剩下的称为==worker节点==。

master节点负责管理服务器集群。

1. ==对外需要提供api接口，用来对接集群进行管理==。
2. 对内，woker节点通过api接口要，定时上报运行状态，接收管理。

master 上提供管理接口的组件称为 kube apiserver，对应的还需要两个用于和 api server 交互的客户端：

- 一个是提供给集群的运维管理员使用的，我们称为 ==kubectl==；
- 一个是提供给 worker 节点使用的，我们称为 ==kubelet==。

master对worker的管理调度组件，都是通过 kube scheduler来进行。

除此之外，master节点上，还有一个叫kube-controller-manager的控制管理器。

然后，因为master一般也是分布式的，所以需要一个etcd进行分布式存储。



![architecture](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-005400.png)



### 概述

综上我们可以知道，k8s大致包含有以下组件

- Master 组件：kube-apiserver、kube-scheduler、etcd、kube-controller-manager；
- Node 组件：kubelet、kube-proxy；
- 插件：DNS、用户界面 Web UI、容器资源监控、集群日志。

他们的关系如下：

![4.png](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-010707.png)



## 搭建环境

### 选择正确的解决方案

如果你只是想试一试Kubernetes，我们==推荐基于Docker的本地方案==。

基于Docker的本地方案是众多能够完成快速搭建的本地集群方案中的一种，但是局限于单台机器。



当你准备好扩展到多台机器和更高可用性时，托管解决方案是最容易搭建和维护的。

全套云端方案 只需要少数几个命令就可以在更多的云服务提供商搭建Kubernetes。

定制方案 需要花费更多的精力，但是覆盖了从零开始搭建Kubernetes集群的通用建议到分步骤的细节指引。



### 1.minikube 

> https://github.com/kubernetes/minikube

Minikube 是一种可以让您在本地轻松运行 Kubernetes 的工具。Minikube 在笔记本电脑上的虚拟机（VM）中运行单节点 Kubernetes 集群，供那些希望尝试 Kubernetes 或进行日常开发的用户使用。



首先需要在mac 安装[minikube](https://github.com/kubernetes/minikube)

```shell
brew install minikube
```

然后安装[kubectl](https://github.com/kubernetes/kubernetes)

kubectl是本地的cli命令，可以检查集群资源；创建，删除和更新组件。

```
 brew install kubectl
```

启动minikube

`minukube start`

不过上面的命令，国内安装基本上都会失败

```shell
minikube start \
--vm-driver=virtualbox \
--image-mirror-country=cn \
--registry-mirror='https://alzgoonw.mirror.aliyuncs.com' \
--image-repository='registry.cn-hangzhou.aliyuncs.com/google_containers' \
```

这个命令创建一个名为 `minikube` 的 [kubectl 上下文](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-)。 此上下文包含与 Minikube 集群通信的配置。

Minikube 会自动将此上下文设置为默认值，也可以运行：

```
kubectl config use-context minikube
```



要访问 [Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)，请在启动 Minikube 后在 shell 中运行此命令以获取地址：

```shell
minikube dashboard
```

可以看到k8s的控制界面

http://127.0.0.1:59860/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/overview?namespace=default



kubectl连k8s的控制台，需要配置一个context。

查看

```shell
kubectl config view # 查看kubeconfig 配置
kubectl cluster-info # 看当前k8s集群的情况
```

```shell
minikube ssh # 连接到一个kube上
```



## POD

pod是k8s里最小的单位，他用来运行容器。

一般通过yml文件对pod进行创建、删除操作。命令如下：

```shell
# 通过pod.json文件中指定的资源类型和名称删除一个pod
$ kubectl create -f ./pod.yml
$ kubectl delete -f ./pod.yml
```

### Eg.实际案例

我们通过yml文件创建并且启动一个nginx pod

1.创建一个`pod-nginx.yml `

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```
2.验证pod创建成功

```shell
$ kubectl cversion #先确认kubectl连接上了
$ kubectl create -f pod-nginx.yml # 根据yml文件创建pod
$ kubectl get pods -o wide # 查看pod详细信息
```

![image-20200327201551379](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-121551.png)

3.如果需要进入一个pod里，运行 `--it`命令

```shell
$ kubectl exec -it nginx sh # 可以进入某一个pod的容器里
```



#### **思考：如何让外界去访问这个pod的nginx服务？**

方案1：可以将nginx服务映射到minikube机器的ip上

通过port-forward命令，将本地端口映射到pod端口上

```js
Examples:
  # Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod
  kubectl port-forward pod/mypod 5000 6000

  # Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the
deployment
  kubectl port-forward deployment/mydeployment 5000 6000

  # Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the service
  kubectl port-forward service/myservice 5000 6000

  # Listen on port 8888 locally, forwarding to 5000 in the pod
  kubectl port-forward pod/mypod 8888:5000

  # Listen on port 8888 on all addresses, forwarding to 5000 in the pod
  kubectl port-forward --address 0.0.0.0 pod/mypod 8888:5000

  # Listen on port 8888 on localhost and selected IP, forwarding to 5000 in the pod
  kubectl port-forward --address localhost,10.19.21.23 pod/mypod 8888:5000

  # Listen on a random port locally, forwarding to 5000 in the pod
  kubectl port-forward pod/mypod :5000
```



## Node

什么是node？



## Resource

### ReplicationController

ReplicationController 类似于进程管理器，但是 ReplicationController 不是监控单个节点上的单个进程，而是监控跨多个节点的多个 pod。



#### yml格式

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3 #指定同时运行多少个pod
  selector: #标签选择器，管理所有与之匹配的pod
    app: nginx
  template: #必须字段
    metadata:
      name: nginx
      labels: #必须和.spec.selector相同，否则被api拒绝。
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```



#### 创建rc

```shell
kubectl create -f replication.yml
```



#### 扩容缩容

通过简单地更新 `replicas` 字段，ReplicationController 可以方便地横向扩容或缩容副本的数量，或手动或通过自动缩放控制代理

```shell
kubectl scale --replicas=1 rc/nginx
```

这样可以手动把nginx 缩放到1个pod

![image-20200329095054336](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-29-015054.png)



#### **删除rc以及对应的pod**

要删除一个 ReplicationController 以及它的 Pod，使用 [`kubectl delete`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete)。 kubectl 将 ReplicationController 缩放为 0 并等待以便在删除 ReplicationController 本身之前删除每个 Pod。 

```
kubectl delete -f replication.yml
```

总结一下，步骤为：

1.缩放副本为 0、 

2.等待 Pod 删除，之后删除 ReplicationController 资源



### ReplicaSet

ReplicaSet是replication controller的升级版。

*`Replication Controller`*只支持基于等式的selector（env=dev或environment!=qa），但ReplicaSet还支持基于集合的selector。比如：version in (v1.0, v2.0)或 env notin (dev, qa)

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
    matchExpressions: # 表达式
      - {key: tier, operator: In, values: [frontend]}
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
        ports:
        - containerPort: 80

```
创建rs后，我们看一下rs的信息：

![image-20200329140643726](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-29-060644.png)





## Deployment

提供一个声明式的更新

可以声明需要更新的版本

### 创建管理deployment

1.定义一个yml文件

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector: # 通过selector声明pods
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

2.创建deployment

```shell
$ kubectl create -f ./deployment_nginx.yml
```

3.查看deployment

```shell
$ kubectl get deployment -o wide
```

![image-20200328073517412](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-233517.png)

4.查看replicaSet 和 pods

所以创建deployment的时候，也会创建rs资源。

![image-20200328073609314](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-233610.png)

5.通过deployment来更新image

```shell
$ kubectl set image deployment nginx-deployment nginx=nginx:1.13
```

等待一会儿，就可以看到，deployment被更新了

![image-20200328074254196](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-234255.png)



6.如果需要回滚，或者查看历史。

通过rollout undo、rollout history来进行操作

```shell
$ kubectl rollout undo deployment nginx-deployment
$ kubectl rollout history deployment nginx-deployment
```

![image-20200328074558262](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-234558.png)



## ExternalName

```
kubectl create svc externalname -n test-bhop prerender --external-name prerender.broker.svc.cluster.local
```



## 命名空间

```
kubectl get namespace
```



# 其他待了解

## Nginx Ingress 教程



# 常用东西

## 查看网页界面

### 安装Dashboard UI



### 命令行代理

您可以使用 kubectl 命令行工具访问 Dashboard，命令如下：

```
kubectl proxy
```

这个命令可以让本地通过[这个地址](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/ )来访问

如果命名空间错误的话，

![image-20200423171043037](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-23-091043.png)

查看一下k8s上面的dashboard的服务名称，然后替换掉。







## 切换k8s的上下文

如果有多个k8s环境可以连接的话，可以通过切换context的方式，来指定连接到某个context上。

```shell
$ kubectl config current-context  # 展示当前所处的上下文
$ kubectl config get-contexts # 显示一个或多个contexts
$ kubectl config use-context # 切换上下文
```

![image-20200328075902219](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-27-235902.png)





## Node

查看当前context下的node

```shell
$ kubectl get node
```

![image-20200328080044652](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-000045.png)





## Service

第一种方式：通过expose命令

将pod expose为一个service, 类型为NodePort

```shell
$ kubectl expose pods nginx-pod --type=NodePort
```

![image-20200328103332201](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-023332.png)

可以通过32685这个端口去访问pod的服务



第二种：通过yml文件去创建

```yml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  ports:
  - port: 80
    nodePort: 8080
    targetPort: 80 # 也可以指定pod的port name: 比如nginx-port
    protocol: TCP
  selector:
    app: nginx
  type: NodePort
```



![image-20200328103829227](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-023829.png)





## Labels

k8s里几乎所有资源都可以设置label，做个试验

先创建一个pods

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-pod
    image: nginx
    ports:
    - containerPort: 80
```

expose service

![image-20200328092121258](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-012122.png)

> --type=:   ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.

通过ip + 端口 可以访问

![image-20200328092419233](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-012419.png)



显示node的labels

```
$ kubectl get node --show-labels
```



设置node的labels

```shell
$ kubectl label node ${node_name} key=value # 设置node的label
```



显示pods的labels

![image-20200328093042661](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-28-013043.png)





