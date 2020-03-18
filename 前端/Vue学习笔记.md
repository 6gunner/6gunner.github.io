# Vue概念总结

https://ustbhuangyi.github.io/vue-analysis/v2/prepare/



## Runtime Only VS Runtime + Compiler

通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 Runtime Only 版本的还是 Runtime + Compiler 版本。下面我们来对比这两个版本。

- Runtime Only

我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

- Runtime + Compiler

我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

```js
// 需要编译器的版本
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

因为在 Vue.js 2.0 中，最终渲染都是通过 `render` 函数，如果写 `template` 属性，则需要编译成 `render` 函数。

==那么这个编译过程会发生运行时，所以需要带有编译器的版本==。

很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js。



## New Vue究竟做了什么？

Vue其实是一个Class，而js的Class是通过函数实现的。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

Vue只能通过new来初始化，初始化之后调用了_init(options)方法。

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
	...... 省略一些代码
  // a flag to avoid this being observed
  vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
	...... 省略一些代码
  // expose real self
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  ...... 省略一些代码
  
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}

```

可以看到，_init方法干了几件事情：

合并配置

初始化了声明周期、事件

初始化渲染函数

调用了构造函数

初始化data、props、computed、watcher

最后检测是否有el属性，如果有，那么进行属性的挂载。



## $mount方法



<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-15-093813.png" alt="img" style="zoom:50%;" />

整个vue的渲染流程如上。

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```



先用mount变量缓存了`Vue.property.$mount`的方法，然后重新定义`Vue.prototype.$mount方法`，在这个方法里将template转化为render方法。

最后再调用mount方法。

```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

原型上的$mount方法，实际上是调用了mountCompoent。

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

mountComponent的核心是渲染一个Watcher。Watcher的作用就是在初始化的时候，执行updateComponent 方法，然后在vue的state发生变化的时候，自动执行updateComponent方法。（自动执行的实现在[响应式原理](#响应式原理)里会讲到）。

==updateComponent方法分两步，第一步是执行`_render()`，第二步是执行`_update`。==



## Virtual Dom

[snabbdom 一个很纯粹的virtual dom实现](https://github.com/snabbdom/snabbdom/blob/master/src/vnode.ts)

`_render` 最终是通过执行 `createElement` 方法并返回的是 `vnode`，它是一个虚拟 Node。

Vue 2.0 相比 Vue 1.0 最大的升级就是利用了 Virtual DOM。

因此在分析 `createElement` 的实现前，我们先了解一下 Virtual DOM 的概念：

​	虚拟dom出现的原因是因为 浏览器中的dom设计很复杂，频繁操作dom会造成性能问题。

​	虚拟dom其实就是通过js数据结构来模拟dom结构，来创建一个内存中dom节点（VNode）。通过操作内存中	的VNode，最终映射到浏览器的dom中去。

​	虚拟dom除了定义数据结构之外，映射到真实的DOM中，需要经历三个过程：==create、diff、patch==等。



### create环节

之前我们知道$mount的`_render`方法中，其实是通过`createElement`方法返回一个的VNode，之后再调用`_update`方法，实现patch。

所以先来看一下createElement方法：

```js
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```



createElement接收5个参数：

- context:  vnode的上下文，类型是component
- tag ：创建节点的标签。可以是string，也可以是component
- data：表示节点的一些属性。他是VNodeData的数据类型
- children：表示当前 VNode 的子节点，它是任意类型的。

createElement做的第一件事情是`normalizedChildren`。 因为children接收的参数是任意类型的，但是我们创建VNode的时候，需要将children进行扁平化处理，变成一个VNode数组的形式。

处理好children数据后，第二件事情就是创建并且返回一个VNode。



Q: how to understand "a functional component  may return an Array"?



### patch环节

update操作实际上是根据vnode插入一个新的dom元素，然后将旧的dom节点删除掉。实现替换的效果。

来看下vue是怎么去操作这个vnode的

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render 初始化渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates 更新渲染
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

`_update`方法调用有两种情况，一种是初始化渲染，一种是页面发生了变化，进行更新渲染。都是调用了内部的`__patch__`方法。

`__patch__`方法其实和平台相关，不同的平台，vue使用的patch方法不一样。 patch方法实际上是通过`createPatchFunction`方法来返回的。这里用到了`柯里化函数`的编程思想，通过不同的调用函数参数，来返回不同的函数，进行不同的逻辑。



```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ... 省略
   
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

回到 `patch` 方法本身，它接收 4个参数，

- `oldVnode` 表示旧的 VNode 节点，它也可以不存在或者是一个 DOM 对象；

- `vnode` 表示执行 `_render` 后返回的 VNode 的节点；

- `hydrating` 表示是否是服务端渲染；

- `removeOnly` 是给 `transition-group` 用的。



打断点进行调试：

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-15-092337.png" alt="image-20200315172337067" style="zoom:50%;" />



初始化去渲染的时候，传入了当前页面的dom、_render返回的vnode，后面两个参数都是false。

然后逻辑走到`createElm`这一步。`createElm` 的作用是通过虚拟节点vnode创建真实的 DOM 并插入到它的父节点中。

这里面用到了递归，一种常用的深度优先的遍历算法。

最终顺序是：先插入子节点，再插入父节点。



## 创建组件 

`createComponent`的逻辑很复杂，简化的来看，构建组件主要包含3个流程：

- 创建子类构造函数
- 安装组件hooks函数
- 实例化vnode

#### 创建子类构造函数

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {}
```



因为我们写组件的时候，最后都是通过`export default {}`来返回这个组件的。

所以，其实创建组件时，Ctor这个参数传入的就是一个js对象。

那构建子类构造函数也很简单，就是把这个对象通过原型继承的方式，继承Vue的构造函数，并且把Vue的一些基础方法赋给这个子类。

```js
const baseCtor = context.$options._base // 实际上就是Vue

// plain options object: turn it into a constructor
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
```

```js
/**
 * Class inheritance 继承
 */
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name)
  }

  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  // For props and computed properties, we define the proxy getters on
  // the Vue instances at extension time, on the extended prototype. This
  // avoids Object.defineProperty calls for each instance created.
  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  // allow further extension/mixin/plugin usage
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  // create asset registers, so extended classes
  // can have their private assets too.
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })
  // enable recursive self-lookup
  if (name) {
    Sub.options.components[name] = Sub
  }

  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

这里有一个cachedCtors，用来缓存构造函数。避免子组件被重复构造。

#### 安装组件钩子函数

#### 实例化 VNode

```js
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
return vnode
```

```js
var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  ...
};
```

这里有一个需要注意的地方，创建组件VNode的时候，children是空的。



## Patch组件

初次patch的时候

![image-20200316215334552](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-16-135335.png)



创建组件时，先执行了hooks的init方法里。

vnode代表组件本身，activeInstance代表Vue实例。



```
/**
   * 
   * @param vnode 
   * @param hydrating
   */
init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
```

在init里面，执行了createComponentInstanceForVnode方法。

![image-20200316220802478](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-16-140802.png)



执行`_init`方法，先是调用了initInternalComponent方法。

```
/**
* @param vm 也就是这个组件的实例
*/
function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```

重点是

`opts.parent = options.parent`、`opts._parentVnode = parentVnode`。将options上面的`parent父组件`和`_parentVnode占位组件`都赋给了该组件的$options属性上。

走完initInternalComponent逻辑之后，进入initLifecycle函数。

这里主要就是把parent赋值给`vm.$parent`, 把vm放入`parent.$children`数组里。·

```js
function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }
	// parent
  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

最后组件初始化好后，执行$mount方法。

先执行`_render方法`，返回一个vnode

将当前占位vnode赋值给$vnode

```js
vm.$vnode = _parentVnode;
```

然后执行`_update`方法

```js
Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };
```

接着就是调用了组件的render方法，去创建了一个原生DOM（比如div），再去它的遍历children，去创建子组件。

patch最后其实是返回了一个vnode.$el，一个dom元素。

最后还是走到了init函数，调用initComponent和insert方法。

![image-20200316224956645](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-16-144956.png)



#### 总结

1.patch的过程：createComponent -> 子组件初始化 -> 子组件render  -> 子组件patch

2.activeInstance为当前的组件实例，比如初始化的时候是我们的App组件。

​	vm.$vnode为组件的占位vnode

​	vm._vnode为组件渲染的vnode

渲染vnode理解如下，可以认为是，当组件真正被渲染的时候，组件的rootVnode就是渲染vnode。

占位vnode理解为：在父组件中占一个vnode位置，实际没有什么特殊作用。最后渲染时，是通过这个组件vnode.elm属性上dom来进行渲染的。

![image-20200316224456041](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-16-144456.png)



## 合并Options

很多框架都有自定义options的功能。框架里会对这些传入的options和自身默认的options做一个合并操作。

vue的合并功能写的非常细致化，针对不同的配置，都有不同的合并策略。

具体可以打断点调试这段代码，strat里就存放了很多合并策略。每一个key，都会有不同的合并方法。

```js
function mergeField (key) {
  var strat = strats[key] || defaultStrat;
  options[key] = strat(parent[key], child[key], vm, key);
}
```

比如生命周期hooks的合并，他是合并为一个数组。

```js
/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}
```



合并Options有两种情况，一种是调用Vue.mixin时调用，还有一种是new Vue时，Vue._init方法里调用

### Vue.mixin

Vue.mixin实际上干的就是将Vue.options和传入的options进行合并。

```js
function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    // this.options就是Vue.options
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}
```
而Vue.options里就放了一些空对象，然后设置了一些内置组件
```js
Vue.options = Object.create(null);
ASSET_TYPES.forEach(function (type) {
  Vue.options[type + 's'] = Object.create(null);
});

// this is used to identify the "base" constructor to extend all plain-object
// components with in Weex's multi-instance scenarios.
Vue.options._base = Vue;

extend(Vue.options.components, builtInComponents);

initUse(Vue);
initMixin$1(Vue);
initExtend(Vue);
initAssetRegisters(Vue);
```



Vue的内置组件

<img src="/Users/keyang/Library/Application Support/typora-user-images/image-20200317210829275.png" alt="image-20200317210829275" style="zoom:50%;" />



### new Vue

new Vue是在_init里调用mergeOptions方法的

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
);
```

resolveConstructorOptions里返回的Vue.options.

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-133013.png" alt="image-20200317213013200" style="zoom:50%;" />

options其实就是new Vue时传入的参数

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-133240.png" alt="image-20200317213240188" style="zoom:50%;" />



最后得到一个options:

![image-20200317213641400](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-133642.png)





### 子组件的构建

还有一种mergeOptions的情况。就是子组件创建时，调用的。他实际上和new Vue类似，所以上面不把它归为一类。但是这里会单独拉出来讲

```js
Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
```

![image-20200317214055866](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-134056.png)

这里parent指的仍然是Vue.options，child指的是组件本身的属性。（如果是.vue的文件，会通过loader转化而成的）

最后，在Sub的构造函数里调用`_init`方法，进而调用了initInternalComponent方法。这里会将vm.constructor就是Sub，那么Sub.options会作为`vm.$options`对象的`__proto__`对象。

最终在mount的时候被调用。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-135427.png" alt="image-20200317215426250" style="zoom:50%;" />

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-17-135818.png" alt="image-20200317215817874" style="zoom:50%;" />



# Vue生命周期

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-12-233304.png" alt="Vue 实例生命周期" style="zoom: 50%;" />







### beforeCreate（初始化界面前）

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  // ...
}
```

从源码可以看出来，`beforeCreate`这个阶段，只初始化了vue的内部事件。这个时候data、methods、watch、props、computed等属性还没有初始化。

虽然可以调用$watch方法，但是由于data未初始化，所以监听对象会发生错误。

可以访问$route对象

 vue-router 和 vuex 的时候会发现它们都混合了 `beforeCreate` 钩子函数

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-13-222445.png" alt="image-20200314062444475" style="zoom:50%;" />

### created（初始化界面后）

 `created`这个钩子函数调用时，vue已经初始化好基本的数据。比如：

- props
- methods 
- data
- computed
- watch
- ...

可以去操作这些初始化属性，或者根据他们去准备一些数据。



### beforeMount（渲染dom前）

这个阶段，Vue组件只是判断了一下是否存传入了render方法。

如果没传入，那么创建一个默认的render方法：`createEmptyVNode`。

这个时候可以访问$el对象，但是访问的是渲染之前的dom对象。

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-13-225019.png" alt="image-20200314065018418" style="zoom:33%;" />

这个阶段，vue传入的参数也会对生命周期产生影响。

如果没有传入`el`属性，且没有调用`vm.$mount(el)`那么`beforeMount`和`mounted`钩子函数都不会被进入。

如果传入了`template`，那么render函数会将template编译到最终的页面里。

比如我写了:

```html
#js
new Vue({
	el: '#app',
	template: `<div id="">Hello World</div>`,
})

#html
<body>
  <div id="app">hello world</div>
</body>
```

那么最终呈现的是`Hello World`

由此可以看出来：==实例内部的template属性比外部的优先级高==,



### Mount(渲染dom后)

实例化 `Watcher`

渲染dom，并将渲染后的dom替换了html的dom。

这时候访问vue实例的$el，是更新后的dom。



### beforeUpdate

数据更新时调用，发生在虚拟 DOM 打补丁之前。

这个时候，$data已经变化了。

这里适合在更新之前访问现有的 DOM。

还可以手动移除已添加的事件监听器。

```js
beforeUpdate: function() {
  console.group('beforeUpdate 更新前状态===============》');
  console.log("%c%s", "color:red", "el     : " + this.$el.innerHTML);
  console.log(this.$el); // 因为$el是一个对象，存储的是引用。所以用console.log打印时，显示的是变化后的$el
  console.log("%c%s", "color:red", "data   : " + JSON.stringify(this.$data));
  console.log("%c%s", "color:red", "message: " + this.a);
  console.groupEnd();
},
updated: function() {
  console.group('updated 更新完成状态===============》');
  console.log("%c%s", "color:red", "el     : " + this.$el.innerHTML);
  console.log(this.$el);
  console.log("%c%s", "color:red", "data   : " + JSON.stringify(this.$data));
  console.log("%c%s", "color:red", "message: " + this.a);
  console.groupEnd();
},
```



### updated

当这个钩子被调用时，组件 DOM 已经更新，所以可以执行==依赖于 DOM ==的操作。

但在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](https://cn.vuejs.org/v2/api/#computed)或 [watcher](https://cn.vuejs.org/v2/api/#watch) 取而代之。

这个期间，**不会**保证所有的子组件也都一起被重绘。如果需要等子组件也渲染完成再做逻辑，可以用

```js
this.$nextTick(() => {
	  // Code that will run only after the
    // entire view has been re-rendered
})
```



### beforeDestroy（卸载组件前）

这个阶段，vue其实只是判断了一下，是否已经开始执行了destroy。

这个时候实例还是完全可用的



### destroyed（卸载组件后）

从父组件那将自己移除

删除了自己的所有watcher

对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。



### **❗** keep-alive





## 响应式原理

### Object.defineProperty

vue2.x中的双向绑定是通过Object.defineProperty实现的。

下面来学习这个原理：

Object.defineProperty可以去定义一个对象属性的get、set方法。

但是这个方法有一个缺陷：

**在一个对象的访问器属性中不能直接操作它的数据属性**

```js
const book = {
  name: '明朝那些事',
  author: '当年明月',
}
// 这段代码会超出最大调用栈
Object.defineProperty(book, 'name',{
  configurable: true,
  enumerable: true,
  set (v) {
    if (v == this.name) return;
    this.name = v;
  },
  get () {
    console.log('读取name');
    return this.name;
  }
});

```

![image-20200310221210363](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-03-10-141210.png)

所以需要通过其他的方式。比如预一个变量去先读取值，然后在get的时候返回这个变量的值。

或者去使用其他的属性来替代要获取的属性。

```js
let name = book.name;
Object.defineProperty(book, 'name',{
  configurable: true,
  enumerable: true,
  set (v) {
    if (v == name) return;
    name = v;
  },
  get () {
    return name;
  }
});
book.name = '粉饰太平';

// 通过定义另一个属性去解决上面的问题
Object.defineProperty(book, 'bookName',{
  configurable: true,
  enumerable: true,
  set (v) {
    if (v == this.name) return;
    this.name = v;
  },
  get () {
    console.log('读取name');
    return this.name;
  }
});
book.bookName = '妖孽宫廷';
```





## 依赖搜集

> 原理

通过Object.defineProperty方法，当属性被访问时，一定会触发get方法；

在get方法里就可以进行依赖搜集的操作；

先为这个实例创建一个dep对象；

将调用属性的实例加入到dep对象的subs数组中；

```js
class Dep {
  constructor () {
    this.subs = new Set();
  }

  depend() {
    // 将订阅者注册到这个地方
    if (activiedUpate) {
      this.subs.add(activiedUpate);
    }
  }

  notify() {
    this.subs.forEach(sub => sub());
  }
}

// new Observer就是把obj的所有属性都变成reactive的。
class Observer {
  constructor(obj) {
    Object.keys(obj).forEach((i) => {
      defineReactive(obj, i, obj[i]);
    })
  }
}

function defineReactive(obj, key, val) {
  let dep = new Dep();
  Object.defineProperty(obj, key,{
    configurable: true,
    enumerable: true,
    set (v) {
      if (v == val) return;
      val = v;
      dep.notify();
    },
    get () {
      dep.depend();
      return val;
    }
  });
}

// js是单线程，所以一次只会有1个函数被执行
// 用一个全局的activiedUpate来存储当前执行的update函数
let activiedUpate;
function autoRun(update) {
  // 为什么要用这个wrappedUpdate？
  function wrappedUpdate() {
    activiedUpate = wrappedUpdate;
    update();
    activiedUpate = null;
  }
  wrappedUpdate();
}

// Observer测试
// 先定义一个state对象
let state = {
  a: 3,
}
new Observer(state);
// 设想一个问题，当state.a变化时，怎么能够让b的值也发生变化
autoRun(() => {
  let b = state.a * 10;
  console.log(b);
})
state.a = 4;
```



以上是对object类型的情况。

如果是数组的类型，监控的写法会不一样。

我们通过拦截器的形式：

- 先定义一个数组的原型对象
- 然后在这个原型对象上重写我们的方法，先实现我们自己的业务逻辑，再执行真正的数组的方法。
- 当我们检测到传入的对象是数组时，将对象的原型对象指定为我们自身的原型对象。
- 这样就可以实现对方法的拦截

```js
// 如果是数组的话，怎么进行检测更新？
function isObject(obj) {
  return obj.constructor == Object || obj.constructor == Array;
}

class Dep {
  constructor () {
    this.subs = new Set()
  }
  depend () {
    // 将订阅者注册到这个地方
    if (activiedUpate) {
      this.subs.add(activiedUpate)
    }
  }
  notify () {
    this.subs.forEach(sub => sub())
  }
}

function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * 重写数组对象的原型
 * @param array
 */
function reAssignArrayMethod (array) {
  const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'reverse', 'sort']
  const arrayProto = Object.create(Array.prototype)
  methods.forEach(method => {
    const originalMethod = arrayProto[method]
    Object.defineProperty(arrayProto, method, {
      value: (...args) => {
        const result = originalMethod.apply(array, args)
        // 调用ob对象去notify
        array['_ob_'].dep.notify()
        return result
      },
      enumerable: true,
      writable: true,
      configurable: true
    })
  })
  array.__proto__ = arrayProto
}

// new Observer就是把obj的所有属性都变成reactive的。
class Observer {
  constructor (obj) {
    this.dep = new Dep()
    def(obj, '_ob_', this)
    if (Array.isArray(obj)) {
      reAssignArrayMethod(obj)
    } else {
      Object.keys(obj).forEach((i) => {
        defineReactive(obj, i, obj[i])
      })
    }
  }
}

function createObserver (val) {
  if (!isObject(val)) {
    return
  }
  const ob = new Observer(val);
  return ob;
}

function defineReactive (obj, key, val) {
  let dep = new Dep()
  const childOb = createObserver(val)
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set (v) {
      if (v == val) return
      val = v
      dep.notify();
    },
    get () {
      dep.depend()
      if (childOb) {
        childOb.dep.depend()
      }
      return val
    }
  })

}

// js是单线程，所以一次只会有1个函数被执行
// 用一个全局的activiedUpate来存储当前执行的update函数
let activiedUpate

function autoRun (update) {
  // 为什么要用这个wrappedUpdate？设置全局activiedUpate
  function wrappedUpdate () {
    activiedUpate = wrappedUpdate
    update()
    activiedUpate = null
  }

  wrappedUpdate()
}

// 测试
const state = {
  array: [0, 1, 2]
}
new Observer(state)
autoRun(() => {
  console.log(state.array)
})
state.array.push(3)

```



Vue在渲染组件时， 返回get() -> 获取正在计算的watcher （Dep.target）-> 将这个渲染watcher添加到属性的Dep.subs()里。

get() -> 搜集正在计算的watcher （Dep.target）-> 将渲染watcher添加到属性的Dep.subs()里



为什么会cleanup deps









[vue面试题](https://juejin.im/post/5e5485786fb9a07c9c6a54be)

