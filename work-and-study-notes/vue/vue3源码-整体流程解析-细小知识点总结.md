# 细小知识点总结
## CSS Module
> 出现地方在上面**渲染vnode详细分析-设置组件实例setupComponent-核心逻辑setupStatefulComponent-instance.proxy的get方法中获取type**

## 全局挂载方法
> 出现地方在上面**渲染vnode详细分析-设置组件实例setupComponent-核心逻辑setupStatefulComponent-instance.proxy的get方法中获取appContext**

## context.reload
```javascript
const app = (context.app = {
    mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
            // 开发者模式：HMR root reload
            context.reload = () => {
                render(cloneVNode(vnode), rootContainer, isSVG);
            };
        }
    }
});
```
## patch()中的setRef()
## 判断两个vnode的类型是否相同
根据`type`+`key`进行类型判断<br />其中type可能为

- Text
- Comment
- Static
- Fragment
- 根据shareFlag进行判断，分为：`ELEMENT`普通DOM元素、`COMPONENT`组件、`TELEPORT`、`SUSPPENSE`

key为v-for时设置的`key`？？？？如果没有v-for呢？？？？？
```javascript
function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 /* COMPONENT */ &&
        hmrDirtyComponents.has(n2.type)) {
        // HMR only: if the component has been hot-updated, force a reload.
        return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
}
```
## 初次渲染componentUpdateFn生命周期总结 
> `setupRenderEffect()->componentUpdateFn ()`

- `beforeMount` -> `props.onVnodeBeforeMount`
- `subTree渲染`+`patch()`
- `mounted` -> `props.onVnodeMounted`
```javascript
const componentUpdateFn = () => {
    if (!instance.isMounted) {
        const { bm, m, parent } = instance;
        toggleRecurse(instance, false);
        // beforeMount hook
        if (bm) {
            invokeArrayFns(bm);
        }
        // onVnodeBeforeMount
        if (!isAsyncWrapperVNode &&
            (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);

        startMeasure(instance, `render`);
        const subTree = (instance.subTree = renderComponentRoot(instance));
        endMeasure(instance, `render`);

        startMeasure(instance, `patch`);
        patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
        endMeasure(instance, `patch`);
        initialVNode.el = subTree.el;

        // mounted hook
        if (m) {
            queuePostRenderEffect(m, parentSuspense);
        }
        // onVnodeMounted
        if (!isAsyncWrapperVNode &&
            (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }

        if (initialVNode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;

        initialVNode = container = anchor = null;
    }
}
```
## with语句
# <br />