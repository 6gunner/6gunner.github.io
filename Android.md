# 一、模拟器启动问题

## 使用Genymotion模拟器启动项目

**问题**

```shell
adb server version (32) doesn't match this client (35); killing...
error: could not install *smartsocket* listener: Address already in use
ADB server didn't ACK
* failed to start daemon *
error: cannot connect to daemon
```

**解决方法**

命令行的 adb 是用 Android SDK 自带的，而Genymotion 根本不知道 sdk 的位置。因此Genymotion 的 adb 和Android sdk 里的adb 冲突了。只要修改 Genymotion 里的 adb 为 Android SDK 的，就可以识别了。

具体去修改Genymotion的偏好设置即可



## adb 环境配置

### adb mac环境变量

```shell
# Setting Path for ADB
export ANDROID_HOME="/Users/keyang/Library/Android/sdk"
export ANDROID_HOME
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
```

### adb install

adb -s {seria number} install xxx.apk 在指定设备上安装apk



## 打包命令：

```shell
./gradlew clean assemblequickbrokerReleaseChannels
```



# 二、Gradle基础知识

## 安卓Gradle配置文件

1. ### 根目录下的build.gradle

   根目录下的build.gradle文件用于添加子工程或模块共用的配置项

   buildscript: 用来设置整个项目的classpath

   allprojects: 项目的所有子工程都会用到这个配置，

2. ### 根目录下的gradle.properties

   gradle.properties里面定义的属性是全局的，可以在各个模块的build.gradle里面直接引用.

3. ### app目录下的build.gradle

  ```groovy
  // com.android.application 这是一个application
  // com.android.library 这是一个库
  apply plugin: 'com.android.application'
  // 配置项目的各种属性
  android {
    compiledSdkVersion 28 //项目编译的sdk版本，也就是API level
    // 程序默认配置，指定应用程序包名，最小sdk版本，目标sdk版本，版本号，版本名
    defaultConfig {
      
    }
    // 指定生成安装文件的配置，常有两个子包:release,debug，
    // 注：直接运行的都是debug安装文件
    buildTypes {
      debug {
        applicationIdSuffix ".debug"
      }
      release {
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
      }
    }
    // 文件配置
    sourceSets {
      main {
        res.srcDirs = ['src/main/res', 'src/main/res-night']
      }
      quickbroker {
        java.srcDirs = ['src/quickbroker/java']
        res.srcDirs += ['src/quickbroker/res']
        manifest.srcFile 'src/quickbroker/AndroidManifest.xml'
      }
    }
    // 声明有哪些flavor的维度
    flavorDimensions "broker"
    // productFlavors是可定义的产品特性
    productFlavors {
      dimension "broker" // 每一个flavor都必须有一个dimension
      //buildConfigField用于给BuildConfig文件添加一个字段
      //三个参数:1.要定义的常量的类型 2.该常量的命名 3.该常量的值
      buildConfigField("String", "DOMAIN", "\"$DOMAIN\"")
    }
  }
  ```

  

## 配置Flavors

- productFlavors与buildTypes是多对多的关系
- productFlavor 其实是defaultConfig的子集

- productFlavors下可以新增多个flavor，每个flavor都可以覆盖defaultConfig下的属性实现差异化。如：包名、应用名、编译版本；



## BuildConfig类

BuildConfig类是Android打包以后自动生成的一个类,它位于build/generated/source/buildConfig/**/debug中或者release中

![image-20190708113710871](http://ww4.sinaimg.cn/large/006tNc79ly1g4sa1jqaojj30dj0cmwf7.jpg)

1. ### 使用BuildConfig自定义常量

2. ### 可以配置BuildConfig的地方

```
// 在buildConfig里面使用
defaultConfig {
	buildConfigField("String","testKey","\"testValue\"")
}
// 在buildTypes里使用
buildTypes {
  debug {
    buildConfigField("String","testKey","\"testValue\"")
  },
  release {
    buildConfigField("String","testKey","\"testValue\"")
  }
}
// 在productFlavors中配置
productFlavors {
	flavorName {
  	buildConfigField("String", "key", "\"value\"")
	}
}
```

3. ### 结合gradle.properties使用

   第一步：在gradle.properties里定义值

   ```properties
   DOMAIN = bhopb.cloud
   ```

   第二步：在app/build.gradle设置BuildConfig

   ```
   android {
       ...
       buildTypes {
           release {
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
               buildConfigField("String","DOMAIN","\"${DOMAIN}\"")
           }
           debug{
               buildConfigField("String","KDOMAINY","\"${DOMAIN}\"")
           }
       }
       ...
   }
   ```



# 三、Activity生命周期

<img src="https://upload-images.jianshu.io/upload_images/215430-4bd5c7b4d06e0dac.png">

### 完整生命周期

```mermaid
graph LR
onCreate --> onStart
onStart --> onResume
onResume --> onPause
onPause --> onStop
onStop --> onDestroy
```

通常在onCreate时完成下面几件事：

1）实例化组件，并且将组件放置在屏幕上(setContentView)

2) 引用已实例化的组件

3）为组件设置监听器

4）访问外部数据Model



### AB组件跳转生命周期

A组件打开时：

```mermaid
graph LR
onCreate --> onStart
onStart --> onResume
```

B组件打开时, A组件进入onPause

```mermaid
graph LR
A[A组件onPause] --> B[B组件onCreate]
B --> C[B组件onStart]
C --> D[B组件onResume]
D --> E[A组件onStop]



```

返回A组件时，B组件先进入onPause

```mermaid
graph LR
A[B页面onPause] --> B[A页面restart]
B --> C[A页面start]
C --> D[A页面resume]
D --> E[B页面Stop]
E --> F[B页面destroy]
```



### Home返回主屏生命周期

```mermaid
graph TD
运行界面 -->|onPause|暂停
暂停 -->|onStop|离开前台
离开前台 --onSaveInstanceState
离开前台 -->|onRestart|恢复可见
恢复可见 -->|onStart|进入前台
进入前台 -->|onResume|恢复前台

```



### 设备旋转与Activity生命周期

设备旋转时，系统会销毁当前Activity实例，然后创建一个新的Activity实例。

原理：

​	设置配置是用来描述设备当前状态的一系列特征。特征包括：屏幕方向、屏幕密度、屏幕尺寸、键盘类型、底座模式、语言等。在应用运行时，只要`设备配置`发生了改变，Android就会销毁当前Activity，重新创建新的activity。

​	因为屏幕发生旋转时，方向改变了，所以设备配置发生了变化，因此activity会重新创建。



onSave



## 布局样式

### 4种应用资源

1. **colorPrimary** 应用的主要色调，actionBar默认使用该颜色，Toolbar导航栏的底色
2. **colorPrimaryDark** 应用的主要暗色调，statusBarColor默认使用该颜色
3. **statusBarColor** 状态栏颜色，默认使用colorPrimaryDark
4. **colorAccent** CheckBox，RadioButton，SwitchCompat等一般控件的选中效果默认采用该颜色



### 安卓单位

> px、dp、dip、sp

px: 像素

dpi:  每英寸点数，即每英寸包含像素个数。比如320X480分辨率的手机，宽2英寸，高3英寸, 每英寸包含的像素点的数量为320/2=160dpi（横向）或480/3=160dpi（纵向），160就是这部手机的dpi，横向和纵向的这个值都是相同的

density: 屏幕密度 = dpi/160;

dp/dip: dp和dip是同一种单位，都是指"设备独立像素"。在屏幕密度dpi = 160屏幕上，1dp = 1px

sp: 和dp很类似，一般用来设置字体大小，和dp的区别是它可以根据用户的字体大小偏好来缩放。

我们新建一个Android项目后应该可以看到很多drawable文件夹，分别对应不同的dpi

- drawable-ldpi (dpi=120, density=0.75)
- drawable-mdpi (dpi=160, density=1)
- drawable-hdpi (dpi=240, density=1.5)
- drawable-xhdpi (dpi=320, density=2)
- drawable-xxhdpi (dpi=480, density=3)



## Drawable

​	shape: 定义一些形状。最常见的比如矩形，圆角矩形，椭圆。

​	selector: 定义一些页面中和交互相关的样式。比如按钮的按压状态、是否禁用、checkbox的选中状态等等。

​	



## SplashScreen

一般app从click启动，到进入MainActivity，中间会有一段空白页面的时间。这一段时间，一般系统会用来做初始化工作的。但是空白的时间太长，会降低客户的体验效果。所以一般我们会在app启动后加一个SplashActivity，用来做缓冲。

```xml
<application
        android:name=".app.Application"
        android:allowBackup="false"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:largeHeap="true"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="false"
        android:theme="@style/AppTheme"
        android:networkSecurityConfig="@xml/network_security_config"
       tools:replace="android:label,android:icon,android:theme,android:allowBackup,android:supportsRtl">
   			<!-- 指明样式主题 -->
        <activity
            android:name=".main.ui.SplashActivity"
            android:screenOrientation="portrait"
            android:theme="@style/SplashTheme" 
            >
          <!-- 告诉app，SplashActivity是启动后第一个进入的主页面 -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
</application>
```

一般Splash的屏幕都是全屏的页面，所以在设置好SplashActivity后，我们还需要设置一下SplashTheme，来设置一下页面的样式。

```xml
<style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
  <!-- 设置window的背景图片，默认是白屏 -->
  <!--  除了图片，也可以设置drawable -->
  <item name="android:windowBackground">@mipmap/launch_bg</item>
  <!-- 设置全屏，默认是false -->
  <item name="android:windowFullscreen">true</item>
  <item name="android:fitsSystemWindows">true</item>
  <item name="android:windowNoTitle">true</item>
  <item name="android:clipToPadding">true</item>
  <item name="android:windowTranslucentNavigation">true</item>
</style>
```

在SplashActivity里，一般还会判断做一下引导页和倒计时欢迎页面；引导页只在安装后第一次使用时出现。

```java
在Activity的onCreate里判断
public void startApp() {
    boolean firstlaunch = SPEx.get("firstlaunch", true);
    if (firstlaunch) {
      SPEx.set("firstlaunch", false);
      Intent intent = new Intent(getActivity(), BootPageActivity.class);
      getActivity().startActivity(intent);
    } else {
      Intent intent = new Intent(getActivity(), WelcomeActivity.class);
      getActivity().startActivity(intent);
    }
    getActivity().finish();
  }
```

倒计时欢迎页面关键代码：

```java
public Handler mHandler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
      super.handleMessage(msg);
      // 跳转到主页面
      Intent intent = new Intent(act, MainActivity.class);
      startActivity(intent);
      //执行一次后销毁本页面
      finish();
    }
};

// 在onResume或者其他生命周期方法里调用
mHandler.sendEmptyMessageDelayed(0, n * 1000) // 倒计时n秒
```



## 全屏处理

两种方式：一种通过style的theme主题配置；一种通过代码来控制全屏或者取消全屏；

方法1：xml配置式

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
	<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
			<item name="android:windowFullscreen">false</item>
  </style>
</resources>
```



方法2：java编程式

```java
//全屏
getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

// 取消全屏
getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
```





## 其他

### 安卓的三个bar：

**状态栏(Status Bar)：**屏幕最上面的，显示时间等

**标题栏(Title Bar)：**应用的标题

**导航栏(Navigation Bar)：**最下面的反馈按钮



### 如何隐藏StatusBar

```java
// 隐藏title
if(getSupportActionBar()!=null){
  getSupportActionBar().hide();
}
```



### 如何在Fragment里面添加Toolbar





# 

## 列表视图

### 1.ListView

​	**基础属性**：

​	**Adapter**:  创建一个LlistAdapter继承BaseAdapter

​	**监听器**:  每一个item都可以去绑定clickListener



### 2.GridView

> GridView和ListView的用法基本一致，只是布局变化了，会以宫格的形式展示。
>
> GridView可以结合BaseAdapter使用，也可以结合SimpleAdapter使用

#### 2.1结合BaseAdapter

```java
class GridViewAdapter extends BaseAdapter { // 自己写一个Adapter类，继承BaseAdapter
  
   private Context context;
   private Inflater mInflater 
   
   public GridViewAdapter(Context context) {
   	 this.mInflater = LayoutInflater.from(context);
     this.list = list;
   }

  @Override
  public View getView(int position, View convertView, ViewGroup parent) {
    // 这个地方是返回一个视图
    // 第一种：不做任何处理，每次都重新创建view
    View view = mInflater.inflate(R.layout.item_filter_exchange_list, null);
    TextView textView = convertView.findViewById(R.id.exch_name);
    textView.setText(list.get(position).getExch_name());
    return view;
    
    // 第二种：通过converView来
    if (convertView == null) {
      convertView = mInflater.inflate(R.layout.item_filter_exchange_list, null);
    }
    TextView textView = convertView.findViewById(R.id.exch_name);
    textView.setText(list.get(position).getExch_name());
    return convertView;
  }
} 

```



#### 2.2结合SimpleAdapter





### 3.RecyclerView

> RecyclerView是GroupView的子类，每一个列表项都作为一个View的对象来显示。

RecyclerView需要Adapter和ViewHolder结合来使用

#### 	3.1Adapter的作用

​	每一个listview都需要adapter。在RecyclerView里，adapter负责两件事情：

1. 创建必要的ViewHolder以及对应的视图，提供给RecyclerView
2. 负责根据传入的位置，找到对应的model，绑定到ViewHolder上；

Adapter的实现步骤：

​	a.创建一个Adapter继承RecyclerView.Adapter，在Adapter里实现对应的方法。

​	b.创建ViewHolder继承RecyclerView.ViewHolder

```java
// RecyclerView.Adapter实现代码
// 可以自定义一个ViewHolder的类，传入给Adapter作为泛型。
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.MyViewHodler> {
  
  private LayoutInflater myLayoutInflater;
  private Context mContext;
  private List<String> list;


  public RecyclerViewAdapter(Context context) {
    this.mContext = context;
    myLayoutInflater = LayoutInflater.from(context);
  }
  
  public void setList(List<String> list) {
    this.list = list;
  }

  // 自定义的ViewHolder类
  public static class MyViewHodler extends RecyclerView.ViewHolder {
    public TextView textView;
    public MyViewHodler(@NonNull View itemView) {
      super(itemView);
      textView = itemView.findViewById(R.id.rcv_text);
    }
  }
  @Override
  public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
    // 这个方法是为了个每一个item从layout文件inflate出一个view。
    // 这个方法的返回对象是一个ViewHolder.
    View view = myLayoutInflater.inflate(R.layout.layout_recycler_item, viewGroup, false);
    MyViewHodler viewHolder = new MyViewHodler(view);
    return viewHolder;
  }

  @Override
  public void onBindViewHolder(@NonNull MyViewHodler viewHolder, int i) {
    // 传入的位置，找到对应的model，绑定到ViewHolder上
    TextView textView = viewHolder.textView;
    String text = list.get(i);
    textView.setText(text);
  }

  @Override
  public int getItemCount() {
    return list.size();
  }
}
```



### 第三方Adapter

BRVAH: https://www.jianshu.com/p/b343fcff51b0

使用：

```
notifyDataSetChanged
```



## Fragment

> Fragment可以展示整个屏幕或者屏幕的某一部分UI，由activity来托管。
>
> Fragment可以灵活的应用在不同的地方，不会受到限制。

### 使用Fragment的两种方式

- #### 一、静态添加Fragment

  静态添加fragment分几个步骤：

  1.在activity.xml布局文件里声明fragment

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
      android:orientation="horizontal"
      android:layout_width="match_parent"
      android:layout_height="match_parent">
    	<!-- android:name 属性指定要在布局中实例化的 Fragment 类 -->
      <!-- fragment必须用id或者tag作为唯一标识。-->
      <fragment android:name="com.example.news.ArticleListFragment"
              android:id="@+id/list"
              android:layout_weight="1"
              android:layout_width="0dp"
              android:layout_height="match_parent" />
      <fragment android:name="com.example.news.ArticleReaderFragment"
              android:id="@+id/viewer"
              android:layout_weight="2"
              android:layout_width="0dp"
              android:layout_height="match_parent" />
  </LinearLayout>
  ```

  当系统创建这个activity时，会去实例化Fragment的类，并且调用它的onCreateView()方法,来替换这个fragment。

  2.创建一个类，继承fragment类，重写onCreateView

  ```java
  public static class ExampleFragment extends Fragment {
      @Override
      public View onCreateView(LayoutInflater inflater, ViewGroup container,
                               Bundle savedInstanceState) {
          // Inflate the layout for this fragment
          return inflater.inflate(R.layout.example_fragment, container, false);
      }
  }
  ```

  3.创建fragment的布局xml ，此处代码省略

  

- #### 二、动态添加Fragment

  动态添加fragment的方式是唯一可以在运行时控制fragment的方式。我们可以通过代码编程，将fragment动态添加、替换、删除。动态添加分为以下几个步骤：

  1. 定义容器视图
  
     ```xml
     <?xml version="1.0" encoding="utf-8"?>
     <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
         android:layout_width="match_parent"
         android:layout_height="match_parent">
     <!-- 虽然是动态添加fragment，但是也需要在Activity的视图中为fragment安排位置 -->
     <FrameLayout
             android:id="@+id/fragment_container"
             android:layout_width="match_parent"
             android:layout_height="match_parent" />
     </LinearLayout>
     ```
  
     使用FrameLayout来作为fragment的容器视图，当然一个托管的Activity可以有多个容器视图。
  
     
  
  2. 创建fragment类
  
     ```java
     public class CrimeListFragment extends Fragment {
     
       private RecyclerView mRecyclerView;
     
       private List<CrimeBean> list;
     
       private CrimeAdapter mCrimeAdapter;
     
       public static CrimeListFragment createInstance() {
         CrimeListFragment fragment = new CrimeListFragment();
         return fragment;
       }
     
       /**
        * onCreate方法是public的，需要被托管的Activity调用
        * onCreate方法并没有创建fragment视图，视图是在onCreateView里创建的
        * @param savedInstanceState
        */
       @Override
       public void onCreate(@Nullable Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         list = DataServer.getCrimes(100);
       }
     
       /**
        * inflater和container是用来生成fragment视图的必须参数
        * savedInstanceState可以用来恢复视图数据
        * @param inflater
        * @param container
        * @param savedInstanceState
        * @return
        */
       @Nullable
       @Override
       public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
         View view = inflater.inflate(R.layout.fragment_crime_list, container,false);
         mRecyclerView = view.findViewById(R.id.rv_crime_list);
         mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
         updateUI();
         return view;
       }
     
       private void updateUI() {
         mCrimeAdapter = new CrimeAdapter(list);
         mRecyclerView.setAdapter(mCrimeAdapter);
         mCrimeAdapter.setOnItemClickListener(this);
       }
     
     
       @Override
       public void onActivityResult(int requestCode, int resultCode, Intent data) {
         super.onActivityResult(requestCode, resultCode, data);
       }
     }
     ```
  
     
  
  3. 获取fragmentManager，添加fragment到Activity中
  
     ```java
     public class CrimeActivity extends AppCompatActivity {
     
       @Override
       protected void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         setContentView(R.layout.activity_crime);
     //    获取fragmentManager
         FragmentManager fragmentManager = getSupportFragmentManager();
     //    通过fragmentManager找到内存中的fragment
         Fragment fragment = fragmentManager.findFragmentById(R.id.fragment_container);
         if (fragment == null) {
           fragment = CrimeListFragment.createInstance();
           // 开启事物
           FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
           fragmentTransaction.add(R.id.fragment_container, fragment);
            // 提交事物
           fragmentTransaction.commit();
         }
       }
     }
     ```
  
     

### Fragment的事物管理

事物的顺序：beginTransaction —> add/remove/replace... —> commit

### Fragment的生命周期

fragment的声明周期类似于activity，但是它的生命周期不是由系统来管理，而是由Activity来管理。具体如下图：

![](http://pvhgkdx46.bkt.clouddn.com/fragment_lifecycle.png)

​	当向运行中的Activity添加fragment时，FragmentManger会立即执行fragment的必要方法，保持fragment和Activity两者状态一致。以下方法会依次被调用：

- onAttach(Activity)

- onCreate(Bundle): 
- onCreateView(...): 系统会在Fragment首次绘制时调用此方法。如果需要绘制UI，需要在这个方法里返回UI的根视图
- onActivityCreated(Bundle)
- onStart
- onResume 

  

### getSupportFragmentManager、getChildFragmentManager的区别

getChildFragmentManager： 返回一个私有的FragmentManager，这个manager是属于当前Fragment内部的

getSupportFragmentManager： 返回Activity的FragmentManager，他能管理属于Activy的fragment。

所以主要的不同点在于：每个Fragment有他们自己内部的`FragmentManager`，他们能管理自己内部的`Fragment`。但是其他FragmentManager能管理整个activity的。



### Fragment和Activity间传递消息





最后：不要滥用fragment。一个页面中，最好的设计是存在2~3个fragment。



## LayoutInflater

layoutInflater是一个将xml布局文件转换为View对象的工具

1. ### 获取LayoutInflater

   ```java
   LayoutInflater inflater = LayoutInflater.from(context); 
   ```

2. #### 将Layout转化为View

   ```java
   convertView = mLayoutInflater.inflate(R.layout.layout_grid_item, null);
   ```



## ViewPager

ViewPager的Adapter有三种：PageAdapter、FragmentPagerAdapter、FragmentStatePagerAdapter

### PageAdapter

### FragmentPagerAdapter



# Adapter

## BaseAdater



# EventBus使用

## 前言

EventBus原理：通过事件类型，来进行订阅发布

![image-20190812150412158](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-08-12-070412.png)



// todo 待补充









# 

## TabLayout

tablayout是单独的design support中, 想要用tablayout, 需要在gradle里单独引用他

```
implementation 'com.android.support:design:28.0.0-rc02'
```



### 1.简单使用

1）在布局文件中声明Tablayout

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:app="http://schemas.android.com/apk/res-auto"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical">

    <android.support.design.widget.TabLayout
        android:id="@+id/tabLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />
</LinearLayout>
```

2) 在Activity或者Fragment的onCreate周期中，手动创建tab，并且绑定tab clickListener

```java
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_tab_layout);
    mTabLayout = (TabLayout) findViewById(R.id.tabLayout);
    // 添加多个tab
    for (int i = 0; i < title.length; i++) {
        TabLayout.Tab tab = mTabLayout.newTab();
        tab.setText(title[i]);
        mTabLayout.addTab(tab);
    }
    // 给tab设置点击事件
    mTabLayout.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
        @Override
        public void onTabSelected(TabLayout.Tab tab) {
            Toast.makeText(getApplicationContext(), title[tab.getPosition()], Toast.LENGTH_SHORT).show();
        }
        @Override
        public void onTabUnselected(TabLayout.Tab tab) {
        }
        @Override
        public void onTabReselected(TabLayout.Tab tab) {
        }
    });
}
```



### 2.与ViewPager结合

#### 1）先在布局文件中放好TabLayout和ViewPager：

```xml
<android.support.design.widget.TabLayout
        android:id="@+id/tab"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        app:tabIndicatorColor="@color/colorPrimaryDark"
        app:tabIndicatorHeight="3dp"
        />

    <android.support.v4.view.ViewPager
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:id="@+id/tab_view_pager"
        />
```



2）设置TabLayout和ViewPager相互关联

```java
@Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_tab_view);
    // 1. 声明布局中的tablayout
    mTabLayout = findViewById(R.id.tab);
    // 2. 声明viewpager
    mViewPager = findViewById(R.id.tab_view_pager);
    // 3. 初始化fragments
    initFragments();
    // 4. 为viewPager声明FragmentPagerAdapter类的实例
    mViewPager.setAdapter(new TabFragmentPagerAdapter(mFragment, getSupportFragmentManager()));
    // 5. 设置tabLayout的启动viewPager,这个方法会创建tab，并且重置title
    mTabLayout.setupWithViewPager(mViewPager, false);
    // 6. 最后设置每个tab的text
    for (int i = 0; i < TAB_TITLES.length; i++) {
      mTabLayout.getTabAt(i).setText(TAB_TITLES[i]);
    }
  }

  /**
   * 添加Fragment
   */
  private void initFragments() {
    for (int i = 0; i < TAB_TITLES.length; i++) {
      mFragment.add(new TabFragment());
    }
  }
```



## FrameLayout

FrameLayout是最简单的ViewGroup组件，它不以特定的方式来安排子视图的位置。

FrameLayout子视图的位置排列取决于他们各自的android:layout_gravity属性





## 布局重用<include/>

<include/>可以













# 事件传递

## 事件的处理方式：



### Handler处理

handler.set

```

```



## 消息传递

方式1：Bundle

```java
Date date = (Date) getArguments().getSerializable(CRIME_DATE); // 通过传入的argument来读取

```



方式2：Intent  // todo 

```
Activity.RESULT_OK

```





# 四、编程框架

## MVP

为了解决mvc中，逻辑处理与视图展示无法分离的问题；

**m**：model/bean 数据层，主要负责处理业务逻辑

**v**:  activity/fragment 视图层，只用来展示界面，逻辑处理交给presenter来处理；

**p**:  presenter 展示层，和view一一对应；





```java
// 基础类
BaseFragment<P extends BaseFragmentPresenter<V>, V extends AppUI> 


```

presenter 里面有UI

fragment里面传入了presenter



```mermaid
onResume --> 
```



## Flux框架







## 事件总线

- ### Bus

  文档链接：[http://square.github.io/otto/](http://square.github.io/otto/)

- ### EventBus

  文档链接：[http://greenrobot.org/eventbus/documentation/delivery-threads-threadmode/](http://greenrobot.org/eventbus/documentation/delivery-threads-threadmode/)

  事件处理模式

  ​	1. ThreadMode.POSTING: 

  ​	订阅者被调用的线程和提交事件的线程是同一个线程，

  ​	这个模式下，开销最小，因为它完全不需要切换线程；

  

  ​	2. ThreadMode.MAIN：在主线程中处理。一般会涉及到UI的处理。

  ​	3. ThreadMode.MAIN_ORDERED： 在主线程中处理，并且严格按照提交的顺序，并保持一致。

  ​	4. ThreadMode.BACKGROUND：

  ​	5. ThreadMode.ASYNC：

  ​	

  ```java
  // Called in the same thread (default)
  // ThreadMode is optional here
  @Subscribe(threadMode = ThreadMode.POSTING)
  public void onMessage(MessageEvent event) {
      log(event.message);
  }
  ```

  



## RxJava

RxJava概述

R：reactive响应式的，x:代表任何的意思。Rxjava表示以java语言实现的响应式的编程。

Rxjava核心

响应式编程核心思想就是观察者模式。本质上要求`观察者(A)`高度敏感的关注`被观察者(B)`的状态变化。当B状态发生变化时，A需要做出及时的反应。

一般观察者模式有两种：主动模式、被动模式；

主动的观察者模式是：`观察者`主动去监听`被观察者`状态变化

被动的观察者模式是：`观察者`向`被观察者`订阅消息，`被观察者`状态发生变化时，向订阅者发送消息.

Rxjava的模式是被动观察者模式





# 五、三方组件

## SmartRefreshLayout 

地址：https://github.com/scwang90/SmartRefreshLayout

组成

- SmartRefreshLayout 刷新布局核心实现，自带ClassicsHeader（经典）、BezierRadarHeader（贝塞尔雷达）两个 Header.

- SmartRefreshHeader 各种Header的集成，除了Layout自带的Header，其它都在这个包中.

- SmartRefreshFooter 各种Footer的集成，除了Layout自带的Footer，其它都在这个包中.

  

## BHOP组件

1.交易盘口： BookListView

2.TopBar 包含了交易界面里面的下拉币对



# 六、升级策略

## 强制更新策略

当发布新的版本时，或者有一些改动较大的功能时，往往需要强制用户更新版本。

一般检测的策略是根据版本号来判断。在app启动时，检测本地app的版本号。如果用户安装的版本号 < 最新的版本号，通过弹出toast的方式，强制app更新。 

检测最新的版本可以通过一个简单的json文件来实现。以下是我在实际项目中用到的一种方式：

```java
// checkVersionUpdate
// 在MainActivity的onCreate方法里, 检测app的版本
UtilsApi.RequestCheckVersionUpdate(context, new SimpleResponseListener<UpdateResponse>() {
      @Override
      public void onSuccess(UpdateResponse data) {
        super.onSuccess(data);
        if (CodeUtils.isSuccess(data, false)) {
          // 比较当前版本和服务器上的版本
          if (DevicesUtil.getAppVersion(context) >= data.versionCode) {
            if (showToast) {
              ToastUtils.showLong(context, context.getString(R.string.string_version_new));
            }
            return;
          }
          String url = data.downloadUrl;
          String descp = data.newFeatures;
          boolean forceUpdate = data.needForceUpdate;
          if (data.needUpdate == true && !TextUtils.isEmpty(url)) {
            // 弹出强制更新dialog
            showForceUpdateDialog(context, url, descp, forceUpdate);
          }
        }
      }

      @Override
      public void onError(Throwable error) {
        super.onError(error);
      }
    });
```

```java
/**
   * showForceUpdateDialog
   */
  private static void showForceUpdateDialog(final Context context, final String url, String descp, final boolean forceUpdate) {
    final VersionUpdateDialog builder = new VersionUpdateDialog(context);
    builder.setTitle(context.getString(R.string.string_version_find_new));
    builder.setMessage(descp);
    if (forceUpdate == true) {
      builder.setCancelable(false);
      builder.setCanceledOnTouchOutside(false);
    }
    builder.setPositiveButton(context.getString(R.string.string_version_update), new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        // 我们系统里面是通过浏览器去下载安装包的方式更新应用
        // 如果需要，还可以做到通过启动下载线程的方式更新应用包，这种方式体验会更好。
        context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        if (builder.isShowing()) {
          builder.dismiss();
        }
      }
    });
    builder.setNegativeButton(context.getString(R.string.string_version_cancel), new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        // 取消的操作
        if (builder.isShowing()) {
          builder.dismiss();
        }
      }
    });
    builder.setNegativeButtonEnable(!forceUpdate);
    builder.show();
  }
```



也可以通过第三方平台来实现，比如[腾讯的buggly](https://bugly.qq.com/v2/product/apps/a14de22571?pid=1)：

`buggly`支持全量更新和热更新两种模式，还可以通过配置的方式来选择是否强制更新。

图1：全量更新

![image-20190819213051898](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-08-19-133053.png)



图2：发布补丁

![image-20190819213012111](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-08-19-133013.png)



Buggy底层的检测策略应该一样，都是通过versionCode来比较，并且会校验MD5值。

关于Buggly的其他用法，参考后面的[集成平台-Buggly](#Buggly)







# 七、集成平台

## Buggly