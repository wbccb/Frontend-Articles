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
    return array.reduce(function (prev, current) {
        // prev之前累计的结果
        // current目前遍历到的item
        if (Array.isArray(current) && number - 1 > 0) {
            // concat就已经是平铺一层了，因此是num-1
            return prev.concat(flat(current));
        } else {
            // concat就已经是平铺一层了，因此是num-1
            return prev.concat(current);
        }
    }, []);
}

// 栈的思想平铺
function flatStack(array) {
    let res = [];

    let stack = [].concat(array);
    while(stack.length > 0) {
        const item = stack.pop();
        if(Array.isArray(item)) {
            // 如果是数组，则平铺继续放进去
            stack.push(...item);
        } else {
            res.unshift(item);
        }
    }

    return res;
}