# 文章内容
用具体的例子讲解patchVNode的具体流程，通过例子逐渐分析出patchVNode代码所代表的含义
# 前置知识
由上一篇文章[Vue2源码-整体流程浅析](https://segmentfault.com/a/1190000042749514)可以知道，当两个VNode是同一个VNode时，会触发patchVNode()的执行
# prepatch()触发
```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    //...
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode)
    }
    //...
}
```
从下面代码可以知道，`prepatch()`主要是调用了`updateChildComponent()`，这个方法的作用是将`newVnode`相关数据更新到旧的`oldVnode.componentOptions`
```javascript
// vue/src/core/vdom/create-component.js
prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
    )
}
```
```javascript
// vue/src/core/instance/lifecycle.js
export function updateChildComponent(
    vm: Component, // 旧的Component对象
    propsData: ?Object, // 新的props数据
    listeners: ?Object, // 新的listeners数据
    parentVnode: MountedComponentVNode, // 新的VNode数据
    renderChildren: ?Array<VNode> // 新的children数据
) {
    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
        vm._vnode.parent = parentVnode
    }
    vm.$options._renderChildren = renderChildren
    vm.$attrs = parentVnode.data.attrs || emptyObject
    vm.$listeners = listeners || emptyObject

    if (propsData && vm.$options.props) {
        toggleObserving(false)
        const props = vm._props
        const propKeys = vm.$options._propKeys || []
        for (let i = 0; i < propKeys.length; i++) {
            const key = propKeys[i]
            const propOptions: any = vm.$options.props // wtf flow?
            props[key] = validateProp(key, propOptions, propsData, vm)
        }
        toggleObserving(true)
        vm.$options.propsData = propsData
    }
    //...省略代码，基本跟上面代码逻辑一致，进行vm的更新而已
}
```
# 触发update()方法执行
```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    //...
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode)
    }


    if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }

    //...
}
```
> 参考Vue2自定义指令的钩子函数：[https://v2.cn.vuejs.org/v2/guide/custom-directive.html#ad](https://v2.cn.vuejs.org/v2/guide/custom-directive.html#ad)

从文档可以知道，`update()`的钩子函数，代表所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新<br />比如下面的示例代码，如果我们注册了一个`test33`的自定义指令，那么`<div v-test33></div>`所在组件的 VNode 更新时调用注册的`update()`方法
```javascript
// html
<template>
    <div v-test33></div>
</template>

// js
Vue.directive('test33', {
    update: function (el) {
        console.error("测试update 自定义指令");
    }
})
```
# 分情况进行children的比较
```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    //...
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode)
    }
    const oldCh = oldVnode.children
    const ch = vnode.children
    //...

    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } else if (isDef(ch)) {
            if (process.env.NODE_ENV !== 'production') {
                checkDuplicateKeys(ch)
            }
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } else if (isDef(oldCh)) {
            removeVnodes(oldCh, 0, oldCh.length - 1)
        } else if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '')
        }
    } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text)
    }
}
```
从上面的代码可以知道，当`prepatch()`将`newVNode`的相关数据更新到`oldVNode.componentOptions`后，会进行它们`children`的比较，确定它们`children`的更新策略，总结下来为

- oldVNodeChildren!==newVNodeChildren，触发`updateChildren()`方法
- oldVNodeChildren为空，newVNodeChildren不为空，执行newVNodeChildren新建插入操作
- oldVNodeChildren不为空，newVNodeChildren为空，执行oldVNodeChildren删除操作
- 如果是文本节点，则更新文本内容

## 核心部分updateChildren()
### 前置说明

- 由于流程过于复杂，将使用一个具体的例子说明源码的流程
- patchVnode(oldVnode, newVnode, insertedVnodeQueue, newCh, newIdx)：当`oldVnode`=`newVnode`的时候，才会触发`patchVnode()`方法，进行新旧`VNodeData`的更新，然后进行`children`元素的比较，进行新增删除/向下比较触发`updateChildren()`，除了更新数据(同个VNode进行数据更新)、处理children(addVNode/removeVNode/updateVNode-选择性更新)，不做其它处理
> 下面所有图中旧的children真实情况下应该存在oldVNode的DOM引用情况，为了偷懒，会将矩形外边的节点当作oldVNode引用DOM的位置，矩形包裹才是旧VNode的位置，因此会出现情况5中就算移动了元素到其它位置，仍然存在元素在oldVNode中的情况

### 条件分类代码
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) { 
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) { 
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode
    }
}
```
### 情况4: oldEndIdx===newStartIdx
![oldEndVNode==newStartVNode.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667412333526-5dbd49b1-2d6b-4a05-8543-d83726a23d07.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=uc05428aa&margin=%5Bobject%20Object%5D&name=oldEndVNode%3D%3DnewStartVNode.svg&originHeight=406&originWidth=1314&originalType=binary&ratio=1&rotation=0&showTitle=false&size=38290&status=done&style=none&taskId=u667d591f-6543-444a-bfbf-fa482cd4c55&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx

        // 数据更新，如果有children，也在patchVnode()内部进行调用处理，addVNode/removeVNode/updateChildren
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // 调整目前DOM元素的位置，将oldEndVnode的DOM移动到oldStartVnode的DOM前面
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx] // 更新索引
        newStartVnode = newCh[++newStartIdx] // 更新索引
    } else {
        // 情况5: 四端都找不到同样的VNode
    }
}
```
### 情况2: oldEndIdx===newEndIdx
![oldEndIdx==newEndIdx.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667412426618-94b08346-9fa1-4c9b-ac17-c83d91efe7f5.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u529830e7&margin=%5Bobject%20Object%5D&name=oldEndIdx%3D%3DnewEndIdx.svg&originHeight=432&originWidth=1367&originalType=binary&ratio=1&rotation=0&showTitle=false&size=38691&status=done&style=none&taskId=uc65c031d-0d02-4245-98d2-0bc4c987a73&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx

        // 数据更新，如果有children，也在patchVnode()内部进行调用处理，addVNode/removeVNode/updateChildren
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx

        //......
    } else {
        // 情况5: 四端都找不到同样的VNode
    }
}
```
### 情况3: oldStartIdx === newEndIdx
![oldStartIdx==newEndIdx.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667412544055-12d5d222-65f4-495e-b10c-f5624c5be9f8.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u3c4a374e&margin=%5Bobject%20Object%5D&name=oldStartIdx%3D%3DnewEndIdx.svg&originHeight=418&originWidth=1246&originalType=binary&ratio=1&rotation=0&showTitle=false&size=40935&status=done&style=none&taskId=uc877cf5d-3fa7-4685-8afb-c8b025b762a&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx

        //....
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx

        // 数据更新，如果有children，也在patchVnode()内部进行调用处理，addVNode/removeVNode/updateChildren
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 调整目前DOM元素的位置，将oldStartVnode的DOM移动到oldEndVnode的DOM后面
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx

        //......
    } else {
        // 情况5: 四端都找不到同样的VNode
    }
}
```
### 情况1: oldStartIdx === newStartIdx
![oldStartIdx==newStartIdx.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667412647833-b1ba092a-d2c9-40da-8875-9058e1e7f737.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ufb2bfe04&margin=%5Bobject%20Object%5D&name=oldStartIdx%3D%3DnewStartIdx.svg&originHeight=375&originWidth=1212&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37782&status=done&style=none&taskId=uf88ab570-f6d2-4831-a1fe-64b28de6812&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx

        // 数据更新，如果有children，也在patchVnode()内部进行调用处理，addVNode/removeVNode/updateChildren
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx

        //....
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx

        //....
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx

        //......
    } else {
        // 情况5: 四端都找不到同样的VNode
    }
}
```
### 情况5: 四端都无法找到可以复用，相同的VNode
#### 四端无法找到可匹配的VNode，但是中间可以找到
![oldKeyToIndx_sameVnode.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667412744865-d88ed41d-3e5b-47eb-ab6c-545db81fa52c.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u3d859c67&margin=%5Bobject%20Object%5D&name=oldKeyToIndx_sameVnode.svg&originHeight=391&originWidth=1257&originalType=binary&ratio=1&rotation=0&showTitle=false&size=40859&status=done&style=none&taskId=u5a8b744a-3b0e-4389-a5f1-48223ad8558&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
            // ... 
        } else {
            // 命中下面代码
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // 数据更新，如果有children，也在patchVnode()内部进行调用处理，addVNode/removeVNode/updateChildren
                patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                // 将索引中的oldCh[idxInOld]置为空，方便后面直接跳过
                oldCh[idxInOld] = undefined
                // 调整目前DOM元素的位置，将oldCh[idxInOld]的DOM移动到oldStartVnode前面
                canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
            } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            }
        }
        newStartVnode = newCh[++newStartIdx]
    }
}
```
#### (新条件1)oldStartVnode=undefine：中间区域可复用区域直接跳过下一次循环
![oldStartVNode为空.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667413059910-c98b3c46-ec22-4fc7-a095-2acb27b329ff.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ue3b65dd7&margin=%5Bobject%20Object%5D&name=oldStartVNode%E4%B8%BA%E7%A9%BA.svg&originHeight=395&originWidth=1416&originalType=binary&ratio=1&rotation=0&showTitle=false&size=39635&status=done&style=none&taskId=ue7232e80-6f23-43d3-a038-476481b8642&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
        // 新条件1：oldStartVnode=undefine
        oldStartVnode = oldCh[++oldStartIdx] // 情况5置为undefined的startVNode
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
            // ... 
        } else {
            // 命中下面代码
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // ...
                oldCh[idxInOld] = undefined
                // ...
            } else {
                // ...
            }
        }
        newStartVnode = newCh[++newStartIdx]
    }
}
```
#### 四端无法找到可匹配的VNode，中间也无法找到，属于新增元素
![newStartIdx大于newEndIdx.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667413226490-4aacbe80-59a3-4bd9-b2c7-2d2813af3b14.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u96f5f337&margin=%5Bobject%20Object%5D&name=newStartIdx%E5%A4%A7%E4%BA%8EnewEndIdx.svg&originHeight=399&originWidth=1481&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41415&status=done&style=none&taskId=u92b3dc59-11a4-476b-af35-f84d0cbe403&title=)
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // 情况5置为undefined的startVNode
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { 
            // 命中下面代码，新增元素并且插入oldStartVNode对应的DOM前面
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // ...
                oldCh[idxInOld] = undefined
                // ...
            } else {
                // ...
            }
        }
        newStartVnode = newCh[++newStartIdx]
    }
}
```
### (循环结束1)newStartIdx > newEndIdx
结束第一个循环需要删除不用的旧VNode
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
        // 新条件1：oldStartVnode=undefine
        oldStartVnode = oldCh[++oldStartIdx] // 情况5置为undefined的startVNode
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode，中间可复用，移动DOM/中间不可复用，新增插入DOM
        if (isUndef(idxInOld)) {
            // 四端都找不到同样的VNode，中间不可复用，新增插入DOM
        } else {
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // 四端都找不到同样的VNode，中间可复用，移动DOM
            } else {
                // key相同，其它条件不同当作新VNode处理，即中间不可复用，新增插入DOM处理
            }
        }
    }
}
if (newStartIdx > newEndIdx) {
    // 循环结束1：删除已经废弃的旧VNode
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
}
```
> 从上面分析代码可以看出，条件中还缺少`oldEndVnode`不存在以及结束第一个循环时，`oldStartIdx > oldEndIdx`两种可能性的判断，事实上这两种情况也有可能发生

### (新条件2)oldEndVnode=undefine
> 暂时还没想好场景，先作为补齐条件判断加入

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
        // 新条件1：oldStartVnode=undefine
        oldStartVnode = oldCh[++oldStartIdx] // 情况5置为undefined的startVNode
    } else if (isUndef(oldEndVnode)) {
        // 新条件2：oldEndVnode=undefine
        oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode，中间可复用，移动DOM/中间不可复用，新增插入DOM
        if (isUndef(idxInOld)) {
            // 四端都找不到同样的VNode，中间不可复用，新增插入DOM
        } else {
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // 四端都找不到同样的VNode，中间可复用，移动DOM
            } else {
                // key相同，其它条件不同当作新VNode处理，即中间不可复用，新增插入DOM处理
            }
        }
    }
}
if (newStartIdx > newEndIdx) {
    // 删除已经废弃的旧VNode
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
}
```
### (循环结束2)oldStartIdx>oldEndIdx
由上面的分析可以知道，一开始会触发情况1: oldStartIdx === newStartIdx，然后`oldStartIdx++`和`oldEndIdx++`，此时由于`oldStartIdx>oldEndIdx`，循环结束<br />![oldStartIdx大于oldEndIdx.svg](https://cdn.nlark.com/yuque/0/2022/svg/21527712/1667415936140-96cd04bd-00da-48dc-be5e-53cf547095fe.svg#clientId=uf4de11ff-ba7a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ubbc6544a&margin=%5Bobject%20Object%5D&name=oldStartIdx%E5%A4%A7%E4%BA%8EoldEndIdx.svg&originHeight=346&originWidth=352&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7616&status=done&style=none&taskId=ud983599c-1904-49a1-b077-8bca8355fa3&title=)<br />从上图可以看出，目前`newCh`还有一个`VNode`未处理，因此需要遍历`[newStartIdx, newEndIdx]`进行剩余元素的添加处理，如下面代码所示，循环区间，进行`createElm()`操作
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
        // 新条件1：oldStartVnode=undefine
        oldStartVnode = oldCh[++oldStartIdx] // 情况5置为undefined的startVNode
    } else if (isUndef(oldEndVnode)) {
        // 新条件2：oldEndVnode=undefine
        oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 情况1: oldStartIdx === newStartIdx
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 情况2: oldEndIdx === newEndIdx
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 情况3: oldStartIdx === newEndIdx
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 情况4: oldEndIdx === newStartIdx
    } else {
        // 情况5: 四端都找不到同样的VNode，中间可复用，移动DOM/中间不可复用，新增插入DOM
        if (isUndef(idxInOld)) {
            // 四端都找不到同样的VNode，中间不可复用，新增插入DOM
        } else {
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
                // 四端都找不到同样的VNode，中间可复用，移动DOM
            } else {
                // key相同，其它条件不同当作新VNode处理，即中间不可复用，新增插入DOM处理
            }
        }
    }
}
if (oldStartIdx > oldEndIdx) {
    // 如果新的children最后一个节点已经处理完成，那么初始化refElm为最后一个节点
    // 由下面insert方法可以知道，插入元素会nodeOps.insertBefore(parent, elm, ref)
    // 不断在ref前面插入[newStartIdx,newEndIdx]的DOM
    // 由于ref一致都不会动，因此[newStartIdx,newEndIdx]可以顺序插入
    // 如果新的children最后一个节点还没处理，那么处理refElm=null
    // 由下面insert方法可以知道，插入元素会nodeOps.appendChild(parent, elm)
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    // addVnodes:[newStartIdx,newEndIdx]遍历调用createElm插入DOM元素
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
} else if (newStartIdx > newEndIdx) {
    // 循环结束1: 删除多余的oldVNode
}

// addVnodes->createElm()->insert()
function insert(parent, elm, ref) {
    if (isDef(parent)) {
        if (isDef(ref)) {
            if (nodeOps.parentNode(ref) === parent) {
                nodeOps.insertBefore(parent, elm, ref)
            }
        } else {
            nodeOps.appendChild(parent, elm)
        }
    }
}
```
# 触发postpatch()执行
```javascript
if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
}
```
> 参考Vue2自定义指令的钩子函数：[https://v2.cn.vuejs.org/v2/guide/custom-directive.html#ad](https://v2.cn.vuejs.org/v2/guide/custom-directive.html#ad)

从下面的源码分析和文档可以知道，`postpatch()`实际上调用的是`componentUpdated()`的钩子函数，代表指令所在组件的 VNode 及其子 VNode 全部更新后调用
```javascript
if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
            callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
    });
}
```
比如下面的示例代码，如果我们注册了一个`test33`的自定义指令，那么`<div v-test33></div>`所在组件的 VNode 及其子 VNode 全部更新后就会调用注册的`componentUpdated()`方法
```javascript
// html
<template>
    <div v-test33></div>
</template>

//js
Vue.directive('test33', {
    componentUpdated: function () {
        console.error("测试componentUpdated");
    }
})
```
# 参考文章

1. [vue-design](https://github.com/HcySunYang/vue-design)
