最常见的 Web 类示例之一: TodoList = Todo list + Add todo button



### 图解一: React 表示法

App组件下面有2个组件`ToDoList`和`AddToDoBtn`。 `TodoList`由多个`ToDo单项组成。

所有的todo items维护在App组件里，通过props传递给子组件

![img](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-01-121748.png)



### 图解二: Redux 表示法

React 组件只负责页面渲染, 而不负责页面逻辑。页面逻辑可以从中单独抽取出来, 变成 store。

![image-20200301202340778](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-01-122341.png)





### 图解三: 加入 Saga

![image-20200301202541156](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-01-122541.png)



### 图解四: Dva 表示法

![image-20200301202901014](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-01-122901.png)