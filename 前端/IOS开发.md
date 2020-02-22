# 编译工具



## 快捷方式

```markdown
command + A 代码全选；
control + I 代码排版；
```



## POD镜像设置

新版的 CocoaPods 不允许用pod repo add直接添加master库了，需要进入目录操作：

```ruby
cd ~/.cocoapods/repos 
pod repo remove master
git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master
```

最后进入自己的工程，在自己工程的podFile第一行加上：

```
source 'https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git'
```

> 重置为官方上游

```bash
cd ~/.cocoapods/repos
pod repo remove master
git clone https://github.com/CocoaPods/Specs master

# 最后进入自己的工程，在自己工程的podFile第一行加上
sources 'https://github.com/CocoaPods/Specs'
```





# 发布APP

## 开发证书 

### 证书类型

> 开发证书

用于在设备上运行 app 以及使用 app 功能。

开发证书属于个人,在开发者帐户中，电脑名称会追加到开发证书名称后面 (例如，`Gita Kumar (Work Mac)`，其中 `Work Mac` 是电脑名称)，便于识别证书。

>分发证书

用于分发 app 以进行测试和上传到 [App Store Connect](https://help.apple.com/developer-account/#/dev6e1771f2c)。一个机构账户能创建2个。

分发证书属于团队，每个团队只能拥有一种类型的分发证书 ([Developer ID](https://help.apple.com/developer-account/#/dev84de6b2b4) 证书除外)。只有[帐户持有人](https://help.apple.com/developer-account/#/devb9535fd68)或[管理](https://help.apple.com/developer-account/#/deva73372ae0)角色可以创建分发证书。



> 创建一个证书

![image-20200222174007618](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-094008.png)

![image-20200222175621391](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-095621.png)

## 发布到fir

> 参考文章：https://fir.im/support/articles/app_publish/how-to-build-adhoc-ipa

1.添加证书

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-100002.png" alt="image-20200222180001298" style="zoom:50%;" />

2.选择iOS Distribution

![image-20200222181215956](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101216.png)

3.上传本地秘钥

![image-20200222181229494](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101229.png)

4.下载证书 & 配置profile

![image-20200222181417366](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101417.png)

![image-20200222181545272](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101545.png)



5.选择bundler appid

这里面我选择的`XC Wildcard(R8WQ7RD5NR.*)` 忘了截图了



6.选择证书 生成profile

![image-20200222181656512](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101656.png)



![image-20200222181754122](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101754.png)



![image-20200222181808852](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-22-101809.png)

7.下载profile 然后配置到xcode里

8.配置`code sign identity`



## 上架到APPStore

> 之前的笔记：https://note.youdao.com/ynoteshare1/index.html?id=41b0ebcb8c73d7b5b7c45fac65a6193e&type=note





## 基本语法

https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/DefiningClasses/DefiningClasses.html

### 文件扩展

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-21-142523.jpg" alt="image-20190618220154265" style="zoom:33%;" />

### 调用方法

```objective-c
// 普通调用方法
[object method];
// 带输入的方法
[object methodWithInput:input]

// 接收方法返回的对象
output = [object methodWithOutput];
output = [object methodWithInputAndOutput:input]
  
// 多参数方法
// 方法定义 writeToFile:atomically方法里接收2个参数：path和useAuxiliaryFile
-(BOOL)writeToFile:(NSString *)path atomically:(BOOL)useAuxiliaryFile;
// 调用方法
BOOL result = [myData writeToFile:@"/tmp/log.txt" atomically:NO];
```

对于上面的多参数方法，实际上方法名叫：`writeToFile:atomically:`



### 存储器

1.x版本

oc里所有实例的属性都默认私有。1.x版本里修改或者读取变量需要通过setter和getter方法(读取不用特意去加get前缀，比如上面代码里的`[photo caption]`

```objective-c
[photo setCaption:@"Day at the Beach"];
caption = [photo caption];
```



2.x版本

直接使用`.`语法

```objc
photo.caption = @"Day at the Beach";
output = photo.caption;
```



### 创建对象

自动释放内存

```objc
NSString* string = [NSString string];
```



手动释放内存

```objc
NSString* string = [[NSString alloc] init];
[string release];
```



### 定义Class Interface

oc里创建类需要分2步，第一步使用@interface来定义头文件(`.h`后缀)；第二步实现这个头文件。

```objc

```





