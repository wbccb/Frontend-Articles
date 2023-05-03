// reduce版本
function flat(array) {
    return array.reduce(function (prev, current) {
        // prev之前累计的结果
        // current目前遍历到的item
        if (Array.isArray(current)) {
            return prev.concat(flat(current));
        } else {
            return prev.concat(current);
        }
    }, []);
}

// reduce版本 + 加入平铺层数控制
function flatNumber(array, number) {
    if (number <= 0) {
        return array;
    }
    // 这种写法会超时！
    // return array.reduce(function (prev, current) {
    //     // prev之前累计的结果
    //     // current目前遍历到的item
    //     if (Array.isArray(current) && number - 1 > 0) {
    //         // concat就已经是平铺一层了，因此是num-1
    //         return prev.concat(flat(current));
    //     } else {
    //         // concat就已经是平铺一层了，因此是num-1
    //         return prev.concat(current);
    //     }
    // }, []);

    // 不超时的写法，将concat改为push
    return array.reduce(function (prev, current) {
        const res = prev;
        // 要注意！这里没使用concat，concat就已经是平铺一层了，因此是num-1
        // 这里没使用concat，因此是number>0
        // 由于顶部已经number<=0，因此这里的number>0可以省略
        if (Array.isArray(current)) {
            res.push(...flatNumber(current, number - 1));
        } else {
            res.push(current);
        }
        return res;
    }, []);
}

// 非reduce版本
function flatNotReduce(array, number) {
    if (number <= 0) {
        return array;
    }
    if (array.every((a) => typeof a === "number")) {
        return array;
    }
    const res = [];
    for (let item of array) {
        if (typeof item === "number") {
            res.push(item);
        } else {
            res.push(...item);
        }
    }
    return flatNotReduce(res, number - 1);
}

// 栈的思想平铺
function flatStack(array) {
    let res = [];

    let stack = [].concat(array);
    while (stack.length > 0) {
        const item = stack.pop();
        if (Array.isArray(item)) {
            // 如果是数组，则平铺继续放进去
            stack.push(...item);
        } else {
            res.unshift(item);
        }
    }

    return res;
}