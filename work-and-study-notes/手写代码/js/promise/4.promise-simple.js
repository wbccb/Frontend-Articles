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
        
        const resolved = (value)=> {
            if(this.status === PENDING) {
                this.status = RESOLVED;
                this.value = value;

                this.resolveCallback.forEach(fn=> fn(value));
            }
        }
        
        const rejected = (reason)=> {
            if(this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                this.rejecectCallback.forEach(fn=> fn(reason));
            }
        }

        try {
            executor(resolved, rejected);
        } catch (e) {
            rejected(e);
        }
    }
    
    then(onfulfilled, onrejected) {
        
        // 已经执行万层
        if(this.status === RESOLVED) {
            onfulfilled(this.value);
            return;
        }
        if(this.status === REJECTED) {
            onrejected(this.reason);
            return;
        }
        
        // 如果还没执行完成，是异步的
        if(this.status === PENDING) {
            this.resolveCallback.push(onfulfilled);
            this.rejecectCallback.push(onrejected);
        }

    }

}


let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //     reject("33")
    // }, 1000);

    // reject("33");

    a.b.c = 1;

});

promise.then(data => {
    console.log("res1", data);
}, err => {
    console.log("err1", err);
});

promise.then(data => {
    console.log("res2", data);
}, err => {
    console.log("err2", err);
});

promise.then(data => {
    console.log("res3", data);
}, err => {
    console.log("err3", err);
});