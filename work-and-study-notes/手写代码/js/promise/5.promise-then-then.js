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
            if (this.status === REJECTED && onrejected) {
                // setTimeout是为了能够拿到promise2这个对象
                setTimeout(() => {

                    const x = onrejected(this.reason); // 可能为promise，可能为数据

                    this.commonResolve(promise2, x, resolve, reject);
                }, 0);
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

                if (onrejected) {
                    //new Promise((_, reject)=> reject("fff"))
                    //         .then(()=>{}, (e)=>{console.warn(e);return "xixi";})
                    //         .then(res=> console.error("then res", res));
                    // 打印的是： error res xixi，即onrejected如果返回正常的数据，会触发的是then!
                    this.rejecectCallback.push((reason) => {
                        // setTimeout是为了能够拿到promise2这个对象
                        setTimeout(() => {
                            try {
                                const x = onrejected(reason); // 可能为promise，可能为数据
                                this.commonResolve(promise2, x, resolve, reject);
                            } catch (e) {
                                reject(e);
                            }
                        }, 0);
                    });
                }
            }
        });


        return promise2;

    }

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
    return new MyPromise((resolve, reject)=> reject("我是故意错的res"));
}, err => {
    console.error("err2", err);
}).then(data => {
    console.warn("res3", data);
}, err => {
    console.error("err3", err);
});