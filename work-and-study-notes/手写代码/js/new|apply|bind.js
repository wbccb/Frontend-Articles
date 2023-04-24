function MyNew(...args) {
    // 拿到构造器和参数
    const Constructor = args[0];
    const params = args.slice(1);

    // 创建一个空的对象
    const newObject = new Object();

    // 继承原型链
    newObject.__proto__ = Constructor.prototype;

    // 以newObject的名义执行整个构造函数，如果有返回值，则返回整个值作为新创建的对象
    const resultObject = Constructor.apply(newObject, params);

    return typeof resultObject === "object" ? resultObject : newObject;
}

function TestObject(test) {
    this.test = test;
}

// let temp1 = new TestObject(1);
// 等同于下面
const temp = MyNew(TestObject, 1);
console.warn("new", temp.test);

// 执行方法的主题还是mockApply，只是作用域要换成context
Function.prototype.mockApply = function (context, args) {
    // 实际上传入一个数组args
    context = context || window;
    args = args || [];

    const id = Symbol();
    context[id] = this; // this相当于整个function内容

    const result = context[id](args);
    delete context[id];

    return result;
}

// 执行方法的主题还是mockCall，只是作用域要换成context
Function.prototype.mockCall = function (context, ...args) {
    context = context || window;

    const id = Symbol();
    context[id] = this;


    if (args === "void 0") {
        const res = context[id]();
        delete context[id];
        return res;
    }

    const res = context[id](...args);
    delete context[id];
    return res;
}


// 涉及到this的指向问题
// 1.在函数体中，简单调用该函数时，严格模式下this绑定到undefined，否则绑定到全局对象window/global
// 2.一般构造函数new调用时，绑定到新创建的对象上
// 3.一般由call/apply/bind方法显式调用，绑定到指定参数的对象上
// 4.一般由上下文对象调用，绑定在该对象上
// 5.箭头函数中，根据外层上下文绑定的this决定this指向
Function.prototype.mockBind = function () {

    var args = Array.prototype.slice.call(arguments);
    var context = args[0] || window;
    var params = args.slice(1) || [];
    var me = this;

    // this 的指向，是在调用函数时根据执行上下文所动态确定的。
    return function newFn() {
        var params1 = Array.prototype.slice.call(arguments);
        var finalArgs = params.concat(params1);
        // return me.apply(me, finalParams);
        // 上面没有考虑到new function()的情况
        // 如果没有new newFn()，this=window，因为我们拿到的是一个裸方法
        // 如果有new newFn()，this=newFn，虽然拿到的是一个裸方法，但是new改变了内部的指向
        console.warn("newFn this", this);
        return me.apply(this instanceof newFn ? this : context, finalArgs);
    }

}

function testFn() {
    console.log(this.context);
}

const temp = testFn.mockBind({context: "xixixi"});
temp();

const test = new temp();