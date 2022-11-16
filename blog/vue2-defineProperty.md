> 本文基于Vue 2.6.14进行源码分析
> 为了增加可读性，会对源码进行删减、调整顺序、改变的操作，文中所有源码均可视作为伪代码

# 文章内容

1. 响应式原理相关function和class的讲解
2. Object数据类型的响应式初始化和特殊更新模式
3. Array数据类型的响应式初始化和特殊更新模式
4. 渲染Watcher的依赖收集和派发更新分析：流程图
5. computed类型的依赖收集和派发更新分析：流程图和源码分析
6. watch类型的的依赖收集和派发更新分析：源码分析

# 响应式原理初始化
## 响应式数据设置代理

- 访问props的item对应的key时，使用`this.[key]`会自动代理到`vm._props.[key]`
- 访问data的item对应的key1时，使用`this.[key1]`会自动代理到`vm._data.[key1]`

```javascript
function initProps(vm: Component, propsOptions: Object) {
    for (const key in propsOptions) {
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
}
```
```javascript
function initData(vm: Component) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {};
    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i = keys.length
    while (i--) {
        const key = keys[i]
        // 监测props是否已经有这个key了，有的话弹出警告
        proxy(vm, `_data`, key)
    }
}
```
```javascript
export function proxy(target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

## Vue.props响应式数据设置
> 在合并配置mergeOptions()中，会调用normalizeProps()对props的数据进行整理，最终确保initPros调用时`props`已经是一个对象，因此不需要Observer判断是否是数组，直接对key进行defineReactive即可
```javascript
function initProps(vm: Component, propsOptions: Object) {
    const propsData = vm.$options.propsData || {}
    const props = vm._props = {}
    const keys = vm.$options._propKeys = []

    for (const key in propsOptions) {
        keys.push(key)
        const value = validateProp(key, propsOptions, propsData, vm)
        defineReactive(props, key, value)
    }
}
```
## Vue.data响应式数据设置

- 为`data`建立一个`Observer`，主要功能是根据value类型判断，是数组则递归调用`observe`，为每一个item都创建一个`Observer`对象，如果是对象，则遍历`key`，为每一个`key`都创建响应式监听

```javascript
function initData(vm: Component) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {}
    // observe data
    observe(data, true /* asRootData */)
}

export function observe(value: any, asRootData: ?boolean): Observer | void {
    if (!isObject(value) || value instanceof VNode) {
        return
    }
    // ... 判断数据value是否已经设置响应式过
    let ob = new Observer(value)
    return ob
}
```
```javascript
export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data

    constructor(value: any) {
        this.value = value
        this.dep = new Dep()
        if (Array.isArray(value)) {
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    walk(obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }

    observeArray(items: Array<any>) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}
```
## Object.defineProperty响应式基础方法

- `get`：返回对应key的数据 + 依赖收集
- `set`：设置对应key的数据+派发更新

```javascript
export function defineReactive(obj: Object, key: string, val: any, ...args) {
    const dep = new Dep()
    let childOb = !shallow && observe(val) // 如果val也是object

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    // key对应的val是Object,当val里面的key发生改变时
                    // 即obj[key][key1]=xxx
                    // 也会通知目前obj[key]收集的Watcher的更新
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}
```
## Dep响应式依赖管理类

- 每一个key都有一个`Dep`管理类
- `Dep`具备`addSub`，即关联`Watcher`(渲染Watcher或者其它)的能力
- `Dep`具备`depend()`，被`Watcher`显式关联，可以被`Watcher`触发`dep.notify()`通知它关联`Watcher`更新的能力

```javascript
Dep.target = null
const targetStack = []
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```
## Watcher响应式依赖收集和派发更新执行类

- `get()`方法进行`pushTarget(this)`，触发对应的`getter`回调，开始收集，然后`popTarget(this)`，停止收集，最后触发`cleanupDeps()`进行依赖的更新
- `update()`将更新内容压入队列中，然后根据顺序调用`Watcher.run()`，也就是回调`constructor()`传进来的`this.cb`方法

```javascript
export default class Watcher {
    constructor(...args) {
        this.vm = vm
        if (isRenderWatcher) {
            vm._watcher = this
        }
        vm._watchers.push(this)
        this.cb = cb; // 触发更新时调用的方法
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.value = this.lazy
            ? undefined
            : this.get()
    }

    get() {
        pushTarget(this)
        let value
        const vm = this.vm
        value = this.getter.call(vm, vm)
        if (this.deep) {
            traverse(value)
        }
        popTarget()
        this.cleanupDeps()
        return value
    }

    addDep(dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }


    update() {
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

   
    run() {
        if (this.active) {
            const value = this.get()
            if (value !== this.value || isObject(value) || this.deep) {
                const oldValue = this.value
                this.value = value
                if (this.user) {
                    const info = `callback for watcher "${this.expression}"`
                    invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }

    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}
```
# Object数据类型响应式
## 最外一层key的响应式设置
使用`observe()`对每一个`Object`的`key`都进行`Object.defineProperty()`劫持
```javascript
function observe(value, asRootData) {
    ob = new Observer(value);
    return ob
}

var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    this.walk(value);
};
walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}
```
```javascript
export function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            dep.notify()
        }
    })
}
```
## 深度key的响应式设置
```javascript
export function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
    const dep = new Dep()
    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}
```

- 由上面对`observe()`方法的分析，它会遍历`Object`的每一个`key`，进行`Object.defineProperty`声明
- 对于`Object`每一个`key`对应的`value`，如果`childOb = !shallow && observe(val)`不为空，那么它会遍历`value`对应的每一个`key`，如果`value[key]`也是一个`Object`，那么会再次走到`childOb = !shallow && observe(val)`，直到所有`Object`都为响应式数据为止
- 对于`obj[key]`来说，会调用`dep.depend()`，如果`obj[key]`本身也是一个对象，即`childOb`不为空，那么它就会调用`childOb.dep.depend()`，因此当`obj[key][key1]=xx`时，也会触发`dep.depend()`收集的`Watcher`发生更新，例如

```javascript
data: {
  parent: {
    children: {test: "111"}
  }
}


<div>{{parent.children}}</div>
```
由上面的分析可以知道，当`this.parent.children.test`发生变化时，会触发`this.parent.children`收集的`渲染Watcher`发生变化，从而触发界面重新渲染
## 额外添加key
由于`Object.defineProperty()`的限制，无法实现对`Object`新增`key`的响应式监听，因此当我们想要为`Object`设置新的`key`的时候，需要调用`Vue.set`方法

```javascript
export function set(target: Array<any> | Object, key: any, val: any): any {
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    const ob = (target: any).__ob__;
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}
```

`Vue.set()`的流程可以总结为：

- 为`Object`增加对应的`key`和`value`数据
- 将新增的`key`加入响应式监听中，如果`key`对应的`value`也是`Object`，按照上面深度key的监听设置分析，会递归调用`observe`进行深度key的响应式设置
- 手动触发`Object`收集的`Watcher`的刷新操作
> 本质上，上面的三步流程除了第二步有略微差别之外，其它部分跟defineReactive中的set()方法流程一致

## 删除key
删除`key`也无法触发响应式的变化，需要手动调用`Vue.del()`方法：

- 删除`Object`指定的`key`
- 手动触发`Object`收集的`Watcher`的刷新操作

```javascript
function del(target: Array<any> | Object, key: any) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1)
        return
    }
    const ob = (target: any).__ob__
    if (!hasOwn(target, key)) {
        return
    }
    delete target[key]
    if (!ob) {
        return
    }
    ob.dep.notify()
}
```
# Array数据类型响应式
## 前置说明
根据[官方文档](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E6%95%B0%E7%BB%84)说明，Vue 不能检测以下数组的变动

- 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如：vm.items.length = newLength

举个例子：
```javascript
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```
为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将在响应式系统内触发状态更新
```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```
为了解决第二类问题，你可以使用 splice：
```javascript
vm.items.splice(newLength)
```
## 对Array[index]数据的响应式监听
如果`item=Array[index]`是`Object`数据，使用`observe()`对`Array`的每一个`item`都进行响应式的声明
```javascript
function observe(value, asRootData) {
    ob = new Observer(value);
    return ob
}

var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
        if (hasProto) {
            protoAugment(value, arrayMethods)
        } else {
            copyAugment(value, arrayMethods, arrayKeys)
        }
        this.observeArray(value)
    }
};

observeArray(items: Array < any >) {
    for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i])
    }
}
```
## Vue.set更新Array-item
从下面代码可以看出，`Vue.set()`更新数组的`item`本质上也是调用`Array.splice()`方法
```javascript
export function set(target: Array<any> | Object, key: any, val: any): any {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
}
```
## Array.splice更新Array-item
从上面的分析可以知道，一开始会触发`new Observer(value)`的初始化<br />从下面代码可以知道，大部分浏览器会触发`protoAugment()`方法，也就是改变`Array.__proto__`
```javascript
var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
        if (hasProto) {
            protoAugment(value, arrayMethods)
        } else {
            copyAugment(value, arrayMethods, arrayKeys)
        }
        this.observeArray(value)
    }
};

function protoAugment (target, src: Object) {
  target.__proto__ = src
}
// node_modules/vue/src/core/observer/array.js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
```
而改变了`Array.__proto__`多少方法呢？
```javascript
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
```
```javascript
methodsToPatch.forEach(function (method) {
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) ob.observeArray(inserted)
        // notify change
        ob.dep.notify()
        return result
    })
})
// node_modules/vue/src/core/util/lang.js
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}
```
从上面代码分析可以知道，`Vue`劫持了`Array`的`'push'`,`'pop'`,`'shift'`,  `'unshift'`, `'splice'`, `'sort'`,`'reverse'`方法，一旦运行了这些方法，会主动触发：

- 调用`Array`原来的方法进行调用，然后返回`Array`原来的方法的返回值，如`Array.push`调用后的返回值
- 进行`observeArray`的响应式设置，更新新设置的`item`(可能为`Object`，需要设置响应式)
- 手动触发`ob.dep.notify()`，触发对应的`Watcher`更新，达到响应式自动更新的目的

# 渲染Watcher依赖收集流程分析
> 仅仅分析最简单的渲染Watcher依赖收集的流程，实际上并不是只有渲染Watcher一种

![Vue2-watch-依赖收集.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667740052766-1ea207c1-4c12-4bfa-b959-c81f5fdea0a2.svg#clientId=u9ddbf7f0-6edf-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ua41172f6&margin=%5Bobject%20Object%5D&name=Vue2-watch-%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86.svg&originHeight=697&originWidth=841&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20742&status=done&style=none&taskId=u62f39cd1-1493-4d07-bb77-4f372a4c289&title=)
# 渲染Watcher派发更新流程分析
![Vue2-paifagengxin.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1666531557436-8fce70c5-11b7-42c7-aed5-d62f694ecbf6.svg#clientId=u650da562-c25e-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ud261adde&margin=%5Bobject%20Object%5D&name=Vue2-paifagengxin.svg&originHeight=786&originWidth=1088&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23072&status=done&style=none&taskId=u674587b2-58c6-48fc-a28d-e4735c2d5d7&title=)
# computed依赖收集和派发更新分析
## 测试代码
```javascript
<div>{{myName}}</div>

// { [key: string]: Function | { get: Function, set: Function } }
computed: {
  myName: function() {
    // 没有set()方法，只有get()方法
    return this.firstName + this.lastName;
  }
}
```
## 依赖收集流程图分析
## ![Computed-watcher收集依赖.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667746530083-ec021791-0778-4dbb-8406-71970b7e130c.svg#clientId=u9ddbf7f0-6edf-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u716ac54a&margin=%5Bobject%20Object%5D&name=Computed-watcher%E6%94%B6%E9%9B%86%E4%BE%9D%E8%B5%96.svg&originHeight=1064&originWidth=1273&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41646&status=done&style=none&taskId=ue4e583aa-3c8e-4bb1-8e43-70a510e462e&title=)
## 依赖收集代码分析
### computedWatcher初始化
`Vue.prototype._init`初始化时，会调用`initState()->initComputed()`，从而进行`computed`数据的初始化
```javascript
// node_modules/vue/src/core/instance/state.js
function initComputed(vm: Component, computed: Object) {
    const watchers = vm._computedWatchers = Object.create(null)

    for (const key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions //{ lazy: true }
        )
        defineComputed(vm, key, userDef);
    }
}
```
从上面代码可以知道，最终为每一个`computed`监听的数据建立一个`Watcher`，一个数据对应一个`computed Watcher，传入{ lazy: true }`，然后调用`defineComputed()`方法
```javascript
export function defineComputed(target: any, key: string, userDef: Object | Function) {
    // 为了减少分支判断，方便理解，统一假设userDef传入Function
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}
```
从上面代码可以知道，最终`defineComputed`是进行了`Object.defineProperty`的数据劫持，一般在`computed`中都只写`get()`方法，即
```javascript
computed: {
  myName: function() {
    // 没有set()方法，只有get()方法
    return this.firstName + this.lastName;
  }
}
```
而回到上面代码的分析，`defineComputed`劫持了`computed`的`get()`方法，最终返回`watcher.value`
### 渲染Watcher触发ComputedWatcher的get()方法执行
当界面上`<template>{myName}</template>`渲染`myName`的时候，会触发`myName`的`get()`方法，由于`Object.defineProperty`的数据劫持，会先调用

- `watcher.evaluate()`->`watcher.get()`（从下面的代码可以得出这样的推导关系）
- `watcher.depend()`
```javascript
const watcher = this._computedWatchers && this._computedWatchers[key]
if (watcher) {
    if (watcher.dirty) {
        // evaluate () {
        //     this.value = this.get()
        //     this.dirty = false
        // }
        watcher.evaluate()
    }
    if (Dep.target) {
        // depend() {
        //     let i = this.deps.length
        //     while (i--) {
        //         this.deps[i].depend()
        //     }
        // }
        watcher.depend()
    }
    return watcher.value
}
```
```javascript
// watcher.js
get() {
   //  function pushTarget (target: ?Watcher) {
   //    targetStack.push(target)
   //    Dep.target = target
		// }
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
        // this.getter = return this.firstName + this.lastName;
        value = this.getter.call(vm, vm);
    } catch (e) {} 
    finally {
        if (this.deep) { // watch类型的watcher才能配置这个参数
            traverse(value);
        }
        popTarget();
        this.cleanupDeps();
    }
    return value;
}
```
从上面的代码可以知道，当调用`watcher.evaluate()`->`watcher.get()`的时候，会调用：

- pushTarget(this)：将目前的`Dep.target `切换到`Computed Watcher`
- this.getter.call(vm, vm)：触发`this.firstName`对应的`get()`方法和`this.lastName`对应的`get()`方法。由下面的依赖收集代码可以知道，此时`this.firstName`和`this.lastName`持有的`Dep`会进行`dep.addSub(this)`，收集该`Computed Watcher`
- popTarget()：将目前的`Dep.target`恢复到上一个状态
- `cleanupDeps()`：更新`Computed Watcher`的所有依赖关系，将无效的依赖关系删除(比如`v-if`造成的依赖关系不用再依赖)
- 最终返回`myName`= `return this.firstName + this.lastName;`
> watcher.evaluate()：求值 + 更新依赖 + 将涉及到的响应式对象firstName和lastName关联到Computed Watcher

```javascript
export function defineReactive(obj: Object, key: string, val: any, ...args) {
    const dep = new Dep()
    let childOb = !shallow && observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        }
    })
}

// Dep.js
depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}

// watcher.js
addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
            dep.addSub(this)
        }
    }
}
```
回到`myName`的`get()`方法，即下面的代码，我们刚刚分析了`watcher.evaluate()`，那么我们接下来还调用了`myName`中`watcher.depend()`<br />我们从上面的代码知道，这个方法主要是用来收集依赖的，此时的`Dep.target`是`渲染Watcher`，`computed Watcher`会进行自身的`depend()`，本质是拿出自己所有记录的`Dep(为了方便理解，我们理解Dep就是一个响应式对象的代理)`，`computed Watcher`拿出自己记录的所有的`deps[i]`，然后调用它们的`depend()`方法，从而完成这些响应式对象(`firstName`和`lastName`)与`渲染Watcher`的关联，最后返回`watcher.value`
```javascript
const watcher = this._computedWatchers && this._computedWatchers[key]
if (watcher) {
    if (watcher.dirty) {
        // 上面分析触发了watcher.get()方法
        // 得到对应的watcher.value
        // 收集了firstName+lastName和computerWatcher的绑定
        watcher.evaluate();
        // 将目前的Dep.target切换到渲染Watcher
    }
    if (Dep.target) {
        // depend() {
        //     let i = this.deps.length
        //     while (i--) {
        //         this.deps[i].depend()
        //     }
        // }
        watcher.depend()
    }
    return watcher.value
}

// watcher.js
depend() {
    // this.deps是从cleanupDeps()中
    // this.deps = this.newDeps来的
    // this.newDeps是通过addDep()来的
    let i = this.deps.length
    while (i--) {
        this.deps[i].depend()
    }
}

// Dep.js
depend() {
    if (Dep.target) {
        Dep.target.addDep(this)
    }
}
```
## 派发更新流程图分析
![Computed-watcher派发更新.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667750143614-a0699891-6765-4c54-b60f-b92584ecd595.svg#clientId=u9ddbf7f0-6edf-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u984cc269&margin=%5Bobject%20Object%5D&name=Computed-watcher%E6%B4%BE%E5%8F%91%E6%9B%B4%E6%96%B0.svg&originHeight=1047&originWidth=1410&originalType=binary&ratio=1&rotation=0&showTitle=false&size=34674&status=done&style=none&taskId=u0a85ce78-d8c8-4f7a-8ecc-ea7b39511dc&title=)
## 派发更新代码分析
```javascript
computed: {
  myName: function() {
    // 没有set()方法，只有get()方法
    return this.firstName + this.lastName;
  }
}
```
当`this.firstName`发生改变时，会触发`this.firstName.dep.subs.notify()`功能，也就是触发刚刚注册的两个`Watcher`: `渲染Watcher`和`Computed Watcher`，首先触发的是`Computed Watcher`的`notify()`方法，由下面的代码可以知道，只执行`this.dirty=true`
```javascript
  update () {
    // Computed Watcher的this.lazy都为true
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```
然后触发`渲染Watcher`，触发整个界面进行渲染，从而触发该`computed[key]`的`get()`方法执行，也就是`myName`的`get()`方法执行，由依赖收集的代码可以知道，最终执行为
```javascript
const watcher = this._computedWatchers && this._computedWatchers[key]
if (watcher) {
    if (watcher.dirty) {
        // 上面分析触发了watcher.get()方法
        // 得到对应的watcher.value
        watcher.evaluate();
    }
    if (Dep.target) {
        // depend() {
        //     let i = this.deps.length
        //     while (i--) {
        //         this.deps[i].depend()
        //     }
        // }
        watcher.depend()
    }
    return watcher.value
}
```
从上面的分析可以知道，`computed[key]`的`get()`先收集了一波依赖：

- watcher.evaluate()：求值watcher.value + 更新依赖 + 将涉及到的响应式对象关联到`Computed Watcher`
- watcher.depend()：将涉及到的响应式对象关联到当前的`Dep.target`，即`渲染Watcher`

然后返回了对应的值`watcher.value`
> computedWatcher一般无set方法，因此触发派发更新就是触发渲染Watcher/其它Watcher持有computed进行重新渲染，从而触发computed的get方法，收集最新依赖以及获取最新值

# watch依赖收集和派发更新分析
> watch流程图跟computed流程大同小异，因此watch只做源码分析

## 测试代码
`watch`支持多种模式的监听方式，比如传入一个回调函数，比如传入一个方法名称，比如传入一个`Object`，配置参数
```javascript
// { [key: string]: string | Function | Object | Array }
watch: {
    a: function (val, oldVal) {},
    b: 'someMethod', // 方法名
    c: {
      handler: function (val, oldVal) {}, // 值改变时的回调方法
      deep: true, // 深度遍历
      immediate: true // 马上回调一次
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1', // 方式1
      function handle2 (val, oldVal) {}, // 方式2
			{ // 方式3
        handler: function (val, oldVal) {},
        deep: true,
        immediate: true
    	},
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) {}
}
```
## 初始化watch
```javascript
export function initState(vm: Component) {
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}
function initWatch(vm: Component, watch: Object) {
    for (const key in watch) {
        const handler = watch[key];
        // 处理watch:{b: [三种形式都允许]}的形式
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}
function createWatcher(vm: Component, expOrFn: string | Function, handler: any, options?: Object) {
    if (isPlainObject(handler)) {
        // 处理watch:{b: {handler: 处理函数, deep: true, immediate: true}}的形式
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        // 处理watch: {b: 'someMethod'}的形式
        handler = vm[handler]
    }
    return vm.$watch(expOrFn, handler, options)
}
```
从上面的代码可以看出，初始化时，会进行`watch`中各种参数的处理，将3种不同类型的`watch`回调模式整理成为规范的模式，最终调用`Vue.prototype.$watch`进行`new Watcher`的构建
```javascript
Vue.prototype.$watch = function (expOrFn: string | Function, cb: any, options?: Object): Function {
    const vm: Component = this
    // cb是回调方法，如果还是对象，则使用createWatcher拆出来里面的对象
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
    }
    options.user = true
    // 建立一个watch类型的Watcher
    // expOrFn: getter
    // cb: 注册的回调
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        // options={immediate:true}的分支逻辑
        pushTarget()
        invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
        popTarget()
    }
    return function unwatchFn() {
        watcher.teardown()
    }
}
```
## 依赖收集代码分析
新建`Watcher`的时候， 在`constructor()`中会触发
```javascript
class watcher {
	constructor() {
    // watch的key
    this.getter = parsePath(expOrFn);
    this.value = this.lazy?undefined:this.get();
}

const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```
从上面的代码可以知道，最终`this.getter`调用的还是传入的`obj[key]`，从下面的`get()`方法可以知道，赋值`this.getter`后，会触发`get()`方法，从而触发`this.getter.call(vm, vm)`，因此最终`this.getter`得到的就是`vm[key]`
```javascript
get() {
    pushTarget(this)
    let value
    const vm = this.vm
    value = this.getter.call(vm, vm)
    if (this.deep) {
        traverse(value); // 深度遍历数组/对象，实现
    }
    popTarget()
    this.cleanupDeps()
    return value
}

// traverse.js
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```
上面代码的步骤可以概括为

- pushTarget：修复当前的`Dep.target`为当前的`watch类型的Watcher`
- this.getter：返回当前的`vm[key]`，同时触发`vm[key]`的响应式劫持`get()`方法，从而触发`vm[key]`持有的`Dep`对象启动`dep.depend()`进行依赖收集(如下面代码所示)，`vm[key]`持有的`Dep`对象将当前的`watch类型的Watcher`收集到`vm[key]`中，下次`vm[key]`发生变化时，会触发`watch类型的Watcher`进行`callback的回调`
- traverse(value)：深度遍历，会访问每一个Object的key，由于每一个Object的key之前在initState()的时候已经使用`Object.defineProperty()`进行get方法的劫持，因此触发它们对应的getter方法，进行`dep.depend()`收集当前的`watch类型的Watcher`，从而实现改变Object内部深层的某一个key的时候会回调`watch类型的Watcher`。没有加`deep=true`的时候，`watch类型的Watcher`只能监听Object的改变，比如watch:{curData: function(){}}，只有this.curData=xxx，才会触发watch，this.curData.children=xxx是不会触发的
- popTarget：恢复`Dep.target`为上一个状态
- cleanupDeps：更新依赖关系
- 返回值value，依赖收集结束，`watch类型的Watcher`初始化结束

```javascript
Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
        const value = getter ? getter.call(obj) : val
        if (Dep.target) {
            dep.depend()
            if (childOb) {
                childOb.dep.depend()
                if (Array.isArray(value)) {
                    dependArray(value)
                }
            }
        }
        return value
    }
})
```
## 派发更新代码分析
当`watcher`的值发生改变时，会触发`dep.subs.notify()`方法，从上面的分析可以知道，最终会调用`watcher.run()`方法
```javascript
run() {
    if (this.active) {
        const value = this.get()
        if (
            value !== this.value ||
            isObject(value) ||
            this.deep
        ) {
            // set new value
            const oldValue = this.value
            this.value = value
            if (this.user) {
                const info = `callback for watcher "${this.expression}"`
                invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
            } else {
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }
}
```
由于`watch类型的Watcher`传入了`this.user=true`，因此会触发`invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)`，将新值和旧值一起回调，比如
```javascript
watch: {
  myObject: function(value, oldValue) {//新值和旧值}
}
```
## watchOptions几种模式分析
### deep=true
```javascript
// watcher.js
get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
        value = this.getter.call(vm, vm)
    } catch (e) {
        if (this.user) {
            handleError(e, vm, `getter for watcher "${this.expression}"`)
        } else {
            throw e
        }
    } finally {
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
            traverse(value)
        }
        popTarget()
        this.cleanupDeps()
    }
    return value
}
```
在`get()`方法中进行对象的深度key的遍历，触发它们的`getter()`方法，进行依赖的收集，可以实现
```javascript
watch: {
  myObject: {
    deep: true,
    handler: function(value, oldValue) {//新值和旧值}
  }
}

this.myObject.a = 2;
```
虽然上面的例子只是监听了`myObject`，但是由于加入`deep=true`，因此`this.myObject.a`也会触发`watcher.run()`，如下面代码所示，由于`this.deep=true`，因此会回调`cb(value, oldValue)`
```javascript
run() {
    if (this.active) {
        const value = this.get()
        if (
            value !== this.value ||
            isObject(value) ||
            this.deep
        ) {
            // set new value
            const oldValue = this.value
            this.value = value
            if (this.user) {
                const info = `callback for watcher "${this.expression}"`
                invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
            } else {
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }
}
```
### immediate=true
从下面代码可以知道，当声明`immediate=true`的时候，初始化`Watcher`，会马上调用`invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)`，即`cb`的回调
```javascript
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        const info = `callback for immediate watcher "${watcher.expression}"`
        pushTarget()
        invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
        popTarget()
    }
    return function unwatchFn() {
        watcher.teardown()
    }
}

watch: {
    myObject:
    {
        immediate: true,
      	handler: function() {...初始化马上触发一次}
    }
}
```
### sync=true
如果声明了`sync=true`，在`dep.sub.notify()`中，会马上执行，如果没有声明`sync=true`，会推入队列中，等到下一个`nextTick`周期才会执行
```javascript
update() {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()
    } else {
        queueWatcher(this)
    }
}

export function queueWatcher(watcher: Watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
        } else {
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }
        // queue the flush
        if (!waiting) {
            waiting = true

            if (process.env.NODE_ENV !== 'production' && !config.async) {
                flushSchedulerQueue()
                return
            }
            nextTick(flushSchedulerQueue)
        }
    }
}
```
# 参考文章

1. [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/)
