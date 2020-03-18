# 架构篇

## MVP应用构架模式

> https://blog.csdn.net/qq_17766199/article/details/50591910

mvp架构的出现，主要为了解决 mvc 中，`逻辑处理层(c`)与`视图展示层(v)`无法分离的问题；

**m**：model/bean 数据层，主要负责处理业务逻辑。可以封装一些请求网络的方法，也可以交给其他service去做。

**v**: activity/fragment 视图层，只用来展示界面，逻辑处理交给 presenter 来处理；

**p**: presenter 展示层，和 view 一一对应；拥有view的弱引用，view所有的和数据打交道的操作都会交给presenter去做。



![这里写图片描述](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-26-092422.png)



架构实现

mvp的实现有很多版本，但是万变不离其宗：

下面是我们项目里用到的：

首先是IBaseView接口。接口这边主要是定义了一些UI层常用操作，比如显示loading、判断ui是否存活。所有的Activity或者Fragment都会继承这个接口。

```java
public interface IBaseView {

	void showProgressDialog(String title, String hint);

	void dismissProgressDialog();

	boolean isAlive();
}
```

然后是IPresenter接口。

```java
/**
 * MVP框架中的Presenter，负责连接View和Model，部分时候直接接管Model的操作。
 * 将Activity的生命周期拿过来，用于过程的控制
 * ================================================
 */
public interface IPresenter<V> {

    String getString(int resId);

    V getUI();

    void onUIReady(BaseMVPActivity activity, V ui);

    void onStart();

    void onResume();

    void onPause();

    void onStop();

    void onDestroy();

    void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults);

    void onRestoreInstanceState(Bundle savedInstanceState);

    void onSaveInstanceState(Bundle outState);

    void onActivityResult(int requestCode, int resultCode, Intent data);
}
```



BaseMvpActivity

```java
/**
 * 最基础的Activity类，所有原生Activity，都应继承他
 * ================================================
 */
public abstract class BaseMVPActivity<P extends BaseMVPPresenter<V>, V extends IBaseUI> extends AppCompatActivity {

	private P presenter;
	protected ViewFinder viewFinder;
	private boolean isAlive = true;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		viewFinder = new ViewFinder(this);
		presenter = createPresenter();
		setContentView();
		presenter.onUIReady(this, getUI());
	}

	/**
	 * 创建Presenter
	 * @return
	 */
	protected abstract P createPresenter();

	protected P getPresenter() {
		return presenter;
	}

	/**
	 * 設置页面资源
	 */
	protected abstract void setContentView();


	/**
	 * 获取View视图
	 * @return
	 */
	protected abstract V getUI();

	@Override
	protected void onStart() {
		super.onStart();
		presenter.onStart();
	}

	@Override
	protected void onResume() {
		super.onResume();
		presenter.onResume();
	}

	@Override
	protected void onPause() {
		super.onPause();
		presenter.onPause();
	}

	@Override
	protected void onStop() {
		super.onStop();
		presenter.onStop();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		isAlive = false;
		presenter.onDestroy();
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		presenter.onRequestPermissionsResult(requestCode, permissions, grantResults);
	}

	@Override
	public void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		presenter.onSaveInstanceState(outState);
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		presenter.onRestoreInstanceState(savedInstanceState);
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		presenter.onActivityResult(requestCode, resultCode, data);
	}

	/**
	 * Activity 是否还可用
	 *
	 * @return
	 */
	public boolean isAlive() {
		return isAlive && !isFinishing();
	}

	public Fragment instanceFragment(String fName, Bundle bundle, String tag) {
		Fragment fragment = getSupportFragmentManager().findFragmentByTag(tag);
		if (fragment != null) {
			if (fragment.getArguments() != null)
				fragment.getArguments().putAll(bundle);
			return fragment;
		}

		List<Fragment> frgs = getSupportFragmentManager().getFragments();
		if (frgs != null) {
			for (Fragment item : frgs) {
				//这里有可能会有问题，因为多个相同的fragment到这里就会出错
				if (item == null || !item.getClass().getName().equals(fName))
					continue;

				if (item.getArguments() != null)
					item.getArguments().putAll(bundle);
				return item;
			}
		}

		fragment = Fragment.instantiate(this, fName, bundle);

		return fragment;
	}

	public Fragment instanceFragment(String fName, Bundle bundle) {
		return instanceFragment(fName, bundle, fName);
	}

}


```





BaseMvpPresenter层。实现了IPresenter的接口。这边主要是负责

```java
/**
 *
 * @author
 */
public abstract class BaseMVPPresenter<V extends IBaseUI> implements IPresenter<V> {

	// 弱引用UI
	private WeakReference<V> mUIRef;

	private BaseMVPActivity activity;

	/**
	 * 获取当前activity
	 * @return
	 */
	protected BaseMVPActivity getActivity() {
		return activity;
	}

	@Override
	public V getUI() {
		return mUIRef == null ? null : mUIRef.get();
	}

	/**
	 * 获取Resources
	 * @return
	 */
	public Resources getResources() {
		return activity.getResources();
	}

	@Override
	public String getString(int resId) {
		return activity.getString(resId);
	}


	@Override
	public void onUIReady(BaseMVPActivity activity, V ui) {
		this.activity = activity;
		this.mUIRef = new WeakReference<V>(ui);
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onResume() {

	}

	@Override
	public void onPause() {

	}

	@Override
	public void onStop() {

	}

	@Override
	public void onDestroy() {

	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {

	}

	@Override
	public void onRestoreInstanceState(Bundle savedInstanceState) {

	}

	@Override
	public void onSaveInstanceState(Bundle outState) {

	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {

	}
}

```



单元测试



fragment 里面传入了 presenter

```mermaid
onResume -->
```

## 网络组件

OkHttp

使用 OkHttpClient 的时候需要**注意**以下几点：

1. 最好只使用一个共享的 OkHttpClient 实例，将所有的网络请求都通过这个实例处理。因为每个 OkHttpClient 实例都有自己的连接池和线程池，重用这个实例能降低延时，减少内存消耗，而重复创建新实例则会浪费资源。
2. OkHttpClient 的线程池和连接池在空闲的时候会自动释放，所以一般情况下不需要手动关闭，但是如果出现极端内存不足的情况，可以使用以下代码释放内存：

```java
client.dispatcher().executorService().shutdown();   //清除并关闭线程池
client.connectionPool().evictAll();                 //清除并关闭连接池
client.cache().close();                             //清除cache
```

## WebSocket 框架

1.开源框架选择

市面上比较多的博客里写到用： [java-websocket](https://github.com/TooTallNate/Java-WebSocket)。

再基于网上某一个大神的封装，思路清晰，设计的很合理，做起业务起来一定很舒适。

> 参考连接：https://github.com/0xZhangKe/WebSocketDemo/tree/master/doc；
>
> 另一篇博客，有空阅读https://www.jianshu.com/p/7b919910c892

看到项目里面已经有人用过 okhttp3 提供的 websocket 封装了功能。okhttp3 是项目里面封装网络请求用到的开源框架，一直在更新，再加上前人的逻辑代码已经存在，那么久索性沿用他们的代码；后续如果新的项目尝试用一下第一种；

2.带着问题去查看文章

在查资料之前，我的几个问题是：

- 怎么去建立 websocket 的连接？

- 怎么去保持连接，

- 怎么监听消息，消息怎么给我的 Activity 或者 Fragment 使用？

- 怎么断开重连，并且重新订阅；

  3.阅读前人代码框架

说实话代码写的真的是乱，需要整理一下流程；

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-11-20-085339.png" alt="image-20191120165338088" style="zoom:50%;" />

创健 okHttpClient

```java
 OkHttpClient.Builder clientBuild = new OkHttpClient.Builder();
    //设置一下整体的超时
    clientBuild.connectTimeout(DEFAULT_CONNECT_TIME_OUT, TimeUnit.SECONDS)
      .retryOnConnectionFailure(true)
      //.connectTimeout(2, TimeUnit.SECONDS)
      .readTimeout(DEFAULT_TIME_OUT, TimeUnit.SECONDS)
      .writeTimeout(DEFAULT_TIME_OUT, TimeUnit.SECONDS)
      .cookieJar(cookieJar)
      .cache(cache)
      .addInterceptor(interceptorWrapper);

    clientBuild.eventListenerFactory(HttpEventListener.FACTORY);
    clientBuild.sslSocketFactory(createSSLSocketFactory());
    clientBuild.hostnameVerifier(new HostnameVerifier() {
      @Override
      public boolean verify(String hostname, SSLSession session) {
        return true;
      }
    });
    DEFAULT_CLIENT = clientBuild.build();
```

因为 okhttpClient 在多个地方要用到，所以封装到了 HttpUtils 里，这里截取了部分逻辑代码；

建立 websocket 连接

```java
OkHttpClient okHttpClient = HttpUtils.getInstance().getHttpClient();

		if (okHttpClient != null) {
			Request.Builder builder = new Request.Builder().url(url);
      // 参数...
			builder.addHeader(Fields.PARAM_NETT, DevicesUtil.GetNetworkType(CApplication.getInstance()));
			builder.addHeader(Fields.PARAM_UID, userId);
			String lan = RateAndLocalManager.GetInstance(CApplication.getInstance()).getCurLocalLanguage();
			if (TextUtils.isEmpty(lan)) {
				builder.addHeader(Fields.PARAM_LANGUAGE, lan);
			}
			Request request = builder.build();
      webSocketClient = okHttpClient.newWebSocket(request, new MyWebSocketListener());
```

## RxJava

### RxJava 概述

R：reactive 响应式的，x:代表任何的意思。Rxjava 表示以 java 语言实现的响应式的编程。

### Rxjava 核心思想

响应式编程核心思想就是观察者模式。本质上要求`观察者(A)`高度敏感的关注`被观察者(B)`的状态变化。当 B 状态发生变化时，A 需要做出及时的反应。

一般观察者模式有两种：主动模式、被动模式；

主动的观察者模式是：`观察者`主动去监听`被观察者`状态变化

被动的观察者模式是：`观察者`向`被观察者`订阅消息，`被观察者`状态发生变化时，向订阅者发送消息.

==Rxjava 的模式是被动观察者模式==

### Rxjava1 解读

![image-20191102131511286](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-26-091220.png)

**Observable**：被观察者、

通过 create 方法来创建一个被观察者对象；

通过 subscribe 方法来注册一个观察者；

**Observer**: 观察者

作为 Observable 的 subscribe 方法的参数；

**Subscription**：订阅

用来描述`Observable`于`Observer`对象间的关系

通过 unsubscribe 方法来取消订阅

**OnSubscribe**: 被订阅时的事件

当订阅时，会触发此接口的 call 方法，

他是`Observable`的内部接口，用来发送数据；

`Observable对象`的`subscribe`调用了 hook.onSubscribeStart 方法，实际上就是调用了的`OnSubscribe`对象的 call 方法；

**Subscriber**：订阅者

实现了`Observer`和`Subscription`接口；

是 call 回调方法的参数；

Rxjava2 解读

# 三方组件

## SmartRefreshLayout

文档地址：https://github.com/scwang90/SmartRefreshLayout

框架组成

- SmartRefreshLayout 刷新布局核心实现，自带 ClassicsHeader（经典）、BezierRadarHeader（贝塞尔雷达）两个 Header.

- SmartRefreshHeader 各种 Header 的集成，除了 Layout 自带的 Header，其它都在这个包中。Header 是指在下拉刷新时，显示“正在刷新”中的 header。

- SmartRefreshFooter 各种 Footer 的集成，除了 Layout 自带的 Footer，其它都在这个包中。Footer 是指在上拉加载更多时，显示“正在加载”的 footer。

  <img src="https://raw.githubusercontent.com/scwang90/SmartRefreshLayout/master/art/jpg_preview_xml_define.jpg" alt="img" style="zoom:75%;" />

### 1.简单使用

在 XML 布局文件中添加 SmartRefreshLayout

```
<?xml version="1.0" encoding="utf-8"?>
<com.scwang.smartrefresh.layout.SmartRefreshLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/refreshLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <android.support.v7.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:overScrollMode="never"
        android:background="#fff" />
</com.scwang.smartrefresh.layout.SmartRefreshLayout>
```

在 Activity 或者 Fragment 中添加代码

```java
RefreshLayout refreshLayout = (RefreshLayout)findViewById(R.id.refreshLayout);
refreshLayout.setOnRefreshListener(new OnRefreshListener() {
    @Override
    public void onRefresh(RefreshLayout refreshlayout) {
        refreshlayout.finishRefresh(2000/*,false*/);//传入false表示刷新失败
    }
});
refreshLayout.setOnLoadMoreListener(new OnLoadMoreListener() {
    @Override
    public void onLoadMore(RefreshLayout refreshlayout) {
        refreshlayout.finishLoadMore(2000/*,false*/);//传入false表示加载失败
    }
});
```

2.指定 Header 和 Footer

## BufferKnife

在 activity 里使用

```java
class ExampleActivity extends Activity {
  @BindView(R.id.title) TextView title;
  @BindView(R.id.subtitle) TextView subtitle;
  @BindView(R.id.footer) TextView footer;

  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.simple_activity);
    ButterKnife.bind(this);
    // TODO Use fields...
  }
}
```

在 fragment 里使用

```java
public class FancyFragment extends Fragment {
  @BindView(R.id.button1) Button button1;
  @BindView(R.id.button2) Button button2;

  @Override public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fancy_fragment, container, false);
    ButterKnife.bind(this, view);
    // TODO Use fields...
    return view;
  }
}
```

## BRVAH

> 使用文档
> https://www.jianshu.com/p/b343fcff51b0

### BaseQuickAdapter



设置List的图片

```
Picasso.with(mContext).load(item.url).fit().into((ImageView) helper.getView(R.id.discount_coin_url));
```



设置Item 的点击事件

```java
mCFDAssetListAdapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
			@Override
			public void onItemClick(BaseQuickAdapter adapter, View view, int position) {
				BalanceAssetBean itemModel = (BalanceAssetBean) adapter.getData().get(position);
				if (itemModel != null) {
					IntentUtils.goCFDAssetDetail(getContext(), itemModel);
				}
			}
		});

```



设置列表的分割线

```
adapter.addItemDecoration(new ItemDecoration(getContext(), LinearLayout.Horizontal))
```





# 升级级策略

## 强制更新策略

当发布新的版本时，或者有一些改动较大的功能时，往往需要强制用户更新版本。

一般检测的策略是根据版本号来判断。在 app 启动时，检测本地 app 的版本号。如果用户安装的版本号 < 最新的版本号，通过弹出 toast 的方式，强制 app 更新。

检测最新的版本可以通过一个简单的 json 文件来实现。以下是我在实际项目中用到的一种方式：

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

也可以通过第三方平台来实现，比如[腾讯的 buggly](https://bugly.qq.com/v2/product/apps/a14de22571?pid=1)：

`buggly`支持全量更新和热更新两种模式，还可以通过配置的方式来选择是否强制更新。

图 1：全量更新

![image-20190819213051898](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-26-091217.png)

图 2：发布补丁

![image-20190819213012111](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-26-091219.png)

Buggy 底层的检测策略应该一样，都是通过 versionCode 来比较，并且会校验 MD5 值。

关于 Buggly 的其他用法，参考后面的[集成平台-Buggly](#Buggly)

# 代码分析

## LeakCanary

## Lint

Android Studio 中内置了 Lint，我们小手一点就可以直接使用。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-02-25-041156.png" alt="image-20200225121155503" style="zoom:25%;" />

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





### robolectric框架

https://maxwell-nc.github.io/android/robolectricTest.html



PowerMock

```java
//@RunWith(PowerMockRunner.class)
//@PrepareForTest(CodeUtils.class)

```

