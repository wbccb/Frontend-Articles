// 重写一些原生方法：使用高阶函数，进行AOP面向切片编程
// AOP面向切片编程的作用是把一些跟核心业务逻辑无关的功能抽离处理，本质就是给原函数增加一层，不用管理原函数的内部实现


// 对核心方法say函数封装，在调用say之前先调用其它方法
function say(whoA, whoB) {
    console.log("核心方法say触发", whoA, "对", whoB, "说");
}


// 起到一种管理类的作用，在这个管理beforeFn()->Fn()
Function.prototype.before = function (beforeFunc) {
    return (...args) => {
        // 先执行beforeFunc--->我们注册的说话前要执行什么逻辑
        beforeFunc();

        // 再执行say
        this(...args);
    }
}


const newFn = say.before(() => {
    // 说话前调用的方法
    console.warn("说话前的方法触发");
});


newFn("我", "你");