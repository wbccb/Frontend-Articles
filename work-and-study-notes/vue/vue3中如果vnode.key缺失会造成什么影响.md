# diff算法影响
在`patchKeyChildren`的步骤5.2中，为了复用`新旧vnode`

如果`prevChild.key`缺失，会进行`[s2, e2]`的所有`newChild`遍历，使用`isSameVNodeType`去找可以复用的`vnode节点`

> 那如果newChild.key也缺失呢？直接当作新元素插入处理？