function isObject(obj) {
    return (typeof obj === "object" && null !== obj);
}

// 简易版：判断两个数据是否相等(如果是Object则比对内容是否相等)：没有考虑循环调用、function等情况
function isEqual(obj1, obj2) {
    // 1. 判断是不是都是引用类型(由于没考虑function，因此只有Object一种引用类型)
    if (!isObject(obj1) || !isObject(obj2)) {
        return obj1 === obj2;
    }

    // 2. 比对是不是同一个内存地址
    if (obj1 === obj2) {
        return true;
    }

    // 3. 比对key的数量
    const obj1KeyLen = Object.keys(obj1);
    const obj2KeyLen = Object.keys(obj2);
    if (obj1KeyLen !== obj2KeyLen) return false;

    // 4. 递归比对每一个item的值
    for (let key in obj1) {
        const result = isEqual(obj1[key], obj2[key]);
        if (!result) {
            return false;
        }
    }

    return true;
}

