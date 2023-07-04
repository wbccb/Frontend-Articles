const observersArray = [];

function observe(fn) {
    observersArray.push(fn);
}

function observable(obj) {
    // 建立响应式对象
    return new Proxy(obj, {
        set: (target, p, value, receiver) => {
            console.warn(target, p, value, receiver);
            const result = Reflect.set(target, p, value, receiver); // 成功返回true
            observersArray.forEach(fn => fn());
            return result;
        },
        get: (target, p, receiver) => {
            return Reflect.get(target, p, receiver);
        }
    })
}

const initObject = {
    one: "one",
    two: "twoNumber"
}
const testObject = observable(initObject);

observe(() => {
    console.log("testObject发生更新了1", testObject);
});

observe(() => {
    console.log("testObject发生更新了2", testObject);
});


initObject.one = "oneNumber111";
console.error("testObject", testObject.one);
testObject.one = "oneNumber";
