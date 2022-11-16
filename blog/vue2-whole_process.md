> 本文基于Vue 2.6.14进行源码分析
> 为了增加可读性，会对源码进行删减、调整顺序、改变的操作，文中所有源码均可视作为伪代码

# 文章内容

- 流程图展示Vue2初始化渲染流程
- 源码(删减、调整顺序)分析无/有Component时的渲染流程
- 用简单例子，进行整体流程的分析

# 整体流程图
![Vue2整体流程.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667663769904-2d71ff9c-cd82-4602-878a-2ce6ab9ad25f.svg#clientId=ub81b81ba-2038-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ub3b14172&margin=%5Bobject%20Object%5D&name=Vue2%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B.svg&originHeight=1160&originWidth=1230&originalType=binary&ratio=1&rotation=0&showTitle=false&size=47227&status=done&style=none&taskId=u07b955a3-9950-4a58-a35c-836e25205c1&title=)
# 流程图代码分析
## _init()：初始化逻辑
1. 初始化生命周期
2. 初始化event
3. 初始化createElement等渲染方法
4. 生命周期`beforeCreate`调用
5. 初始化props、methods、data、computed、watch
6. 生命周期`created`调用
7. `vm.$mount`渲染到真实DOM上
```javascript
function Vue (options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
    const vm = this;
   
    // 合并配置
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
    );
    initLifecycle(vm); // 初始化生命周期
    initEvents(vm); // 初始化event
    initRender(vm); // 初始化createElement等渲染方法
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm); // 初始化props、methods、data、computed、watch
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
};
```
## 实例挂载分析
### Vue.$mount流程
从下面的代码分析可以知道，`Vue.$mounte`首先会判断是否有`render()`方法，如果没有手写`render()`方法，只有`<template>`，那得先把`template`转化为`render()`的模式，最终一切渲染都得转化为`render()`方法
```javascript
// node_modules/vue/src/platforms/web/entry-runtime-with-compiler.js
const mount = Vue.prototype.$mount; // 在原来$mount()基础上再封装一层逻辑，然后调用原来的$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  const options = this.$options
 
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
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

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  return mount.call(this, el, hydrating)
}
```
### 初始化渲染Watcher
由下面代码可以知道，转化`render()`会进行`渲染Watcher`的注册，然后调用生命周期`mounted`调用
从下面代码分析也可以知道，最终渲染触发的方法是`vm._update(vm._render(), hydrating)`
```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// node_modules/vue/src/core/instance/lifecycle.js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
  callHook(vm, 'beforeMount')

  // 删除源码中的if分支
  let updateComponent;
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
> 初次渲染会触发new Watcher的渲染，由于初次渲染`vm._isMounted=false`，因此不会调用生命周期`beforeUpdate`，只有下一次渲染才会触发生命周期`beforeUpdate`的打印
### vm._render()
最终通过调用`render()`方法进行渲染，然后返回`VNode`数据<br />`render`函数传入`vm.$createElement`进行渲染<br />在上面上面`initRender()`的分析中，我们知道`vm.$createElement=createElement`<br />而`createElement`实际上会调用`_createElement`
```javascript
// node_modules/vue/src/core/instance/render.js
Vue.prototype._render = function (): VNode {
    // ...
  	const { render, _parentVnode } = vm.$options
    vnode = render.call(vm._renderProxy, vm.$createElement)
    if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0]
    }
    if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
}
```
#### _createElement()

- VNode的children节点进行处理，可能是任意类型，我们需要处理为规范的`length=1`的`VNode`数组
- 根据`tag`进行`VNode`的创建，比如`Component`组件类型，需要调用不同的创建方法
- 最后返回创建的`VNode`
```javascript
function _createElement(context, tag, data, children, normalizationType) {

    // children的整理和规范化
    if (Array.isArray(children) && typeof children[0] === 'function') {
        data = data || {};
        data.scopedSlots = { default: children[0] };
        children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
    }

    // 根据tag做类型判断，是要直接创建createVNode还是createComponent
    // 本质都是返回VNode数据
    var vnode, ns;
    if (typeof tag === 'string') {
        var Ctor;
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
        if (config.isReservedTag(tag)) {
            vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            );
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            // component
            vnode = createComponent(Ctor, data, context, children, tag);
        } else {
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            );
        }
    } else {
        vnode = createComponent(tag, data, context, children);
    }


    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        if (isDef(ns)) { applyNS(vnode, ns); }
        if (isDef(data)) { registerDeepBindings(data); }
        return vnode
    } else {
        return createEmptyVNode()
    }
}
```
#### createComponent()：创建组件类型的VNode
>  如果遇到组件类型，_createElement()则调用createComponent()进行组件VNode的创建

- 继承Vue函数，构建扩展后的`Constructor()`方法
- 合并4个钩子到`VNodeData.hook`中，方便后续逻辑调用
- 传入上面构建的`Ctor`和`VNodeData`作为参数，实例化`VNode`
- 返回`VNode`
```javascript
// node_modules/vue/src/core/vdom/create-component.js
export function createComponent(...args): VNode | Array<VNode> | void {

    // core/global-api/index.js: Vue.options._base = Vue
    // 因此baseCtor = Vue
    const baseCtor = context.$options._base
    if (isObject(Ctor)) {
        // Vue.extend = function (extendOptions: Object): Function {
        //     const Sub = function VueComponent(options) {
        //         this._init(options)
        //     }
        // }
        Ctor = baseCtor.extend(Ctor); // 返回Vue的继承类，继承基础上扩展一些功能
    }

    // 合并4个钩子函数到VNodeData.hook中，方便后续逻辑调用
    installComponentHooks(data)

    // 创建vue-component类型的VNode
  	const name = Ctor.options.name || tag;
    const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,
        { Ctor, propsData, listeners, tag, children },
        asyncFactory
    )

    return vnode
}

const componentVNodeHooks = {
    init (...){},
    prepatch (...){},
    insert (...){},
    destroy (...){}
}
const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks(data: VNodeData) {
    const hooks = data.hook || (data.hook = {})
    for (let i = 0; i < hooksToMerge.length; i++) {
        const key = hooksToMerge[i]
        const existing = hooks[key]
        const toMerge = componentVNodeHooks[key]
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
        }
    }
}
```
### vm._update()

- 作用：获取`vm._render()`渲染的`VNode`，进行真实`DOM`的渲染
- 流程：分为3种情况进行分析，核心是调用`createElm()`方法进行VNode的渲染
```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    // ...
    if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
    }
    // ...
}
// node_modules/vue/src/platforms/web/runtime/index.js
Vue.prototype.__patch__ = inBrowser ? patch : noop
// node_modules/vue/src/platforms/web/runtime/patch.js
export const patch: Function = createPatchFunction({ nodeOps, modules })
```
```javascript
// node_modules/vue/src/core/vdom/patch.js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction(backend) {
    const cbs = {};
    const { modules, nodeOps } = backend;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = []
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
    }
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isRealElement) {
            oldVnode = emptyNodeAt(oldVnode)
        }

        // 三种情景代码...
    }
}
```
#### patch情景1:  初始化root/渲染更新-无可复用的VNode
```javascript
return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
    }
    var isRealElement = isDef(oldVnode.nodeType);
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
        // 初始化root时调用
        // index.html的id='app'
        const oldElm = oldVnode.elm
        // id='app'的<div>的parent，即body
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
        // destroy old node
        if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode)
        }
    }
}
```

- 初始化root时调用，进行`newVNode`的创建，然后插入到`id=app`的旁边，然后删除`<div id="app">`的DOM，如下面代码所示
- 渲染更新-无可复用的VNode，监测到`sameVnode()=false`，说明当前VNode无法复用，不是之前那个`VNode`，直接重新建立一个新的`VNode`，然后将旧的`VNode`删除(跟初始化root流程差不多)
```html
// 初始化root
// patch之前的状态
<div id='app'></div>

// createElm之后的状态
<div id='app'></div>
<div id='app1'></div>

// destroy old node
<div id='app1'></div>
```
#### patch情景2:  渲染更新-可复用的VNode进行patchVnode
监测到`sameVnode()=true`，说明当前VNode可复用，直接进行数据更新，以及它们的`children`的`diff`比较，找出`children`可复用的地方(不可复用的地方得重新创建和销毁)
```javascript
var isRealElement = isDef(oldVnode.nodeType);
if (!isRealElement && sameVnode(oldVnode, vnode)) {
    // patch existing root node
    patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
}
function sameVnode(a, b) {
    return (
        a.key === b.key &&
        a.asyncFactory === b.asyncFactory && (
            (
                a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)
            ) || (
                isTrue(a.isAsyncPlaceholder) &&
                isUndef(b.asyncFactory.error)
            )
        )
    )
}
```
注：当两个VNode的key、tag、isComment、VNodeData、inputType都相同时，说明是同一个节点，只是有所改变，可以进行复用

**patchVnode()流程**
- 因为oldVNode和newVNode是同一个节点(sameVnode=true)，尝试将oldVNode转化为新VNode，包括props、listeners、slot等更新
- 执行`update`的钩子函数（自定义指令注册）
- 根据它们各自的children进行分组处理
    - oldVNodeChildren!==newVNodeChildren，进行diff算法比对更新
    - oldVNodeChildren为空，newVNodeChildren不为空，执行newVNodeChildren新建插入操作
    - oldVNodeChildren不为空，newVNodeChildren为空，执行oldVNodeChildren删除操作
    - 如果是文本节点，则更新文本内容
- 执行`postpatch`的钩子函数（自定义指令注册）
> 详细代码分析请看下一篇文章 [Vue2 双端比较diff算法-patchVNode流程浅析](https://segmentfault.com/a/1190000042749546)

**patchVnode()总结概述**<br />更新两个`VNode`的数据，并且比对两个`VNode`的`chlidren`，先进行简单的处理，如果有其中一个不存在，则直接执行`create`/`remove`操作，如果两者都存在，才需要调用`updateChildren()`进行对比和复用

#### patch情景3:  Component内部结构渲染
遇到组件渲染时，使用
  ```javascript
  if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
  }
  ```
#### 核心方法createElm()-非component渲染
**流程图**<br />![createElm函数解析.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667647872660-052df664-d8bf-48bf-b5c9-338a9d23ff29.svg#clientId=ub81b81ba-2038-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ub13b0047&margin=%5Bobject%20Object%5D&name=createElm%E5%87%BD%E6%95%B0%E8%A7%A3%E6%9E%90.svg&originHeight=860&originWidth=1411&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33498&status=done&style=none&taskId=u8c3e8ead-afa0-4b30-9e0c-9b849a678c4&title=)

- 作用：通过`VNode`创建真实的DOM节点并插入
- 流程：
    - document.createElement创建`vnode.elm`
    - 遍历children，进行`createElm()`的递归调用
    - 调用所有`生命周期create`的方法
    - 调用`Node.appendChild`/`Node.insertBefore`方法将`VNode.elm`挂载的`DOM`元素插入到目前parentElm
> 如果是初始化，此时的parentElm=`<Body></Body>`
```javascript
// node_modules/vue/src/core/vdom/patch.js
function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return;
    }
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) { // 有标签的内容

        // 本质是document.createElement创建真实DOM的元素
        vnode.elm = vnode.ns
            ? nodeOps.createElementNS(vnode.ns, tag)
            : nodeOps.createElement(tag, vnode)
        setScope(vnode)

        // if (Array.isArray(children)) {
        //     for (let i = 0; i < children.length; ++i) {
        //       createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        //     }
        // } else if (isPrimitive(vnode.text)) {
        //     nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
        // }
        createChildren(vnode, children, insertedVnodeQueue); // 方法内容如上面注释代码

        if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue); // 方法内容如下面注释代码
            // for (let i = 0; i < cbs.create.length; ++i) {
            //     cbs.create[i](emptyNode, vnode)
            //   }
            //   i = vnode.data.hook // Reuse variable
            //   if (isDef(i)) {
            //     if (isDef(i.create)) i.create(emptyNode, vnode)
            //     if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
            // }
        }
        // parentElm = body(初始化时)
        insert(parentElm, vnode.elm, refElm); // 方法内容如下面注释代码
        // function insert (parent, elm, ref) {
        //  if (isDef(parent)) {
        //     if (isDef(ref)) {
        //       if (nodeOps.parentNode(ref) === parent) {
        //         // parent.insertBefore(elm, ref)
        //         nodeOps.insertBefore(parent, elm, ref)
        //       }
        //     } else {
        //       // parent.appendChild(elm)
        //       nodeOps.appendChild(parent, elm)
        //     }
        // }}
    } else if (isTrue(vnode.isComment)) { // 注释内容
        vnode.elm = nodeOps.createComment(vnode.text)
        insert(parentElm, vnode.elm, refElm)
    } else { // 纯文本
        vnode.elm = nodeOps.createTextNode(vnode.text)
        insert(parentElm, vnode.elm, refElm)
    }
}
```
#### 核心方法createElm()-有component渲染
由代码分析可以知道，会先调用`createComponent()`尝试进行`Component`的创建，如果创建成功，则不继续往下执行
```javascript
// node_modules/vue/src/core/vdom/patch.js
function createElm(...args) {
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
    }
}
```
```javascript
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
        // Component里面的内容进行初始化和渲染
        i(vnode, false /* hydrating */) // componentVNodeHooks.init()
    }

    if (isDef(vnode.componentInstance)) {
        // 拿到已经渲染好的Component的DOM树：vnode.componentInstance.$el
        initComponent(vnode, insertedVnodeQueue)

        // 将已经渲染好的Component的DOM树插入到parentElm之前占位的<component>部分
        insert(parentElm, vnode.elm, refElm)
    }
}

var componentVNodeHooks = {
    init: function (vnode, hydrating) {
        var child = (vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance));
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
}

function initComponent(vnode, insertedVnodeQueue) {
    // vnode.componentInstance.$el此时就是已经渲染的Component形成的DOM树 
    vnode.elm = vnode.componentInstance.$el
}
```

- 由上面代码可以知道，先调用了`componentVNodeHooks.init()`进行Component的里面内容的渲染：`child.$mount`
- Component渲染完成后，将渲染完成的DOM挂载在`vnode.componentInstance.$el`上
- 然后再进行当前Component所在的占位符的parent的插入children-DOM的操作
> DOM的渲染顺序因此是 先子后父

# 示例分析-Component渲染
> 由于createComponet涉及的点过多，因此使用例子进行单独分析，主要是分析创建Component所经历的流程

## 例子
> 详细代码请看[github-component调试](https://github.com/wbccb/Frontend-Articles/blob/main/vue2-debugger/component.html)

```html
<div id='el'>
</div>

<script type='text/x-template' id='demo-template'>
  <div id='children1'>
    <p id='children1_1'>Selected: {{ selected }}</p>
    <component-select :options='options' v-model='selected' id='children1_2_component'>
    </component-select>
  </div>
</script>

<script type='text/x-template' id='select2-template'>
  <select id='children_component_select'>
    <option disabled value='0' id='children_component_select_option'>Select one</option>
  </select>
</script>
```
```javascript
<script>
  Vue.component('component-select', {
    .....
  })
  var vm = new Vue({
    el: '#el',
    template: '#demo-template',
    data: {
      selected: 0,
      options: [
        { id: 1, text: 'Hello' },
        { id: 2, text: 'World' }
      ]
    }
  })
</script>
```
从上面`html`内容可以知道，最终是要渲染出`<component-select></component-select>`组件内容<br />![创建Component示例html.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667650783406-8839043f-17d8-40b5-abef-fa6a479af670.svg#clientId=ub81b81ba-2038-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u88f4dd05&margin=%5Bobject%20Object%5D&name=%E5%88%9B%E5%BB%BAComponent%E7%A4%BA%E4%BE%8Bhtml.svg&originHeight=487&originWidth=452&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6133&status=done&style=none&taskId=ue13e1352-7b3a-4f87-bc28-e08e36a721f&title=)<br />由一开始的分析可以知道，最终`<template></template>`都会转化为`render()`函数，上面示例代码最终转化的`render()`函数是
```javascript
// _v = createTextVNode;
// _c = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, false); };
(function anonymous() {
    with (this) {
        return _c('div', {
            attrs: {
                "id": "children1"
            }
        }, [_c('p', {
            attrs: {
                "id": "children1_1"
            }
        }, [_v("Selected: " + _s(selected))]), _v(" "), _c('component-select', {
            attrs: {
                "options": options,
                "id": "children1_2_component"
            },
            model: {
                value: (selected),
                callback: function($$v) {
                    selected = $$v
                },
                expression: "selected"
            }
        })], 1)
    }
})
```
## 初次渲染流程图
![Vue2整体流程示例图.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667663471744-709aa796-c33a-4cf7-a7cf-a3d83482b850.svg#clientId=ub81b81ba-2038-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u5546161b&margin=%5Bobject%20Object%5D&name=Vue2%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B%E7%A4%BA%E4%BE%8B%E5%9B%BE.svg&originHeight=1350&originWidth=1397&originalType=binary&ratio=1&rotation=0&showTitle=false&size=66286&status=done&style=none&taskId=u0633dc09-7ee2-4438-b257-027a7fd71cd&title=)
