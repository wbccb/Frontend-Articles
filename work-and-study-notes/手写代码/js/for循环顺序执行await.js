// 有时候我们希望在for循环中进行new Promise()的请求，然后顺序执行

// 比如下面，我们希望可以顺利执行后的打印结果为：3 2 1 结束
async function test() {
    let arr = [3, 2, 1]
    arr.forEach(async item => {
        const res = await handle(item)
        console.log(res)
    });
    console.log('结束')
}

function handle(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x)
        }, 1000 * x)
    })
}

test();

// 但是实际上并不是这样的结果，那是因为forEach的底层执行如下面所示，会直接循环遍历多个index
// 不是我们想要的i=0;await fn();i++;i=1;await fn()这种模式
// 而是 i=0;fn(){await 实际fn()}; i=1;fn(); i=2;fn(await 实际fn())

const myForEach = function (fn) {
    let i
    for (i = 0; i < this.length; i++) {
        fn(this[i], i)
    }
}

// 因此我们想要这种i=0;await fn();i++;i=1;await fn()这种模式，我们可以使用for...of
(function () {
    async function test() {
        let arr = [3, 2, 1];
        for (let item of arr) {
            console.warn("开始await", new Date().getTime());
            const res = await handle(item)
            console.log("结束获取到结果", res, new Date().getTime());
        }
        console.log('结束')
    }

    function handle(x) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(x)
            }, 1000 * x)
        })
    }

    test();
})();

// 因为for...of本质就是使用iterator进行遍历，实际是下面这种代码！
(function () {
    async function test() {
        let arr = [3, 2, 1];
        let iterator = arr[Symbol.iterator]();
        let result = iterator.next();
        while(!result.done) {
            let value = result.value;
            const res = await handle(value);
            console.log(res);
            result = iterator.next();
        }
        console.log('结束')
    }

    function handle(x) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(x)
            }, 1000 * x)
        })
    }

    test();
})();