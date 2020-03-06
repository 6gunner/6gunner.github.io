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





# 从零开始

## 基本语法

https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/DefiningClasses/DefiningClasses.html

http://cocoadevcentral.com/d/learn_objectivec/

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

> 1.x版本

oc里所有实例的属性都默认私有。1.x版本里修改或者读取变量需要通过setter和getter方法(读取不用特意去加get前缀，比如上面代码里的`[photo caption]`

```objective-c
[photo setCaption:@"Day at the Beach"];
caption = [photo caption];
```



> 2.x版本

直接使用`.`语法

```objc
photo.caption = @"Day at the Beach";
output = photo.caption;
```



### 创建对象

> 自动释放内存

```objc
NSString* string1 = [NSString string];
```



> 手动释放内存

```objc
NSString* string2 = [[NSString alloc] init];
[string2 release];
```



> 初始化方法

```objc
-(id)init{
	if (self = [super init]) {
		  [self setCaption:@"Default Caption"];
      [self setPhotographer:@"Default Photographer"];
	}
}
```

> 对象回收

```objc
-(void) dealloc{
  	[caption release];
    [photographer release];
  	// 调用父类的回收方法
    [super dealloc];
}
```





### 定义Class Interface

oc里创建类需要分2步，第一步使用@interface来定义头文件(`.h`后缀)；第二步实现这个头文件。

```objc
#import <Foundation/Foundation.h>

@interface XYZPerson : NSObject

	@property NSString* firstName;
	@property NSString* lastName;
	@property NSDate* birthDate;

	- (void)sayHello;

@end
```

```objc
#import "XYZPerson.h"

@implementation XYZPerson
  
  - (void)sayHello {
      NSString* hello = [NSString stringWithFormat:@"Hello, %@ %@!",self.firstName, 			self.lastName];
      NSLog (@"%@", hello);
  }
@end
```



### property属性

oc里面的存储器可以用@property指令来代替。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-24-233952.png" alt="img" style="zoom:50%;" />



attributes有三种类型：

#### 1.Atomicity(原子性)

比较简单的一句话理解就是：是否给setter和getter加锁(是否保证setter或者getter的每次访问是完整性的)。

原子性，有atomic和nonatomic两个值可选。默认值是atomic(也就是不写的话，默认是atomic)。

- **atomic**(默认值)

使用atomic，在一定程度上可以保证线程安全，「atomic的作用只是给getter和setter加了个锁」。也就是说，有线程在访问setter，其他线程只能等待完成后才能访问。

它能保证：即使多个线程「同时」访问这个变量，atomic会让你得到一个有意义的值(valid value)。但是不能保证你获得的是哪个值（有可能是被其他线程修改过的值，也有可能是没有修改过的值）。

- **nonatomic**

而用nonatomic，则不保证你获得的是有效值，如果像上面所述，读、写两个线程同时访问变量，有可能会给出一个无意义的垃圾值。

这样对比，atomic并不能完全保证程序层面的线程安全，又有额外的性能耗费(要对getter和setter进行加锁操作);

所以，你会见到，几乎所有情况，我们都用nonatomic。

#### 2.Access(存取特性)

存取特性有**readwrite**(默认值)和**readonly**。

这个从名字看就很容易理解，定义了这个属性是「只读」，还是「读写」皆可。

如果是**readwrite**，就是告诉编译器，同时生成getter和setter。如果是**readonly**，只生成getter。

#### 3.Storage(内存管理特性)(管理对象的生命周期的)

- **strong** (默认值)

ARC新增的特性。

表明你需要引用(持有)这个对象(reference to the object)，负责保持这个对象的生命周期。

**注意，基本数据类型(非对象类型,如int, float, BOOL)，默认值并不是strong，strong只能用于对象类型。**

- **weak**

ARC新增的特性。

也会给你一个引用(reference/pointer)，指向对象。但是不会主张所有权(claim ownership)。也不会增加retain count。

如果对象A被销毁，所有指向对象A的弱引用(weak reference)(用weak修饰的属性)，都会自动设置为nil。

在delegate patterns中常用weak解决strong reference cycles(以前叫retain cycles)问题。

- **copy**

为了说明**copy**，我们先举个栗子：

我在某个类(class1)中声明两个字符串属性，一个用copy，一个不用：

```objectivec
@property (copy, nonatomic) NSString *nameCopy;

// 或者可以省略strong, 编译器默认取用strong
@property (strong, nonatomic) NSString *nameNonCopy;
```

在另一个类中，用一个NSMutableString对这两个属性赋值并打印，再修改这个NSMutableString，再打印，看看会发生什么：

```objectivec
Class1 *testClass1 = [[Class1 alloc] init];

NSMutableString *nameString = [NSMutableString stringWithFormat:@"Antony"];

// 用赋值NSMutableString给NSString赋值
testClass1.nameCopy = nameString;
testClass1.nameNonCopy = nameString;
   
NSLog(@"修改nameString前, nameCopy: %@; nameNonCopy: %@", testClass1.nameCopy, testClass1.nameNonCopy);

[nameString appendString:@".Wong"];
   
NSLog(@"修改nameString后, nameCopy: %@; nameNonCopy: %@", testClass1.nameCopy, testClass1.nameNonCopy);
```

打印结果是：

```css
修改nameString前, nameCopy: Antony; nameNonCopy: Antony
修改nameString后, nameCopy: Antony; nameNonCopy: Antony.Wong
```

我只是修改了`nameString`，为什么`testClass1.nameNonCopy`的值没改，它也跟着变了？

因为`strong`特性，对指向对象的指针进行引用计数加1，这时候，`nameString`和`testClass1.nameNonCopy`指向的其实是同一个对象(同一块内存)。`nameString`修改了值，自然影响到`testClass1.nameNonCopy`。

而`copy`这个特性，会在赋值前，复制一个对象，`testClass1.nameCopy`指向了一个新对象，这时候`nameString`怎么修改，也不关它啥事了。应用`copy`特性，系统应该是在setter中进行了如下操作：



```objectivec
- (void)setNameCopy:(NSString *)nameCopy {
    _nameCopy = [nameCopy copy];
}
```

大家了解`copy`的作用了吧，是为了防止属性被意外修改的。那什么时候要用到`copy`呢？

所有有mutable(可变)版本的属性类型，如NSString, NSArray, NSDictionary等等——他们都有可变的版本类型:NSMutableString, NSMutableArray, NSMutableDictionary。这些类型在属性赋值时，右边的值有可能是它们的可变版本。这样就会出现属性值被意外改变的可能。所以它们都应该用`copy`。

- **assign**

是非ARC时代的特性，

它的作用和**weak**类似，唯一区别是：如果对象A被销毁，所有指向这个对象A的**assign**属性并不会自动设置为nil。这时候这些属性就变成野指针，再访问这些属性，程序就会crash。

因此，在ARC下，**assign**就变成用于修饰基本数据类型(Primitive Type)，也就是非对象/非指针数据类型，如：int、BOOL、float等。

**注意，在非ARC时代，还没有strong的时候。assign是默认值。ARC下，默认值变成strong了。这个要注意一下，否则会引起困扰。**

- **retain**

**retain**是以前非ARC时代的特性，在ARC下并不常用。

它是**strong**的同义词，两者功能一致。不知道为什么还保留着。

```objc
@interface Photo: NSObject 
@property (retain) NSString* caption;
@property (retain) NSString* photographer;
@end 
```

括号里面的retain表示，setter方法应该保存输入值。

```objc
#import "Photo.h"  
@implementation Photo

@synthesize caption;
@synthesize photographer;
// 需要手动释放内存
- (void) dealloc
{
    [caption release];
    [photographer release];
    [super dealloc];
}
@end
```





### 调用nil对象方法

oc里面nil表示空对象，但是调用nil对象的方法不会报错或者异常。

```objc
- (void) dealloc
{
    self.caption = nil;
    self.photographer = nil;
    [super dealloc];
}
```



### Categories

categories是一个最有用的特色功能，他可以不用重新定义一个子类，就能重写一个类的方法（一般是增加方法）；

```objc
#import <Cocoa/Cocoa.h>
            
@interface NSString (Utilities)
- (BOOL) isURL;
@end
```

```objc
#import "NSString-Utilities.h"
            
@implementation NSString (Utilities)

- (BOOL) isURL
{
    if ( [self hasPrefix:@"http://"] )
        return YES;
    else
        return NO;
}

@end
```

```objc
NSString* string1 = @"http://pixar.com/";
NSString* string2 = @"Pixar";

if ( [string1 isURL] )
    NSLog (@"string1 is a URL");

if ( [string2 isURL] )
    NSLog (@"string2 is a URL");
```



## 构建应用界面

### 视图的生命周期



### HelloWorld页面

> 通过xib创建

AppDelegate.m代码

```objc
 // 调用UIWindow的initWithFrame方法
    // 参数是一个CGRect对象 通过[UIScreen mainScreen]对象的bounds方法获取获取
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = [[RootViewController alloc] initWithNibName:@"RootViewController" bundle:nil];
    [self.window makeKeyAndVisible];
    
```



> 通过代码构建

1.创建一个视图页面`CocoaTouchClass`

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-23-021512.png" alt="image-20200223101512042" style="zoom:50%;" />

2.在AppDelegate.m里引用controller

```objc
#import "HelloWorldViewController.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = [[HelloWorldViewController alloc] init];
    self.window.backgroundColor = [UIColor whiteColor];
    [self.window makeKeyAndVisible];
    return YES;
}
```



### frame和bounds的区别

frame指的是相对于view的parent视图

bounds指的是相对于自身的视图；

所以bounds的位置是（0，0）

```objc
- (void)viewDidLoad {
    [super viewDidLoad];
    CGRect rootScreen = [[UIScreen mainScreen] bounds];
    UIView* viewA = [[UIView alloc] init];
    viewA.backgroundColor = [UIColor grayColor];
    viewA.frame = CGRectMake(0, 0, rootScreen.size.width, 500);
    [self.view addSubview:viewA];
    
    UIView* viewB = [[UIView alloc] init];
    viewB.backgroundColor = [UIColor whiteColor];
    viewB.frame = CGRectMake(50, 100, 100, 200);
    [viewA addSubview:viewB];
    
    NSLog(@"frame_x: %.2f, frame_y: %.2f", viewB.frame.origin.x, viewB.frame.origin.y);
    
    NSLog(@"frame_w: %.2f, frame_h: %.2f", viewB.frame.size.width, viewB.frame.size.height);
    
    NSLog(@"bounds_x: %.2f, bounds_y: %.2f", viewB.bounds.origin.x, viewB.bounds.origin.y);
    
    NSLog(@"bounds_w: %.2f, bounds_h: %.2f", viewB.bounds.size.width, viewB.bounds.size.height);

}
```



```shell
2020-02-23 11:01:40.144806+0800 my-app[66443:5710889] frame_x: 50.00, frame_y: 100.00
2020-02-23 11:01:40.144934+0800 my-app[66443:5710889] frame_w: 100.00, frame_h: 200.00
2020-02-23 11:01:40.145047+0800 my-app[66443:5710889] bounds_x: 0.00, bounds_y: 0.00
2020-02-23 11:01:40.145134+0800 my-app[66443:5710889] bounds_w: 100.00, bounds_h: 200.00
```



### 绑定事件



### 控件

#### UISwitch控件

分段控制器                                                                                                                                                                                                                              



#### UINavigationController







# 框架

## MVVM vs MVC

一个典型的 iOS 是如何构建的，并从那里了解 MVVM：

![Typical Model-View-Controller setup](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-25-082522.png)

我们看到的是一个典型的 MVC 设置。Model 呈现数据，View 呈现用户界面，而 View Controller 调节它两者之间的交互。Cool！

稍微考虑一下，虽然 View 和 View Controller 是技术上不同的组件，但它们几乎总是手牵手在一起，成对的。你什么时候看到一个 View 能够与不同 View Controller 配对？或者反过来？所以，为什么不正规化它们的连接呢？

![Intermediate](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-25-082551.png)

这更准确地描述了你可能已经编写的 MVC 代码。但它并没有做太多事情来解决 iOS 应用中日益增长重量级视图控制器的问题。在典型的 MVC 应用里，*许多*逻辑被放在 View Controller 里。它们中的一些确实属于 View Controller，但更多的是所谓的“表示逻辑（presentation logic）”。

* 表示层逻辑：那些可以将Model转化为View需要呈现的样子的逻辑。例如将一个 `NSDate` 转换为一个格式化过的 `NSString`。

我们的图解里缺少某些东西，那些使我们可以把所有表示逻辑放进去的东西。我们打算将其称为 “View Model” —— 它位于 View/Controller 与 Model 之间：

![Model-View-ViewModel](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-25-082509.png)

看起好多了！这个图解准确地描述了什么是 MVVM：一个 MVC 的增强版，我们正式连接了视图和控制器，并将表示逻辑从 Controller 移出放到一个新的对象里，即 View Model。MVVM 听起来很复杂，但它本质上就是一个精心优化的 MVC 架构，而 MVC 你早已熟悉。

如我们之前所见，MVVM 基本上就是 MVC 的改进版，所以很容易就能看到它如何被整合到现有使用典型 MVC 架构的应用中。让我们看一个简单的 `Person` Model 以及相应的 View Controller：

```objc
@interface Person : NSObject

- (instancetype)initwithSalutation:(NSString *)salutation firstName:(NSString *)firstName lastName:(NSString *)lastName birthdate:(NSDate *)birthdate;

@property (nonatomic, readonly) NSString *salutation;
@property (nonatomic, readonly) NSString *firstName;
@property (nonatomic, readonly) NSString *lastName;
@property (nonatomic, readonly) NSDate *birthdate;

@end
```

Cool！现在我们假设我们有一个 `PersonViewController` ，在 `viewDidLoad` 里，只需要基于它的 `model` 属性设置一些 Label 即可。

```objc
- (void)viewDidLoad {
    [super viewDidLoad];

    if (self.model.salutation.length > 0) {
        self.nameLabel.text = [NSString stringWithFormat:@"%@ %@ %@", self.model.salutation, self.model.firstName, self.model.lastName];
    } else {
        self.nameLabel.text = [NSString stringWithFormat:@"%@ %@", self.model.firstName, self.model.lastName];
    }

    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"EEEE MMMM d, yyyy"];
    self.birthdateLabel.text = [dateFormatter stringFromDate:model.birthdate];
}
```

这全都直截了当，标准的 MVC。现在来看看我们如何用一个 View Model 来增强它。

```objc
@interface PersonViewModel : NSObject

- (instancetype)initWithPerson:(Person *)person;

@property (nonatomic, readonly) Person *person;

@property (nonatomic, readonly) NSString *nameText;
@property (nonatomic, readonly) NSString *birthdateText;

@end
```

我们的 View Model 的实现大概如下：

```objc
@implementation PersonViewModel

- (instancetype)initWithPerson:(Person *)person {
    self = [super init];
    if (!self) return nil;

    _person = person;
    if (person.salutation.length > 0) {
        _nameText = [NSString stringWithFormat:@"%@ %@ %@", self.person.salutation, self.person.firstName, self.person.lastName];
    } else {
        _nameText = [NSString stringWithFormat:@"%@ %@", self.person.firstName, self.person.lastName];
    }

    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"EEEE MMMM d, yyyy"];
    _birthdateText = [dateFormatter stringFromDate:person.birthdate];

    return self;
}

@end
```

Cool！我们已经将 `viewDidLoad` 中的表示逻辑放入我们的 View Model 里了。此时，我们新的 `viewDidLoad` 就会非常轻量：

```objc
- (void)viewDidLoad {
    [super viewDidLoad];

    self.nameLabel.text = self.viewModel.nameText;
    self.birthdateLabel.text = self.viewModel.birthdateText;
}
```

所以，如你所见，并没有对我们的 MVC 架构做太多改变。还是同样的代码，只不过移动了位置。





## MJRefresh

> https://github.com/CoderMJLee/MJRefresh

ios下拉刷新组件

### 基本用法

1.pull-to-refresh.





# Masonry

布局框架