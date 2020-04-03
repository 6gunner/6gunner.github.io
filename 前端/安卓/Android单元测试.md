# 单元测试



> https://github.com/ChrisZou/android-unit-testing-tutorial
>
> https://blog.csdn.net/qq_17766199/article/details/78243176
>
> https://github.com/simplezhli/AndroidUT/blob/androidx/app/src/test/java/com/zl/weilu/androidut/mvp/LoginPresenterTest.java





几个基本技术：JUnit4 + Mockito + Dagger2 + Robolectric。基本来说，并没有什么黑科技，都是业界标准。

## 测试分类

```
单元测试（Junit4、Mockito、PowerMockito、Robolectric）
UI测试（Espresso、UI Automator）
压力测试（Monkey）
```

测试代码结构：

```
app/src
     ├── androidTestjava (仪器化单元测试、UI测试)
     ├── main/java (业务代码)
     └── test/java  (本地单元测试)
```



- testImplementation : adds dependency for `test` source set
- androidTestImplementation : adds dependency for `androidTest` source set



## 测试哪些东西？

1. 所有的Model、Presenter/ViewModel、Api、Utils等类的public方法
2. Bean类getter、setter、toString、hashCode等一动生成的方法除外，其他的逻辑部分需要测试。
3. 自定义View的功能：比如set data以后，text有没有显示出来等等。简单的交互，比如click事件。但是负责的交互一般不测，比如touch、滑动事件等等。
4. Activity的主要功能：比如view是不是存在、显示数据、错误信息、简单的点击事件等。比较复杂的用户交互比如onTouch，以及view的样式、位置等等可以不测。因为不好测。



### 怎么去写测试

一个类的方法可以分为两种，一种是有返回值的，另一种是没有返回值的。对于有返回值的方法，我们要测起来比较容易，就跟上面的`Calculator`例子那样，输入相应的参数，得到相应的返回值，然后验证得到的返回值跟我们预期的值一样，就好了。
但是没有返回值的方法，要怎么测试呢？比如说刚刚login的例子，点击那个按钮，会执行Activity的`login()`方法，它的定义如下：

```java
public void login() {
    String username = ...//get username from username EditText
    String password = ...//get password from password EditText
    //do other operation like validation, etc
    ...

    mUserManager.performlogin(username, password);
}
```

这个方法是void的，那么怎么验证这个方法是正确的呢？其实仔细想想，这个方法也是有输出的，它的输出就是，调用了`mUserManager`的`performLogin`方法，同时传给他两个参数。所以只要验证`mUserManager`的`performLogin`方法得到了调用，同时传给他的参数是正确的，就说明这个方法是能正常工作的。





## 测试框架

### robolectric框架

https://maxwell-nc.github.io/android/robolectricTest.html



#### 怎么在robolectric里获取context

```java
Preferences preferences = Preferences.getInstance(ApplicationProvider.getApplicationContext());
```



### PowerMock

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest(CodeUtils.class)
```



