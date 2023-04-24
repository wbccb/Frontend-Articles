// 跟4.promise-then-then.js相比较
// 1. 对多层then的处理，也就是promise.then().then()这种情况的处理：then直接返回promise
// 2. 如果then返回的是promise,直接返回即可，如果返回的是基础数据，则需要包裹一个promise.resolve(res)

// !!! 没有考虑catch的情况，只有then(onfulfilled, onrejected)这种情况

const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

class MyPromise {
    constructor(executor) {

        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.resolveCallback = [];
        this.rejecectCallback = [];

        const resolved = (value) => {
            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.value = value;

                this.resolveCallback.forEach(fn => fn(value));
            }
        }

        const rejected = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                this.rejecectCallback.forEach(fn => fn(reason));
            }
        }

        try {
            executor(resolved, rejected);
        } catch (e) {
            rejected(e);
        }
    }


    /**
     * 处理x是不是promise的情况！
     */
    commonResolve(promise, x, resolve, reject) {

        if (typeof x === "object" && x !== null || typeof x === "function") {
            // x是promise
            // x是function
            if (promise === x) {
                return reject(new TypeError("promise循环嵌套"));
            }

            let called; // 如果已经调用过一次resolve，后面再调用应该阻止！
            try {
                let then = x.then;
                if (typeof then === "function") {
                    // 如果x是一个promise,取它执行后的结果，然后继续commonResolve()判断是否是promise
                    then.call(x, (y) => {
                        if (called) {
                            return;
                        }

                        called = true;
                        this.commonResolve(promise, y, resolve, reject);
                    }, (error) => {
                        if (called) {
                            return;
                        }
                        called = true;
                        reject(error);
                    });
                } else {
                    resolve(x);
                }
            } catch (e) {
                if (called) {
                    return;
                }
                called = true;
                reject(e);
            }
        } else {
            // x是基本类型
            resolve(x);
        }
    }

    then(onfulfilled, onrejected) {

        let promise2 = new MyPromise((resolve, reject) => {
            // 已经执行完成
            if (this.status === RESOLVED && onfulfilled) {
                // setTimeout是为了能够拿到promise2这个对象
                setTimeout(() => {

                    const x = onfulfilled(this.value); // 可能为promise，可能为数据

                    this.commonResolve(promise2, x, resolve, reject);
                }, 0);
            }
            if (this.status === REJECTED) {
                if (onrejected) {
                    // setTimeout是为了能够拿到promise2这个对象
                    setTimeout(() => {

                        const x = onrejected(this.reason); // 可能为promise，可能为数据

                        this.commonResolve(promise2, x, resolve, reject);
                    }, 0);
                } else {
                    // 没有声明处理函数，只能返回下一级继续处理拒绝状态！
                    reject(this.reason);
                }
            }

            // 如果还没执行完成，是异步的
            if (this.status === PENDING && (onfulfilled || onrejected)) {
                if (onfulfilled) {
                    this.resolveCallback.push((res) => {
                        // setTimeout是为了能够拿到promise2这个对象
                        setTimeout(() => {
                            try {
                                const x = onfulfilled(res); // 可能为promise，可能为数据
                                this.commonResolve(promise2, x, resolve, reject);
                            } catch (e) {
                                reject(e);
                            }
                        }, 0);
                    });
                }


                //new Promise((_, reject)=> reject("fff"))
                //         .then(()=>{}, (e)=>{console.warn(e);return "xixi";})
                //         .then(res=> console.error("then res", res));
                // 打印的是： error res xixi，即onrejected如果返回正常的数据，会触发的是then!
                this.rejecectCallback.push((reason) => {
                    if (onrejected) {
                        // setTimeout是为了能够拿到promise2这个对象
                        setTimeout(() => {
                            try {
                                const x = onrejected(reason); // 可能为promise，可能为数据
                                this.commonResolve(promise2, x, resolve, reject);
                            } catch (e) {
                                reject(e);
                            }
                        }, 0);
                    } else {
                        // 如果没有传入onrejected()处理函数，直接返回reject()，即表示目前Promise是一个reject状态
                        // Promise.reject(reason).catch()如果此时跟着catch()，本质就是then(null, cb)
                        // Promise.reject(reason).then(null, cb)，会触发cb的执行！
                        reject(reason);
                    }
                });
            }
        });


        return promise2;

    }

}

const isPromise = (fn) => {
    // class Promise本质就是function类型
    // 可以const Promise = {then: function() {}}
    if (typeof fn === "object" && fn !== null || typeof fn === "function") {
        if (typeof fn.then === "function") {
            return true;
        }
    }
    return false;
}

// 增加promise.all的代码逻辑！
MyPromise.all = function (array) {
    return new MyPromise((resolve, reject) => {

        // 使用3.after.js的次数

        let len = array.length;
        let result = new Array(len).fill(undefined)

        function processData(res, index) {
            result[index] = res;
            len--;
            if (len === 0) {
                resolve(result);
            }
        }

        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (isPromise(item)) {
                item.then(res => {
                    processData(res, i);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                processData(item, i);
            }
        }
    });
}


// resolve就是直接模拟Promise返回resolve状态
MyPromise.resolve = function (data) {
    return new MyPromise((resolve, reject) => {
        resolve(data); // 没有考虑data是promise的情况，只考虑是基础数据
    })
}

MyPromise.reject = function (data) {
    return new MyPromise((resolve, reject) => {
        reject(data); // 没有考虑data是promise的情况，只考虑是基础数据
    })
}

MyPromise.race = function (array) {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < array.length; i++) {
            const item = array[i];
            item.then(res => {
                return resolve(res);
            }, (error) => {
                return reject(error);
            })
        }
    });
}

// 如果没有传入onrejected()处理函数，Promise()直接返回reject()，即表示目前Promise是一个reject状态
// Promise.reject(reason).catch()如果此时跟着catch()，本质就是then(null, cb)
// Promise.reject(reason).then(null, cb)，会触发cb的执行！
// 如果之前Promise.then(cb, cb1)中cb1已经处理了拒绝状态，那么最终cb1执行就是resolve()状态了
// 即Promise.then(cb, cb1).then(cb2, cb3)中cb1已经处理了拒绝状态，那么最终cb1执行后就是执行cb2，而不是cb3
MyPromise.catch = function (cb) {
    // 如果之前
    return this.then(null, cb);
}

// xxx.then().then().then().finally(cb)
// xxx.then().then().then().then(cb, cb)
// 代表无论如何，成功或者失败，肯定会调用cb这个方法！
MyPromise.finally = function (cb) {
    return this.then(cb, cb);
}


let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //     reject("33")
    // }, 1000);

    resolve("hahah");

    // reject("33");

    // a.b.c = 1;

});

promise.then(data => {
    console.warn("res1", data);

    return "我是res1";
}, err => {
    console.error("err1", err);
}).then(data => {
    console.warn("res2", data);
    return new MyPromise((resolve, reject) => reject("我是故意错的res"));
}, err => {
    console.error("err2", err);
}).then(data => {
    console.warn("res3", data);
}, err => {
    console.error("err3", err);
});